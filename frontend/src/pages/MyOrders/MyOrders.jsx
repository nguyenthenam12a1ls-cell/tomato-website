import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext'; // 1. Import AuthContext
import axios from 'axios';
import { assets } from '../../assets/assets';
import './MyOrders.css';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  // 2. Dùng AuthContext
  const { url, token } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      // 3. Dùng url và token
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // ... code logic hiển thị popup giữ nguyên ...
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className='my-orders-order'>
            <img src={assets.parcel_icon} alt="parcel" />
            <p>
              {order.items.map((item, idx) =>
                idx === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              )}
            </p>

            <p>${parseFloat(order.amount).toFixed(2)}</p>
            <p>Items: {order.items.length}</p>
            <p>
              <span>&#x25cf;</span> <b>{order.status}</b>
            </p>

            <button onClick={() => handleViewDetails(order)}>View Details</button>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="order-details-popup">
          <div className="order-details-content">
            <h3>Order Details</h3>
            <p><b>Status:</b> {selectedOrder.status}</p>
            <p><b>Total Amount:</b> ${parseFloat(selectedOrder.amount).toFixed(2)}</p>
            <h4>Items:</h4>
            <ul>
              {selectedOrder.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} — Quantity: {item.quantity} — Price: ${parseFloat(item.price).toFixed(2)}
                </li>
              ))}
            </ul>

            <button onClick={handleCloseDetails}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;