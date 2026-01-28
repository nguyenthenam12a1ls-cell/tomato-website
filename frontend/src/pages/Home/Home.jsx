import React, { useState, useContext, useEffect } from 'react' // Thêm useContext, useEffect
import './Home.css'
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import { CartContext } from '../../Context/CartContext'; // 1. Import Context

const Home = () => {

  const [category,setCategory]=useState("All");

  // 2. Lấy searchTerm từ Context
  const { searchTerm } = useContext(CartContext);

  // 3. Tạo biến (boolean) để biết người dùng có đang tìm kiếm không
  const isSearching = searchTerm.length > 0;

  // 4. Tự động set Category về "All" khi người dùng bắt đầu tìm kiếm
  useEffect(() => {
    if (isSearching) {
      setCategory("All");
    }
  }, [searchTerm]); // Chạy lại khi searchTerm thay đổi

  return (
    <div>
      {/* 5. Chỉ hiển thị Header và ExploreMenu nếu KHÔNG tìm kiếm */}
      {!isSearching && (
        <>
          <Header/>
          <ExploreMenu category={category} setCategory={setCategory}/>
        </>
      )}

      {/* 6. Hiển thị tiêu đề "Kết quả" nếu ĐANG tìm kiếm */}
      {isSearching && (
        <div className='search-results-title'>
          <h2>Kết quả tìm kiếm cho: "{searchTerm}"</h2>
        </div>
      )}

      {/* FoodDisplay luôn luôn hiển thị */}
      <FoodDisplay category={category}/>
      
      <AppDownload/>
    </div>
  )
}

export default Home;