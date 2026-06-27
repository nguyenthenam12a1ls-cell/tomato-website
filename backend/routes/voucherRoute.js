import express from "express";
import { applyVoucher, listVouchers } from "../controllers/voucherController.js";
import authMiddleware from "../middleware/auth.js";
import { generalLimiter } from "../middleware/rateLimiter.js";

const voucherRouter = express.Router();

voucherRouter.post('/apply', generalLimiter, authMiddleware, applyVoucher);
voucherRouter.get('/list', generalLimiter, listVouchers);

export default voucherRouter;