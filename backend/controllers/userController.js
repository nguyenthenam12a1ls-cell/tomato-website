import jwt from "jsonwebtoken";
import path from 'path'
import { fileURLToPath } from 'url';
import { userService } from "../services/userService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// login user(đã xong)
const loginUser = async (req, res) => {
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

        return res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi" });
    }
}


// register user 
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Thông tin đăng nhập không hợp lệ' });
    }
    try {
        const token = await userService.register(name, email, password);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi khi đăng ký người dùng" });
    }
}

// chức năng logout
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Đã đăng xuất thành công" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Lỗi khi đăng xuất" });
    }
}

// API lấy dữ liệu admin 
const getAdminData = async (req, res) => {
    try {
        const userId = req.userId;
        const adminData = await userService.getAdminData(userId);
        res.json({ success: true, data: adminData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server khi lấy dữ liệu API" });
    }
};

// API lấy thông tin profile 
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const data = await userService.getProfile(userId);

        return res.json({ success: true, data });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi" });
    }
}

// API cập nhật hồ sơ
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const profileData = req.body;
        const file = req.file
        const updatedData = await userService.updateProfile(userId, profileData, file);

        res.json({ success: true, message: "Đã cập nhật hồ sơ", data: updatedData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi khi cập nhật hồ sơ" });
    }
}

// Google Auth Callback
const googleAuthCallback = (req, res) => {
    try {
        const user = req.user;
        const token = createToken(user.id);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}?token=${token}`);
    } catch (error) {
        console.log(error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login-error`);
    }
}

// --- HÀM MỚI: QUÊN MẬT KHẨU ---
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const forgotedPassword = await userService.forgotPassword(email);
        res.json({ success: true, message: "Nếu email tồn tại, link reset sẽ được gửi." });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server" });
    }
};

// --- HÀM MỚI: ĐẶT LẠI MẬT KHẨU ---
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const resetedPassword = await userService.resetPassword(token, newPassword);

        res.json({ success: true, message: "Mật khẩu đã được cập nhật thành công." });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Link không hợp lệ hoặc đã hết hạn." });
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
