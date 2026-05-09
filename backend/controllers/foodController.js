import fs from "fs";
import path from "path";
import { foodService } from "../services/foodService.js";


const serializeFood = (food) => ({
    ...food
});

const addFood = async (req, res, next) => {
    try {
        const imageFilename = req.file?.filename;
        const foodData = req.body;

        const newFood = await foodService.createFood(foodData, imageFilename);

        res.json({ success: true, message: "Thêm món ăn thành công", data: newFood });
    } catch (error) {
        next(error);
    }
};

const listFood = async (req, res, next) => {
    try {

        const foods = await foodService.getAllFoods();

        res.json({ success: true, data: foods.map(serializeFood) });
    } catch (error) {
        next(error);
    }
};

const removeFood = async (req, res, next) => {
    try {
        const foodId = Number(req.body.id);

        const food = await foodService.deleteFood(foodId);

        res.json({ success: true, message: "Đã xóa món ăn thành công", data: food });
    } catch (error) {
        next(error);
    }
};

const getFoodById = async (req, res, next) => {
    try {
        const foodId = Number(req.params.foodId);

        const food = await foodService.getFoodById(foodId);

        res.json({ success: true, data: serializeFood(food) });
    } catch (error) {
        next(error);
    }
};

const updateFood = async (req, res, next) => {
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
        next(error);
    }
};

export { addFood, listFood, removeFood, getFoodById, updateFood };
