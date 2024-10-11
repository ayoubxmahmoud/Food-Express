import React from 'react';
import './Header.css'; // Import your custom CSS file
import { assets } from '../../assets/assets';

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-content">
        <div className="header-row">
          <div className="header-text">
            <h1 className="header-title">Enjoy Our<br />Delicious Meal</h1>
            <ul className="header-list">
              <li>Best Quality Ingredients</li>
              <li>World's Best Chef</li>
              <li>Fastest Food Delivery</li>
            </ul>
            <a href="#explore-menu">View Menu</a>
          </div>
          <div className="header-image">
            <img className="image-fluid" src={assets.hero} alt="Hero" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;