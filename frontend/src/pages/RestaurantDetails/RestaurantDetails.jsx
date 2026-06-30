import React, { useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { url } = useAuth();
    const { food_list, cartItems, addToCart, removeFromCart, totalAmount } = useContext(CartContext);

    // 1. Gọi API lấy chi tiết nhà hàng từ Backend
    const { data: restaurant, isLoading, isError } = useQuery({
        queryKey: ['restaurant', id],
        queryFn: async () => {
            const res = await axios.get(`${url}/api/restaurant/${id}`);
            return res.data.data;
        }
    });

    // 2. Lọc danh sách món ăn (Tạm thời chúng ta sẽ hiển thị toàn bộ menu của quán, sau này nâng cấp Database thêm khóa ngoại sẽ lọc chính xác hơn)
    const restaurantFoods = useMemo(() => {
        if (!food_list || !restaurant) return [];
        return food_list;
    }, [food_list, restaurant]);

    // 3. Quản lý giỏ hàng bên tay phải
    const activeCartItems = useMemo(() => {
        if (!food_list || !cartItems) return [];
        return food_list
            .filter(item => cartItems[item.id || item._id] > 0)
            .map(item => ({
                ...item,
                quantity: cartItems[item.id || item._id]
            }));
    }, [food_list, cartItems]);

    const getImageUrl = (imageName) => {
        if (!imageName) return "";
        if (imageName.startsWith("http")) return imageName;
        return url + "/images/" + imageName;
    };

    // Hiển thị vòng xoay đang tải khi gọi mạng
    if (isLoading) {
        return (
            <main className="pt-20 min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </main>
        );
    }

    // Hiển thị báo lỗi nếu id không tồn tại
    if (isError || !restaurant) {
        return (
            <main className="pt-20 min-h-screen bg-background flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-on-surface">Không tìm thấy nhà hàng</h2>
                <button onClick={() => navigate('/restaurants')} className="mt-4 text-primary hover:underline">Quay lại danh sách</button>
            </main>
        );
    }

    return (
        <main className="pt-20 min-h-screen bg-background">
            {/* PHẦN 1: HEADER QUÁN KÉO DÀI TRÊN CÙNG */}
            <section className="relative w-full aspect-[21/9] md:aspect-[16/6] overflow-hidden">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${getImageUrl(restaurant.image)})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full px-4 md:px-margin-desktop pb-6 flex flex-col md:flex-row md:items-end gap-6 z-10">
                    <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-background bg-white shadow-lg overflow-hidden shrink-0">
                        <img className="w-full h-full object-cover" src={getImageUrl(restaurant.logo)} alt="Logo" />
                    </div>
                    <div className="flex-grow text-white pb-1">
                        <div className="flex items-center gap-2 mb-1">
                            {restaurant.isOpen !== false && <span className="bg-[#4CAF50] text-white px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Đang mở</span>}
                            <div className="flex items-center gap-1 text-yellow-400">
                                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="font-bold">{restaurant.rating || "5.0"}</span>
                            </div>
                        </div>
                        <h1 className="font-headline-lg text-[24px] md:text-[36px] font-bold drop-shadow-md">{restaurant.name}</h1>
                        <p className="text-white/80 text-sm mb-2">{restaurant.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/70">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {restaurant.address || "Chi nhánh chính"}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {restaurant.deliveryTime || "30-45'"}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">delivery_dining</span> {restaurant.deliveryFee ? `$${restaurant.deliveryFee} ship` : "Free ship"}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* PHẦN 2: THỰC ĐƠN VÀ GIỎ HÀNG BÊN PHẢI */}
            <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 flex flex-col md:flex-row gap-gutter items-start">

                <div className="flex-grow w-full md:w-2/3">
                    <h2 className="font-headline-md text-headline-md font-bold mb-6 flex items-center gap-2">
                        Thực đơn của quán <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                    </h2>

                    {restaurantFoods.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-outline-variant/30">
                            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">restaurant_menu</span>
                            <p className="text-on-surface-variant font-bold">Thực đơn đang được cập nhật...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                            {restaurantFoods.map((food, index) => {
                                const qty = cartItems[food.id || food._id] || 0;
                                return (
                                    <div key={index} className="bg-white p-4 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30 group">
                                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shrink-0 bg-surface-container-low">
                                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={`${url}/images/${food.image}`} alt={food.name} />
                                        </div>
                                        <div className="flex flex-col justify-between flex-grow">
                                            <div>
                                                <div className="flex justify-between items-start gap-2 mb-1">
                                                    <h3 className="font-bold text-[16px] group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/food/${food.id || food._id}`)}>{food.name}</h3>
                                                    <span className="text-primary font-bold whitespace-nowrap">${food.price.toFixed(2)}</span>
                                                </div>
                                                <p className="text-on-surface-variant text-[12px] line-clamp-2">{food.description}</p>
                                            </div>

                                            <div className="flex justify-end mt-2">
                                                {qty === 0 ? (
                                                    <button
                                                        onClick={() => addToCart(food.id || food._id)}
                                                        className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2 bg-primary-container text-on-primary-container rounded-full px-2 py-1 shadow-sm">
                                                        <button onClick={() => removeFromCart(food.id || food._id)} className="w-6 h-6 flex items-center justify-center font-bold text-lg hover:bg-black/5 rounded-full">-</button>
                                                        <span className="font-bold text-sm min-w-[12px] text-center">{qty}</span>
                                                        <button onClick={() => addToCart(food.id || food._id)} className="w-6 h-6 flex items-center justify-center font-bold text-lg hover:bg-black/5 rounded-full">+</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <aside className="w-full md:w-1/3 sticky top-24 bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
                    <div className="p-5 bg-surface-container-low border-b border-outline-variant/50">
                        <h3 className="font-bold text-lg text-on-surface">Giỏ hàng của bạn</h3>
                        <p className="text-xs text-on-surface-variant mt-1">Từ: {restaurant.name}</p>
                    </div>

                    <div className="p-5 max-h-[300px] overflow-y-auto space-y-4">
                        {activeCartItems.length === 0 ? (
                            <div className="py-8 text-center text-on-surface-variant">
                                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">shopping_basket</span>
                                <p className="text-sm">Chưa có món nào trong giỏ hàng</p>
                            </div>
                        ) : (
                            activeCartItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center border-b border-outline-variant/20 pb-3 last:border-0 last:pb-0">
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-sm text-on-surface line-clamp-1">{item.name}</h4>
                                        <span className="text-xs text-primary font-bold">${item.price.toFixed(2)} x {item.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-surface-container rounded-full px-2 py-0.5">
                                        <button onClick={() => removeFromCart(item.id || item._id)} className="w-5 h-5 flex items-center justify-center text-sm font-bold text-primary">-</button>
                                        <span className="font-bold text-xs">{item.quantity}</span>
                                        <button onClick={() => addToCart(item.id || item._id)} className="w-5 h-5 flex items-center justify-center text-sm font-bold text-primary">+</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-5 bg-surface-container-lowest border-t border-outline-variant/30 space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-on-surface">
                            <span>Tạm tính:</span>
                            <span className="text-primary text-[16px]">${totalAmount.toFixed(2)}</span>
                        </div>
                        <button
                            disabled={activeCartItems.length === 0}
                            onClick={() => navigate('/order')}
                            className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Thanh toán ngay
                        </button>
                    </div>
                </aside>

            </div>
        </main>
    );
};

export default RestaurantDetails;
