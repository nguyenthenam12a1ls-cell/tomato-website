import React, { useContext, useState } from 'react';
import { CartContext } from '../../Context/CartContext'; 
import { AuthContext } from '../../Context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import discountCodes from './discountCodes.json'; 
import { assets } from '../../assets/assets';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, totalAmount, addToCart } = useContext(CartContext);
  const { url } = useContext(AuthContext);
  const navigate = useNavigate();

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
  // Let's add VAT like the design: Thuế VAT (8%)
  const vat = subtotal * 0.08;
  const total = subtotal - discountAmount + deliveryFee + vat;

  // Progress for free shipping 
  const freeShipTarget = 50;
  const progressPercent = Math.min((subtotal / freeShipTarget) * 100, 100);
  const amountNeeded = Math.max(freeShipTarget - subtotal, 0);

  return (
    <main className="flex-grow max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-xl w-full mt-20 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* LEFT COLUMN: Cart Items */}
        <div className="lg:col-span-8">
          <h1 className="font-headline-md text-headline-md font-bold text-on-tertiary-fixed mb-stack-lg">Giỏ hàng của bạn</h1>
          
          {subtotal > 0 && (
            <div className="bg-surface-container-low p-stack-md rounded-xl mb-stack-lg flex flex-col gap-1 border-l-4 border-secondary">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">restaurant</span>
                <span className="font-label-md text-label-md text-on-surface">Đang đặt tại: <span className="font-bold">Nhà hàng Tomato</span></span>
              </div>
              <p className="text-label-sm text-label-sm text-on-surface-variant opacity-80">Thêm từ quán khác sẽ xóa giỏ hàng hiện tại</p>
            </div>
          )}

          <div className="space-y-stack-md">
            {food_list.map((item) => {
              if (cartItems[item.id] > 0) {
                return (
                  <div key={item.id} className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant flex gap-stack-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => navigate(`/food/${item.id}`)}>
                      <img className="w-full h-full object-cover" src={url + "/images/" + item.image} alt={item.name} />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="cursor-pointer" onClick={() => navigate(`/food/${item.id}`)}>
                          <h3 className="font-label-md text-label-md text-on-surface font-bold line-clamp-1">{item.name}</h3>
                          <p className="text-label-sm text-label-sm text-on-surface-variant line-clamp-1 mt-1">${item.price} / phần</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-outline hover:text-error transition-colors p-1">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-stack-sm">
                        <div className="flex items-center gap-3 bg-surface-container rounded-full px-3 py-1">
                          <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center text-primary font-bold hover:bg-surface-container-highest rounded-full transition-colors">
                             <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>remove</span>
                          </button>
                          <span className="font-label-md text-[14px] w-4 text-center select-none">{cartItems[item.id]}</span>
                          <button onClick={() => addToCart(item.id)} className="w-6 h-6 flex items-center justify-center text-primary font-bold hover:bg-surface-container-highest rounded-full transition-colors">
                             <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
                          </button>
                        </div>
                        <span className="font-label-md text-[16px] md:text-label-md text-primary font-bold">${(item.price * cartItems[item.id]).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}

            {subtotal === 0 && (
              <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/50">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">shopping_cart</span>
                <p className="text-body-lg text-on-surface-variant">Giỏ hàng của bạn đang trống.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold hover:underline">Tiếp tục chọn món</button>
              </div>
            )}
          </div>

          {subtotal > 0 && (
            <>
              <button onClick={() => navigate('/')} className="mt-stack-lg flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined">add_circle</span>
                <span>Thêm món khác</span>
              </button>

              <hr className="my-stack-xl border-outline-variant opacity-30" />

              <div className="space-y-stack-lg">
                <div className="space-y-stack-sm">
                  <label className="font-label-md text-label-md text-on-surface">Mã giảm giá</label>
                  <div className="flex gap-2">
                    <input 
                      className="flex-grow bg-surface-container-lowest border-outline rounded-lg px-4 py-2 focus:ring-secondary focus:border-secondary text-on-surface outline-none border" 
                      placeholder="Nhập mã ưu đãi..." 
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button onClick={handleApplyPromo} className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:bg-primary-container transition-colors active:scale-95">Áp dụng</button>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex items-center gap-2 bg-[#E1F2E5] text-[#2D6A4F] px-3 py-1.5 rounded-lg w-fit mt-2">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span className="font-label-sm text-label-sm font-bold">Mã đã áp dụng (-{discountPercent}%)</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-stack-sm mt-4">
                  <label className="font-label-md text-label-md text-on-surface">Ghi chú cho tài xế</label>
                  <textarea className="w-full bg-surface-container-lowest border border-outline rounded-lg px-4 py-3 focus:ring-secondary focus:border-secondary outline-none text-on-surface" placeholder="Ghi chú cho tài xế..." rows="3"></textarea>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN: Summary */}
        {subtotal > 0 && (
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-28 space-y-stack-lg">
              
              <div className="bg-surface-container-lowest rounded-xl shadow-md p-stack-lg border border-outline-variant">
                <h2 className="font-headline-md text-[20px] font-bold text-on-tertiary-fixed mb-stack-md">Tổng cộng</h2>
                
                {/* Free Ship Progress */}
                <div className="mb-stack-lg bg-surface-container-low p-3 rounded-lg border border-primary-fixed">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-label-sm text-label-sm">Miễn phí giao hàng</span>
                    <span className="text-label-sm text-label-sm font-bold text-primary">{progressPercent.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <p className="text-[11px] mt-2 text-on-surface-variant italic">
                    {amountNeeded > 0 ? `Thêm $${amountNeeded.toFixed(2)} để được miễn phí giao hàng` : 'Tuyệt vời! Bạn được miễn phí giao hàng.'}
                  </p>
                </div>

                {/* Calculations */}
                <div className="space-y-3 mb-stack-lg border-b border-outline-variant pb-stack-md">
                  <div className="flex justify-between text-body-md text-body-md">
                    <span className="text-on-surface-variant">Tạm tính</span>
                    <span className="font-semibold text-on-surface">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-body-md text-body-md">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <span>Phí giao hàng</span>
                      <span className="material-symbols-outlined text-[16px] cursor-help">info</span>
                    </div>
                    <span className="font-semibold text-on-surface">${deliveryFee.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-body-md text-body-md">
                      <span className="text-on-surface-variant">Giảm giá ({discountPercent}%)</span>
                      <span className="font-bold text-[#2D6A4F]">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-body-md text-body-md">
                    <span className="text-on-surface-variant">Thuế VAT (8%)</span>
                    <span className="font-semibold text-on-surface">${vat.toFixed(2)}</span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-center mb-stack-lg">
                  <span className="font-headline-md text-headline-md text-on-tertiary-fixed">Tổng cộng</span>
                  <span className="font-display-lg text-[28px] font-extrabold text-primary">${total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={() => navigate('/order')}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg hover:bg-primary-container transform active:scale-[0.98] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Thanh toán ngay</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant opacity-70">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span className="text-label-sm text-label-sm">Thanh toán bảo mật & an toàn</span>
                </div>
              </div>

              {/* Cross-sell Section */}
              <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant">
                <h4 className="font-label-md text-label-md font-bold mb-stack-md">Thêm vào đơn cho đủ miễn ship</h4>
                <div className="space-y-stack-sm">
                  
                  <div className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZTh_9VFS0Dq8hD7zTbJA2sxfdrDzfsBu5rwJ8-OtcwJemN_TqzAMwPNdsOFLkW5L0IIpvVXwO6ybXk2V5Hxgm8pVNshy8s1nAgbCXQzzqxnaNChrbqMqkuoWGSfhZooZgmY-XMzrCvJ_DpweNLvaGVaEaE0ddZGWSv21tS2sWaN1QVgQJIgRmCcBP4Xd9rGerCdT7-L2ek3Dr0Fj1Ixg9TnE4IY5HvGlwRCHFhBfJ2UXUV0-AUgw" alt="Coca" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-label-sm text-label-sm font-bold group-hover:text-primary transition-colors">Coca-Cola 330ml</p>
                      <p className="text-label-sm text-label-sm text-primary font-bold">$1.50</p>
                    </div>
                    <button className="text-primary hover:bg-primary-fixed-dim rounded-full p-1">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnPLiEUi1s5tv49qUEEZVF1HophWhC41k0h2KV1LrvcKiZeRqk5Aabc_wOlCeJR_6EcVq0_TetPLA4KzbYmkzSyZkG8tf4fCb-soHJAWarljNRXjyMPMH7ony_EKg2bscZwnAXRtN-Y0qS9DTCpB9UhkFgbz9Hg8GwGmSdiT3ejmxDuXR0glsCMfGOb78ju3XK9fAojq3-fDkxQnW1VqreudKBAiVpAnRWA1NcYS51gK0UGjB54-M" alt="Fries" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-label-sm text-label-sm font-bold group-hover:text-primary transition-colors">Khoai tây chiên</p>
                      <p className="text-label-sm text-label-sm text-primary font-bold">$2.50</p>
                    </div>
                    <button className="text-primary hover:bg-primary-fixed-dim rounded-full p-1">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
