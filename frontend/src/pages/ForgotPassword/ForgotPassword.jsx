import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { url } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(url + "/api/user/forgot-password", { email });
            toast.success(response.data.message);
        } catch {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-primary to-orange-400 p-6 text-center">
                    <h2 className="font-headline-md text-headline-md text-white m-0">Quên mật khẩu?</h2>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <p className="text-on-surface-variant font-body-md text-body-md text-center">
                        Đừng lo lắng. Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
                    </p>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="font-label-md text-label-md text-on-surface">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email của bạn"
                            required
                            className="p-3 rounded-lg border border-outline-variant focus:outline-none focus:border-primary font-body-md text-body-md"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full mt-2 py-3 rounded-xl bg-primary text-white font-label-md text-label-md shadow-md hover:bg-orange-600 transition-colors disabled:opacity-70">
                        {isLoading ? "Đang gửi..." : "Gửi link"}
                    </button>
                    <Link to="/" className="text-center font-label-md text-label-md text-primary mt-2 hover:underline">
                        Quay về trang chủ
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
