import jwt from "jsonwebtoken";
import path from 'path'
import { fileURLToPath } from 'url';
import { userService } from "../services/userService.js";
import { sendSuccess, sendError } from "../utils/response.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// login user(đã xong)
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'Cần nhập thông tin và mật khẩu' });
    }
    try {
        const token = await userService.login(email, password);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        sendSuccess(res, "Đăng nhập thành công ", token);
    } catch (error) {
        next(error);
    }
}


// register user 
const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        sendError(res, 'Thông tin đăng nhập không hợp lệ');
    }
    try {
        const token = await userService.register(name, email, password);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        sendSuccess(res, "Đăng xuất thành công", token);
    } catch (error) {
        next(error);
    }
}

// chức năng logout
const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        sendSuccess(res, "Đã đăng xuất thành công");
    } catch (error) {
        next(error);
    }
}

// API lấy dữ liệu admin 
const getAdminData = async (req, res, next) => {
    try {
        const userId = req.userId;
        const adminData = await userService.getAdminData(userId);
        sendSuccess(res, "Lấy thông tin admin thành công", adminData);
    } catch (error) {
        next(error);
    }
};

// API lấy thông tin profile 
const getProfile = async (req, res, next) => {
    try {
        const userId = req.userId;
        const data = await userService.getProfile(userId);

        sendSuccess(res, "Lấy thông tin profile thành công", data);
    } catch (error) {
        next(error);
    }
}

// API cập nhật hồ sơ
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.userId;
        const profileData = req.body;
        const file = req.file
        const updatedData = await userService.updateProfile(userId, profileData, file);

        sendSuccess(res, "Đã cập nhật hồ sơ", updatedData);
    } catch (error) {
        next(error);
    }
}

// Google Auth Callback
const googleAuthCallback = (req, res, next) => {
    try {
        const user = req.user;
        const token = createToken(user.id);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}?token=${token}`);
    } catch (error) {
        next(error);
    }
}

// --- HÀM MỚI: QUÊN MẬT KHẨU ---
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const forgotedPassword = await userService.forgotPassword(email);
        sendSuccess(res, "Nếu email tồn tại, link reset sẽ được gửi.");

    } catch (error) {
        next(error);
    }
};

// --- HÀM MỚI: ĐẶT LẠI MẬT KHẨU ---
const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const resetedPassword = await userService.resetPassword(token, newPassword);

        sendSuccess(res, "Mật khẩu đã được cập nhật thành công.");

    } catch (error) {
        next(error);
    }
};


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
