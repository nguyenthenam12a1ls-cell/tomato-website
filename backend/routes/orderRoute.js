import express from "express"
import authMiddleware from "../middleware/auth.js"
// 1. IMPORT THÊM vnpayReturn
import { placeOrder , verifyOrder, vnpayReturn, userOrders , listOrders, updateStatus , getStats , getRecentOrders, getQuarterlyRevenue, getMonthlyRevenue, getYearlyRevenue} from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder); // Dùng cho Stripe
orderRouter.post("/userorders", authMiddleware, userOrders);

// 2. THÊM ROUTE MỚI CHO VNPAY
orderRouter.get("/vnpay_return", vnpayReturn);

// (Routes cho Admin - giữ nguyên)
orderRouter.get('/list', listOrders);
orderRouter.post('/status', updateStatus);
orderRouter.get('/stats', authMiddleware, getStats); 
orderRouter.get('/recent', authMiddleware, getRecentOrders)
orderRouter.get('/quarterly', authMiddleware, getQuarterlyRevenue); 
orderRouter.get('/monthly', authMiddleware, getMonthlyRevenue);
orderRouter.get('/yearly', authMiddleware, getYearlyRevenue)

export default orderRouter;