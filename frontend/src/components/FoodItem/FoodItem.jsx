import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets.js'
// 1. IMPORT CẢ HAI CONTEXT ĐÚNG
import { CartContext } from '../../Context/CartContext.jsx'
import { useAuth } from '../../Context/AuthContext.jsx' // (Hoặc import AuthContext nếu bạn không dùng hook 'useAuth')
import { useNavigate } from 'react-router-dom'

const FoodItem= ({id,name,price,description,image}) => {
  
  // 2. LẤY TỪ 2 CONTEXT RIÊNG BIỆT
  const {cartItems,addToCart,removeFromCart} = useContext(CartContext);
  const { url } = useAuth(); // (Hoặc useContext(AuthContext))
  
  const navigate = useNavigate();
  
  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            {/* 3. Ảnh (sử dụng 'url' đúng) và onClick chuyển trang */}
            <img className='food-item-image' src={url+"/images/"+image} alt='' onClick={() => navigate(`/food/${id}`)}/>
            
            {/* 4. Thêm e.stopPropagation() để các nút này KHÔNG chuyển trang */}
            {!cartItems[id]
              ?<img className='add' onClick={(e)=> { e.stopPropagation(); addToCart(id); }} src={assets.add_icon_white} alt=""/> 
              :<div className='food-item-counter' onClick={(e) => e.stopPropagation()}>  
                <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt=''/>
                <p>{cartItems[id]}</p>
                <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt=''/> 
              </div>  
              }  
        </div>
      
        {/* 5. Khối thông tin cũng onClick chuyển trang */}
        <div className="food-item-info" onClick={() => navigate(`/food/${id}`)}>  
          <div className="food-item-name-rating">  
              <p>{name}</p>  
              <img src={assets.rating_starts} alt="" />  
          </div>  
          <p className="food-item-desc">{description}</p>  
          <p className="food-item-price">${price}</p>  
        </div>  
    </div>
  )
}

export default FoodItem;