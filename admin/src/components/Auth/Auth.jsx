import React, { useState, useContext } from 'react';
import './Auth.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext'; 
import { assets } from '../../assets/assets'; // 1. Import assets

const Auth = () => {
    
    const { url, setToken } = useContext(StoreContext);
    
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(data => ({ ...data, [name]: value }));
    }

    const onLogin = async (event) => {
        event.preventDefault();

        const endpoint = currState === "Login" ? "login" : "register";
        
        try {
            const response = await axios.post(`${url}/api/user/${endpoint}`, data);

            if (response.data.success) {
                setToken(response.data.token); 
                toast.success(currState === "Login" ? "Đăng nhập thành công" : "Đăng ký thành công");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi kết nối, vui lòng thử lại.");
        }
    }

    return (
        <div className='auth'>
            <form className="auth-container" onSubmit={onLogin}>
                
                {/* 2. THÊM LOGO VÀO POPUP */}
                <div className="auth-header">
                    <img src={assets.logo} alt="Logo" />
                    <h2>{currState === "Login" ? "Admin Login" : "Admin Sign Up"}</h2>
                </div>

                <div className="auth-inputs">
                    {currState === "Sign Up" && (
                        <input 
                            name='name' 
                            onChange={onChangeHandler} 
                            value={data.name} 
                            type="text" 
                            placeholder='Your Name' 
                            required 
                        />
                    )}
                    <input 
                        name='email' 
                        onChange={onChangeHandler} 
                        value={data.email} 
                        type="email" 
                        placeholder='Your Email' 
                        required 
                    />
                    <input 
                        name='password' 
                        onChange={onChangeHandler} 
                        value={data.password} 
                        type="password" 
                        placeholder='Password' 
                        required 
                    />
                </div>
                
                {/* 3. THÊM LOGIC ẨN/HIỆN CHECKBOX */}
                {currState === "Sign Up" && (
                    <div className="auth-condition">
                        <input type="checkbox" required />
                        <p>By continuing, I agree to the terms of use & privacy policy.</p>
                    </div>
                )}
                
                <button type='submit' className='auth-submit-btn'>
                    {currState === "Sign Up" ? "Create Account" : "Login"}
                </button>

                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default Auth;