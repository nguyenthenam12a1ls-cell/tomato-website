import fs from "fs";
import path from "path";
import { prisma } from "../config/prisma.js";

const serializeFood = (food) => ({
    ...food,
    _id: String(food.id)
});

const addFood = async (req, res) => {
    try {
        const imageFilename = req.file?.filename;

        if (!imageFilename) {
            return res.json({ success: false, message: "Anh la bat buoc" });
        }

        await prisma.food.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                price: Number(req.body.price),
                category: req.body.category,
                image: imageFilename,
            },
        });

        res.json({ success: true, message: "Them mon an thanh cong" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Loi" });
    }
};

const listFood = async (req, res) => {
    try {
        const foods = await prisma.food.findMany({
            orderBy: { id: "desc" },
        });

        res.json({ success: true, data: foods.map(serializeFood) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const removeFood = async (req, res) => {
    try {
        const foodId = Number(req.body.id);

        if (Number.isNaN(foodId)) {
            return res.json({ success: false, message: "Invalid food id" });
        }

        const food = await prisma.food.findUnique({
            where: { id: foodId },
        });

        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        fs.unlink(`uploads/${food.image}`, () => {});

        await prisma.food.delete({
            where: { id: foodId },
        });

        res.json({ success: true, message: "Food removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const getFoodById = async (req, res) => {
    try {
        const foodId = Number(req.params.foodId);

        if (Number.isNaN(foodId)) {
            return res.json({ success: false, message: "ID mon an khong hop le" });
        }

        const food = await prisma.food.findUnique({
            where: { id: foodId },
        });

        if (!food) {
            return res.json({ success: false, message: "Khong tim thay mon an" });
        }

        res.json({ success: true, data: serializeFood(food) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Loi server" });
    }
};

const updateFood = async (req, res) => {
    try {
        const foodId = Number(req.body.id);

        if (Number.isNaN(foodId)) {
            return res.json({ success: false, message: "Invalid food id" });
        }

        const food = await prisma.food.findUnique({
            where: { id: foodId },
        });

        if (!food) {
            return res.json({ success: false, message: "Khong tim thay mon an" });
        }

        let imageFilename = food.image;

        if (req.file) {
            const oldImagePath = path.join("uploads", food.image);

            try {
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            } catch (error) {
                console.error("Loi khi xoa anh cu:", error);
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
                image: imageFilename,
            },
        });

        res.json({ success: true, message: "Cap nhat mon an thanh cong" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Loi server" });
    }
};

export { addFood, listFood, removeFood, getFoodById, updateFood };
