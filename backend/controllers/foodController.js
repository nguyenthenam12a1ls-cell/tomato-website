import fs from "fs";
import path from "path";
import { foodService } from "../services/foodService.js";
import { sendError, sendSuccess } from '../utils/response.js';
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import redisClient from "../config/redis.js";

const serializeFood = (food) => ({
    ...food
});

const addFood = asyncHandler(async (req, res, next) => {
    const imageFilename = req.file?.filename;
    const foodData = req.body;

    const newFood = await foodService.createFood(foodData, imageFilename);
    if (!newFood) throw new AppError("Không tìm thấy món ăn mới", 404)

    sendSuccess(res, "Thêm món ăn thành công", newFood);
    await redisClient.del("foods:all");
});

const listFood = asyncHandler(async (req, res, next) => {
    const key = "foods:all";
    const cachedFoods = await redisClient.get(key);
    if (cachedFoods) {
        const data = JSON.parse(cachedFoods);
        return sendSuccess(res, "Có dữ liệu", data);
    }

    const foods = await foodService.getAllFoods();
    if (!foods) throw new AppError("Không thể list món ăn", 404);

    const dataFoods = JSON.stringify(foods);
    await redisClient.set(key, dataFoods);

    sendSuccess(res, "Lấy danh sách món ăn thành công", foods.map(serializeFood));
});

const removeFood = asyncHandler(async (req, res, next) => {
    const foodId = Number(req.body.id);

    const food = await foodService.deleteFood(foodId);

    if (!food) throw new AppError("Không tìm thấy món ăn để xóa", 404);
    sendSuccess(res, "Đã xóa món ăn thành công", food);

    await redisClient.del("foods:all");
});

const getFoodById = asyncHandler(async (req, res, next) => {
    const foodId = Number(req.params.foodId);

    const food = await foodService.getFoodById(foodId);

    if (!food) throw new AppError("Không tìm thấy món ăn", 404);
    sendSuccess(res, "Lấy thông tin món ăn thành công", serializeFood(food));


});

const updateFood = asyncHandler(async (req, res, next) => {
    const foodId = Number(req.body.id);

    if (Number.isNaN(foodId)) {
        throw new AppError("ID món ăn không hợp lệ", 404);
    }

    const existingFood = await foodService.getFoodById(foodId);

    const newImageFilename = req.file ? req.file.filename : existingFood.image;

    await foodService.updateFood(foodId, req.body, newImageFilename);

    sendSuccess(res, "Cập nhật món ăn thành công");

    await redisClient.del("foods:all");
});

export { addFood, listFood, removeFood, getFoodById, updateFood };
