import fs from "fs";
import path from "path";
import { foodService } from "../services/foodService.js";
import { sendError, sendSuccess } from '../utils/response.js';

const serializeFood = (food) => ({
    ...food
});

const addFood = async (req, res, next) => {
    try {
        const imageFilename = req.file?.filename;
        const foodData = req.body;

        const newFood = await foodService.createFood(foodData, imageFilename);

        sendSuccess(res, "Thêm món ăn thành công", newFood);
    } catch (error) {
        next(error);
    }
};

const listFood = async (req, res, next) => {
    try {

        const foods = await foodService.getAllFoods();

        sendSuccess(res, "Lấy danh sách món ăn thành công", foods.map(serializeFood));
    } catch (error) {
        next(error);
    }
};

const removeFood = async (req, res, next) => {
    try {
        const foodId = Number(req.body.id);

        const food = await foodService.deleteFood(foodId);

        sendSuccess(res, "Đã xóa món ăn thành công", food);
    } catch (error) {
        next(error);
    }
};

const getFoodById = async (req, res, next) => {
    try {
        const foodId = Number(req.params.foodId);

        const food = await foodService.getFoodById(foodId);

        sendSuccess(res, "Lấy thông tin món ăn thành công", serializeFood(food));
    } catch (error) {
        next(error);
    }
};

const updateFood = async (req, res, next) => {
    try {
        const foodId = Number(req.body.id);

        if (Number.isNaN(foodId)) {
            sendError(res, "ID món ăn không hợp lệ");
            return;
        }

        const existingFood = await foodService.getFoodById(foodId);

        const newImageFilename = req.file ? req.file.filename : existingFood.image;

        await foodService.updateFood(foodId, req.body, newImageFilename);

        sendSuccess(res, "Cập nhật món ăn thành công");
    } catch (error) {
        next(error);
    }
};

export { addFood, listFood, removeFood, getFoodById, updateFood };
