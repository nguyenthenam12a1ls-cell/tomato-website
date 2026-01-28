import express from 'express'
import {loginUser, registerUser, logoutUser , getAdminData, getProfile, updateProfile, googleAuthCallback, forgotPassword, resetPassword} from '../controllers/userController.js'
import authMiddleware from '../middleware/auth.js'
import multer from 'multer'
import passport from 'passport';

const upload = multer({ storage: multer.memoryStorage() });
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/getadmin', authMiddleware, getAdminData);
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.put("/update", authMiddleware, upload.single('avatar'), updateProfile);

userRouter.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
userRouter.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-error', session: false }),
  googleAuthCallback
);

// THÊM 2 ROUTE MỚI
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;