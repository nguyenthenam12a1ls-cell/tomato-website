import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const url = "http://localhost:4000";
    const navigate = useNavigate();

    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: ['userProfile', token],
        queryFn: async () => {
            if (!token) return null;

            const response = await axios.get(url + "/api/user/profile", {
                headers: { token },
            });

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to load profile");
            }

            return response.data.data;
        },
        enabled: !!token,
        retry: 1,
    });

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.token = token;
                }
                return config;
            },
            (requestError) => Promise.reject(requestError)
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (responseError) => {
                if (
                    responseError.response &&
                    (
                        responseError.response.status === 401 ||
                        responseError.response.data.message === "Error in Auth Middleware (Token invalid or expired)"
                    )
                ) {
                    console.log("Token het han hoac khong hop le, dang tu dong dang xuat.");
                    logout();
                }
                return Promise.reject(responseError);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [token, navigate]);

    const contextValue = {
        token,
        setToken,
        url,
        logout,
        user,
        isUserLoading: isLoading,
        isUserError: isError,
        userError: error,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
