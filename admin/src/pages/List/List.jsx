import React, { useEffect, useState, useContext } from 'react'
import './List.css'
import axios from "axios"
import {toast} from "react-toastify"
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext' 
import { assets } from '../../assets/assets' // 1. Import assets

const List = () => { 

  const { url } = useContext(StoreContext); 
  const [list,setList]=useState([]);

  const fetchList=async ()=>{
    const response=await axios.get(`${url}/api/food/list`);
    if(response.data.success){
      setList(response.data.data)
    }
    else{
      toast.error("Error")
    }
  }

  const removeFood= async (foodId)=>{
    const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
    await fetchList();
    if(response.data.success){
      toast.success(response.data.message);
    }
    else{
      toast.error("Error");
    }
  }

  useEffect(()=>{
    fetchList();
  },[url]) // 2. Thêm [url] vào dependency array


  return (
    // 3. THÊM CLASS 'list-container' BỌC BÊN NGOÀI
    <div className='list add'>
      <div className="list-container">
        <p className='list-title'>All Foods List</p>
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>
          {list.map((item,index)=>{
            return(
              <div key={index} className="list-table-format">
                <img className='list-item-image' src={`${url}/images/`+item.image} alt=''/>
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                {/* 4. NÂNG CẤP ICON ACTION */}
                <div className="action-icons">
                  <Link to={`/edit/${item._id}`}>
                    <img className='action-icon' src="/src/assets/edit_icon.png" alt="Edit" />
                  </Link>
                  <img onClick={()=>removeFood(item._id)} className='action-icon' src="/src/assets/close_icon.png" alt="Delete" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default List