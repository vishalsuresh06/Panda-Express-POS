// src/pages/menu/index.jsx
import React from 'react';
import './menu.css';
import orangeChickenImg from './orangechicken.PNG';
import blackPepperSteakImg from './black_pepper_steak.PNG';
import honeyWalnutShrimpImg from './honey_walnut_shrimp.PNG';
import teriyakiChickenImg from './teriyaki_chicken.PNG';
import broccoliBeefImg from './broccoli_beef.PNG';
import kungPaoChickenImg from './kung_pao_chicken.PNG';
import honeySesameChickenImg from './honey_sesame_chicken.PNG';
import beijingBeefImg from './beijing_beef.PNG';
import mushroomChickenImg from './mushroom_chicken.PNG';
import sweetfireChickenImg from './sweetfire_chicken.PNG';
import stringBeanChickenImg from './string_bean_chicken.PNG';
import blackPepperChickenImg from './black_pepper_chicken.PNG';
import chowMeinImg from './chow_mein.PNG';
import friedRiceImg from './fried_rice.PNG';
import whiteRiceImg from './white_rice.PNG';
import superGreensImg from './super_greens.PNG';
import fountainDrinkImg from './fountain_drink.png';
import waterImg from './water.png';
import gatoradeImg from './gatorade.png';
import veggieSpringRollImg from './veggie_spring_roll.PNG';
import chickenEggRollImg from './chicken_egg_roll.PNG';
import creamCheeseRangoonImg from './cream_cheese_rangoon.PNG';
import applePieRollImg from './apple_pie_roll.png';
import chickenFeetImg from './chickenfeet.jpg';
import aLaCarteImg from './A_La_Carte.png';
import biggerImg from './Bigger.png';
import bowlImg from './Bowl.png';
import cateringImg from './Catering.png';
import cubImg from './cub.png';
import plateImg from './Plate.png';
import pandaImg from './panda.jpg';

// Data for each section
const sizes = [
  { name: 'Cub Meal', description: '$6.60+ • 1 Jr. entrée, 1 Jr. side', calories: '330-1000', image: cubImg },
  { name: 'Bowl', description: '$8.30 • 1 entrée & 1 side', calories: '394 - 1,105', image: bowlImg },
  { name: 'Plate', description: '$9.80+ • 2 entrées & 1 side', calories: '544 - 1,595', image: plateImg },
  { name: 'Bigger Plate', description: '$11.30 • 3 entrées & 1 side', calories: '694 - 2,085', image: biggerImg },
  { name: 'Catering', description: 'Large portions for events', calories: 'Varies', image: cateringImg },
  { name: 'A La Carte', description: '$4.40+ • 1 entrée', calories: 'Varies', image: aLaCarteImg },
];

const entrees = [
  { name: 'Orange Chicken', calories: 490, image: orangeChickenImg, isSpicy: true },
  { name: 'Black Pepper Sirloin Steak', calories: 400, image: blackPepperSteakImg, isSpicy: true, isPremium: true },
  { name: 'Honey Walnut Shrimp', calories: 360, image: honeyWalnutShrimpImg, isPremium: true },
  { name: 'Grilled Teriyaki Chicken', calories: 300, image: teriyakiChickenImg },
  { name: 'Broccoli Beef', calories: 150, image: broccoliBeefImg, isGlutenFree: true },
  { name: 'Kung Pao Chicken', calories: 290, image: kungPaoChickenImg, isSpicy: true },
  { name: 'Honey Sesame Chicken Breast', calories: 420, image: honeySesameChickenImg },
  { name: 'Beijing Beef', calories: 470, image: beijingBeefImg, isSpicy: true },
  { name: 'Mushroom Chicken', calories: 170, image: mushroomChickenImg },
  { name: 'Sweetfire Chicken Breast', calories: 380, image: sweetfireChickenImg, isSpicy: true },
  { name: 'String Bean Chicken Breast', calories: 240, image: stringBeanChickenImg },
  { name: 'Black Pepper Chicken', calories: 280, image: blackPepperChickenImg },
];

