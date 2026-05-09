import express from 'express'
import { loginUser, registerUser, logoutUser, getAdminData, getProfile, updateProfile, googleAuthCallback, forgotPassword, resetPassword } from '../controllers/userController.js'
import authMiddleware from '../middleware/auth.js'
import multer from 'multer'
import passport from 'passport';
import { authLimiter, generalLimiter } from '../middleware/rateLimiter.js';

const upload = multer({ storage: multer.memoryStorage() });
const userRouter = express.Router();

userRouter.post('/register', authLimiter, registerUser);
userRouter.post('/login', authLimiter, loginUser);
userRouter.post('/logout', generalLimiter, logoutUser);
userRouter.post('/getadmin', generalLimiter, authMiddleware, getAdminData);
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