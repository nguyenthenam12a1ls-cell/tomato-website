import fs from "fs";
import path from "path";
import { foodService } from "../services/foodService.js";


const serializeFood = (food) => ({
    ...food
});

const addFood = async (req, res) => {
    try {
        const imageFilename = req.file?.filename;
        const foodData = req.body;

        const newFood = await foodService.createFood(foodData, imageFilename);

        res.json({ success: true, message: "Thêm món ăn thành công", data: newFood });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Lỗi server" });
    }
};

const listFood = async (req, res) => {
    try {

        const foods = await foodService.getAllFoods();

        res.json({ success: true, data: foods.map(serializeFood) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi" });
    }
};

const removeFood = async (req, res) => {
    try {
        const foodId = Number(req.body.id);

        const food = await foodService.deleteFood(foodId);

        res.json({ success: true, message: "Đã xóa món ăn thành công", data: food });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi" });
    }
};

const getFoodById = async (req, res) => {
    try {
        const foodId = Number(req.params.foodId);

        const food = await foodService.getFoodById(foodId);

        res.json({ success: true, data: serializeFood(food) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Lỗi server" });
    }
};

const updateFood = async (req, res) => {
    try {
        const foodId = Number(req.body.id);

        if (Number.isNaN(foodId)) {
            return res.json({ success: false, message: "ID món ăn không hợp lệ" });
        }

        const existingFood = await foodService.getFoodById(foodId);

        const newImageFilename = req.file ? req.file.filename : existingFood.image;

        await foodService.updateFood(foodId, req.body, newImageFilename);

        res.json({ success: true, message: "Cập nhật món ăn thành công" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Lỗi server" });
    }
};

export { addFood, listFood, removeFood, getFoodById, updateFood };
