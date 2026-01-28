import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import '../ForgotPassword/ForgotPassword.css'; // Tái sử dụng CSS

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
        } catch (error) {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
        setIsLoading(false);
    };

    return (
        <div className="forgot-password-page">
            <form onSubmit={handleSubmit} className="forgot-password-container">
                <h2>Tạo mật khẩu mới</h2>
                <p>Vui lòng nhập mật khẩu mới của bạn.</p>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu mới</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading} className="save-btn">
                    {isLoading ? "Đang lưu..." : "Lưu mật khẩu"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;