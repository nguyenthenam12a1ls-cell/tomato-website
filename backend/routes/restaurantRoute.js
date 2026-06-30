import express from "express";
import {
    addRestaurant, getRestaurant, listRestaurants, removeRestaurant, updateRestaurant
} from "../controllers/restaurantController.js";
import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import { generalLimiter } from "../middleware/rateLimiter.js";
import multer from "multer";
import path from "path";

// 1. Cấu hình Multer để upload ảnh nhà hàng
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Chỉ chấp nhận file ảnh!"), false);
};

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage, fileFilter });

// Middleware nhỏ để trích xuất tên file ảnh và gắn vào req.body (do Controller của chúng ta lấy từ req.body)
const processImages = (req, res, next) => {
    if (req.files?.image) req.body.image = req.files.image[0].filename;
    if (req.files?.logo) req.body.logo = req.files.logo[0].filename;
    next();
};

const restaurantRouter = express.Router();

// 2. Public routes (Khách hàng mở app là gọi được)
restaurantRouter.get("/list", generalLimiter, listRestaurants);
restaurantRouter.get("/:id", generalLimiter, getRestaurant);

// 3. Admin routes (Chỉ Admin mới có quyền thêm/sửa/xóa nhà hàng)
// Dùng upload.fields vì Nhà hàng có 2 loại ảnh: image (ảnh bìa) và logo
restaurantRouter.post("/add", generalLimiter, authMiddleware, adminAuth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
]), processImages, addRestaurant);

restaurantRouter.post("/update", generalLimiter, authMiddleware, adminAuth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
]), processImages, updateRestaurant);

restaurantRouter.post("/remove", generalLimiter, authMiddleware, adminAuth, removeRestaurant);

export default restaurantRouter;
