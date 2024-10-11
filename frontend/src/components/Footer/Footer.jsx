import React, { useEffect } from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import $ from 'jquery';
import initializeNavbar from '../../utils/main';
import 'jquery.easing';

function Footer({setShowLogin}) {
  useEffect(() => {
    initializeNavbar(); // Initialize any jQuery or other scripts
  }, []);

  return (
    <div className="footer" id='footer'>
      <div className="footer-container">
        <div className="footer-section">
          <h4 className="footer-title">Company</h4>
          <p className='desc'>
            <b>Delicious Express</b> is a dynamic food service company offering a wide variety of fresh, 
            high-quality meals delivered directly to your door. Known for its diverse menu options, 
            including gourmet dishes, comfort foods, and healthy alternatives, Delicious Express combines
            convenience with culinary excellence. Whether you're looking for a quick lunch or a full dinner 
            experience, Delicious Express ensures fast, reliable service and a memorable dining experience every time.            
          </p>

        </div>
        <div className="footer-section">
          <h4 className="footer-title">Contact</h4>
          <p className="footer-contact"><i className="fa fa-map-marker-alt"></i> 123 Street, New York, USA</p>
          <p className="footer-contact"><i className="fa fa-phone-alt"></i> +012 345 67890</p>
          <p className="footer-contact"><i className="fa fa-envelope"></i> info@example.com</p>
          <div className="footer-social">
            <a className="footer-social-icon" href="#"><i className="fab fa-twitter"></i></a>
            <a className="footer-social-icon" href="#"><i className="fab fa-facebook-f"></i></a>
            <a className="footer-social-icon" href="#"><i className="fab fa-youtube"></i></a>
            <a className="footer-social-icon" href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">Opening</h4>
          <p className="footer-opening-hours">Monday - Saturday: 09AM - 09PM</p>
          <p className="footer-opening-hours">Sunday: 10AM - 08PM</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">Newsletter</h4>
          <p className="footer-description">Subscribe to our newsletter for the latest updates.</p>
          <div className="footer-newsletter">
            <input type="text" className="footer-input" placeholder="Your email" />
            <button className="footer-button" onClick={() => setShowLogin(true)}>Sign Up</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; 2024 Delicious Express, All Rights Reserved. Developed and Designed By <a href="#">AYOUB MAHMOUD</a>
        </p>
        <div className="footer-menu">
          <a href="#">Home</a>
          <a href="#">Cookies</a>
          <a href="#">Help</a>
          <a href="#">FAQs</a>
        </div>
      </div>
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
    </div>
  );
}

export default Footer;