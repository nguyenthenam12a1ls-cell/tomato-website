import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../Context/CartContext.jsx';
import { useAuth } from '../../Context/AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { totalAmount, food_list, cartItems, setCartItems } = useContext(CartContext);
  const { token, url, user } = useAuth();

  // Combine original fields into the new design's single inputs where possible
  const [data, setData] = useState({
    fullName: "", phone: "", city: "Ho Chi Minh City", district: "District 1",
    address: "", notes: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [showNewAddress, setShowNewAddress] = useState(true); // Default show for new users

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const discountPercent = parseFloat(localStorage.getItem("discountPercent")) || 0;
  const subtotal = totalAmount;
  const discountAmount = (subtotal * discountPercent) / 100;
  const deliveryFee = subtotal === 0 ? 0 : 2; // For UI matching, maybe $2
  const vat = subtotal * 0.08;
  const totalAfterDiscount = subtotal - discountAmount + deliveryFee + vat;

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item.id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item.id]
        });
      }
    });

    let orderData = {
      // Map back to original structure if needed by backend, or just send the new one
      address: {
        firstName: data.fullName.split(' ')[0] || '',
        lastName: data.fullName.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        street: data.address,
        city: data.city,
        state: data.district,
        zipcode: '00000',
        country: 'Vietnam',
        phone: data.phone
      },
      items: orderItems,
      amount: totalAfterDiscount,
      discount: discountPercent,
      paymentMethod: paymentMethod
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      if (response.data.success) {
        if (paymentMethod === 'stripe' || paymentMethod === "vnpay") {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else if (paymentMethod === "cod") {
          setCartItems({});
          localStorage.removeItem("discountCode");
          localStorage.removeItem("discountPercent");
          toast.success("Đặt hàng thành công!");
          navigate('/myorders');
        }
      } else {
        toast.error(response.data.message || "Không thể tạo đơn hàng");
      }
    } catch {
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
    <form onSubmit={placeOrder} className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-xl mt-20 min-h-screen">
      <div className="mb-stack-xl">
        <h1 className="text-display-lg font-extrabold text-on-background tracking-tight">Thanh toán</h1>
        <p className="text-on-surface-variant mt-2">Vui lòng kiểm tra chi tiết đơn hàng và thông tin giao hàng.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* LEFT COLUMN: Checkout Flow */}
        <div className="lg:col-span-8 space-y-stack-xl">

          {/* 1. Delivery Address */}
          <section className="relative">
            <div className="absolute left-[15px] top-[32px] bottom-[-48px] w-[2px] bg-outline-variant z-0 hidden md:block"></div>
            <div className="flex items-center gap-4 mb-stack-lg relative z-10">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-label-sm">1</span>
              <h2 className="text-headline-md font-bold">Địa chỉ giao hàng</h2>
            </div>
            <div className="pl-0 md:pl-12 space-y-stack-md">

              {/* Add New Address Button */}
              {!showNewAddress && (
                <button type="button" onClick={() => setShowNewAddress(true)} className="w-full py-4 border-2 border-dashed border-outline-variant rounded-2xl text-on-surface-variant font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">add</span>
                  Thêm địa chỉ mới
                </button>
              )}

              {/* Expandable New Address Form */}
              {showNewAddress && (
                <div className="bg-surface-container-low p-stack-lg rounded-2xl border border-outline-variant animate-in fade-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    <div className="space-y-1">
                      <label className="text-label-sm font-bold text-on-surface-variant">Họ và tên</label>
                      <input required name="fullName" value={data.fullName} onChange={onChangeHandler} className="w-full rounded-xl border-outline p-3 focus:border-primary focus:ring-primary bg-surface-container-lowest" placeholder="Nhập họ và tên" type="text" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-label-sm font-bold text-on-surface-variant">Số điện thoại</label>
                      <input required name="phone" value={data.phone} onChange={onChangeHandler} className="w-full rounded-xl border-outline p-3 focus:border-primary focus:ring-primary bg-surface-container-lowest" placeholder="Nhập số điện thoại" type="tel" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-label-sm font-bold text-on-surface-variant">Tỉnh/Thành phố</label>
                      <select name="city" value={data.city} onChange={onChangeHandler} className="w-full rounded-xl border-outline p-3 focus:border-primary focus:ring-primary bg-surface-container-lowest">
                        <option value="Ho Chi Minh City">Hồ Chí Minh</option>
                        <option value="Hanoi">Hà Nội</option>
                        <option value="Da Nang">Đà Nẵng</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-label-sm font-bold text-on-surface-variant">Quận/Huyện</label>
                      <select name="district" value={data.district} onChange={onChangeHandler} className="w-full rounded-xl border-outline p-3 focus:border-primary focus:ring-primary bg-surface-container-lowest">
                        <option value="District 1">Quận 1</option>
                        <option value="District 3">Quận 3</option>
                        <option value="Binh Thanh">Bình Thạnh</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-label-sm font-bold text-on-surface-variant">Địa chỉ chi tiết</label>
                      <textarea required name="address" value={data.address} onChange={onChangeHandler} className="w-full rounded-xl border-outline p-3 focus:border-primary focus:ring-primary bg-surface-container-lowest" placeholder="Số nhà, tên đường..." rows="2"></textarea>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-label-sm font-bold text-on-surface-variant">Ghi chú giao hàng (Tùy chọn)</label>
                      <input name="notes" value={data.notes} onChange={onChangeHandler} className="w-full rounded-xl border-outline p-3 focus:border-primary focus:ring-primary bg-surface-container-lowest" placeholder="VD: Giao giờ hành chính, gọi trước khi giao" type="text" />
                    </div>
                  </div>
                  <div className="mt-stack-lg flex gap-4">
                    <button type="button" onClick={() => setShowNewAddress(false)} className="flex-1 bg-outline-variant text-on-background py-3 rounded-xl font-bold hover:bg-surface-variant transition-colors">Đóng</button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 3. Payment Method */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-stack-lg relative z-10">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-label-sm">2</span>
              <h2 className="text-headline-md font-bold">Phương thức thanh toán</h2>
            </div>
            <div className="pl-0 md:pl-12 space-y-stack-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-stack-md">

                {/* Visa Card Selection */}
                <label className="cursor-pointer group">
                  <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === "stripe"} onChange={(e) => setPaymentMethod(e.target.value)} className="peer hidden" />
                  <div className="h-full p-stack-md rounded-2xl border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-surface-container transition-all group-hover:scale-105 group-hover:shadow-lg">
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-primary">credit_card</span>
                        <div className="flex gap-1">
                          <div className="w-6 h-4 bg-[#1434CB] rounded-sm"></div>
                          <div className="w-6 h-4 bg-[#EB001B] rounded-sm"></div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="font-bold">Thẻ Tín dụng/Ghi nợ</p>
                        <p className="text-xs text-on-surface-variant">Visa, Mastercard, JCB</p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* VNPay */}
                <label className="cursor-pointer group">
                  <input type="radio" name="paymentMethod" value="vnpay" checked={paymentMethod === "vnpay"} onChange={(e) => setPaymentMethod(e.target.value)} className="peer hidden" />
                  <div className="h-full p-stack-md rounded-2xl border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-surface-container transition-all group-hover:scale-105 group-hover:shadow-lg">
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-[#005BAA]">qr_code_2</span>
                      </div>
                      <div className="mt-4">
                        <p className="font-bold">VNPay</p>
                        <p className="text-xs text-on-surface-variant">Quét mã QR qua App</p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className="cursor-pointer group">
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} className="peer hidden" />
                  <div className="h-full p-stack-md rounded-2xl border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-surface-container transition-all group-hover:scale-105 group-hover:shadow-lg">
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-green-600">payments</span>
                      </div>
                      <div className="mt-4">
                        <p className="font-bold">Tiền mặt</p>
                        <p className="text-xs text-on-surface-variant">Thanh toán khi nhận hàng</p>
                      </div>
                    </div>
                  </div>
                </label>

              </div>

              {/* Card Entry Form (Conditional) */}
              {paymentMethod === "stripe" && (
                <div className="bg-surface-container-low p-stack-lg rounded-2xl border border-outline-variant space-y-4 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-1">
                    <label className="text-label-sm font-bold text-on-surface-variant">Số thẻ</label>
                    <div className="relative">
                      <input className="w-full rounded-xl border-outline p-3 pl-12 focus:border-primary focus:ring-primary bg-surface-container-lowest" placeholder="0000 0000 0000 0000" type="text" />
                      <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">credit_card</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-label-sm font-bold text-on-surface-variant">Ngày hết hạn</label>
                      <input className="w-full rounded-xl border-outline p-3 focus:border-primary focus:ring-primary bg-surface-container-lowest" placeholder="MM/YY" type="text" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-label-sm font-bold text-on-surface-variant">CVV</label>
                      <input className="w-full rounded-xl border-outline p-3 focus:border-primary focus:ring-primary bg-surface-container-lowest" placeholder="***" type="password" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Order Summary (Sticky) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-stack-lg mt-8 lg:mt-0">
          <div className="bg-surface-container-lowest rounded-2xl shadow-lg p-stack-lg border border-surface-variant overflow-hidden">
            <h3 className="text-headline-md font-bold mb-stack-md">Tóm tắt đơn hàng</h3>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Tạm tính</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Phí giao hàng</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-body-md text-green-600 font-semibold">
                  <span>Giảm giá ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>VAT (8%)</span>
                <span>${vat.toFixed(2)}</span>
              </div>

              <div className="pt-stack-md border-t border-outline-variant/30 flex justify-between items-end mt-4">
                <div>
                  <p className="text-label-sm font-bold text-on-surface-variant uppercase">Tổng thanh toán</p>
                  <p className="text-[32px] leading-none font-extrabold text-primary">${totalAfterDiscount.toFixed(2)}</p>
                </div>
                <span className="text-label-sm text-on-surface-variant mb-1">Đã bao gồm thuế</span>
              </div>
            </div>

            <button type="submit" className="w-full mt-stack-lg bg-primary text-on-primary py-4 rounded-xl font-extrabold text-[18px] flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-md">
              Xác nhận Đặt hàng
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <p className="mt-4 text-[11px] text-center text-on-surface-variant leading-relaxed">
              Bằng việc đặt hàng, bạn đồng ý với <a className="underline hover:text-primary" href="/privacy-policy">Điều khoản dịch vụ</a> và <a className="underline hover:text-primary" href="/privacy-policy">Chính sách bảo mật</a> của chúng tôi.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="bg-surface-container-low p-4 rounded-2xl flex justify-between items-center opacity-80 border border-outline-variant/30">
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Bảo mật SSL</span>
            </div>
            <div className="h-6 w-px bg-outline-variant"></div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Đảm bảo</span>
            </div>
            <div className="h-6 w-px bg-outline-variant"></div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[20px]">currency_exchange</span>
              <span class="text-[10px] font-bold uppercase text-on-surface-variant">Hoàn tiền</span>
            </div>
          </div>
        </aside>

      </div>
    </form>
  );
};

export default PlaceOrder;
