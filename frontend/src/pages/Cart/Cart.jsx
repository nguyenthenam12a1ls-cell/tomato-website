import React, { useContext, useState } from 'react';
import './Cart.css';
import { CartContext } from '../../Context/CartContext'; 
import { AuthContext } from '../../Context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import discountCodes from './discountCodes.json'; 
// 1. IMPORT 'ASSETS' (ĐƯỜNG DẪN ĐÚNG)
import { assets } from '../../assets/assets';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, totalAmount, addToCart } = useContext(CartContext);
  const { url } = useContext(AuthContext);
  const navigate = useNavigate();

  // ... (Code logic cho promo, subtotal, v.v. giữ nguyên) ...
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    const foundCode = discountCodes.find(item => item.code.toUpperCase() === code);

    if (foundCode) {
      setDiscountPercent(foundCode.discount);
      alert(`🎉 Mã ${foundCode.code} được áp dụng! Giảm ${foundCode.discount}%`);
      localStorage.setItem("discountCode", foundCode.code);
      localStorage.setItem("discountPercent", foundCode.discount);
    } else {
      setDiscountPercent(0);
      alert('❌ Mã giảm giá không hợp lệ!');
      localStorage.removeItem("discountCode");
      localStorage.removeItem("discountPercent");
    }
  };

  const subtotal = totalAmount;
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className='cart'>
      <div className="cart-container">

        <div className="cart-items-list">
          <h2>Giỏ hàng của bạn</h2>
          <hr />
          
          {food_list.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={index} className="cart-item">
                  <img src={url + "/images/" + item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">${item.price}</p>
                    <div className="cart-item-counter">
                      
                      {/* 2. SỬA LẠI ĐƯỜNG DẪN SRC ĐỂ DÙNG ASSETS */}
                      <img onClick={() => removeFromCart(item._id)} src={assets.remove_icon_red} alt="Remove" />
                      <p>{cartItems[item._id]}</p>
                      <img onClick={() => addToCart(item._id)} src={assets.add_icon_green} alt="Add" />

                    </div>
                  </div>
                  <p className="cart-item-total">${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cart-item-remove'>×</p>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* --- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (giữ nguyên) --- */}
        <div className="cart-summary">
          
          <div className='cart-promocode'>
            <h3>Mã giảm giá</h3>
            <p>Nếu bạn có mã, hãy nhập vào đây</p>
            <div className='cart-promocode-input'>
              <input
                type='text'
                placeholder='Nhập mã...'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button type="button" onClick={handleApplyPromo}>Áp dụng</button>
            </div>
          </div>

          <div className="cart-total">
            <h3>Tổng giỏ hàng</h3>
            <div>
              <div className='cart-total-details'>
                <p>Tạm tính</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <hr />
              <div className='cart-total-details'>
                <p>Giảm giá ({discountPercent}%)</p>
                <p>-${discountAmount.toFixed(2)}</p>
              </div>
              <hr />
              <div className='cart-total-details'>
                <p>Phí giao hàng</p>
                <p>${deliveryFee}</p>
              </div>
              <hr />
              <div className='cart-total-details total-bold'>
                <b>Tổng cộng</b>
                <b>${total.toFixed(2)}</b>
              </div>
            </div>
            <button onClick={() => navigate('/order')}>TIẾN HÀNH THANH TOÁN</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;