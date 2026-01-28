import React from 'react'
import './ExploreMenu.css'
import {menu_list} from '../../assets/assets.js'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Khám phá thực đơn của chúng tôi</h1>
        <p className='explore-menu-text'>Khám phá thực đơn đa dạng với nhiều món ăn hấp dẫn. Sứ mệnh của chúng tôi là thỏa mãn vị giác và nâng tầm trải nghiệm ẩm thực của bạn qua từng bữa ăn ngon.</p>
        
        <div className='explore-menu-list'>
            {menu_list.map((item,index)=>{
                return (
                    // Chuyển class "active" ra div cha
                    <div 
                      onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} 
                      key={index} 
                      className={category===item.menu_name ? 'explore-menu-list-item active' : 'explore-menu-list-item'}
                    >
                        <img src={item.menu_image} alt=''/>
                        <p>{item.menu_name}</p>
                    </div>
                )
            })
            }
        </div>
        <hr></hr>
    </div>
  )
}

export default ExploreMenu;