import { prisma } from "../config/prisma.js";

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


const addToCart = async (userId, foodId) => {

    if (Number.isNaN(userId) || Number.isNaN(foodId)) {
        throw new Error("ID không hợp lệ")
    }

    const userData = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userData) {
        throw new Error("Không tìm thấy user");
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
};

const removeFromCart = async (userId, foodId) => {

    if (Number.isNaN(userId) || Number.isNaN(foodId)) {
        throw new Error("ID không hợp lệ");
    }

    const userData = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userData) {
        throw new Error("Không tìm được user");
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
        return;
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
};

const getCart = async (userId) => {
    if (Number.isNaN(userId)) {
        throw new Error("ID không hợp lệ");
    }

    const userData = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userData) {
        throw new Error("Không tìm thấy user");
    }

    const cart = await getOrCreateCart(userId);
    const cartData = {};

    for (const item of cart.items) {
        cartData[String(item.foodId)] = item.quantity;
    }
    return cartData;
};

export const cartService = {
    addToCart,
    removeFromCart,
    getCart
};