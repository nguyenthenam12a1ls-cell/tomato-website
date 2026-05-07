import { prisma } from "../config/prisma.js";
const USD_TO_VND_RATE = 25000;

const getRevenueQueryMatch = () => ({ payment: true });

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

const placeOrder = async (userId, paymentMethod, amountUSD, address, items) => {

    try {

        if (Number.isNaN(userId) || Number.isNaN(amountUSD) || items.length === 0) {
            throw new Error("Dữ liệu đơn hàng không hợp lệ");
        }

        let finalAmount = amountUSD;
        let currency = "usd";

        if (paymentMethod === "vnpay") {
            finalAmount = Math.round(amountUSD * USD_TO_VND_RATE);
            currency = "vnd";
        }

        if (!["stripe", "vnpay"].includes(paymentMethod)) {
            throw new Error("Phương thức thanh toán không hợp lệ");
        }


        const result = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
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
                include: { items: true }
            });
            const cart = await tx.cart.findUnique({
                where: { userId },
            })

            if (cart) {
                await tx.cartItem.deleteMany({
                    where: { cartId: cart.id },
                });
            }
            return { newOrder, finalAmount, currency };
        });
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const verifyOrder = async (orderId, success) => {
    if (success === "true") {
        await prisma.order.update({
            where: { id: Number(orderId) },
            data: {
                payment: true,
                status: "Food Processing",
            },
        });
        return ({ message: "Paid" });
    }
    await prisma.order.delete({
        where: { id: Number(orderId) },
    });
};

const getUserOrders = async (userId) => {
    const orders = await prisma.order.findMany({
        where: { userId: Number(userId) },
        include: { items: true },
        orderBy: { createdAt: "desc" },
    });
    return orders;
};

const getAllOrders = async () => {
    const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
    });
    return orders;
};

const updateOrderStatus = async (orderId, status) => {
    const result = await prisma.order.update({
        where: { id: Number(orderId) },
        data: {
            status: status,
        },
    });
    return result;
};

const getStats = async () => {
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

    return ({
        data: { totalOrders, totalRevenue, totalUsers },
    });
};

const getRecentOrders = async () => {
    const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 10,
    });
    return orders;
};

const getMonthlyRevenue = async (year, month) => {
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
    return chart;
};

const getQuarterlyRevenue = async (year, quarter) => {
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
    return chart;
};

const getYearlyRevenue = async (year) => {
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

    return ({
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
};

export const orderService = {
    placeOrder,
    verifyOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    getStats,
    getRecentOrders,
    getMonthlyRevenue,
    getQuarterlyRevenue,
    getYearlyRevenue
};