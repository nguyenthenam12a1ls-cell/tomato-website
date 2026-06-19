import React, { useContext } from 'react';
import { CartContext } from '../../Context/CartContext';
import { useNavigate } from 'react-router-dom';

const PersonalizedRecommendations = () => {
    const { addToCart, food_list } = useContext(CartContext);
    const navigate = useNavigate();

    const recommendations = [
        {
            id: "1",
            title: "Phở Bò Kobe Cao Cấp",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7YVBa4q28g9S2AsjBD_BS92JC-9Dbk5I9L4eJ7o0TpJQAITR6ysw_O9ChF4KhC8-dU8d7DDV6VKXa03fyL6nqKUuGOY-ewvCVK35piEGNf0MpexVXgWyLl_ZRN7Gr9-fix_RU4gl3O05tcIg9mjezm7DyUgAnpKNPQixd2DplyAkXjL8pLwnRHZHdzCsgFIym95NrMx-9iu0Y2LQiYuxCavxc_dN3e76kopUw3qWkpTGn_FxC_6E",
            price: "195.000đ"
        },
        {
            id: "2",
            title: "Signature Cheeseburger",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZlSXGBu-1AIe-qwyObYOLXWUX4JdYU5yuDor-99qEs6qyKuBm-u3cVOmRuseP-77lPH2hJvVZfC4e7dQAaH5Lp5OoUE8FVCfi582JMsrS7IEqaR3MTT9J2Hg8OU8FRwUyL4DkZXcOg_53tsuwhUnrFPbS-h7Jmyi_R7M7YJZIDfkr6sZpDTHflhpILSaavgTM2HpNj1jHMXv8SlRW_xHFgA85c79_Hry70uQOwvspb_1_kA3h8qA",
            price: "120.000đ"
        },
        {
            id: "3",
            title: "Salmon Avocado Salad",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDON9Okmbga23yHO3nyl1HeSTOqR6GLF9Jam67a4QnNHEWn5CEivcR-LnZXJpEdpfy9r-VfHjOWKyyQ552PGuI2-0pOyNGUT93oBav9l7Q9xM-xC7NCd4HWIzZABbeoZ7gKJOZ6HA9GaX5_GrVwZ00xDayS0ihKUEjvcg4xlYdjoL9l__zgh-MLbxV6ZtSIqvR2SFJtvC-EDKQHRV8g2kT1mCWDhB7auLfs-GJozjtHY_ybKMniov0",
            price: "145.000đ"
        },
        {
            id: "4",
            title: "Combo Dimsum 8 Món",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcA4ksxSH6mMfSRq-4ibScRW_7U49v-8Q8ac6go3rAit1rkhUkyd0yygRs-KsMYjwQxXxOkxJLYRJbqg2W6IZhxUhE9A6KH_g0KyaBst__TtAmkX0PL9-uJvEbOqfKBtladah7Nq1fR62eI50PbagRDDthuOTgeiF95HpAydx--amCNrksEBaQLocZsjS17UG3N3zYGJ77NOuUYeX_Gls8N7Ct2XOXortqNVvHBJ8NB51fSQ5OwWk",
            price: "180.000đ"
        }
    ];

    const getMatchedFood = (title) => {
        if (!food_list || food_list.length === 0) return null;
        
        let matched = null;
        if (title.includes("Phở") || title.includes("Dimsum") || title.includes("Noodles")) {
            matched = food_list.find(f => f.category === "Noodles" || f.name.toLowerCase().includes("noodle"));
        } else if (title.includes("Cheeseburger") || title.includes("Burger") || title.includes("Sandwich")) {
            matched = food_list.find(f => f.category === "Sandwich" || f.name.toLowerCase().includes("sandwich"));
        } else if (title.includes("Salad")) {
            matched = food_list.find(f => f.category === "Salad" || f.name.toLowerCase().includes("salad"));
        }
        
        return matched || food_list[0];
    };

    const handleCardClick = (title) => {
        const matched = getMatchedFood(title);
        if (matched) {
            navigate(`/food/${matched.id || matched._id}`);
        }
    };

    const handleAddToCartClick = (e, title) => {
        e.stopPropagation();
        const matched = getMatchedFood(title);
        if (matched) {
            addToCart(matched.id || matched._id);
        }
    };

    return (
        <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg mb-8">
            <h2 className="text-headline-md font-headline-md font-bold mb-6">Dựa trên lịch sử đặt món của bạn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-gutter">
                {recommendations.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-surface rounded-2xl overflow-hidden shadow-md card-hover border border-outline-variant/20 flex flex-col cursor-pointer" 
                        onClick={() => handleCardClick(item.title)}
                    >
                        <div className="aspect-[16/9] overflow-hidden">
                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} alt={item.title} />
                        </div>
                        <div className="p-4 flex justify-between items-center bg-surface flex-grow">
                            <div className="pr-2">
                                <h4 className="text-label-md font-bold line-clamp-1 mb-1">{item.title}</h4>
                                <span className="text-primary font-bold">{item.price}</span>
                            </div>
                            <button 
                                onClick={(e) => handleAddToCartClick(e, item.title)} 
                                className="bg-surface-container-low text-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors shrink-0"
                            >
                                <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 0"}}>add</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PersonalizedRecommendations;
