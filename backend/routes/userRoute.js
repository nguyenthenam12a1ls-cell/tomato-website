import express from 'express'
import { loginUser, registerUser, logoutUser, getAdminData, getProfile, updateProfile, googleAuthCallback, forgotPassword, resetPassword } from '../controllers/userController.js'
import authMiddleware from '../middleware/auth.js'
import multer from 'multer'
import passport from 'passport';
import { authLimiter, generalLimiter } from '../middleware/rateLimiter.js';
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/userValidator.js";
const upload = multer({ storage: multer.memoryStorage() });
const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API quản lý người dùng và xác thực
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 */
userRouter.post('/register', authLimiter, validate(registerSchema), registerUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
userRouter.post('/login', authLimiter, validate(loginSchema), loginUser);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
userRouter.post('/logout', generalLimiter, logoutUser);

/**
 * @swagger
 * /api/user/getadmin:
 *   post:
 *     summary: Lấy dữ liệu quản trị (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về dữ liệu quản trị
 */
userRouter.post('/getadmin', generalLimiter, authMiddleware, getAdminData);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Lấy thông tin cá nhân (Cần Token)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin cá nhân
 */
userRouter.get("/profile", generalLimiter, authMiddleware, getProfile);
userRouter.put("/update", generalLimiter, authMiddleware, upload.single('avatar'), updateProfile);

userRouter.get('/auth/google', generalLimiter,
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
userRouter.get('/auth/google/callback', generalLimiter,
  passport.authenticate('google', { failureRedirect: '/login-error', session: false }),
  googleAuthCallback
);

// THÊM 2 ROUTE MỚI
userRouter.post("/forgot-password", authLimiter, forgotPassword);
userRouter.post("/reset-password/:token", authLimiter, resetPassword);

export default userRouter;