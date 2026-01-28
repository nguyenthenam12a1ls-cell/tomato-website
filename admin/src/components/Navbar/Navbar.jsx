import React, { useState, useContext } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext' 
import { useNavigate } from 'react-router-dom' 

const Navbar = () => {
  
  const { setToken, adminData } = useContext(StoreContext);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate(); 

  const logout = () => {
    setToken(""); 
    setShowProfilePopup(false);
    navigate("/"); 
  }

  return (
    <div className='navbar'>
        <div className="navbar-logo">
            <p>Admin<span>Panel</span></p>
        </div>
        
        <img 
          onClick={() => setShowProfilePopup(prev => !prev)} 
          className='profile' 
          src={assets.profile_image} 
          alt="Profile" 
        />

        {showProfilePopup && (
          <div className="navbar-profile-popup">
            <div className="popup-user-info">
              <img src={assets.profile_image} alt="Avatar" />
              
              {adminData ? (
                <div>
                  <h4>{adminData.name}</h4>
                  <p>{adminData.email}</p>
                </div>
              ) : (
                <div>
                  <h4>Đang tải...</h4>
                </div>
              )}

            </div>
            
            <button onClick={logout} className='popup-logout-btn'>
              <img src="/src/assets/logout_icon.png" alt="" />
              Logout
            </button>
          </div>
        )}

    </div>
  )
}

export default Navbar