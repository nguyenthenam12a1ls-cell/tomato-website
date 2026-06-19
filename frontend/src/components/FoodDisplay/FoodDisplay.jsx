import React, { useContext } from 'react';
import { CartContext } from '../../Context/CartContext.jsx';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category, excludeId = null }) => {
    const { food_list } = useContext(CartContext);
    
    // Filter list first to check if we have any items
    const filteredFoodList = food_list.filter(item => 
        (category === "All" || category === item.category) && (item.id !== excludeId)
    );

    return (
        <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg" id="food-display">
            <h2 className="text-headline-md font-headline-md mb-stack-md font-bold">{category === "All" ? "Đang hot hôm nay 🔥" : `Món ngon danh mục: ${category}`}</h2>
            
            {filteredFoodList.length === 0 ? (
                <div className="py-10 text-center text-on-surface-variant bg-surface-container-low rounded-2xl">
                    <span className="material-symbols-outlined text-5xl mb-2 opacity-50">restaurant</span>
                    <p className="text-body-lg">Không tìm thấy món ăn nào trong danh mục này.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-gutter">
                    {filteredFoodList.map((item) => (
                        <FoodItem 
                            key={item.id} 
                            id={item.id} 
                            name={item.name} 
                            description={item.description} 
                            price={item.price} 
                            image={item.image} 
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default FoodDisplay;
