import { cartService } from "../services/cartService.js"
import { sendSuccess, sendError } from "../utils/response.js";

// add items to user cart
const addToCart = async (req, res, next) => {
    try {
        const userId = Number(req.userId);
        const foodId = Number(req.body.itemId);

        await cartService.addToCart(userId, foodId);

        sendSuccess(res, "Đã thêm vào giỏ hàng");
    } catch (error) {
        next(error);
    }
};

// remove items from user cart
const removeFromCart = async (req, res, next) => {
    try {
        const userId = Number(req.userId);
        const foodId = Number(req.body.itemId);

        await cartService.removeFromCart(userId, foodId);

        sendSuccess(res, "Đã xóa món ăn khỏi giỏ hàng");
    } catch (error) {
        next(error);
    }
};

// fetch user cart data
const getCart = async (req, res, next) => {
    try {
        const userId = Number(req.userId);
        const cartData = await cartService.getCart(userId);
        sendSuccess(res, "Thao tác giỏ hàng thành công", cartData);
    } catch (error) {
        next(error);
    }
};

export { addToCart, removeFromCart, getCart };
