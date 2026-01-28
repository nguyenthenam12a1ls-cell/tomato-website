import React, { useState, useEffect, useContext } from 'react'
import './PlaceOrder.css'
import { CartContext } from '../../Context/CartContext.jsx' // Đảm bảo đường dẫn Context đúng
import { useAuth } from '../../Context/AuthContext.jsx' // (Hoặc import AuthContext tùy cách bạn setup)
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify' 

const PlaceOrder = () => {
  // Lấy context
  const { totalAmount, food_list, cartItems } = useContext(CartContext);
  const { token, url } = useAuth(); // Dùng hook useAuth (hoặc useContext(AuthContext))

  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", country: "", phone: ""
  });
  
  // --- THÊM STATE MỚI CHO THANH TOÁN ---
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // Mặc định là Stripe

  const onChangeHandler = (event) => {
    // Sửa lỗi gõ không được (từ bước trước)
    const name = event.target.name; 
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const discountPercent = parseFloat(localStorage.getItem("discountPercent")) || 0;
  const subtotal = totalAmount;
  const discountAmount = (subtotal * discountPercent) / 100;
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const totalAfterDiscount = subtotal - discountAmount + deliveryFee;

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: totalAfterDiscount,
      discount: discountPercent,
      paymentMethod: paymentMethod // <-- Gửi phương thức thanh toán lên server
    };

    try {
      // API này của trang web chính
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

      if (response.data.success) {
        const { session_url } = response.data;
        // Chuyển hướng người dùng đến URL thanh toán (Stripe hoặc VNPay)
        window.location.replace(session_url);
      } else {
        toast.error(response.data.message || "Không thể tạo đơn hàng");
      }
    } catch (error) {
        toast.error("Lỗi server, không thể đặt hàng");
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (totalAmount === 0) {
      navigate('/cart');
    }
  }, [token, totalAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      
      {/* CỘT TRÁI (FORM ĐỊA CHỈ) */}
      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>
        
        <div className="multi-fields">
          <div className="form-group"><label>Tên</label><input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='Tên' /></div>
          <div className="form-group"><label>Họ</label><input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Họ' /></div>
        </div>
        <div className="form-group"><label>Email</label><input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email của bạn' /></div>
        <div className="form-group"><label>Địa chỉ</label><input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Số nhà, tên đường' /></div>
        <div className="multi-fields">
          <div className="form-group"><label>Thành phố</label><input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='Thành phố' /></div>
          <div className="form-group"><label>Tỉnh/Bang</label><input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='Tỉnh/Bang' /></div>
        </div>
        <div className="multi-fields">
          <div className="form-group"><label>Mã Zip</label><input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Mã Zip' /></div>
          <div className="form-group"><label>Quốc gia</label><input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Quốc gia' /></div>
        </div>
        <div className="form-group"><label>Số điện thoại</label><input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Số điện thoại' /></div>
      </div>

      {/* CỘT PHẢI (TỔNG TIỀN VÀ CHỌN THANH TOÁN) */}
      <div className="place-order-right">
        
        {/* --- THÊM KHỐI CHỌN THANH TOÁN --- */}
        <div className="payment-method">
            <p className="title">Phương thức thanh toán</p>
            <div className="payment-option">
                <input 
                    type="radio" 
                    id="stripe" 
                    name="paymentMethod" 
                    value="stripe" 
                    checked={paymentMethod === "stripe"} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="stripe">Thanh toán quốc tế (Stripe)</label>
            </div>
            <div className="payment-option">
                <input 
                    type="radio" 
                    id="vnpay" 
                    name="paymentMethod" 
                    value="vnpay" 
                    checked={paymentMethod === "vnpay"} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="vnpay">Thanh toán nội địa (VNPay)</label>
            </div>
        </div>

        {/* Khối Tổng tiền (Giữ nguyên) */}
        <div className="cart-total">
          <h2>Tổng giỏ hàng</h2>
          <div>
            <div className='cart-total-details'><p>Tạm tính</p><p>${subtotal.toFixed(2)}</p></div>
            <hr />
            <div className='cart-total-details'><p>Giảm giá ({discountPercent}%)</p><p>-${discountAmount.toFixed(2)}</p></div>
            <hr />
            <div className='cart-total-details'><p>Phí giao hàng</p><p>${deliveryFee}</p></div>
            <hr />
            <div className='cart-total-details total-bold'><b>Tổng cộng</b><b>${totalAfterDiscount.toFixed(2)}</b></div>
          </div>
          <button type='submit' className='place-order-submit'>TIẾN HÀNH THANH TOÁN</button>
        </div>

      </div>
    </form>
  );
};

export default PlaceOrder;