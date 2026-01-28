import React, { useContext } from 'react' 
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Auth from './components/Auth/Auth'
import Edit from './pages/Edit/Edit'
import Dashboard from './pages/Dashboard/Dashboard'
import { StoreContext } from './context/StoreContext' 

const App = () => {
  
  const { token } = useContext(StoreContext);

  if (!token) {
    return (
      <>
        <ToastContainer />
        <Auth />
      </>
    )
  }

  return (
    <div>
      <ToastContainer />
      <Navbar />
      {/* <hr /> <-- ĐÃ XÓA DÒNG NÀY */}
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path='/' element={<Dashboard />}/> 
          <Route path='/add' element={<Add />}/>
          <Route path='/list' element={<List />}/>
          <Route path='/orders' element={<Orders />}/>
          <Route path='/edit/:foodId' element={<Edit />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App