import React, { useRef } from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  const menuListRef = useRef(null);

  const scroll = (direction) => {
    if (menuListRef.current) {
      const scrollAmount = 300; // Amount to scroll
      menuListRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.
      </p>
      
      <div className="explore-menu-container">
        <i 
          className="fa fa-chevron-left explore-menu-arrow" 
          onClick={() => scroll('left')}
        ></i>

        <div className="explore-menu-list" ref={menuListRef}>
          {menu_list.map((item, index) => (
            <div 
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} 
              key={index} 
              className="explore-menu-list-item"
            >
              <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt={item.menu_name} />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>

        <i 
          className="fa fa-chevron-right explore-menu-arrow" 
          onClick={() => scroll('right')}
        ></i>
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;