import React, { useState, useEffect, useContext } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext'; 

const Orders = () => { 

  const { url } = useContext(StoreContext); 
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Lỗi khi tải danh sách đơn hàng");
      }
    } catch (error) {
      toast.error("Lỗi API: Không thể tải đơn hàng");
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus,
      });

      if (response.data.success) {
        toast.success("Cập nhật trạng thái thành công");
        await fetchAllOrders(); // Tải lại danh sách
      } else {
        toast.error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      toast.error("Lỗi API: Không thể cập nhật trạng thái");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [url]); 

  return (
    // THÊM CLASS 'order-container' BỌC BÊN NGOÀI
    <div className='order add'>
      <div className="order-container">
        <h3>Trang Quản lý Đơn hàng</h3>
        <div className="order-list">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className='order-item'>
                <img src={assets.parcel_icon} alt="Parcel Icon" />
                
                {/* NHÓM THÔNG TIN MÓN ĂN VÀ KHÁCH HÀNG */}
                <div className="order-item-details">
                  <p className='order-item-food'>
                    {order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return `${item.name} x ${item.quantity}`;
                      } else {
                        return `${item.name} x ${item.quantity}, `;
                      }
                    })}
                  </p>
                  <p className='order-item-name'>
                    {`${order.address.firstName || ''} ${order.address.lastName || ''}`}
                  </p>
                  <div className='order-item-address'>
                    <p>{`${order.address.street || ''}`}</p>
                    <p>{`${order.address.city || ''}, ${order.address.zipcode || ''}`}</p>
                  </div>
                  <p className='order-item-phone'>{order.address.phone}</p>
                </div>

                {/* THÔNG TIN PHỤ */}
                <div className="order-item-info">
                  <p>Số lượng: {order.items.length}</p>
                  <p className="order-item-amount">${order.amount}</p>
                </div>
                
                {/* SELECT TRẠNG THÁI */}
                <div className="order-item-status">
                  <select 
                    onChange={(event) => statusHandler(event, order._id)} 
                    value={order.status}
                    // Thêm class động dựa trên trạng thái
                    className={`status-select status-${order.status.toLowerCase().replace(' ', '-')}`}
                  >
                    <option value="Food Processing">Đang chuẩn bị</option>
                    <option value="Out for Delivery">Đang giao hàng</option>
                    <option value="Delivered">Đã giao</option>
                  </select>
                </div>

              </div>
            ))
          ) : (
            <p>Không có đơn hàng nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;