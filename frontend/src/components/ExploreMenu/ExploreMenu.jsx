import React from 'react';
import { menu_list } from '../../assets/assets.js';

// Mapping menu names to emojis as in the design
const categoryEmojis = {
    "Salad": "🥗",
    "Rolls": "🥖", // Approximate
    "Deserts": "🍰",
    "Sandwich": "🥪",
    "Cake": "🎂",
    "Pure Veg": "🥦",
    "Pasta": "🍝",
    "Noodles": "🍜"
};

const ExploreMenu = ({ category, setCategory }) => {
    return (
        <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg" id="explore-menu">
            <h2 className="text-headline-md font-headline-md mb-2 font-bold">Khám phá thực đơn</h2>
            <p className="text-body-md text-on-surface-variant max-w-2xl mb-6">Thỏa mãn vị giác của bạn với các danh mục ẩm thực phong phú của chúng tôi.</p>
            
            <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-4 pt-2">
                {menu_list.map((item, index) => {
                    const isActive = category === item.menu_name;
                    const emoji = categoryEmojis[item.menu_name] || "🍽️";
                    
                    return (
                        <button 
                            key={index} 
                            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
                            className="flex flex-col items-center gap-2 group min-w-[64px]"
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform ${isActive ? 'bg-primary-container scale-110 shadow-md' : 'bg-surface-container-high group-hover:scale-110'}`}>
                                <span className="text-3xl">{emoji}</span>
                            </div>
                            <span className={`text-label-md font-label-md whitespace-nowrap ${isActive ? 'text-primary font-bold' : 'text-on-surface'}`}>
                                {item.menu_name}
                            </span>
                        </button>
                    )
                })}
            </div>
        </section>
    );
};

export default ExploreMenu;