import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const ProfileSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="w-full md:w-80 flex-shrink-0">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 p-6 sticky top-28">
                
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-24 h-24 rounded-full border-4 border-primary p-1 mb-4 shadow-sm">
                        <img 
                            className="w-full h-full rounded-full object-cover" 
                            src={user?.avatar ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/images/${user.avatar}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                            alt="Avatar" 
                        />
                    </div>
                    <h2 className="font-headline-md text-[20px] text-on-surface font-bold">{user?.name || "Người dùng"}</h2>
                    <p className="font-body-md text-on-surface-variant mb-2 text-sm">{user?.email}</p>
                </div>
                
                <nav className="space-y-2">
                    <NavLink 
                        to="/profile" 
                        className={({isActive}) => `flex items-center px-4 py-3 rounded-lg font-bold group transition-colors ${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-container'}`}
                    >
                        <span className="material-symbols-outlined mr-3 group-hover:scale-110 transition-transform text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                        <span className="text-[15px]">Hồ sơ cá nhân</span>
                    </NavLink>
                    
                    <NavLink 
                        to="/myorders" 
                        className={({isActive}) => `flex items-center px-4 py-3 rounded-lg font-bold group transition-colors ${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-container'}`}
                    >
                        <span className="material-symbols-outlined mr-3 group-hover:text-primary transition-colors text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>receipt_long</span>
                        <span className="text-[15px]">Đơn hàng của tôi</span>
                    </NavLink>
                    
                    <div className="pt-4 mt-4 border-t border-outline-variant/30">
                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-error hover:bg-error-container transition-colors rounded-lg group">
                            <span className="material-symbols-outlined mr-3 group-hover:translate-x-1 transition-transform text-[20px]">logout</span>
                            <span className="text-[15px] font-bold">Đăng xuất</span>
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
