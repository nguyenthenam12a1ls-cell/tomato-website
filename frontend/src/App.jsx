import React , { useState, lazy, Suspense, useContext, useEffect } from 'react'
import Navbar from './pages/Navbar/Navbar';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer';
import LoginPopup from'./components/LoginPopup/LoginPopup';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; 
import { useAuth } from './Context/AuthContext'; 
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Chatbot from './components/Chatbot/Chatbot'; // Import Chatbot

const Cart = lazy(() => import('./pages/Cart/Cart'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder/PlaceOrder'));
const Verify = lazy(() => import('./pages/Verify/Verify'));
const MyOrders = lazy(() => import('./pages/MyOrders/MyOrders'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'));
const Delivery = lazy(() => import('./pages/Delivery/Delivery'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'));
const FoodDetails = lazy(() => import('./pages/FoodDetails/FoodDetails'));


const LoadingFallback = () => (
  <div className='verify' style={{minHeight: '60vh'}}>
    <div className='spinner'></div>
  </div>
);

const App = () => {
  const [showLogin,setShowLogin]=useState(false)
  const { token, setToken } = useAuth(); // Lấy cả token
  const [searchParams] = useSearchParams(); 

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, [searchParams, setToken]); 

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <ToastContainer autoClose={3000} position='top-center'/>
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>  
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<PlaceOrder/>}/>
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/delivery' element={<Delivery />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/food/:foodId' element={<FoodDetails />} />
        </Routes>
      </Suspense>
    </div>
    <Footer/>

    {/* Thêm Chatbot (chỉ hiển thị nếu đã đăng nhập) */}
    {token && <Chatbot />}
    
    </>
  )
}
export default App;