import React, { useContext, useEffect, useRef, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const [showProfile, setShowProfile] = useState(false);
    const [avatarLoadError, setAvatarLoadError] = useState(false);

    const { totalAmount, setSearchTerm } = useContext(CartContext);
    const { token, logout, user, url } = useAuth();
    const navigate = useNavigate();
    const profileRef = useRef(null);

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
        <div className='navbar'>
            <Link to='/'><img src={assets.logo} alt='' className='logo' /></Link>

            <ul className='navbar-menu'>
                <Link to='/' onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>Trang chủ</Link>
                <a href='#explore-menu' onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>Menu</a>
                <a href='#app-download' onClick={() => setMenu('mobile-app')} className={menu === 'mobile-app' ? 'active' : ''}>Mobile App</a>
                <a href='#footer' onClick={() => setMenu('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>Liên hệ</a>
            </ul>

            <div className="navbar-right">
                <div className="navbar-search">
                    <input
                        type="text"
                        placeholder="Tìm món ăn..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={assets.search_icon} alt="" />
                </div>

                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                    <div className={totalAmount === 0 ? '' : 'dot'}></div>
                </div>

                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign Up</button>
                ) : (
                    <div className="navbar-profile" ref={profileRef}>
                        <img
                            src={displayAvatar}
                            alt="Avatar"
                            onClick={toggleProfilePopup}
                            onError={() => setAvatarLoadError(true)}
                        />

                        {showProfile && (
                            <div className="nav-profile-dropdown">
                                <div className="profile-header">
                                    <img
                                        src={displayAvatar}
                                        alt="Profile"
                                        onError={() => setAvatarLoadError(true)}
                                    />
                                    <div className="profile-info">
                                        <h3>{user ? user.name : 'Loading...'}</h3>
                                        <p>{user ? user.email : '...'}</p>
                                    </div>
                                </div>

                                <button
                                    className="profile-details-btn"
                                    onClick={() => {
                                        navigate('/profile');
                                        setShowProfile(false);
                                    }}
                                >
                                    Xem hồ sơ
                                </button>

                                <hr />

                                <ul className="profile-links">
                                    <li onClick={() => {
                                        navigate('/myorders');
                                        setShowProfile(false);
                                    }}>
                                        <img src={assets.bag_icon} alt="" />
                                        <p>Đơn hàng</p>
                                    </li>
                                    <li onClick={() => {
                                        logout();
                                        setShowProfile(false);
                                    }}>
                                        <img src={assets.logout_icon} alt="" />
                                        <p>Đăng xuất</p>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
