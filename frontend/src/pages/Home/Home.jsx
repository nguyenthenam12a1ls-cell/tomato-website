import React, { useState, useContext, useEffect } from 'react'
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import FlashSale from '../../components/FlashSale/FlashSale';
import FeaturedRestaurants from '../../components/FeaturedRestaurants/FeaturedRestaurants';
import PromoBanners from '../../components/PromoBanners/PromoBanners';
import PersonalizedRecommendations from '../../components/PersonalizedRecommendations/PersonalizedRecommendations';
import { CartContext } from '../../Context/CartContext'; 

const Home = () => {

  const [category,setCategory]=useState("All");
  const { searchTerm } = useContext(CartContext);
  const isSearching = searchTerm.length > 0;

  useEffect(() => {
    if (isSearching) {
      setCategory("All");
    }
  }, [searchTerm]); 

  return (
    <div className="bg-background min-h-screen pt-4 pb-12">
      {!isSearching ? (
        <>
          <Header/>
          <ExploreMenu category={category} setCategory={setCategory}/>
          <FlashSale />
          <FeaturedRestaurants setCategory={setCategory} />
          <FoodDisplay category={category}/>
          <PromoBanners />
          <PersonalizedRecommendations />
        </>
      ) : (
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 pt-28">
          <h2 className="text-headline-md font-headline-md font-bold text-on-surface mb-6">Kết quả tìm kiếm cho: "{searchTerm}"</h2>
          <FoodDisplay category={category}/>
        </div>
      )}

      <AppDownload/>
    </div>
  )
}

export default Home;