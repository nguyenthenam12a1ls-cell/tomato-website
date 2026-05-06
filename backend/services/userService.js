import fs from "fs";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { sendPasswordResetEmail } from '../utils/mailService.js';
import validator from 'validator';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

const login = async (email, password) => {
    if (!email || !password) {
        throw new Error("Cần nhập thông tin và mật khẩu");
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("Người dùng không tồn tại");
    }

    if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Thông tin đăng nhập không hợp lệ");
        }

    } else {
        throw new Error("Tài khoản này đăng nhập bằng Google.");
    }

    const token = createToken(user.id);

    return token;
}


const register = async (name, email, password) => {

    if (!name || !email || !password) {
        throw new Error('Thông tin đăng nhập không hợp lệ');
    }

    const exists = await prisma.user.findUnique({
        where: { email }
    });

    if (exists) {
        if (exists.googleId) {
            throw new Error("Email này đã được đăng ký bằng Google.");
        }
        throw new Error("Người dùng đã tồn tại");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Vui lòng nhập email hợp lệ");
    }
    if (password.length < 8) {
        throw new Error("Vui lòng nhập mật khẩu mạnh hơn");
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

    return token;
}

const getAdminData = async (userId) => {

    const user = await prisma.user.findUnique({
        where: { id: Number(userId) }
    });

    if (!user) {
        throw new Error("Không tìm thấy Admin");
    }

    const adminData = {
        name: user.name,
        email: user.email
    };

    return adminData;

};

const getProfile = async (userId) => {

    const user = await prisma.user.findUnique({
        where: { id: Number(userId) }
    });

    if (!user) {
        throw new Error("Không tìm thấy user");
    }
    return ({
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
}

const updateProfile = async (userId, profileData, file) => {

    const { name, phone, street, ward, province, country } = profileData;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (street !== undefined) updateData.street = street;
    if (ward !== undefined) updateData.ward = ward;
    if (province !== undefined) updateData.province = province;
    if (country !== undefined) updateData.country = country;

    if (file) {
        const newFileName = `${Date.now()}-${file.originalname}`;
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        const imagePath = path.join(uploadsDir, newFileName);

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        await fs.promises.writeFile(imagePath, file.buffer);
        updateData.avatar = newFileName;
    }

    await prisma.user.update({
        where: { id: Number(userId) },
        data: updateData
    });

    return updateData;
};

const forgotPassword = async (email) => {

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("Nếu email tồn tại, link reset sẽ được gửi.");
    }

    if (!user.password) {
        throw new Error("Tài khoản này đăng nhập bằng Google.");
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(user.email, resetLink);

};

const resetPassword = async (token, newPassword) => {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const existingUser = await prisma.user.findUnique({
        where: { id: Number(userId) }
    });

    if (!existingUser) {
        throw new Error("Người dùng không tồn tại.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
        where: { id: Number(userId) },
        data: { password: hashedPassword }
    });
}

export const userService = {
    login,
    register,
    getAdminData,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword
};