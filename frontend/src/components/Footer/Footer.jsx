import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom' 

const Footer = () => {
  return (
    
    <div className='footer' id='footer'>  
        <div className="footer-content">  
            <div className="footer-content-left">  
                <img src={assets.logo} alt="" />  
                <p>Sứ mệnh của Tomato là mang đến những bữa ăn ngon, chất lượng từ nguyên liệu tươi sạch nhất đến tận tay bạn. Chúng tôi tin rằng ẩm thực là cầu nối, và mỗi món ăn là một trải nghiệm đáng nhớ.</p>
                <div className="footer-social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src={assets.facebook_icon} alt="Facebook" /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><img src={assets.twitter_icon} alt="Twitter" /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><img src={assets.linkedin_icon} alt="LinkedIn" /></a>
                </div> 
            </div>   
            <div className="footer-content-center">  
                <h2>COMPANY</h2>
                <ul>
                    <Link to='/'><li>Trang chủ</li></Link>
                    {/* --- SỬA 3 DÒNG NÀY --- */}
                    <Link to='/about-us'><li>Về chúng tôi</li></Link>
                    <Link to='/delivery'><li>Vận chuyển</li></Link>
                    <Link to='/privacy-policy'><li>Chính sách pháp lý</li></Link>
                </ul>
            </div>  
            <div className="footer-content-right">  
            <h2> GET IN TOUCH</h2>
            <ul>
                <li><a href="tel:+9112345678">+91-1234-5678</a></li>
                <li><a href="mailto:contact@tomato.com">contact@tomato.com</a></li>
            </ul>
            </div>  
        </div>  
        <hr/>
        <p className="footer-copyright">Copyright 2025 - All Right Reserved.</p>
    </div>  
   
  )
}

export default Footer