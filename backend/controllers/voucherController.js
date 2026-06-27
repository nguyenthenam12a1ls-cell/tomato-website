import { voucherService } from "../services/voucherService.js";
import { sendSuccess } from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";


const applyVoucher = asyncHandler(async (req, res) => {
    const { code, orderAmount } = req.body;

    if (!code) {
        throw new AppError("Vui lòng nhập mã giảm giá", 400);
    }

    const result = await voucherService.applyVoucher(code, Number(orderAmount));

    sendSuccess(res, result.message, result);
});

const listVouchers = asyncHandler(async (req, res) => {
    const vouchers = await voucherService.listVouchers();
    sendSuccess(res, "Lấy danh sách voucher thành công", vouchers);
});

export { applyVoucher, listVouchers };

