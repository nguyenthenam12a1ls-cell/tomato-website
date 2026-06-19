import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';

const FlashSale = () => {
    const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 12 });
    const { food_list } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { h, m, s } = prev;
                s--;
                if (s < 0) {
                    s = 59;
                    m--;
                    if (m < 0) {
                        m = 59;
                        h--;
                        if (h < 0) h = 23;
                    }
                }
                return { h, m, s };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const format = (num) => num.toString().padStart(2, '0');

    const flashSales = [
        {
            title: "Burger Cá Hồi Nướng",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiP_DZ0oU1hLFpqd2IOc7MIhSyf3x2MjIgwykvQj54ijNy6pSysQiWqBvp4vMxwlSTkJCyJk_mHmRV3hvlBPEWDc0sBrB_7ecZ_FLzEY9Y8LbZm2H4EO7mAkYnsRtGq34ZnBPdXUEuAtbSVZ6EWAky2U3LHblGmn4XAEYHtlGkrMYgs9DOkDxoLhqJAUa_FGCKBZdkjcxumDqbg42YFyy7OBBEkLxtJiwFL5-IwI9KozGFu5fFodg",
            price: "89.000đ",
            oldPrice: "149.000đ",
            discount: "-40%"
        },
        {
            title: "Trà Sữa Trân Châu Đường Đen",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChDCEOOyFFdcoDKYdYt2bjY-XcQ_pFmILMjfDebaJzzd2lm6LC3POtl6xVCTjXNEvKfJ-Jsfoqw-Mf3-RIXlrhHL48BEpgbiWZK40B0341VPLc2X55mSg2Q8HP9k9ho9E49HQa3AIS2ZAp2M9VbwsHXXOHDWMqwFyHaJ6DXyJlOOfsBoLYP6EDorEDLk-0hGe3IuW3-Y4IjdmRiPlDbQXniflRQx-colnQajOqkeAeSgNgse41Tgk",
            price: "35.000đ",
            oldPrice: "50.000đ",
            discount: "-30%"
        },
        {
            title: "Combo Sushi Thập Cẩm",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-83FqicfMH7JbkPjwuw-nO3-CUFWHyYEgNb2bHi9ndSfJZjzMfSsHl0D-Szi3kmELSFZ6RLIcqhLR88coxd3Jc5EJS90GBCXah440L9ck7Joh0S98JMyIx7AGJ5_f5vloB0X9eG9VVyYrJS56HxVt_cL9EYnZZUWdbT8FO9g028V4GpPhgqUJjchmCVny3TNHQRnqUQpgA404--QueTNOrJzLSnOnPZxfYsbmIg_LZL4NcmJkcu8",
            price: "125.000đ",
            oldPrice: "250.000đ",
            discount: "-50%"
        },
        {
            title: "Gà Rán Sốt Cay Hàn Quốc",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7q_Uh6gOjMAkmb5QPILCmETSqtXB6944k3aswZRRlEy2VviXh57_-gTPrOVyiTQ1lB15oOeiZyTTdiSiIaCdqyF8JDoH-A0Lre5xeqWl5Tn-oD1Tj15r1fWUKtoi1FM4JJTkIVJmWUzeC6OGzmBfXZmGoa4O02CTTQv5LdP1Dqai2yoKot2yTXNkfFVnvHuvXpwR_wZ2AYvd1hFcCdN-Ulocjuf25buxNTqMsRRbrZhvDQiRoyC0",
            price: "60.000đ",
            oldPrice: "80.000đ",
            discount: "-25%"
        }
    ];

    const handleCardClick = (title) => {
        if (!food_list || food_list.length === 0) return;
        
        let matchedFood = null;
        if (title.includes("Burger") || title.includes("Sandwich")) {
            matchedFood = food_list.find(f => f.category === "Sandwich" || f.name.toLowerCase().includes("sandwich"));
        } else if (title.includes("Trà Sữa") || title.includes("Deserts")) {
            matchedFood = food_list.find(f => f.category === "Deserts" || f.name.toLowerCase().includes("cream"));
        } else if (title.includes("Sushi") || title.includes("Rolls")) {
            matchedFood = food_list.find(f => f.category === "Rolls" || f.name.toLowerCase().includes("roll"));
        } else if (title.includes("Gà") || title.includes("Chicken")) {
            matchedFood = food_list.find(f => f.name.toLowerCase().includes("chicken"));
        }
        
        // Fallback if not matched
        if (!matchedFood) {
            matchedFood = food_list[0];
        }
        
        if (matchedFood) {
            navigate(`/food/${matchedFood.id || matchedFood._id}`);
        }
    };

    return (
        <section className="bg-gradient-to-r from-[#FF9D2E] to-[#FF6B35] py-stack-lg mb-12 rounded-2xl mx-auto max-w-container-max px-4 md:px-margin-desktop mt-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 text-on-primary gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-headline-md font-headline-md text-white font-bold">⚡ Flash Sale</h2>
                    <div className="flex gap-1 items-center">
                        <span className="bg-black/30 px-2 py-1 rounded text-label-md font-bold text-white min-w-[32px] text-center">{format(timeLeft.h)}</span>
                        <span className="text-white font-bold">:</span>
                        <span className="bg-black/30 px-2 py-1 rounded text-label-md font-bold text-white min-w-[32px] text-center">{format(timeLeft.m)}</span>
                        <span className="text-white font-bold">:</span>
                        <span className="bg-black/30 px-2 py-1 rounded text-label-md font-bold text-white min-w-[32px] text-center">{format(timeLeft.s)}</span>
                    </div>
                </div>
                <button onClick={() => navigate('/vouchers')} className="text-label-md font-label-md text-white flex items-center gap-1 hover:underline">
                    Xem tất cả ưu đãi <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-gutter">
                {flashSales.map((item, index) => (
                    <div 
                        key={index} 
                        onClick={() => handleCardClick(item.title)}
                        className="bg-surface rounded-2xl overflow-hidden shadow-md card-hover relative group cursor-pointer"
                    >
                        <div className="absolute top-3 left-3 bg-primary text-on-primary px-2 py-1 rounded-lg text-label-sm font-bold shadow-sm z-10">{item.discount}</div>
                        <div className="h-40 overflow-hidden">
                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={item.image} alt={item.title} />
                        </div>
                        <div className="p-4">
                            <h3 className="text-label-md font-headline-md line-clamp-1 mb-1">{item.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-primary font-bold text-[16px]">{item.price}</span>
                                <span className="text-on-surface-variant line-through text-label-sm">{item.oldPrice}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FlashSale;
