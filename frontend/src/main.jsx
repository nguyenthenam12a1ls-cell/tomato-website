import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
// 1. Import 2 Context Provider mới
import AuthContextProvider from './Context/AuthContext.jsx'
import CartContextProvider from './Context/CartContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}> 
      {/* 2. Bọc Auth bên ngoài */}
      <AuthContextProvider>
        {/* 3. Bọc Cart bên trong (vì CartContext cần token từ AuthContext) */}
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </BrowserRouter>
);