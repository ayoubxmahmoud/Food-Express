import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Header from './components/Header/Header'
import Contact from './pages/Contact/Contact'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile/Profile'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [header, setHeader] = useState(true)
  return (
    <>
    <ToastContainer />
    {showLogin?<LoginPopup setShowLogin={setShowLogin} />:<></>}
      <Navbar setShowLogin={setShowLogin} />
      { header ? <Header /> : <></>}
      <div className='app'>
        <Routes>
          <Route path='/' element={<Home setHeader={setHeader} />}/>
          <Route path='/cart' element={<Cart setHeader={setHeader} />}/>
          <Route path='/order' element={<PlaceOrder setHeader={setHeader} />}/>
          <Route path='/verify' element={<Verify setHeader={setHeader} />}/>
          <Route path='/myorders' element={<MyOrders setHeader={setHeader} />}/>
          <Route path='/contact'  element={<Contact setHeader={setHeader} setShowLogin={setShowLogin} />}/>
          <Route path='/profile' element={<Profile setHeader={setHeader} />}/>
        </Routes>
      </div>
      <Footer setShowLogin={setShowLogin} />
    </>

  )
}

export default App