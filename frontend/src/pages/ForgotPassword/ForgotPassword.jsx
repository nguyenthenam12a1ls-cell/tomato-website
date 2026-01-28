import React, { useState } from 'react';
import './ForgotPassword.css'; 
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
        } catch (error) {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
        setIsLoading(false);
    };

    return (
        <div className="forgot-password-page">
            <form onSubmit={handleSubmit} className="forgot-password-container">
                <h2>Quên mật khẩu?</h2>
                <p>Đừng lo lắng. Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.</p>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email của bạn"
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading} className="save-btn">
                    {isLoading ? "Đang gửi..." : "Gửi link"}
                </button>
                <Link to="/" className="back-to-home">Quay về trang chủ</Link>
            </form>
        </div>
    );
};

export default ForgotPassword;