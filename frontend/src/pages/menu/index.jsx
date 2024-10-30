// src/pages/menu/index.jsx
import React from 'react';
import './menu.css';
import orangeChickenImg from './orangechicken.jpeg';
import broccoliBeefImg from './broccoli_beef.jpeg';
import pandaImg from './panda.jpg';
import eggrollImg from './eggroll.jpg';
import rangoonsImg from './grid_Rangoons.jpg';
import chickenFeetImg from './chickenfeet.jpg';

// Data for each section
const sizes = [
  { name: 'Cub Meal', description: '1 Jr. entrée, 1 Jr. side', calories: '330-1000' },
  { name: 'Bowl', description: '1 entrée & 1 side', calories: '394 - 1,105' },
  { name: 'Plate', description: '2 entrées & 1 side', calories: '544 - 1,595' },
  { name: 'Bigger Plate', description: '3 entrées & 1 side', calories: '694 - 2,085' },
];

const entrees = [
  { name: 'Orange Chicken', calories: 490, image: orangeChickenImg, isSpicy: true },
  { name: 'Broccoli Beef', calories: 150, image: broccoliBeefImg, isGlutenFree: true },
  // Add more entrees as needed
];

const sides = [
  { name: 'Chow Mein', calories: 510 },
  { name: 'Fried Rice', calories: 520 },
  { name: 'Mixed Vegetables', calories: 170 },
  { name: 'White Steamed Rice', calories: 380 },
  // Add more sides as needed
];

const appetizers = [
  { name: 'Egg Roll', calories: 200, image: eggrollImg },
  { name: 'Rangoons', calories: 190, image: rangoonsImg },
  // Add more appetizers as needed
];

const featuredItems = [
  { name: 'Chicken Feet', calories: 250, image: chickenFeetImg },
  // Add more featured items if needed
];

const mostPopularItems = [
  { name: 'Beijing Beef', calories: 470, image: broccoliBeefImg, isSpicy: true },
  // Add more popular items as needed
];

function Menu() {
  return (
    <div className="menu-container">
      {/* Hero Section */}
      <div className="menu-hero">
        <img src={pandaImg} alt="Panda Express" className="menu-logo" />
      </div>

      {/* Sizes Section */}
      <h2 className="menu-section-title">Meal Sizes</h2>
      <div className="menu-sizes">
        {sizes.map((size, index) => (
          <div key={index} className="size-card">
            <h3 className="size-name">{size.name}</h3>
            <p className="size-description">{size.description}</p>
            <p className="size-calories">{size.calories} calories</p>
          </div>
        ))}
      </div>

      {/* Entrée Section */}
      <h2 className="menu-section-title">Entrée Choices</h2>
      <div className="menu-grid">
        {entrees.map((item, index) => (
          <div key={index} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-card-image" />
            <h3 className="menu-card-name">{item.name}</h3>
            <p className="menu-card-calories">{item.calories} calories</p>
            <div className="menu-card-tags">
              {item.isSpicy && <span className="tag spicy">Spicy 🌶️</span>}
              {item.isGlutenFree && <span className="tag gluten-free">Gluten-Free 🌾</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Sides Section */}
      <h2 className="menu-section-title">Side Choices</h2>
      <div className="menu-grid">
        {sides.map((side, index) => (
          <div key={index} className="menu-card">
            <h3 className="menu-card-name">{side.name}</h3>
            <p className="menu-card-calories">{side.calories} calories</p>
          </div>
        ))}
      </div>

      {/* Appetizers Section */}
      <h2 className="menu-section-title">Appetizers</h2>
      <div className="menu-grid">
        {appetizers.map((item, index) => (
          <div key={index} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-card-image" />
            <h3 className="menu-card-name">{item.name}</h3>
            <p className="menu-card-calories">{item.calories} calories</p>
          </div>
        ))}
      </div>

      {/* Featured Items Section */}
      <h2 className="menu-section-title">Featured Items</h2>
      <div className="menu-grid">
        {featuredItems.map((item, index) => (
          <div key={index} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-card-image" />
            <h3 className="menu-card-name">{item.name}</h3>
            <p className="menu-card-calories">{item.calories} calories</p>
          </div>
        ))}
      </div>

      {/* Most Popular Items Section */}
      <h2 className="menu-section-title">Most Popular Items</h2>
      <div className="menu-grid">
        {mostPopularItems.map((item, index) => (
          <div key={index} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-card-image" />
            <h3 className="menu-card-name">{item.name}</h3>
            <p className="menu-card-calories">{item.calories} calories</p>
            <div className="menu-card-tags">
              {item.isSpicy && <span className="tag gluten-free">Gluten-Free 🌾</span>}
              {item.isGlutenFree && <span className="tag gluten-free">Gluten-Free 🌾</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
