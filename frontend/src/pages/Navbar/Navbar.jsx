import React, { useContext, useState, useEffect, useRef } from 'react' // 1. Thêm 'useRef'
import './Navbar.css'
import {assets} from '../../assets/assets'
import {Link, useNavigate} from 'react-router-dom'
import { CartContext } from '../../Context/CartContext' 
import { useAuth } from '../../Context/AuthContext' 

const Navbar = ({setShowLogin}) => {
    
    const [menu,setMenu]=useState("home");
    const { totalAmount, setSearchTerm } = useContext(CartContext);
    const { token, logout, user, url } = useAuth(); 
    const navigate = useNavigate();

    // 2. STATE ĐỂ QUẢN LÝ POPUP
    const [showProfile, setShowProfile] = useState(false);
    
    // 3. TẠO REF ĐỂ "ĐÁNH DẤU" VÙNG POPUP
    const profileRef = useRef(null);

    // 4. LOGIC TỰ ĐỘNG ĐÓNG POPUP KHI BẤM RA NGOÀI
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Nếu popup đang mở VÀ
            // ref đã tồn tại VÀ
            // nơi bấm vào KHÔNG nằm trong vùng ref
            if (showProfile && profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false); // Thì đóng popup
            }
        };

        // Thêm trình lắng nghe
        document.addEventListener('mousedown', handleClickOutside);
        
        // Dọn dẹp
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfile]); // Chạy lại mỗi khi 'showProfile' thay đổi

    // 5. LOGIC BẬT/TẮT KHI BẤM VÀO ICON
    const toggleProfilePopup = () => {
        setShowProfile(prev => !prev);
    }

    // (Biến displayAvatar giữ nguyên)
    const displayAvatar = (user && user.avatar) 
                            ? `${url}/images/${user.avatar}` 
                            : assets.profile_icon;

    return (
        <div className='navbar'>
            
            <Link to='/'><img src={assets.logo} alt='' className='logo'/></Link>
            <ul className='navbar-menu'>
                <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Trang chủ</Link>
                <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Menu</a>
                <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>Mobile App</a>
                <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>Liên hệ</a>
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
                    <div className={totalAmount === 0 ? "" : "dot"}></div>
                </div>

                {!token?<button onClick={()=>setShowLogin(true)} >Sign Up</button>
                // 6. GẮN REF VÀO ĐÂY
                : <div className="navbar-profile" ref={profileRef}> 
                    
                    {/* 7. GẮN ONCLICK VÀO ĐÂY */}
                    <img src={displayAvatar} alt='' onClick={toggleProfilePopup} />
                    
                    {/* 8. DÙNG LOGIC 'showProfile' ĐỂ HIỂN THỊ */}
                    {showProfile && (
                        <div className="nav-profile-dropdown">
                            <div className="profile-header">
                                <img src={displayAvatar} alt="Profile" />
                                <div className="profile-info">
                                    <h3>{user ? user.name : "Loading..."}</h3>
                                    <p>{user ? user.email : "..."}</p>
                                </div>
                            </div>
                            <button 
                                className="profile-details-btn" 
                                // Thêm setShowProfile(false) khi bấm
                                onClick={()=> {navigate('/profile'); setShowProfile(false);}}
                            >
                                Xem hồ sơ
                            </button>
                            <hr />
                            <ul className="profile-links">
                                <li onClick={()=> {navigate('/myorders'); setShowProfile(false);}}>
                                    <img src={assets.bag_icon} alt="" /><p>Đơn hàng</p>
                                </li>
                                <li onClick={()=> {logout(); setShowProfile(false);}}>
                                    <img src={assets.logout_icon} alt="" /><p>Đăng xuất</p>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                }
            </div>
        </div>
    )
}

export default Navbar