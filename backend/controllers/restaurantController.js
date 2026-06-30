import { restaurantService } from "../services/restaurantService.js";
import { sendSuccess } from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const listRestaurants = asyncHandler(async (req, res) => {
    const restaurants = await restaurantService.getAllRestaurants();
    sendSuccess(res, "Lấy danh sách nhà hàng thành công", restaurants);
});

const getRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const restaurant = await restaurantService.getRestaurantById(id);
    sendSuccess(res, "Lấy thông tin nhà hàng thành công", restaurant);
});

const addRestaurant = asyncHandler(async (req, res) => {
    const result = await restaurantService.createRestaurant(req.body);
    sendSuccess(res, "Thêm nhà hàng thành công", result);
});

const updateRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) throw new AppError("Thiếu ID nhà hàng", 400);
    const result = await restaurantService.updateRestaurant(id, req.body);
    sendSuccess(res, "Cập nhật nhà hàng thành công", result);
});

const removeRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) throw new AppError("Thiếu ID nhà hàng", 400);
    await restaurantService.deleteRestaurant(id);
    sendSuccess(res, "Xóa nhà hàng thành công");
});

export { listRestaurants, getRestaurant, addRestaurant, updateRestaurant, removeRestaurant };
