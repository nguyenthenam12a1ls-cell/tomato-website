import { prisma } from '../config/prisma.js';

const getOrCreateCart = async (userId) => {
    const numericUserId = Number(userId);

    let cart = await prisma.cart.findUnique({
        where: { userId: numericUserId },
        include: { items: true }
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId: numericUserId },
            include: { items: true }
        });
    }

    return cart;
};

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const userId = Number(req.userId);
        const foodId = Number(req.body.itemId);

        if (Number.isNaN(userId) || Number.isNaN(foodId)) {
            return res.json({ success: false, message: "ID không hợp lệ" });
        }

        const userData = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userData) {
            return res.json({ success: false, message: "Không tìm thấy user" });
        }

        const cart = await getOrCreateCart(userId);

        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_foodId: {
                    cartId: cart.id,
                    foodId
                }
            }
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + 1 }
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    foodId,
                    quantity: 1
                }
            });
        }

        res.json({ success: true, message: "Đã thêm vào giỏ hàng" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi thêm vào giỏ hàng" });
    }
};

// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const userId = Number(req.userId);
        const foodId = Number(req.body.itemId);

        if (Number.isNaN(userId) || Number.isNaN(foodId)) {
            return res.json({ success: false, message: "ID không hợp lệ" });
        }

        const userData = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userData) {
            return res.json({ success: false, message: "Không tìm thấy user" });
        }

        const cart = await getOrCreateCart(userId);

        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_foodId: {
                    cartId: cart.id,
                    foodId
                }
            }
        });

        if (!existingItem) {
            return res.json({ success: true, message: "Giỏ hàng đã được cập nhật" });
        }

        if (existingItem.quantity > 1) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity - 1 }
            });
        } else {
            await prisma.cartItem.delete({
                where: { id: existingItem.id }
            });
        }

        res.json({ success: true, message: "Đã xóa món ăn khỏi giỏ hàng" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi xóa khỏi giỏ hàng" });
    }
};

// fetch user cart data
const getCart = async (req, res) => {
    try {
        const userId = Number(req.userId);

        if (Number.isNaN(userId)) {
            return res.json({ success: false, message: "ID không hợp lệ" });
        }

        const userData = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userData) {
            return res.json({ success: false, message: "Không tìm thấy user" });
        }

        const cart = await getOrCreateCart(userId);
        const cartData = {};

        for (const item of cart.items) {
            cartData[String(item.foodId)] = item.quantity;
        }

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi khi lấy dữ liệu giỏ hàng" });
    }
};

export { addToCart, removeFromCart, getCart };
