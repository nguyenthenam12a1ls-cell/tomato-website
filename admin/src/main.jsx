import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
// 1. Import KHÔNG CÓ DẤU {}
import StoreContextProvider from './context/StoreContext' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* 2. <App /> PHẢI NẰM BÊN TRONG <StoreContextProvider> */}
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </BrowserRouter>
  ,
)