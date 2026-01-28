import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import moment from "moment-timezone";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ----------------------- CONSTANTS -----------------------
const USD_TO_VND_RATE = 25000; // Tỷ giá quy đổi USD sang VND

// ----------------------- HÀM SORT CHUẨN VNPay -----------------------
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
}

// ----------------------- TẠO URL THANH TOÁN VNPAY -----------------------
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
    // ✅ Thử format đơn giản hơn, chỉ dùng chữ và số
    vnp_Params["vnp_OrderInfo"] = `Thanh toan ${orderId}`;
    vnp_Params["vnp_OrderType"] = "other";
    // ✅ VNPay yêu cầu số tiền * 100 (không có dấu phẩy thập phân)
    vnp_Params["vnp_Amount"] = amountInVND * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    // Tạo signData KHÔNG encode
    const signData = Object.keys(vnp_Params)
        .map((key) => `${key}=${vnp_Params[key]}`)
        .join("&");

    console.log("=== VNPAY DEBUG ===");
    console.log("Amount in VND:", amountInVND);
    console.log("vnp_Amount (VND * 100):", vnp_Params["vnp_Amount"]);
    console.log("SignData:", signData);
    console.log("HashSecret:", secretKey);
    console.log("HashSecret Length:", secretKey.length);
    console.log("===================");

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;

    // Tạo URL có encode
    const paymentUrl =
        vnpUrl +
        "?" +
        Object.keys(vnp_Params)
            .map((key) => `${key}=${encodeURIComponent(vnp_Params[key])}`)
            .join("&");

    return paymentUrl;
};

// ----------------------- ĐẶT HÀNG -----------------------
const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    try {
        const paymentMethod = req.body.paymentMethod;
        const amountUSD = req.body.amount; // Số tiền gốc từ frontend (USD)

        // ✅ TÁCH LOGIC: Quy đổi tiền tệ tùy theo phương thức thanh toán
        let finalAmount = amountUSD;
        let currency = "usd";

        if (paymentMethod === "vnpay") {
            // Quy đổi USD → VND cho VNPay
            finalAmount = Math.round(amountUSD * USD_TO_VND_RATE);
            currency = "vnd";

            console.log("=== PAYMENT CONVERSION ===");
            console.log("Original Amount (USD):", amountUSD);
            console.log("Converted Amount (VND):", finalAmount);
            console.log("Exchange Rate:", USD_TO_VND_RATE);
            console.log("========================");
        }

        // Tạo order với số tiền đã quy đổi
        const newOrder = new orderModel({
            userId: req.userId,
            items: req.body.items,
            amount: finalAmount, // ✅ Lưu số tiền đã quy đổi
            originalAmount: amountUSD, // ✅ Lưu số tiền gốc (USD) để tham khảo
            currency: currency, // ✅ Lưu loại tiền tệ
            address: req.body.address,
            email: req.body.email, // ✅ THÊM EMAIL
            paymentMethod: paymentMethod,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        // ===================== STRIPE (Thanh toán quốc tế - USD) =====================
        if (paymentMethod === "stripe") {
            const line_items = req.body.items.map((item) => ({
                price_data: {
                    currency: "usd", // ✅ Stripe dùng USD
                    product_data: { name: item.name },
                    unit_amount: Math.round(item.price * 100), // USD * 100
                },
                quantity: item.quantity,
            }));

            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: "Delivery Charges" },
                    unit_amount: 200, // $2.00
                },
                quantity: 1,
            });

            const session = await stripe.checkout.sessions.create({
                line_items,
                mode: "payment",
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            });

            return res.json({
                success: true,
                session_url: session.url,
                amount: amountUSD,
                currency: "USD"
            });
        }

        // ===================== VNPAY (Thanh toán Việt Nam - VND) =====================
        if (paymentMethod === "vnpay") {
            const vnpayUrl = createVnpayUrl(
                req,
                newOrder._id.toString(),
                finalAmount // ✅ Truyền số tiền VND đã quy đổi
            );

            return res.json({
                success: true,
                session_url: vnpayUrl,
                amount: finalAmount,
                currency: "VND"
            });
        }

        return res.json({
            success: false,
            message: "Phương thức thanh toán không hợp lệ"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server" });
    }
};

