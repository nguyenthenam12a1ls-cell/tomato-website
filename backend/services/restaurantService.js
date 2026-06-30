import { prisma } from "../config/prisma.js";

const getAllRestaurants = async () => {
    const restaurants = await prisma.restaurant.findMany({
        orderBy: { createdAt: 'desc' }
    });
    // Biến đổi cái tags đang bị lưu dưới dạng chữ (string) thành mảng (array) để Frontend dễ dùng
    return restaurants.map(res => ({
        ...res,
        tags: res.tags ? JSON.parse(res.tags) : []
    }));
};

const getRestaurantById = async (id) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: Number(id) }
    });

    if (!restaurant) throw new Error("Nhà hàng không tồn tại");

    return {
        ...restaurant,
        tags: restaurant.tags ? JSON.parse(restaurant.tags) : []
    };
};

const createRestaurant = async (data) => {
    return prisma.restaurant.create({
        data: {
            ...data,
            // Ép mảng tags ngược lại thành string để lưu vào PostgreSQL
            tags: data.tags ? JSON.stringify(data.tags) : "[]",
            rating: Number(data.rating) || 0
        }
    });
};

const updateRestaurant = async (id, data) => {
    return prisma.restaurant.update({
        where: { id: Number(id) },
        data: {
            ...data,
            tags: data.tags ? JSON.stringify(data.tags) : "[]",
            ...(data.rating && { rating: Number(data.rating) })
        }
    });
};

const deleteRestaurant = async (id) => {
    return prisma.restaurant.delete({
        where: { id: Number(id) }
    });
};

export const restaurantService = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};
