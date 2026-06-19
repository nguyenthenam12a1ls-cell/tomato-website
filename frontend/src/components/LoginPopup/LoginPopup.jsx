import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { useAuth } from '../../Context/AuthContext';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useAuth();
    const [currState, setCurrState] = useState("Đăng nhập"); // Login or Sign-Up
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if (currState === "Đăng nhập") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        const response = await axios.post(newUrl, data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
        } else {
            alert(response.data.message);
        }
    };

    const googleAuth = () => {
        window.location.href = `${url}/api/user/auth/google`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest w-full max-w-[420px] rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto hide-scrollbar relative">
                
                {/* Header Decoration */}
                <div className="h-2 bg-gradient-to-r from-[#E8402A] to-[#FF6B35] w-full"></div>
                
                {/* Close Button */}
                <button 
                    onClick={() => setShowLogin(false)} 
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                <div className="p-8">
                    {/* Logo & Title */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-tr from-primary to-secondary-container rounded-full flex items-center justify-center shadow-md mb-3">
                            <span className="material-symbols-outlined text-white text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>restaurant</span>
                        </div>
                        <h2 className="font-headline-lg text-[28px] font-bold text-on-surface">{currState}</h2>
                        <p className="font-body-md text-on-surface-variant mt-1 text-center">
                            {currState === "Đăng nhập" ? "Chào mừng trở lại! 👋" : "Tạo tài khoản mới để trải nghiệm"}
                        </p>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3 mb-6">
                        <button type="button" onClick={googleAuth} className="w-full flex items-center justify-center space-x-3 h-[48px] bg-white border border-outline-variant hover:bg-surface-container-low transition-colors duration-200 rounded-xl px-6 shadow-sm">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span className="font-bold text-[14px] text-on-surface">Tiếp tục với Google</span>
                        </button>
                    </div>

                    <div className="relative flex items-center my-6">
                        <div className="flex-grow border-t border-outline-variant/50"></div>
                        <span className="flex-shrink mx-4 text-[12px] text-on-surface-variant uppercase tracking-wider font-bold">Hoặc</span>
                        <div className="flex-grow border-t border-outline-variant/50"></div>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={onLogin} className="space-y-4">
                        {currState !== "Đăng nhập" && (
                            <div className="space-y-1">
                                <label className="text-[14px] font-bold text-on-surface ml-1">Tên của bạn</label>
                                <div className="relative flex items-center group">
                                    <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors text-[20px]">person</span>
                                    <input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Nhập tên' required className="w-full h-[48px] pl-11 pr-4 bg-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all outline-none text-[15px]"/>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-1">
                            <label className="text-[14px] font-bold text-on-surface ml-1">Email</label>
                            <div className="relative flex items-center group">
                                <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors text-[20px]">mail</span>
                                <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='email@example.com' required className="w-full h-[48px] pl-11 pr-4 bg-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all outline-none text-[15px]"/>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-[14px] font-bold text-on-surface ml-1">Mật khẩu</label>
                            <div className="relative flex items-center group">
                                <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                                <input name='password' onChange={onChangeHandler} value={data.password} type={showPassword ? 'text' : 'password'} placeholder='••••••••' required className="w-full h-[48px] pl-11 pr-11 bg-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all outline-none text-[15px]"/>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-outline-variant hover:text-on-surface transition-colors flex items-center">
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>
                        
                        {currState === "Đăng nhập" ? (
                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"/>
                                    <span className="text-[14px] text-on-surface-variant group-hover:text-on-surface transition-colors">Ghi nhớ</span>
                                </label>
                                <button type="button" onClick={() => { setShowLogin(false); navigate('/forgot-password'); }} className="text-[14px] font-bold text-primary hover:underline underline-offset-2">Quên mật khẩu?</button>
                            </div>
                        ) : (
                            <div className="flex items-start space-x-2 pt-2">
                                <input type='checkbox' required className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer accent-primary"></input>
                                <p className="text-[12px] text-on-surface-variant">Bằng việc tiếp tục, tôi đồng ý với <a href="/privacy-policy" onClick={() => setShowLogin(false)} className="text-primary hover:underline">Điều khoản sử dụng</a> & <a href="/privacy-policy" onClick={() => setShowLogin(false)} className="text-primary hover:underline">Chính sách bảo mật</a>.</p>
                            </div>
                        )}

                        <button type="submit" className="w-full h-[48px] mt-4 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                            {currState === "Đăng nhập" ? "Đăng nhập" : "Tạo tài khoản"}
                        </button>
                    </form>

                    {/* Footer Toggle */}
                    <div className="mt-8 text-center text-[14px] text-on-surface-variant">
                        {currState === "Đăng nhập" ? (
                            <p>Chưa có tài khoản? <button type="button" onClick={() => setCurrState("Đăng ký")} className="text-primary font-bold hover:underline ml-1">Đăng ký ngay</button></p>
                        ) : (
                            <p>Đã có tài khoản? <button type="button" onClick={() => setCurrState("Đăng nhập")} className="text-primary font-bold hover:underline ml-1">Đăng nhập</button></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;
