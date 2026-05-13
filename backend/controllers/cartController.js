import { cartService } from "../services/cartService.js"
import { sendSuccess, sendError } from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
// add items to user cart
const addToCart = asyncHandler(async (req, res, next) => {
    const userId = Number(req.userId);
    const foodId = Number(req.body.itemId);

    const updatedCart = await cartService.addToCart(userId, foodId);
    if (!updatedCart) throw new AppError("Không thể thêm vào giỏ hàng", 404);
    sendSuccess(res, "Đã thêm vào giỏ hàng");
});

// remove items from user cart
const removeFromCart = asyncHandler(async (req, res, next) => {
    const userId = Number(req.userId);
    const foodId = Number(req.body.itemId);

    const removeCart = await cartService.removeFromCart(userId, foodId);
    if (!removeCart) throw new AppError("Không thể xóa món ăn khỏi giỏ hàng", 404);
    sendSuccess(res, "Đã xóa món ăn khỏi giỏ hàng");
});

// fetch user cart data
const getCart = asyncHandler(async (req, res, next) => {
    const userId = Number(req.userId);
    const cartData = await cartService.getCart(userId);
    if (!cartData) throw new AppError("Không thể thao tác giỏ hàng thành công", 404);
    sendSuccess(res, "Thao tác giỏ hàng thành công", cartData);
});

export { addToCart, removeFromCart, getCart };
