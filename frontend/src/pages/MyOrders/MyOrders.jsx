import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      setData(response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg flex flex-col md:flex-row gap-gutter mt-20 min-h-[calc(100vh-160px)]">

      {/* Sidebar Navigation */}
      <ProfileSidebar />

      {/* Main Content (Order History) */}
      <main className="flex-grow flex flex-col gap-stack-lg w-full">
        <div className="flex flex-col gap-stack-md">
          <h1 className="font-headline-lg text-headline-lg text-on-background">Lịch sử đơn hàng</h1>

          {/* Filter Tabs */}
          <div className="flex items-center gap-stack-sm overflow-x-auto pb-2 border-b border-outline-variant hide-scrollbar">
            <button className="px-6 py-2 md:py-3 rounded-full bg-primary text-white font-label-md text-label-md shadow-md whitespace-nowrap">Tất cả</button>
            <button className="px-6 py-2 md:py-3 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant transition-colors whitespace-nowrap">Đang giao</button>
            <button className="px-6 py-2 md:py-3 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant transition-colors whitespace-nowrap">Đã nhận</button>
            <button className="px-6 py-2 md:py-3 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant transition-colors whitespace-nowrap">Đã hủy</button>
            <button className="px-6 py-2 md:py-3 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant transition-colors whitespace-nowrap">Đang chờ</button>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col md:flex-row gap-stack-md items-start md:items-center justify-between mt-stack-sm">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:border-secondary-container font-body-md text-body-md" placeholder="Tìm kiếm theo mã đơn hoặc tên món..." type="text" />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-on-surface-variant font-label-md text-label-md whitespace-nowrap">Sắp xếp:</span>
              <select className="bg-white border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md focus:outline-none focus:border-secondary-container cursor-pointer w-full md:w-auto min-w-[160px]">
                <option>Mới nhất</option>
                <option>Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order List */}
        <div className="flex flex-col gap-stack-md mt-4">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-stack-xl text-center">
              <span className="material-symbols-outlined text-[80px] text-outline-variant mb-4">shopping_basket</span>
              <h3 className="font-headline-md text-headline-md text-on-background mb-2">Bạn chưa có đơn hàng nào</h3>
              <p className="text-on-surface-variant font-body-md text-body-md mb-stack-lg max-w-sm">Có vẻ như bạn chưa đặt món gì. Hãy khám phá hàng ngàn món ngon từ các nhà hàng xung quanh bạn!</p>
              <button onClick={() => navigate('/')} className="px-8 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-label-md shadow-md hover:scale-105 transition-transform">
                Đặt hàng ngay
              </button>
            </div>
          ) : (
            data.map((order, index) => {
              // Extract order details
              const date = new Date(order.createdAt || Date.now());
              const dateStr = `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}, ${date.getDate()} Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;

              // Get the first item image for the order card
              const firstItem = order.items[0];
              const imageUrl = '';

              // Create summary text: "Phở Đặc Biệt, Quẩy Giòn +1 items"
              let itemsText = "";
              if (order.items.length <= 2) {
                itemsText = order.items.map(item => `${item.name} x${item.quantity}`).join(', ');
              } else {
                itemsText = `${order.items[0].name} x${order.items[0].quantity}, ${order.items[1].name} x${order.items[1].quantity} +${order.items.length - 2} món khác`;
              }

              // Determine styling based on status
              let statusStyle = "";
              let statusText = order.status;
              let isProcessing = false;

              if (order.status === 'Delivered') {
                statusStyle = "bg-green-100 text-green-700 border-green-200";
                statusText = "Đã nhận";
              } else if (order.status === 'Food Processing') {
                statusStyle = "bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1";
                statusText = "Đang giao";
                isProcessing = true;
              } else {
                statusStyle = "bg-surface-variant text-on-surface-variant border-outline-variant";
              }

              return (
                <div key={index} className="bg-white rounded-xl p-stack-md shadow-sm hover:shadow-md transition-all duration-200 border border-outline-variant/30 hover:border-primary-fixed">
                  <div className="flex justify-between items-start mb-stack-md">
                    <div>
                      <p className="font-headline-md text-[18px] md:text-headline-md text-on-background uppercase">#ORD-{String(order.id).padStart(6, '0')}</p>
                      <p className="text-on-surface-variant font-body-md text-sm mt-1">{dateStr}</p>
                    </div>
                    <span className={`px-3 md:px-4 py-1.5 rounded-full font-label-md text-[11px] md:text-label-sm border ${statusStyle}`}>
                      {isProcessing && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                      {statusText}
                    </span>
                  </div>

                  <div className="flex gap-4 items-center py-4 border-y border-outline-variant/30">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                      {imageUrl ? (
                        <img className="w-full h-full object-cover" src={imageUrl} alt="Order item" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline">
                          <span className="material-symbols-outlined text-3xl">restaurant</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-[16px] md:text-lg text-on-background line-clamp-1">{firstItem ? firstItem.name : "Đơn hàng Tomato"}</h3>
                      <p className="text-on-surface-variant font-body-md text-sm mt-1 line-clamp-2">{itemsText}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-stack-md gap-4">
                    <div>
                      <span className="text-on-surface-variant text-label-sm font-label-sm">Tổng cộng:</span>
                      <p className="text-primary font-bold text-xl">${parseFloat(order.amount).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors whitespace-nowrap">Chi tiết</button>
                      {order.status === 'Delivered' ? (
                        <button onClick={() => navigate('/')} className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap">Mua lại</button>
                      ) : (
                        <button className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap">Theo dõi</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default MyOrders;