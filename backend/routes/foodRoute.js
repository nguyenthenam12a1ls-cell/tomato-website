import express from "express"
import { addFood, listFood, removeFood, getFoodById, updateFood } from "../controllers/foodController.js"
import multer from "multer"
import path from "path"
import validate from "../middleware/validate.js"
import { schema } from "../validators/foodValidator.js"
import { generalLimiter } from "../middleware/rateLimiter.js";
import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

// ✅ Khai báo upload TRƯỚC khi dùng
const fileFiller = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Chỉ chấp nhận file ảnh!"), false);
}

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage, fileFilter: fileFiller });

const foodRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Food
 *   description: API quản lý món ăn (Dành cho cả User và Admin)
 */

/**
 * @swagger
 * /api/food/add:
 *   post:
 *     summary: Thêm món ăn mới (Chỉ dành cho Admin)
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thêm món ăn thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
foodRouter.post("/add", generalLimiter, (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        next();
    });
}, authMiddleware, adminAuth, validate(schema), addFood);

/**
 * @swagger
 * /api/food/list:
 *   get:
 *     summary: Lấy danh sách tất cả món ăn
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: Trả về danh sách món ăn
 */
foodRouter.get("/list", generalLimiter, listFood);

/**
 * @swagger
 * /api/food/remove:
 *   post:
 *     summary: Xóa món ăn (Chỉ dành cho Admin)
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
foodRouter.post("/remove", generalLimiter, authMiddleware, adminAuth, removeFood);

/**
 * @swagger
 * /api/food/get/{foodId}:
 *   get:
 *     summary: Lấy thông tin chi tiết một món ăn
 *     tags: [Food]
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trả về thông tin món ăn
 *       404:
 *         description: Không tìm thấy món ăn
 */
foodRouter.get("/get/:foodId", generalLimiter, getFoodById);

/**
 * @swagger
 * /api/food/update:
 *   post:
 *     summary: Cập nhật thông tin món ăn (Chỉ dành cho Admin)
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id: { type: number }
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
foodRouter.post("/update", generalLimiter, authMiddleware, adminAuth, upload.single("image"), updateFood);

export default foodRouter;