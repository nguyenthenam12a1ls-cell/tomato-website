import { prisma } from "../config/prisma.js";
import Stripe from "stripe";
import moment from "moment-timezone";
import crypto from "crypto";
import { orderService } from "../services/orderService.js";
import { sendOrderConfirmationEmail } from "../utils/mailService.js";
import { sendSuccess, sendError } from "../utils/response.js";
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

const placeOrder = async (req, res, next) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    try {

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
                session_url: session.url, // hoặc vnpayUrl
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

        if (paymentMethod === "cod") {
            return sendSuccess(
                res,
                "Đặt hàng thành công! Vui lòng thanh toán khi nhận hàng.",
                { orderId: newOrder.id }
            );
        }
    } catch (error) {
        next(error);
    }
};

const verifyOrder = async (req, res, next) => {
    const { orderId, success } = req.body;

    try {
        const result = await orderService.verifyOrder(orderId, success);
        if (!result) {
            return res.status(200).json({ success: false, message: "Thanh toán thất bại hoặc đơn hàng đã bị hủy" });
        }

        sendOrderConfirmationEmail(result.email, result);
        return sendSuccess(res, "Thanh toán đơn hàng thành công");
    } catch (error) {
        next(error);
    }
};

const vnpayReturn = async (req, res, next) => {
    try {
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
            });
            return res.redirect(`${frontend_url}/cart`);
        }

        await prisma.order.delete({
            where: { id: orderId },
        });
        return res.redirect(`${frontend_url}/cart`);
    } catch (error) {
        next(error);
    }
};

const userOrders = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { status } = req.body;
        const orders = await orderService.getUserOrders(userId, status);
        sendSuccess(res, "Lấy đơn hàng của user thành công", orders.map(serializeOrder));
    } catch (error) {
        next(error);
    }
};

const listOrders = async (req, res, next) => {
    try {
        const { status } = req.query;
        const orders = await orderService.getAllOrders(status);
        sendSuccess(res, "Lấy danh sách đơn hàng thành công", orders.map(serializeOrder));
    } catch (error) {
        next(error);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const { orderId, status } = req.body;
        await orderService.updateOrderStatus(orderId, status);
        sendSuccess(res, "Đã cập nhật trạng thái");
    } catch (error) {
        next(error);
    }
};

const getRevenueQueryMatch = () => ({ payment: true });

const getStats = async (req, res, next) => {
    try {
        const result = await orderService.getStats();
        sendSuccess(res, "Lấy thống kê thành công", result);
    } catch (error) {
        next(error);
    }
};

const getRecentOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getRecentOrders();
        sendSuccess(res, "Lấy đơn hàng gần đây thành công", orders.map(serializeOrder));
    } catch (error) {
        next(error);
    }
};

const padDataForChart = (revenueData, startDate, endDate, label) => {
    const labels = [];
    const dataPoints = [];

    const dataMap = new Map(
        revenueData.map((item) => [item.key, item.value])
    );

    let current = new Date(startDate);

    while (current <= endDate) {
        const dateStr = current.toISOString().split("T")[0];
        labels.push(dateStr);
        dataPoints.push(dataMap.get(dateStr) || 0);
        current.setDate(current.getDate() + 1);
    }

    return {
        labels,
        datasets: [
            {
                label,
                data: dataPoints,
                backgroundColor: "rgba(153, 102, 255, 0.5)",
                borderColor: "rgb(153, 102, 255)",
                borderWidth: 1,
                tension: 0.4,
            },
        ],
    };
};

const getPaidOrdersInRange = async (start, end) => {
    return prisma.order.findMany({
        where: {
            ...getRevenueQueryMatch(),
            createdAt: {
                gte: start,
                lte: end,
            },
        },
        select: {
            amount: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};

const getMonthlyRevenue = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);

        const chart = await orderService.getMonthlyRevenue(year, month);
        sendSuccess(res, "Thành công", chart);
    } catch (error) {
        next(error);
    }
};

const getQuarterlyRevenue = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year);
        const quarter = parseInt(req.query.quarter);

        const chart = await orderService.getQuarterlyRevenue(year, quarter);

        sendSuccess(res, "Thành công", chart);
    } catch (error) {
        next(error);
    }
};

const getYearlyRevenue = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year);
        const data = await orderService.getYearlyRevenue(year);
        sendSuccess(res, "Thành công", data);
    } catch (error) {
        next(error);
    }
};

const cancelOrder = async (req, res, next) => {
    try {
        const orderId = Number(req.params.id);
        const userId = req.userId;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
        }

        if (order.userId !== userId) {
            return res.status(403).json({ success: false, message: "Không có quyền hủy đơn hàng này" });
        }

        if (order.status !== "Food Processing") {
            return res.status(400).json({ success: false, message: "Chỉ có thể hủy đơn hàng đang chờ xử lý" });
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "Cancelled" }
        });

        sendSuccess(res, "Đã hủy đơn hàng thành công");
    } catch (error) {
        next(error);
    }
}

export {
    placeOrder,
    verifyOrder,
    vnpayReturn,
    userOrders,
    listOrders,
    cancelOrder,
    updateStatus,
    getStats,
    getRecentOrders,
    getMonthlyRevenue,
    getQuarterlyRevenue,
    getYearlyRevenue,
};
