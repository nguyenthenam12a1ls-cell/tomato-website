import jwt from "jsonwebtoken";
import path from 'path'
import { fileURLToPath } from 'url';
import { userService } from "../services/userService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// login user(đã xong)
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError("Cần thêm thông tin email và mật khẩu", 404);
    }
    const token = await userService.login(email, password);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccess(res, "Đăng nhập thành công ", token);
});


// register user 
const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new AppError("Cần thêm thông tin tên, email và password", 404);
    }
    const token = await userService.register(name, email, password);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccess(res, "Đăng kí thành công", token);
});

// chức năng logout
const logoutUser = asyncHandler(async (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    sendSuccess(res, "Đã đăng xuất thành công");
});

// API lấy dữ liệu admin 
const getAdminData = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const adminData = await userService.getAdminData(userId);

    if (!adminData) {
        throw new AppError("Cần tìm thông tin admin", 404);
    }
    sendSuccess(res, "Lấy thông tin admin thành công", adminData);
});

// API lấy thông tin profile 
const getProfile = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const data = await userService.getProfile(userId);

    if (!data) throw new AppError("Cần thêm thông tin profile", 404);
    sendSuccess(res, "Lấy thông tin profile thành công", data);
});

// API cập nhật hồ sơ
const updateProfile = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const profileData = req.body;
    const file = req.file
    const updatedData = await userService.updateProfile(userId, profileData, file);

    if (!updatedData) throw new AppError("Cần cập nhật hồ sơ", 404);
    sendSuccess(res, "Đã cập nhật hồ sơ", updatedData);
});

// Google Auth Callback
const googleAuthCallback = asyncHandler((req, res, next) => {
    const user = req.user;
    const token = createToken(user.id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}?token=${token}`);
});

// --- HÀM MỚI: QUÊN MẬT KHẨU ---
const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const forgotedPassword = await userService.forgotPassword(email);
    if (!forgotedPassword) {
        throw new AppError("Lỗi quên mật khẩu", 404);
    }
    sendSuccess(res, "Nếu email tồn tại, link reset sẽ được gửi.");
});

// --- HÀM MỚI: ĐẶT LẠI MẬT KHẨU ---
const resetPassword = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const resetedPassword = await userService.resetPassword(token, newPassword);
    if (!resetedPassword) throw new AppError("Không thể reset password", 404);
    sendSuccess(res, "Mật khẩu đã được cập nhật thành công.");
});


export {
    loginUser,
    registerUser,
    logoutUser,
    getAdminData,
    getProfile,
    updateProfile,
    googleAuthCallback,
    forgotPassword,
    resetPassword
}
