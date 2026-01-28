import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import validator from "validator"
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { sendPasswordResetEmail } from '../utils/mailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// login user 
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Doesn't exists" });
        }
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.json({ success: false, message: "Invalid credentials" });
            }
        } else {
            return res.json({ success: false, message: "Tài khoản này đăng nhập bằng Google." });
        }
        const token = createToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// register user 
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            if (exists.googleId) {
                return res.json({ success: false, message: "Email này đã được đăng ký bằng Google." });
            }
            return res.json({ success: false, message: "User already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
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
        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

// API lấy dữ liệu admin 
const getAdminData = async (req, res) => {
    try {
        const userId = req.userId; // (Code này đã đúng)
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Không tìm thấy Admin" });
        }
        const adminData = {
            name: user.name,
            email: user.email
        };
        res.json({ success: true, data: adminData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server khi lấy dữ liệu API" });
    }
};

// API lấy thông tin profile 
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId); // SỬA Ở ĐÂY
        if (!user) {
            return res.json({ success: false, message: "Không tìm thấy user" });
        }
        res.json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone,
                street: user.street,
                ward: user.ward,
                province: user.province,
                country: user.country
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi" });
    }
}

// API cập nhật hồ sơ
const updateProfile = async (req, res) => {
    try {
        const { name, phone, street, ward, province, country } = req.body;
        const updateData = { name, phone, street, ward, province, country };

        if (req.file) {
            const newFileName = `${Date.now()}-${req.file.originalname}`;
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            const imagePath = path.join(uploadsDir, newFileName);

            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            await fs.promises.writeFile(imagePath, req.file.buffer);
            updateData.avatar = newFileName;
        }
        await userModel.findByIdAndUpdate(req.userId, updateData); // SỬA Ở ĐÂY
        res.json({ success: true, message: "Đã cập nhật hồ sơ" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi khi cập nhật hồ sơ" });
    }
}

// Google Auth Callback
const googleAuthCallback = (req, res) => {
    try {
        const user = req.user;
        const token = createToken(user._id);
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
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.json({ success: true, message: "Nếu email tồn tại, link reset sẽ được gửi." });
        }

        if (!user.password) {
            return res.json({ success: false, message: "Tài khoản này đăng nhập bằng Google." });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

        await sendPasswordResetEmail(user.email, resetLink);

        res.json({ success: true, message: "Nếu email tồn tại, link reset sẽ được gửi." });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server" });
    }
};

// --- HÀM MỚI: ĐẶT LẠI MẬT KHẨU ---
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

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