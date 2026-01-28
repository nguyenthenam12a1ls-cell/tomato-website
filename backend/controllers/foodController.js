import foodModel from "../models/foodModel.js";

import fs from "fs"

import path from 'path';
// add food item 

const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);;
        res.json({ success: false, message: "Error" });
    }
}

// all food list

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// remove food item 

const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// lấy món ăn bằng ID 

const getFoodById = async (req, res) => {
    try {
        const foodId = req.params.foodId;
        const food = await foodModel.findById(foodId);

        if (!food) {
            return res.json({ success: false, message: "Không tìm thấy món ăn" });
        }

        res.json({ success: true, data: food });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server " });
    }
}

// update food 

// update food 
const updateFood = async (req, res) => {
    try {
        const foodId = req.body.id;

        const food = await foodModel.findById(foodId);

        if (!food) {
            return res.json({ success: false, message: "Không tìm thấy món ăn" });
        }

        let imageFilename = food.image; // Mặc định giữ ảnh cũ

        // Nếu có ảnh mới thì mới xử lý ảnh
        if (req.file) {
            // xóa ảnh cũ
            const oldImagePath = path.join("uploads", food.image);
            try {
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            } catch (err) {
                console.error("Lỗi khi xóa ảnh cũ: ", err);
            }
            // lấy tên file ảnh mới
            imageFilename = req.file.filename;
        }

        // === SỬA LỖI LOGIC ===
        // Luôn luôn cập nhật DB (dù có ảnh mới hay không)
        // và di chuyển logic này ra ngoài khối 'if'
        await foodModel.findByIdAndUpdate(foodId, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: imageFilename // Cập nhật tên ảnh (mới hoặc cũ)
        });

        // Luôn luôn trả về response (di chuyển ra ngoài khối 'if')
        res.json({success:true, message: "Cập nhật món ăn thành công"});

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server" });
    }
};
export { addFood, listFood, removeFood , getFoodById, updateFood} 