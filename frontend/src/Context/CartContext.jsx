import { createContext, useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from "./AuthContext"; 

export const CartContext = createContext(null);

const CartContextProvider = (props) => {
    
    const [cartItems, setCartItems] = useState({});
    
    // 1. THÊM STATE CHO TÌM KIẾM
    const [searchTerm, setSearchTerm] = useState(""); 

    const { token, url } = useContext(AuthContext); 

    const { 
        data: food_list = [],
        isLoading: isFoodListLoading,
        isError: isFoodListError
    } = useQuery({
        queryKey: ['foodList', url],
        queryFn: async () => {
            const response = await axios.get(url + "/api/food/list");
            return response.data.data;
        },
        enabled: !!url, 
        staleTime: 1000 * 60 * 5 
    });

    // ... (Các hàm addToCart, removeFromCart, totalAmount, loadCartData, useEffect giữ nguyên) ...
    const addToCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const totalAmount = useMemo(() => {
        let amount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    amount += itemInfo.price * cartItems[item];
                }
            }
        }
        return amount;
    }, [cartItems, food_list]);

    const loadCartData = async (currentToken) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: currentToken } });
            setCartItems(response.data.cartData || {});
        } catch (error) {
            console.error("Lỗi: Không thể tải giỏ hàng.", error);
            setCartItems({});
        }
    };

    useEffect(() => {
        if (token && url) {
            loadCartData(token);
        }
    }, [token, url]); 


    const contextValue = {
        food_list,
        isFoodListLoading,
        isFoodListError,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        totalAmount,
        // 2. THÊM VÀO CONTEXT VALUE
        searchTerm,
        setSearchTerm 
    };

    return (
        <CartContext.Provider value={contextValue}>
            {props.children}
        </CartContext.Provider>
    );
};

export default CartContextProvider;