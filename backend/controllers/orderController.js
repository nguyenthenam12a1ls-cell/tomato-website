import { prisma } from "../config/prisma.js";
import Stripe from "stripe";
import moment from "moment-timezone";
import crypto from "crypto";

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

const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    try {
        const userId = Number(req.userId);
        const paymentMethod = req.body.paymentMethod;
        const amountUSD = Number(req.body.amount);
        const address = req.body.address || {};
        const items = Array.isArray(req.body.items) ? req.body.items : [];

        if (Number.isNaN(userId) || Number.isNaN(amountUSD) || items.length === 0) {
            return res.json({ success: false, message: "Dữ liệu đơn hàng không hợp lệ" });
        }

        let finalAmount = amountUSD;
        let currency = "usd";

        if (paymentMethod === "vnpay") {
            finalAmount = Math.round(amountUSD * USD_TO_VND_RATE);
            currency = "vnd";
        }

        if (!["stripe", "vnpay"].includes(paymentMethod)) {
            return res.json({
                success: false,
                message: "Phương thức thanh toán không hợp lệ",
            });
        }

        const newOrder = await prisma.order.create({
            data: {
                userId,
                amount: finalAmount,
                originalAmount: amountUSD,
                currency,
                paymentMethod,
                email: address.email || "",
                firstName: address.firstName || "",
                lastName: address.lastName || "",
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                zipcode: address.zipcode || "",
                country: address.country || "",
                phone: address.phone || "",
                items: {
                    create: items.map((item) => ({
                        foodId: item.id ? Number(item.id) : null,
                        foodName: item.name,
                        foodPrice: Number(item.price),
                        quantity: Number(item.quantity),
                    })),
                },
            },
            include: { items: true },
        });

        const cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }

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

            return res.json({
                success: true,
                session_url: session.url,
                amount: amountUSD,
                currency: "USD",
            });
        }

        if (paymentMethod === "vnpay") {
            const vnpayUrl = createVnpayUrl(req, newOrder.id.toString(), finalAmount);

            return res.json({
                success: true,
                session_url: vnpayUrl,
                amount: finalAmount,
                currency: "VND",
            });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            await prisma.order.update({
                where: { id: Number(orderId) },
                data: {
                    payment: true,
                    status: "Food Processing",
                },
            });
            return res.json({ success: true, message: "Paid" });
        }

        await prisma.order.delete({
            where: { id: Number(orderId) },
        });
        return res.json({ success: false, message: "Not Paid" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const vnpayReturn = async (req, res) => {
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
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    payment: true,
                    status: "Food Processing",
                },
            });
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
};

const userOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: Number(req.userId) },
            include: { items: true },
            orderBy: { createdAt: "desc" },
        });

        res.json({ success: true, data: orders.map(serializeOrder) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, data: orders.map(serializeOrder) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        await prisma.order.update({
            where: { id: Number(req.body.orderId) },
            data: {
                status: req.body.status,
            },
        });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const getRevenueQueryMatch = () => ({ payment: true });

const getStats = async (req, res) => {
    try {
        const totalOrders = await prisma.order.count();
        const totalUsers = await prisma.user.count({
            where: { role: "user" },
        });

        const revenueAggregate = await prisma.order.aggregate({
            where: getRevenueQueryMatch(),
            _sum: {
                amount: true,
            },
        });

        const totalRevenue = revenueAggregate._sum.amount || 0;

        res.json({
            success: true,
            data: { totalOrders, totalRevenue, totalUsers },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server khi lấy thông tin" });
    }
};

const getRecentOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: "desc" },
            take: 10,
        });
        res.json({ success: true, data: orders.map(serializeOrder) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server" });
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

const getMonthlyRevenue = async (req, res) => {
    try {
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);

        const orders = await getPaidOrdersInRange(start, end);
        const grouped = new Map();

        for (const order of orders) {
            const dateKey = order.createdAt.toISOString().split("T")[0];
            grouped.set(dateKey, (grouped.get(dateKey) || 0) + order.amount);
        }

        const data = Array.from(grouped.entries()).map(([key, value]) => ({
            key,
            value,
        }));

        const chart = padDataForChart(
            data,
            start,
            end,
            `Doanh thu Tháng ${month}/${year}`
        );

        res.json({ success: true, data: chart });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server (monthly)" });
    }
};

const getQuarterlyRevenue = async (req, res) => {
    try {
        const year = parseInt(req.query.year);
        const quarter = parseInt(req.query.quarter);

        const startMonth = (quarter - 1) * 3;
        const start = new Date(year, startMonth, 1);
        const end = new Date(year, startMonth + 3, 0);

        const orders = await getPaidOrdersInRange(start, end);
        const grouped = new Map();

        for (const order of orders) {
            const dateKey = order.createdAt.toISOString().split("T")[0];
            grouped.set(dateKey, (grouped.get(dateKey) || 0) + order.amount);
        }

        const data = Array.from(grouped.entries()).map(([key, value]) => ({
            key,
            value,
        }));

        const chart = padDataForChart(
            data,
            start,
            end,
            `Doanh thu Quý ${quarter}/${year}`
        );

        res.json({ success: true, data: chart });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server (quarterly)" });
    }
};

const getYearlyRevenue = async (req, res) => {
    try {
        const year = parseInt(req.query.year);
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);

        const orders = await getPaidOrdersInRange(start, end);
        const grouped = new Map();

        for (const order of orders) {
            const month = order.createdAt.getMonth() + 1;
            grouped.set(month, (grouped.get(month) || 0) + order.amount);
        }

        const labels = [
            "Th 1",
            "Th 2",
            "Th 3",
            "Th 4",
            "Th 5",
            "Th 6",
            "Th 7",
            "Th 8",
            "Th 9",
            "Th 10",
            "Th 11",
            "Th 12",
        ];

        const points = [];
        for (let i = 1; i <= 12; i++) {
            points.push(grouped.get(i) || 0);
        }

        res.json({
            success: true,
            data: {
                labels,
                datasets: [
                    {
                        label: `Doanh thu năm ${year}`,
                        data: points,
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgb(75, 192, 192)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                ],
            },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server (yearly)" });
    }
};

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
