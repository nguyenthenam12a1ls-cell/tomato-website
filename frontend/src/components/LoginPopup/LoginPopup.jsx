import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import {assets} from '../../assets/assets'
import { useAuth } from '../../Context/AuthContext'
import axios from "axios"
import { useNavigate } from 'react-router-dom' 

const LoginPopup = ({setShowLogin}) => {

    const {url, setToken} = useAuth();
    const [currState,setCurrState]=useState("Sign-Up")
    const [data,setData] =useState({
        name:"",
        email:"",
        password:""
    })
    const navigate = useNavigate(); 

    const onChangeHandler=(event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data =>({...data,[name]:value}))
    }

    const OnLogin = async (event)=>{
        event.preventDefault()
        let newUrl= url;
        if (currState==="Login") {
            newUrl +="/api/user/login"
        }
        else{
            newUrl +="/api/user/register"
        }

        const response =await axios.post(newUrl,data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token",response.data.token)
            setShowLogin(false)
        }
        else{
            alert(response.data.message)
        }
    }

    const googleAuth = () => {
        window.location.href = `${url}/api/user/auth/google`;
    }

    return (
        <div className='login-popup'>
            <div className='login-popup-container'>
                <div className='login-popup-title'>
                    <h2>{currState}</h2>
                    <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=''></img>
                </div>

                <button type="button" className="login-popup-google-btn" onClick={googleAuth}>
                    <img src="/src/assets/google_icon.png" alt="Google" /> 
                    Tiếp tục với Google
                </button>

                <div className="login-popup-divider">
                    <span>hoặc</span>
                </div>
                
                <form onSubmit={OnLogin} className="login-popup-email-form">
                    <div className="login-popup-inputs">
                        {currState==="Login"?<></>:<input name='name' onChange={onChangeHandler}  value={data.name} type='text' placeholder='Your Name' required/>}     
                        <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Your Email' required/>
                        <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='Password' required/>
                    </div>
                    
                    {currState==="Sign-Up" && (
                        <div className="login-popup-condition">
                            <input type='checkbox' required></input>
                            <p>By continuing, I agree to the terms of use & privacy policy.</p>
                        </div>
                    )}

                    <button type='submit'>{currState==="Sign-Up"?"Create Account":"Login"}</button>
                </form>
           
                {currState==="Login"
                    ? (
                        <div>
                            <p>Create a new account? <span onClick={()=>setCurrState("Sign-Up")}>Click here</span></p>
                            <p className="forgot-password-link">
                                Forgot password? <span onClick={() => {
                                    setShowLogin(false);
                                    navigate('/forgot-password');
                                }}>Click here</span>
                            </p>
                        </div>
                    )
                    :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
                }
            </div>
        </div>
    )
}

export default LoginPopup