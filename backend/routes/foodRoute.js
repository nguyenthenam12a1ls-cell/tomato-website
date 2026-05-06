import express from "express"
import { addFood, listFood, removeFood, getFoodById, updateFood } from "../controllers/foodController.js"
import multer from "multer"
import path from "path"
import validate from "../middleware/validate.js"
import { schema } from "../validators/foodValidator.js"



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

foodRouter.post("/add", (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        next();
    });
}, validate(schema), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.get("/get/:foodId", getFoodById);
foodRouter.post("/update", upload.single("image"), updateFood);

export default foodRouter;