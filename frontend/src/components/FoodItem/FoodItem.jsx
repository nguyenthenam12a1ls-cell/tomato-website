import React, { useContext } from 'react';
import { assets } from '../../assets/assets.js';
import { CartContext } from '../../Context/CartContext.jsx';
import { useAuth } from '../../Context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
    const { url } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="bg-surface rounded-2xl overflow-hidden shadow-md card-hover flex flex-col group cursor-pointer border border-outline-variant/30 relative">
            <div 
                className="aspect-square overflow-hidden relative" 
                onClick={() => navigate(`/food/${id}`)}
            >
                <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={url + "/images/" + image} 
                    alt={name} 
                />
            </div>
            
            {!cartItems[id] ? (
                <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(id); }} 
                    className="absolute top-[50%] -translate-y-6 right-3 bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform z-10"
                >
                    <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 0"}}>add</span>
                </button>
            ) : (
                <div 
                    className="absolute top-[50%] -translate-y-6 right-3 flex items-center gap-2 bg-surface shadow-lg rounded-full px-2 py-1 z-10 border border-outline-variant/30"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={() => removeFromCart(id)} className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center hover:bg-error hover:text-on-error transition-colors">
                        <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>remove</span>
                    </button>
                    <span className="text-label-md font-bold text-on-surface w-4 text-center">{cartItems[id]}</span>
                    <button onClick={() => addToCart(id)} className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
                    </button>
                </div>
            )}

            <div className="p-4 flex flex-col flex-grow" onClick={() => navigate(`/food/${id}`)}>
                <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className="text-label-md font-headline-md line-clamp-1">{name}</h4>
                    <img src={assets.rating_starts} alt="rating" className="h-3 shrink-0 mt-1" />
                </div>
                <p className="text-on-surface-variant text-label-sm line-clamp-2 mb-3 flex-grow">{description}</p>
                <span className="text-primary font-bold text-[18px]">${price}</span>
            </div>
        </div>
    );
};

export default FoodItem;