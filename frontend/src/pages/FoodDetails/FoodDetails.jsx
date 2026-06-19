import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';
import { assets } from '../../assets/assets';

const FoodDetails = () => {
    const { foodId } = useParams();
    const navigate = useNavigate();
    const { food_list, cartItems, addToCart, removeFromCart } = useContext(CartContext);
    const { url } = useAuth();
    
    const [food, setFood] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('small');

    useEffect(() => {
        if (food_list && food_list.length > 0) {
            const foundFood = food_list.find(item => String(item._id) === String(foodId) || String(item.id) === String(foodId));
            setFood(foundFood);
        }
    }, [food_list, foodId]);

    if (!food) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background mt-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-on-surface-variant font-bold">Đang tải thông tin món ăn...</p>
            </div>
        );
    }

    const actualId = food._id || food.id;
    // Base price
    const basePrice = food.price;
    // Calculate total price based on size (mock +10k for medium, +20k for large)
    let addedPrice = 0;
    if(selectedSize === 'medium') addedPrice = 0.5; // ~10k VND equivalent in USD for this demo
    if(selectedSize === 'large') addedPrice = 1; // ~20k VND

    const displayPrice = ((basePrice + addedPrice) * quantity).toFixed(2);

    const handleAddToCart = () => {
        // Just add to cart normally
        for(let i=0; i<quantity; i++) {
           addToCart(actualId);
        }
        navigate('/cart');
    };

    return (
        <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg lg:py-stack-xl mt-20 min-h-[calc(100vh-160px)]">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
                <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Trang chủ</button>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <button onClick={() => navigate('/#explore-menu')} className="hover:text-primary transition-colors">Thực đơn</button>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-primary font-bold line-clamp-1">{food.name}</span>
            </div>

            {/* MODAL CONTAINER STYLE FROM DESIGN */}
            <div className="bg-surface rounded-2xl w-full overflow-hidden flex flex-col md:flex-row relative shadow-lg border border-outline-variant/30">
                
                {/* LEFT: IMAGE */}
                <div className="w-full md:w-1/2 relative bg-surface-container-highest min-h-[300px] md:min-h-full">
                    <div 
                        className="w-full h-full bg-cover bg-center absolute inset-0" 
                        style={{backgroundImage: `url(${url}/images/${food.image})`}}
                    ></div>
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-[#FF6B35] text-white font-label-md text-label-md px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
                        Bán chạy
                    </div>
                </div>

                {/* RIGHT: CONTENT & SELECTIONS */}
                <div className="w-full md:w-1/2 flex flex-col h-full bg-surface">
                    
                    {/* Scrollable Content */}
                    <div className="flex-1 p-stack-lg custom-scrollbar">
                        
                        {/* Header Info */}
                        <div className="mb-stack-lg">
                            <h2 className="font-display-lg text-[32px] md:text-headline-lg text-[#1A1A2E] leading-tight mb-stack-xs font-bold">{food.name}</h2>
                            <div className="flex items-center gap-2 mb-stack-md">
                                <div className="flex text-secondary items-center">
                                    <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                    <span className="font-label-md text-label-md ml-1">4.9</span>
                                </div>
                                <span className="text-on-surface-variant font-body-md text-label-md">(2k+ lượt đặt)</span>
                            </div>
                            <p className="font-body-md text-on-surface-variant mb-stack-md leading-relaxed">
                                {food.description}
                            </p>
                            <div className="text-primary font-display-lg text-headline-lg font-bold">${food.price.toFixed(2)}</div>
                        </div>

                        <div className="h-px bg-outline-variant w-full mb-stack-lg opacity-50"></div>

                        {/* OPTIONS */}
                        <div className="space-y-stack-xl">
                            
                            {/* Size Section */}
                            <section>
                                <div className="flex justify-between items-center mb-stack-md">
                                    <h3 className="font-headline-md text-[18px] md:text-body-lg text-on-tertiary-fixed font-bold">Chọn size</h3>
                                    <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded font-label-sm text-[12px] font-bold">Bắt buộc</span>
                                </div>
                                <div className="space-y-stack-md">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">Nhỏ</span>
                                        <input 
                                            checked={selectedSize === 'small'} 
                                            onChange={() => setSelectedSize('small')} 
                                            className="w-5 h-5 text-primary border-outline-variant focus:ring-primary" 
                                            name="size" 
                                            type="radio"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">Vừa (+$0.50)</span>
                                        <input 
                                            checked={selectedSize === 'medium'} 
                                            onChange={() => setSelectedSize('medium')} 
                                            className="w-5 h-5 text-primary border-outline-variant focus:ring-primary" 
                                            name="size" 
                                            type="radio"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">Lớn (+$1.00)</span>
                                        <input 
                                            checked={selectedSize === 'large'} 
                                            onChange={() => setSelectedSize('large')} 
                                            className="w-5 h-5 text-primary border-outline-variant focus:ring-primary" 
                                            name="size" 
                                            type="radio"
                                        />
                                    </label>
                                </div>
                            </section>

                            {/* Topping Section */}
                            <section>
                                <h3 className="font-headline-md text-[18px] md:text-body-lg text-on-tertiary-fixed mb-stack-md font-bold">Topping</h3>
                                <div className="space-y-stack-md">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">Thêm sốt (+$0.20)</span>
                                        <input className="w-5 h-5 rounded text-primary border-outline-variant focus:ring-primary" type="checkbox"/>
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">Thêm phô mai (+$0.50)</span>
                                        <input className="w-5 h-5 rounded text-primary border-outline-variant focus:ring-primary" type="checkbox"/>
                                    </label>
                                </div>
                            </section>

                            {/* Spicy Level Section */}
                            <section>
                                <h3 className="font-headline-md text-[18px] md:text-body-lg text-on-tertiary-fixed mb-stack-md font-bold">Mức độ cay</h3>
                                <div className="flex flex-wrap gap-stack-sm">
                                    <label className="cursor-pointer">
                                        <input defaultChecked className="sr-only peer" name="spicy" type="radio"/>
                                        <div className="px-4 py-2 border border-outline-variant rounded-full font-label-md text-label-md peer-checked:bg-on-tertiary-fixed peer-checked:text-white transition-all">Không cay</div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input className="sr-only peer" name="spicy" type="radio"/>
                                        <div className="px-4 py-2 border border-outline-variant rounded-full font-label-md text-label-md peer-checked:bg-on-tertiary-fixed peer-checked:text-white transition-all">Nhẹ</div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input className="sr-only peer" name="spicy" type="radio"/>
                                        <div className="px-4 py-2 border border-outline-variant rounded-full font-label-md text-label-md peer-checked:bg-on-tertiary-fixed peer-checked:text-white transition-all">Vừa</div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input className="sr-only peer" name="spicy" type="radio"/>
                                        <div className="px-4 py-2 border border-outline-variant rounded-full font-label-md text-label-md peer-checked:bg-on-tertiary-fixed peer-checked:text-white transition-all">Nhiều</div>
                                    </label>
                                </div>
                            </section>

                            {/* Note Section */}
                            <section>
                                <h3 className="font-headline-md text-[18px] md:text-body-lg text-on-tertiary-fixed mb-stack-sm font-bold">Ghi chú</h3>
                                <textarea className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-4 focus:border-secondary focus:ring-secondary min-h-[100px] font-body-md text-on-surface outline-none" placeholder="Ví dụ: Không hành, nhiều nước béo..."></textarea>
                            </section>

                        </div>
                    </div>

                    {/* STICKY BOTTOM BAR */}
                    <div className="p-stack-lg bg-white border-t border-outline-variant flex items-center gap-stack-md">
                        {/* Stepper */}
                        <div className="flex items-center bg-surface-container rounded-full px-2 py-1 h-12 border border-outline-variant/50">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">remove</span>
                            </button>
                            <span className="w-10 text-center font-bold text-[18px]">
                                {quantity}
                            </span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                            </button>
                        </div>
                        {/* CTA Button */}
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 bg-primary text-white h-12 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 hover:bg-primary-container hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                        >
                            Thêm vào giỏ — <span>${displayPrice}</span>
                        </button>
                    </div>

                </div>
            </div>
            
        </main>
    );
};

export default FoodDetails;