const sides = [
  { name: 'Chow Mein', calories: 510, image: chowMeinImg },
  { name: 'Fried Rice', calories: 520, image: friedRiceImg },
  { name: 'White Steamed Rice', calories: 380, image: whiteRiceImg },
  { name: 'Super Greens', calories: 170, image: superGreensImg },
];

const drinks = [
  { name: 'Fountain Drink', price: '$3.00', calories: 'Varies', image: fountainDrinkImg },
  { name: 'Water', price: '$1.50', calories: 0, image: waterImg },
  { name: 'Gatorade', price: '$3.00', calories: 140, image: gatoradeImg },
];

const appetizers = [
  { name: 'Veggie Spring Roll', price: '$2.00', calories: 190, image: veggieSpringRollImg },
  { name: 'Chicken Egg Roll', price: '$2.00', calories: 200, image: chickenEggRollImg },
  { name: 'Cream Cheese Rangoon', price: '$2.00', calories: 190, image: creamCheeseRangoonImg },
  { name: 'Apple Pie Roll', price: '$2.00', calories: 300, image: applePieRollImg },
];

const featuredItems = [
  { name: 'Chicken Feet', calories: 250, image: chickenFeetImg },
];

const mostPopularItems = [
  { name: 'Orange Chicken', calories: 490, image: orangeChickenImg, isSpicy: true },
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
          <div key={index} className="menu-size-card">
            <img src={size.image} alt={size.name} className="menu-card-image" />
            <h3 className="menu-size-name">{size.name}</h3>
            <p className="menu-size-description">{size.description}</p>
            <p className="menu-size-calories">{size.calories} calories</p>
          </div>
        ))}
      </div>

      {/* Entrée Section */}
      <h2 className="menu-section-title">Entrée Choices</h2>
      <div className="menu-grid">
        {entrees.map((item, index) => (
          <div key={index} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-card-image" />
            <div className="menu-card-content">
              <h3 className="menu-card-name">{item.name}</h3>
              <p className="menu-card-calories">{item.calories} calories</p>
              <div className="menu-card-tags">
                {item.isSpicy && <span className="menu-tag spicy">Spicy 🌶️</span>}
                {item.isGlutenFree && <span className="menu-tag gluten-free">Gluten-Free 🌾</span>}
                {item.isPremium && <span className="menu-tag premium">Premium 💎</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sides Section */}
      <h2 className="menu-section-title">Side Choices</h2>
      <div className="menu-sides">
        {sides.map((side, index) => (
          <div key={index} className="menu-side-card">
            <img src={side.image} alt={side.name} />
            <h3>{side.name}</h3>
            <p>{side.calories} calories</p>
          </div>
        ))}
      </div>

      {/* Drinks Section */}
      <h2 className="menu-section-title">Drinks</h2>
      <div className="menu-drinks">
        {drinks.map((drink, index) => (
          <div key={index} className="menu-drink-card">
            <img src={drink.image} alt={drink.name} />
            <h3>{drink.name}</h3>
            <p>{drink.price}</p>
            <p>{drink.calories} calories</p>
          </div>
        ))}
      </div>

      {/* Appetizers Section */}
      <h2 className="menu-section-title">Appetizers</h2>
      <div className="menu-appetizers">
        {appetizers.map((item, index) => (
          <div key={index} className="menu-appetizer-card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <p>{item.calories} calories</p>
          </div>
        ))}
      </div>

      {/* Featured Items Section */}
      <h2 className="menu-section-title">Featured Items</h2>
      <div className="menu-grid">
        {featuredItems.map((item, index) => (
          <div key={index} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-card-image" />
            <div className="menu-card-content">
              <h3 className="menu-card-name">{item.name}</h3>
              <p className="menu-card-calories">{item.calories} calories</p>
            </div>
          </div>
        ))}
      </div>

      {/* Most Popular Items Section */}
      <h2 className="menu-section-title">Most Popular Items</h2>
      <div className="menu-grid">
        {mostPopularItems.map((item, index) => (
          <div key={index} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-card-image" />
            <div className="menu-card-content">
              <h3 className="menu-card-name">{item.name}</h3>
              <p className="menu-card-calories">{item.calories} calories</p>
              {item.isSpicy && <span className="menu-tag spicy">Spicy 🌶️</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
