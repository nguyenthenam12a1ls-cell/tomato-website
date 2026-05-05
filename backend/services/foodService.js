import fs from "fs";
import path from "path";
import { prisma } from "../config/prisma.js";

const createFood = async (foodData, imageFilename) => {
    if (!imageFilename) {
        throw new Error("Ảnh là bắt buộc");
    }

    const newFood = await prisma.food.create({
        data: {
            name: foodData.name,
            description: foodData.description,
            price: Number(foodData.price),
            category: foodData.category,
            image: imageFilename,
        },
    });
    return newFood;
};

const getAllFoods = async () => {
    const foods = await prisma.food.findMany({
        orderBy: { id: "desc" }
    });
    return foods;
};

const deleteFood = async (foodId) => {

    if (isNaN(foodId)) {
        throw new Error("Không tìm thấy ID của món ăn");
    }

    const food = await prisma.food.findUnique({
        where: { id: foodId }
    });

    if (!food) {
        throw new Error("Không tìm thấy món ăn");
    }

    fs.unlink(`uploads/${food.image}`, () => { });

    await prisma.food.delete({
        where: { id: foodId }
    });

    return food;
};

const getFoodById = async (foodId) => {

    const food = await prisma.food.findUnique({
        where: { id: foodId }
    });

    if (!food) {
        throw new Error("Không tìm thấy id của món ăn");
    }

    return food;
};

const updateFood = async (foodId, foodData, newImageFilename) => {

    const food = await prisma.food.findUnique({
        where: { id: foodId }
    });

    if (!food) {
        throw new Error("Không tìm thấy món ăn");
    }

    if (newImageFilename != food.image) {
        const oldImagePath = path.join("uploads", food.image);
        try {
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } catch (error) {
            console.log("Lỗi khi xóa ảnh cũ: " + error);
        }
    }

    const updatedFood = await prisma.food.update({
        where: { id: foodId },
        data: {
            name: foodData.name,
            description: foodData.description,
            price: Number(foodData.price),
            category: foodData.category,
            image: newImageFilename,
        },
    });

    return updatedFood;
};

export const foodService = {
    createFood,
    getAllFoods,
    deleteFood,
    getFoodById,
    updateFood,
};