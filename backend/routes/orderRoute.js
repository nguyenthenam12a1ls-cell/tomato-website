import express from "express"
import { placeOrder, verifyOrder, vnpayReturn, userOrders, listOrders, updateStatus, getStats, getRecentOrders, getQuarterlyRevenue, getMonthlyRevenue, getYearlyRevenue } from "../controllers/orderController.js"
import { generalLimiter } from "../middleware/rateLimiter.js";
import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import validate from "../middleware/validate.js";
import { orderSchema } from "../validators/orderValidator.js";
const orderRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: API quản lý đơn hàng và thanh toán
 */

/**
 * @swagger
 * /api/order/place:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về link thanh toán (Stripe/VNPay)
 */
orderRouter.post("/place", generalLimiter, authMiddleware, validate(orderSchema), placeOrder);
orderRouter.post("/verify", generalLimiter, verifyOrder);
orderRouter.get("/vnpay_return", generalLimiter, vnpayReturn);

/**
 * @swagger
 * /api/order/userorders:
 *   post:
 *     summary: Xem lịch sử đơn hàng của người dùng
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách đơn hàng
 */
orderRouter.post("/userorders", generalLimiter, authMiddleware, userOrders);

/**
 * @swagger
 * /api/order/list:
 *   get:
 *     summary: Danh sách tất cả đơn hàng (Admin only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách đơn hàng toàn hệ thống
 */
orderRouter.get('/list', generalLimiter, authMiddleware, adminAuth, listOrders);

orderRouter.post('/status', generalLimiter, authMiddleware, adminAuth, updateStatus);

/**
 * @swagger
 * /api/order/stats:
 *   get:
 *     summary: Thống kê doanh thu (Admin only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về các con số thống kê
 */
orderRouter.get('/stats', generalLimiter, authMiddleware, adminAuth, getStats);
orderRouter.get('/recent', generalLimiter, authMiddleware, adminAuth, getRecentOrders)
orderRouter.get('/quarterly', generalLimiter, authMiddleware, adminAuth, getQuarterlyRevenue);
orderRouter.get('/monthly', generalLimiter, authMiddleware, adminAuth, getMonthlyRevenue);
orderRouter.get('/yearly', generalLimiter, authMiddleware, adminAuth, getYearlyRevenue)

export default orderRouter;