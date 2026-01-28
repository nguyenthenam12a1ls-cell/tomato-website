import React from 'react'
import "./AppDownload.css"
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
      <div className="app-download-content">
        <h2>Đặt hàng nhanh hơn,<br /> ưu đãi độc quyền</h2>
        <p>Tải ứng dụng Tomato để trải nghiệm đặt hàng liền mạch, theo dõi đơn hàng thời gian thực và nhận hàng ngàn ưu đãi chỉ có trên app.</p>
        <div className='app-download-platforms'>
          <a href="#/" target="_blank" rel="noopener noreferrer">
            <img src={assets.play_store} alt='Play Store'/>
          </a>
          <a href="#/" target="_blank" rel="noopener noreferrer">
            <img src={assets.app_store} alt='App Store'/>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AppDownload