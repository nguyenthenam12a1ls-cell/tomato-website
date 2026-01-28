import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import axios from 'axios'; 

export const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
}

const AuthContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // 1. Khởi tạo token từ localStorage
    const url = "http://localhost:4000"; 
    const navigate = useNavigate();

    // Dùng useQuery để tự động lấy thông tin user
    const { data: user } = useQuery({
        queryKey: ['userProfile', token],
        queryFn: async () => {
            if (token) {
                const response = await axios.get(url + "/api/user/profile", { headers: { token } });
                return response.data.data;
            }
            return null; 
        },
        enabled: !!token, 
        retry: 1 
    });

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    // Cập nhật localStorage khi token thay đổi
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // --- 2. THÊM BỘ "GÁC CỔNG" (INTERCEPTOR) ---
    useEffect(() => {
        // Đây là "gác cổng" cho Request (Yêu cầu đi)
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers['token'] = token;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Đây là "gác cổng" cho Response (Phản hồi về)
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response, // Nếu OK, cho đi qua
            (error) => {
                // Nếu backend báo lỗi (ví dụ: Token hết hạn)
                if (error.response && (error.response.status === 401 || error.response.data.message === "Error in Auth Middleware (Token invalid or expired)")) {
                    // Tự động đăng xuất user
                    console.log("Token hết hạn hoặc không hợp lệ, đang tự động đăng xuất.");
                    logout(); // Gọi hàm logout
                }
                return Promise.reject(error);
            }
        );

        // Dọn dẹp interceptor khi component bị hủy
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [token, navigate]); // Chạy lại nếu token thay đổi

    const contextValue = {
        token,
        setToken,
        url,
        logout,
        user 
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;