// ----------------------- VERIFY STRIPE -----------------------
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {
                payment: true,
                status: "Food Processing",
            });
            return res.json({ success: true, message: "Paid" });
        }

        await orderModel.findByIdAndDelete(orderId);
        return res.json({ success: false, message: "Not Paid" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// ----------------------- CALLBACK VNPAY -----------------------
const vnpayReturn = async (req, res) => {
    let vnp_Params = { ...req.query };

    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    // Tạo signData KHÔNG encode khi verify
    const signData = Object.keys(vnp_Params)
        .map((key) => `${key}=${vnp_Params[key]}`)
        .join("&");

    const secretKey = process.env.VNP_HASHSECRET;
    const checkHash = crypto
        .createHmac("sha512", secretKey)
        .update(Buffer.from(signData, "utf-8"))
        .digest("hex");

    const orderId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    console.log("=== VNPAY RETURN DEBUG ===");
    console.log("SignData:", signData);
    console.log("SecureHash from VNPay:", secureHash);
    console.log("CheckHash computed:", checkHash);
    console.log("Match:", checkHash === secureHash);
    console.log("ResponseCode:", responseCode);
    console.log("========================");

    if (checkHash === secureHash) {
        if (responseCode === "00") {
            await orderModel.findByIdAndUpdate(orderId, {
                payment: true,
                status: "Food Processing",
            });
            return res.redirect(`${frontend_url}/myorders`);
        } else {
            await orderModel.findByIdAndDelete(orderId);
            return res.redirect(`${frontend_url}/cart`);
        }
    }

    console.error("❌ VNPay signature mismatch!");
    await orderModel.findByIdAndDelete(orderId);
    return res.redirect(`${frontend_url}/cart`);
};

// ----------------------- USER ORDERS -----------------------
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// ----------------------- ADMIN LIST -----------------------
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {
            status: req.body.status,
        });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// ----------------------- DASHBOARD -----------------------
const getRevenueQueryMatch = () => ({ payment: true });

const getStats = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments({});
        const revenueData = await orderModel.aggregate([
            { $match: getRevenueQueryMatch() },
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
        const totalUsers = await userModel.countDocuments({});

        res.json({
            success: true,
            data: { totalOrders, totalRevenue, totalUsers },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server khi lấy thông tin" });
    }
};

// ----------------------- RECENT ORDERS -----------------------
const getRecentOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ createdAt: -1 }).limit(10);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server" });
    }
};

// ----------------------- CHART HELPERS -----------------------
const padDataForChart = (revenueData, startDate, endDate, label) => {
    const labels = [];
    const dataPoints = [];

    const dataMap = new Map(
        revenueData.map((item) => [item._id, item.dailyRevenue])
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

// ----------------------- MONTHLY REVENUE -----------------------
const getMonthlyRevenue = async (req, res) => {
    try {
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);

        const data = await orderModel.aggregate([
            {
                $match: {
                    ...getRevenueQueryMatch(),
                    createdAt: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    dailyRevenue: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

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

// ----------------------- QUARTERLY REVENUE -----------------------
const getQuarterlyRevenue = async (req, res) => {
    try {
        const year = parseInt(req.query.year);
        const quarter = parseInt(req.query.quarter);

        const startMonth = (quarter - 1) * 3;

        const start = new Date(year, startMonth, 1);
        const end = new Date(year, startMonth + 3, 0);

        const data = await orderModel.aggregate([
            {
                $match: {
                    ...getRevenueQueryMatch(),
                    createdAt: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    dailyRevenue: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

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

// ----------------------- YEARLY REVENUE -----------------------
const getYearlyRevenue = async (req, res) => {
    try {
        const year = parseInt(req.query.year);

        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);

        const data = await orderModel.aggregate([
            {
                $match: {
                    ...getRevenueQueryMatch(),
                    createdAt: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    monthlyRevenue: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

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

        const map = new Map(data.map((item) => [item._id, item.monthlyRevenue]));

        const points = [];
        for (let i = 1; i <= 12; i++) {
            points.push(map.get(i) || 0);
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