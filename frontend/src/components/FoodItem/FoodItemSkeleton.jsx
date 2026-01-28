import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import CSS của thư viện
import './FoodItem.css'; // Dùng chung CSS với FoodItem để lấy layout

const FoodItemSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="food-item">
        <div className="food-item-img-container">
          {/* Hình ảnh */}
          <Skeleton height="100%" style={{ aspectRatio: '1', borderRadius: '15px 15px 0px 0px' }} />
        </div>
        <div className="food-item-info">
          <div className="food-item-name-rating">
            {/* Tên món ăn */}
            <Skeleton width="70%" height={24} />
            {/* Rating stars */}
            <Skeleton width={70} height={18} />
          </div>
          {/* Mô tả */}
          <Skeleton count={2} height={16} style={{ marginTop: '10px' }} />
          {/* Giá tiền */}
          <Skeleton width="40%" height={28} style={{ marginTop: '10px' }} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default FoodItemSkeleton;