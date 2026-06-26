import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { CartContext } from "../../Context/CartContext";
import { useEffect } from 'react'
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")

    const { url } = useContext(AuthContext);
    const { setCartItems } = useContext(CartContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            const response = await axios.post(url + "/api/order/verify", { success, orderId });
            if (response.data.success) {
                setCartItems({});
                navigate('/myorders');
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Verification error:", error);
            navigate("/");
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="relative flex justify-center items-center">
                <div className="absolute animate-ping w-20 h-20 rounded-full bg-primary/30"></div>
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin shadow-lg z-10"></div>
            </div>
            <h2 className="mt-8 font-headline-md text-[20px] font-bold text-on-surface">Đang xử lý thanh toán...</h2>
            <p className="text-on-surface-variant font-body-md mt-2">Vui lòng không đóng cửa sổ này.</p>
        </div>
    )
}

export default Verify;
