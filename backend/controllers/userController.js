import { prisma } from '../config/prisma.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import validator from "validator"
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { sendPasswordResetEmail } from '../utils/mailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// login user(đã xong)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'Cần nhập thông tin và mật khẩu' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại" });
        }
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.json({ success: false, message: "Thông tin đăng nhập không hợp lệ" });
            }

        } else {
            return res.json({ success: false, message: "Tài khoản này đăng nhập bằng Google." });
        }

        const token = createToken(user.id);

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

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// register user 
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Thông tin đăng nhập không hợp lệ' });
    }
    try {
        const exists = await prisma.user.findUnique({
            where: { email }
        });
        if (exists) {
            if (exists.googleId) {
                return res.json({ success: false, message: "Email này đã được đăng ký bằng Google." });
            }
            return res.json({ success: false, message: "Người dùng đã tồn tại" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Vui lòng nhập email hợp lệ" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Vui lòng nhập mật khẩu mạnh hơn" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const token = createToken(user.id);
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
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) }
        });

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
        const userId = req.userId;

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Không tìm thấy user" });
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
        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (street !== undefined) updateData.street = street;
        if (ward !== undefined) updateData.ward = ward;
        if (province !== undefined) updateData.province = province;
        if (country !== undefined) updateData.country = country;

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
        await prisma.user.update({
            where: { id: Number(req.userId) },
            data: updateData
        });

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
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.json({ success: true, message: "Nếu email tồn tại, link reset sẽ được gửi." });
        }

        if (!user.password) {
            return res.json({ success: false, message: "Tài khoản này đăng nhập bằng Google." });
        }

        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
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
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(userId) }
        });

        if (!existingUser) {
            return res.json({ success: false, message: "Người dùng không tồn tại." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.update({
            where: { id: Number(userId) },
            data: { password: hashedPassword }
        });

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
