// File: src/context/StoreContext.jsx (Cập nhật)

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  
  const url = "http://localhost:4000";
  const [token, setToken] = useState(null);

  // === BẮT ĐẦU THÊM MỚI ===
  // State mới để lưu dữ liệu admin
  const [adminData, setAdminData] = useState(null);

  // Hàm gọi API /getadmin
  const loadAdminData = async (token) => {
    try {
      // Gọi API với token trong headers
      const response = await axios.post(`${url}/api/user/getadmin`, {}, {
        headers: { token }
      });
      
      if (response.data.success) {
        setAdminData(response.data.data); // Lưu dữ liệu admin (name, email)
      } else {
        // Nếu API báo lỗi (vd: token hết hạn), thì xóa token
        console.log("Lỗi khi tải dữ liệu admin:", response.data.message);
        setToken(null); // Kích hoạt đăng xuất
      }
    } catch (error) {
      console.log("Lỗi API /getadmin:", error);
      setToken(null); // Kích hoạt đăng xuất
    }
  };
  // === KẾT THÚC THÊM MỚI ===

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // === THAY ĐỔI: Khi có token, gọi hàm tải dữ liệu admin ===
      loadAdminData(token);
    } else {
      localStorage.removeItem("token");
      setAdminData(null); // Xóa dữ liệu admin khi logout
    }
  }, [token]);

  useEffect(() => {
    const loadToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        // === THAY ĐỔI: Khi F5 và có token, cũng tải dữ liệu admin ===
        loadAdminData(storedToken); 
      }
    };
    loadToken();
  }, []);

  const contextValue = {
    url,
    token,
    setToken,
    // === THÊM MỚI: Cung cấp adminData cho app ===
    adminData, 
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;