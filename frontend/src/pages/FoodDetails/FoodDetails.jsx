import React from 'react';
import './FoodDetails.css'; 
import { assets } from '../../assets/assets'; // (Vẫn cần assets cho icon)

const FoodDetails = () => {

    return (
        <div className="food-details-page">
            {/* Tái sử dụng class 'food-details-loading' để căn giữa */}
            <div className="food-details-loading">
                
                {/* Bạn có thể dùng icon này hoặc xóa đi nếu muốn */}
                <img src={assets.parcel_icon} alt="Đang phát triển" style={{width: '80px', opacity: '0.5'}} />

                <h2 style={{fontSize: '24px', color: '#333'}}>Chức năng đang được phát triển!</h2>
                <p>Trang chi tiết sản phẩm sẽ sớm ra mắt. Vui lòng quay lại sau.</p>
            </div>
        </div>
    );
};

export default FoodDetails;