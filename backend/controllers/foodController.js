import fs from "fs"

import path from 'path';

import { prisma } from "../config/prisma.js";


// add food item 

const addFood = async (req, res) => {
    try {
        const image_filename = req.file?.filename;

        if(!image_filename){
            return res.json({success:false, message: "Ảnh là bắt buộc"});
        }

        await prisma.food.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                price: Number(req.body.price),
                category: req.body.category,
                image: image_filename
            }
        });

        res.json({success: true, message: "Thêm món ăn thành công"});
    } catch(error){
        console.log(error);
        res.json({success:false, message: "Lỗi"});
    }
}

// all food list

const listFood = async (req, res) => {
    try {
        const foods = await prisma.food.findMany({
            orderBy: {id: "desc"}
        });
        res.json({success: true, data: foods});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// remove food item 

const removeFood = async (req, res) => {
    try {
        const foodId = Number(req.body.id);

        if (Number.isNaN(foodId)) {
            return res.json({ success: false, message: "Invalid food id" });
        }

        const food = await prisma.food.findUnique({
            where: { id: foodId }
        });

        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        fs.unlink(`uploads/${food.image}`, () => {});

        await prisma.food.delete({
            where: { id: foodId }
        });

        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// lấy món ăn bằng ID 

const getFoodById = async (req, res) => {
    try {
        const foodId = Number(req.params.foodId);

        if(Number.isNaN(foodId)){
            return res.json({success:false, message:"ID món ăn không hợp lệ"});
        }

        const food = await prisma.food.findUnique({
            where: {id: foodId}
        });

        if(!food){
            return res.json({success: false, message: "Không tìm thấy món ăn"})
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
        const foodId = Number(req.body.id);

        if (Number.isNaN(foodId)) {
            return res.json({ success: false, message: "Invalid food id" });
        }

        const food = await prisma.food.findUnique({
            where: { id: foodId }
        });

        if (!food) {
            return res.json({ success: false, message: "Không tìm thấy món ăn" });
        }

        let imageFilename = food.image;

        if (req.file) {
            const oldImagePath = path.join("uploads", food.image);
            try {
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            } catch (err) {
                console.error("Lỗi khi xóa ảnh cũ:", err);
            }

            imageFilename = req.file.filename;
        }

        await prisma.food.update({
            where: { id: foodId },
            data: {
                name: req.body.name,
                description: req.body.description,
                price: Number(req.body.price),
                category: req.body.category,
                image: imageFilename
            }
        });

        res.json({ success: true, message: "Cập nhật món ăn thành công" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server" });
    }
};

export { addFood, listFood, removeFood , getFoodById, updateFood} 