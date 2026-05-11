import express from "express"
import { addFood, listFood, removeFood, getFoodById, updateFood } from "../controllers/foodController.js"
import multer from "multer"
import path from "path"
import validate from "../middleware/validate.js"
import { schema } from "../validators/foodValidator.js"
import { generalLimiter } from "../middleware/rateLimiter.js";
import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const foodRouter = express.Router();


const fileFiller = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) return cb(null, true);
    cb(new Error("Chỉ chấp nhận file ảnh!"), false);
}

// Image Storage Engine 

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage, fileFilter: fileFiller });

foodRouter.post("/add", generalLimiter, (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        next();
    });
}, authMiddleware, adminAuth, validate(schema), addFood);
foodRouter.get("/list", generalLimiter, listFood);
foodRouter.post("/remove", generalLimiter, authMiddleware, adminAuth, removeFood);
foodRouter.get("/get/:foodId", generalLimiter, getFoodById);
foodRouter.post("/update", generalLimiter, authMiddleware, adminAuth, upload.single("image"), updateFood);

export default foodRouter;