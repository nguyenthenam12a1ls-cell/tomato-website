import express from "express"
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js"
import authMiddleware from "../middleware/auth.js"
import { generalLimiter } from '../middleware/rateLimiter.js';
import { cartSchema } from "../validators/cartValidator.js";
import validate from "../middleware/validate.js";


const cartRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API quản lý giỏ hàng người dùng
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Thêm món ăn vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId: { type: number }
 *     responses:
 *       200:
 *         description: Đã thêm thành công
 */
cartRouter.post("/add", generalLimiter, authMiddleware, validate(cartSchema), addToCart);

/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     summary: Xóa món ăn khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId: { type: number }
 *     responses:
 *       200:
 *         description: Đã xóa thành công
 */
cartRouter.post("/remove", generalLimiter, authMiddleware, validate(cartSchema), removeFromCart);

/**
 * @swagger
 * /api/cart/get:
 *   post:
 *     summary: Lấy dữ liệu giỏ hàng của người dùng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách món trong giỏ
 */
cartRouter.post("/get", generalLimiter, authMiddleware, getCart);

export default cartRouter;
