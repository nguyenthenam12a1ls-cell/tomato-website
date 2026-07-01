import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { url } = useAuth();
    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Mật khẩu không khớp!");
            return;
        }
        if (password.length < 8) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(url + `/api/user/reset-password/${token}`, { password });
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/'); // Chuyển về trang chủ
            } else {
                toast.error(response.data.message); // Hiển thị lỗi (vd: token hết hạn)
            }
        } catch {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-primary to-orange-400 p-6 text-center">
                    <h2 className="font-headline-md text-headline-md text-white m-0">Tạo mật khẩu mới</h2>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <p className="text-on-surface-variant font-body-md text-body-md text-center">
                        Vui lòng nhập mật khẩu mới của bạn.
                    </p>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="font-label-md text-label-md text-on-surface">Mật khẩu mới</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="p-3 rounded-lg border border-outline-variant focus:outline-none focus:border-primary font-body-md text-body-md"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="font-label-md text-label-md text-on-surface">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="p-3 rounded-lg border border-outline-variant focus:outline-none focus:border-primary font-body-md text-body-md"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full mt-2 py-3 rounded-xl bg-primary text-white font-label-md text-label-md shadow-md hover:bg-orange-600 transition-colors disabled:opacity-70">
                        {isLoading ? "Đang lưu..." : "Lưu mật khẩu"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
