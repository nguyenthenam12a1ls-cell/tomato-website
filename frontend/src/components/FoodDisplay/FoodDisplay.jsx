import React, { useContext } from 'react'
import './FoodDisplay.css'
// 1. CẬP NHẬT IMPORT CONTEXT (Đã sửa ở các bước trước)
import { CartContext } from '../../Context/CartContext.jsx' 
import FoodItem from '../FoodItem/FoodItem'

// 2. THÊM PROP 'excludeId = null'
const FoodDisplay = ({ category, excludeId = null }) => {

    const { food_list } = useContext(CartContext)
  return (

    <div className='food-display' id='food-display'>
        <h2>Top món ngon gần bạn</h2>
        <div className="food-display-list">
            {food_list.map((item, index)=>{
                
                // 3. THÊM ĐIỀU KIỆN LỌC (item._id !== excludeId)
                if ((category==="All" || category===item.category) && (item._id !== excludeId)) {

                  return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
                }
            })}
        </div>
    </div>
  )
}

export default FoodDisplay;