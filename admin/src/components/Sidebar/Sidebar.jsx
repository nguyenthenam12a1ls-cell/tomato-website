// File: src/components/Sidebar/Sidebar.jsx (Cập nhật)

import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
    <div className="sidebar-options">
        {/* === BẮT ĐẦU THÊM MỚI === */}
        <NavLink  to='/' end className="sidebar-option"> 
            {/* 'end' prop rất quan trọng để nó không luôn 'active' */}
            <img src={assets.add_icon} alt="" /> {/* (Bạn có thể đổi icon) */}
            <p>Dashboard</p>
        </NavLink>
        {/* === KẾT THÚC THÊM MỚI === */}

        <NavLink  to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/list'className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
        </NavLink >
        <NavLink to='/orders'className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink >
    </div>
    </div>
  )
}

export default Sidebar