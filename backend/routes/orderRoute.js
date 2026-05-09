import express from "express"
import authMiddleware from "../middleware/auth.js"
// 1. IMPORT THÊM vnpayReturn
import { placeOrder, verifyOrder, vnpayReturn, userOrders, listOrders, updateStatus, getStats, getRecentOrders, getQuarterlyRevenue, getMonthlyRevenue, getYearlyRevenue } from "../controllers/orderController.js"
import { generalLimiter } from "../middleware/rateLimiter.js";
const orderRouter = express.Router();

orderRouter.post("/place", generalLimiter, authMiddleware, placeOrder);
orderRouter.post("/verify", generalLimiter, verifyOrder); // Dùng cho Stripe
orderRouter.post("/userorders", generalLimiter, authMiddleware, userOrders);

// 2. THÊM ROUTE MỚI CHO VNPAY
orderRouter.get("/vnpay_return", generalLimiter, vnpayReturn);

// (Routes cho Admin - giữ nguyên)
orderRouter.get('/list', generalLimiter, listOrders);
orderRouter.post('/status', generalLimiter, updateStatus);
orderRouter.get('/stats', generalLimiter, authMiddleware, getStats);
orderRouter.get('/recent', generalLimiter, authMiddleware, getRecentOrders)
orderRouter.get('/quarterly', generalLimiter, authMiddleware, getQuarterlyRevenue);
orderRouter.get('/monthly', generalLimiter, authMiddleware, getMonthlyRevenue);
orderRouter.get('/yearly', generalLimiter, authMiddleware, getYearlyRevenue)

export default orderRouter;