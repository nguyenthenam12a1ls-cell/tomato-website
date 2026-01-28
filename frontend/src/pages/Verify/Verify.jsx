import React from 'react'
import "./Verify.css"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext'; // 1. Import AuthContext
import { useEffect } from 'react'
import axios from 'axios';


const Verify = () => {


    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")

    // 2. Dùng AuthContext
    const {url} = useContext(AuthContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        // 3. Dùng url
        const response = await axios.post(url+"/api/order/verify",{success,orderId});
        if (response.data.success){
            navigate("/myorders");
        }
        else {
            navigate("/")
        }
    }

    useEffect(()=>{
        verifyPayment();
    },[])
  return (
    <div className='verify'>
        <div className="spinner"></div>
    </div>
  )
}

export default Verify