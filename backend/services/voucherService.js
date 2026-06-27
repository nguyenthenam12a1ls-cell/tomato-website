import { prisma } from "../config/prisma.js";

const applyVoucher = async (code, orderAmount) => {
    const voucher = await prisma.voucher.findUnique({
        where: { code: code.toUpperCase() }
    });

    if (!voucher) throw new Error("Mã giảm giá không tồn tại");

    if (!voucher.isActive) throw new Error("Mã giảm giá đã bị vô hiệu hóa");

    if (new Date() > voucher.expiresAt) throw new Error("Mã giảm giá đã hết hạn");

    if (voucher.usedCount >= voucher.maxUses) throw new Error("Mã giảm giá đã hết lượt sử dụng");

    if (orderAmount < voucher.minOrder) throw new Error(`Đơn hàng cần đạt tối thiểu $ ${voucher.minOrder}`);

    let discountAmount = 0;
    if (voucher.discountType === "percent") {
        discountAmount = (orderAmount * voucher.discount) / 100;
    } else {
        discountAmount = voucher.discount;
    }

    return {
        code: voucher.code,
        discountPercent: voucher.discountType === "percent" ? voucher.discount : 0,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        message: `Áp dụng thành công! Giảm ${voucher.discountType === "percent" ? voucher.discount + "%" : "$" + voucher.discount}`
    };
};

const listVouchers = async () => {
    return prisma.voucher.findMany({
        where: {
            isActive: true,
            expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: "desc" }
    });
};

export const voucherService = { applyVoucher, listVouchers };