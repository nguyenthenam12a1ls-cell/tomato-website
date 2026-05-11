import express from "express"
// 1. IMPORT THÊM vnpayReturn
import { placeOrder, verifyOrder, vnpayReturn, userOrders, listOrders, updateStatus, getStats, getRecentOrders, getQuarterlyRevenue, getMonthlyRevenue, getYearlyRevenue } from "../controllers/orderController.js"
import { generalLimiter } from "../middleware/rateLimiter.js";
import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
const orderRouter = express.Router();

orderRouter.post("/place", generalLimiter, authMiddleware, placeOrder);
orderRouter.post("/verify", generalLimiter, verifyOrder); // Dùng cho Stripe
orderRouter.post("/userorders", generalLimiter, authMiddleware, userOrders);

// 2. THÊM ROUTE MỚI CHO VNPAY
orderRouter.get("/vnpay_return", generalLimiter, vnpayReturn);

// (Routes cho Admin - giữ nguyên)
orderRouter.get('/list', generalLimiter, authMiddleware, adminAuth, listOrders);
orderRouter.post('/status', generalLimiter, authMiddleware, adminAuth, updateStatus);
orderRouter.get('/stats', generalLimiter, authMiddleware, adminAuth, getStats);
orderRouter.get('/recent', generalLimiter, authMiddleware, adminAuth, getRecentOrders)
orderRouter.get('/quarterly', generalLimiter, authMiddleware, adminAuth, getQuarterlyRevenue);
orderRouter.get('/monthly', generalLimiter, authMiddleware, adminAuth, getMonthlyRevenue);
orderRouter.get('/yearly', generalLimiter, authMiddleware, adminAuth, getYearlyRevenue)

export default orderRouter;