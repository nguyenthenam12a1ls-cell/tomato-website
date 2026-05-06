import { cartService } from "../services/cartService.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const userId = Number(req.userId);
        const foodId = Number(req.body.itemId);

        await cartService.addToCart(userId, foodId);

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

        await cartService.removeFromCart(userId, foodId);

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
        const cartData = await cartService.getCart(userId);
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi khi lấy dữ liệu giỏ hàng" });
    }
};

export { addToCart, removeFromCart, getCart };
