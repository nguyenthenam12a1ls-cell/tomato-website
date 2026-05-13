import { prisma } from "../config/prisma.js";
import Stripe from "stripe";
import moment from "moment-timezone";
import crypto from "crypto";
import { orderService } from "../services/orderService.js";
import { sendOrderConfirmationEmail } from "../utils/mailService.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/response.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const USD_TO_VND_RATE = 25000;

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
}

const serializeOrder = (order) => ({
    ...order,
    address: {
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        street: order.street,
        city: order.city,
        state: order.state,
        zipcode: order.zipcode,
        country: order.country,
        phone: order.phone,
    },
    items: (order.items || []).map((item) => ({
        ...item,
        name: item.foodName,
        price: item.foodPrice,
        quantity: item.quantity,
    })),
});

const createVnpayUrl = (req, orderId, amountInVND) => {
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;

    const returnUrl = `${req.protocol}://${req.get("host")}/api/order/vnpay_return`;

    const createDate = moment()
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYYMMDDHHmmss");

    const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        req.connection?.remoteAddress ||
        "127.0.0.1";

    let vnp_Params = {};

    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = `Thanh toan ${orderId}`;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amountInVND * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    const signData = Object.keys(vnp_Params)
        .map((key) => `${key}=${vnp_Params[key]}`)
        .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;

    const paymentUrl =
        vnpUrl +
        "?" +
        Object.keys(vnp_Params)
            .map((key) => `${key}=${encodeURIComponent(vnp_Params[key])}`)
            .join("&");

    return paymentUrl;
};

const placeOrder = asyncHandler(async (req, res, next) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    const userId = req.userId;
    const paymentMethod = req.body.paymentMethod;
    const amountUSD = Number(req.body.amount);
    const address = req.body.address || {};
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    const { newOrder, finalAmount, currency } = await orderService.placeOrder(userId, paymentMethod, amountUSD, address, items);

    if (paymentMethod === "stripe") {
        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.name },
                unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: "usd",
                product_data: { name: "Delivery Charges" },
                unit_amount: 200,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder.id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder.id}`,
        });

        return sendSuccess(res, "Tạo link thanh toán thành công", {
            session_url: session.url,
            amount: amountUSD,
            currency: "USD"
        });

    }

    if (paymentMethod === "vnpay") {
        const vnpayUrl = createVnpayUrl(req, newOrder.id.toString(), finalAmount);

        return sendSuccess(
            res,
            "Tạo link thanh toán thành công", {
            session_url: vnpayUrl,
            amount: finalAmount,
            currency: "VND",
        });
    }

    throw new AppError("Phương thức thanh toán không hợp lệ", 400);
});

const verifyOrder = asyncHandler(async (req, res, next) => {
    const { orderId, success } = req.body;

    const result = await orderService.verifyOrder(orderId, success);
    if (result) {
        sendOrderConfirmationEmail(result.email, result);
        return sendSuccess(res, "Thanh toán thành công");
    }
    throw new AppError("Xác minh đơn hàng thất bại", 400);
});

const vnpayReturn = asyncHandler(async (req, res) => {
    let vnp_Params = { ...req.query };

    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const signData = Object.keys(vnp_Params)
        .map((key) => `${key}=${vnp_Params[key]}`)
        .join("&");

    const secretKey = process.env.VNP_HASHSECRET;
    const checkHash = crypto
        .createHmac("sha512", secretKey)
        .update(Buffer.from(signData, "utf-8"))
        .digest("hex");

    const orderId = Number(vnp_Params["vnp_TxnRef"]);
    const responseCode = vnp_Params["vnp_ResponseCode"];
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    if (checkHash === secureHash) {
        if (responseCode === "00") {
            const updatedOrder = await prisma.order.update({
                where: { id: orderId },
                data: {
                    payment: true,
                    status: "Food Processing",
                },
            });

            sendOrderConfirmationEmail(updatedOrder.email, updatedOrder);
            return res.redirect(`${frontend_url}/myorders`);
        }

        await prisma.order.delete({
            where: { id: orderId },
        }).catch(() => { });
        return res.redirect(`${frontend_url}/cart`);
    }

    await prisma.order.delete({
        where: { id: orderId },
    }).catch(() => { });
    return res.redirect(`${frontend_url}/cart`);
});

const userOrders = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const orders = await orderService.getUserOrders(userId);
    sendSuccess(res, "Lấy đơn hàng của user thành công", orders.map(serializeOrder));
});

const listOrders = asyncHandler(async (req, res, next) => {
    const orders = await orderService.getAllOrders();
    sendSuccess(res, "Lấy danh sách đơn hàng thành công", orders.map(serializeOrder));
});

const updateStatus = asyncHandler(async (req, res, next) => {
    const { orderId, status } = req.body;
    await orderService.updateOrderStatus(orderId, status);
    sendSuccess(res, "Đã cập nhật trạng thái");
});

const getStats = asyncHandler(async (req, res, next) => {
    const result = await orderService.getStats();
    sendSuccess(res, "Lấy thống kê thành công", result);
});

const getRecentOrders = asyncHandler(async (req, res, next) => {
    const orders = await orderService.getRecentOrders();
    sendSuccess(res, "Lấy đơn hàng gần đây thành công", orders.map(serializeOrder));
});

const getMonthlyRevenue = asyncHandler(async (req, res, next) => {
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    const chart = await orderService.getMonthlyRevenue(year, month);
    sendSuccess(res, "Thành công", chart);
});

const getQuarterlyRevenue = asyncHandler(async (req, res, next) => {
    const year = parseInt(req.query.year);
    const quarter = parseInt(req.query.quarter);

    const chart = await orderService.getQuarterlyRevenue(year, quarter);

    sendSuccess(res, "Thành công", chart);
});

const getYearlyRevenue = asyncHandler(async (req, res, next) => {
    const year = parseInt(req.query.year);
    const data = await orderService.getYearlyRevenue(year);
    sendSuccess(res, "Thành công", data);
});

export {
    placeOrder,
    verifyOrder,
    vnpayReturn,
    userOrders,
    listOrders,
    updateStatus,
    getStats,
    getRecentOrders,
    getMonthlyRevenue,
    getQuarterlyRevenue,
    getYearlyRevenue,
};
