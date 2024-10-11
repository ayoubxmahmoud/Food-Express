import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import initializeNavbar from '../../utils/main';
import $ from 'jquery';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile menu
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    useEffect(() => {
        initializeNavbar(); // Initialize any jQuery or other scripts

        // Cleanup function to remove event listeners on component unmount
        return () => {
            $(window).off('scroll');
        };
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen); // Toggle mobile menu visibility
    };

    return (
        <div className={`navbar bg-dark navbar-collapse ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>

            <Link to='/' className='title'><img src={assets.logo} alt="" className='logo' />Delicious Express</Link>
            <ul className={`navbar-menu ${mobileMenuOpen ? 'show' : ''}`}>
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>HOME</Link>
                <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>MENU</a>
                <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>MOBILE-APP</a>
                <Link to='/contact' href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>CONTACT US</Link>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="" />
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token ? <button className='login-button' onClick={() => setShowLogin(true)}>Login</button>
                    : <div className="navbar-profile">
                        <img src={assets.profile_icon} alt="" />
                        <ul className='nav-profile-dropdown'>
                            <li onClick={() => navigate("/myorders")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                            <hr />
                            <li onClick={() => navigate("/profile")}><img src={assets.avatar} alt="" /><p>Profile</p></li>
                            <hr />
                            <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                        </ul>
                    </div>
                }
            </div>
            <button className="navbar-toggler" type="button" onClick={toggleMobileMenu}>
                    <span className="fa fa-bars"></span>
            </button>
        </div>
    )
}

export default Navbar;