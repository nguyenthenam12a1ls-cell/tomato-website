import React from 'react'
import './Header.css'

const Header = () => {
  return (
    // Ảnh nền sẽ được áp dụng ở đây
    <div className='header'>
        {/* Nội dung sẽ được căn giữa bằng Flexbox */}
        <div className='header-contents'>
            <h2>Đặt món bạn yêu thích ngay tại đây</h2>
            <p>Hãy lựa chọn từ thực đơn đa dạng với vô số món ăn thơm ngon, được chế biến từ những nguyên liệu hảo hạng và tinh hoa ẩm thực. Sứ mệnh của chúng ta là thỏa mãn mọi cơn thèm ăn của bạn và nâng tầm trải nghiệm ẩm thực — từng bữa ăn ngon lành một.</p>
            <a href='#explore-menu' className='header-btn'>View Menu</a>
        </div>
    </div>
  )
}

export default Header;