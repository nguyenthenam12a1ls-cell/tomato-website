import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';
import { useTheme } from '../../Context/ThemeContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const [showProfile, setShowProfile] = useState(false);
    const [avatarLoadError, setAvatarLoadError] = useState(false);

    const { totalAmount, setSearchTerm } = useContext(CartContext);
    const { token, logout, user, url, isUserLoading, isUserError } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const profileRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showProfile && profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showProfile]);

    useEffect(() => {
        setAvatarLoadError(false);
    }, [user?.avatar]);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const toggleProfilePopup = () => {
        setShowProfile((prev) => !prev);
    };

    const getAvatarSrc = (avatar) => {
        if (!avatar) return assets.profile_icon;
        if (/^(https?:)?\/\//i.test(avatar) || avatar.startsWith('data:')) {
            return avatar;
        }
        return `${url}/images/${avatar}`;
    };

    const displayAvatar = avatarLoadError ? assets.profile_icon : getAvatarSrc(user?.avatar);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-margin-desktop py-4 bg-on-tertiary-fixed shadow-md">
            <div className="max-w-container-max mx-auto w-full flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <Link to="/" onClick={() => setMenu('home')}>
                        <span className="text-headline-md font-headline-md font-extrabold text-primary">Tomato</span>
                    </Link>
                    
                    <div className="hidden md:flex gap-6 items-center">
                        <Link to='/' onClick={() => setMenu('home')} className={`text-label-md font-label-md transition-opacity py-1 ${menu === 'home' ? 'text-primary border-b-2 border-primary' : 'text-on-primary hover:opacity-80'}`}>Khám phá</Link>
                        <Link to='/myorders' onClick={() => setMenu('orders')} className={`text-label-md font-label-md transition-opacity py-1 ${menu === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-on-primary hover:opacity-80'}`}>Đơn hàng</Link>
                        <Link to='/vouchers' onClick={() => setMenu('promos')} className={`text-label-md font-label-md transition-opacity py-1 ${menu === 'promos' ? 'text-primary border-b-2 border-primary' : 'text-on-primary hover:opacity-80'}`}>Khuyến mãi</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden lg:block">
                        <input 
                            className="bg-surface-container-low border-none rounded-full py-2 px-4 w-64 text-label-md focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/70" 
                            placeholder="Tìm kiếm món ăn..." 
                            type="text"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    


                    <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                        <span className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>shopping_cart</span>
                        {totalAmount > 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full shadow-sm"></div>}
                    </div>

                    {!token ? (
                        <button onClick={() => setShowLogin(true)} className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-label-md hover:opacity-90 transition-opacity whitespace-nowrap active:scale-95">Đăng nhập</button>
                    ) : (
                        <div className="relative" ref={profileRef}>
                            <div className="w-10 h-10 rounded-full bg-outline-variant overflow-hidden cursor-pointer shadow-sm border border-outline-variant/30 hover:scale-105 transition-transform" onClick={toggleProfilePopup}>
                                <img 
                                    className="w-full h-full object-cover" 
                                    src={displayAvatar}
                                    alt="Avatar"
                                    onError={() => setAvatarLoadError(true)}
                                />
                            </div>
                            {showProfile && (
                                <div className="absolute right-0 mt-3 w-56 bg-surface rounded-xl shadow-xl border border-outline-variant/20 overflow-hidden flex flex-col z-50">
                                    <div className="p-4 bg-surface-container-low flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-outline-variant shrink-0">
                                            <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" onError={() => setAvatarLoadError(true)} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h3 className="text-label-md font-bold text-on-surface truncate">
                                                {isUserLoading ? 'Đang tải...' : isUserError ? 'Lỗi hồ sơ' : user?.name || 'Người dùng'}
                                            </h3>
                                            <p className="text-label-sm text-on-surface-variant truncate">
                                                {isUserLoading ? '...' : isUserError ? 'Không thể tải hồ sơ' : user?.email || '...'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button onClick={() => { navigate('/profile'); setShowProfile(false); }} className="w-full text-left px-4 py-2.5 text-label-md text-on-surface hover:bg-surface-container rounded-lg transition-colors flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[20px]">person</span> Xem hồ sơ
                                        </button>
                                        <button onClick={() => { navigate('/myorders'); setShowProfile(false); }} className="w-full text-left px-4 py-2.5 text-label-md text-on-surface hover:bg-surface-container rounded-lg transition-colors flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[20px]">receipt_long</span> Đơn hàng
                                        </button>
                                        <div className="h-[1px] bg-outline-variant/30 my-1"></div>
                                        <button onClick={() => { logout(); setShowProfile(false); }} className="w-full text-left px-4 py-2.5 text-label-md text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[20px]">logout</span> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <button className="md:hidden text-on-primary" onClick={() => setMenuOpen(true)}>
                        <span className="material-symbols-outlined text-3xl">menu</span>
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {menuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={() => setMenuOpen(false)}></div>
                    <div className="fixed top-0 right-0 h-full w-64 bg-surface z-50 shadow-2xl p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-headline-md font-bold text-primary">Tomato</span>
                            <button onClick={() => setMenuOpen(false)} className="text-on-surface hover:text-error transition-colors">
                                <span className="material-symbols-outlined text-3xl">close</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-6">
                            <Link to='/' onClick={() => { setMenu('home'); setMenuOpen(false); }} className={`text-headline-md ${menu === 'home' ? 'text-primary font-bold' : 'text-on-surface'}`}>Khám phá</Link>
                            <Link to='/myorders' onClick={() => { setMenu('orders'); setMenuOpen(false); }} className={`text-headline-md ${menu === 'orders' ? 'text-primary font-bold' : 'text-on-surface'}`}>Đơn hàng</Link>
                            <Link to='/vouchers' onClick={() => { setMenu('promos'); setMenuOpen(false); }} className={`text-headline-md ${menu === 'promos' ? 'text-primary font-bold' : 'text-on-surface'}`}>Khuyến mãi</Link>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
