import React, { useEffect, useState } from "react";
import axios from "axios";
import "./menu.css";

const SizesFeaturedPopular = () => {
  // Hardcoded sizes data with descriptions
  const sizes = [
    {
      name: "Bowl",
      price: "$7.50",
      image: "/media/food_images/Bowl.png",
      description: "One side and one entree.",
    },
    {
      name: "Plate",
      price: "$9.50",
      image: "/media/food_images/Plate.png",
      description: "One side and two entrees.",
    },
    {
      name: "Bigger Plate",
      price: "$11.30",
      image: "/media/food_images/Bigger.png",
      description: "One side and three entrees.",
    },
    {
      name: "Family Feast",
      price: "$39.00",
      image: "/media/food_images/Catering.png",
      description: "Large portions for sharing.",
    },
    {
      name: "Cub Meal",
      price: "$6.00",
      image: "/media/food_images/cub.png",
      description: "Perfect size for kids.",
    },
    {
      name: "A La Carte",
      price: "$7.50",
      image: "/media/food_images/A_La_Carte.png",
      description: "Single serving of your favorite item.",
    },
  ];

  const [featuredItem, setFeaturedItem] = useState(null);
  const [popularItem, setPopularItem] = useState(null);
  const [error, setError] = useState(null);

  // Fetch Featured and Popular items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const featuredResponse = await axios.get(
          "http://127.0.0.1:8000/api/food-items/?name=Apple%20Pie%20Roll"
        );
        const popularResponse = await axios.get(
          "http://127.0.0.1:8000/api/food-items/?name=Orange%20Chicken"
        );
        setFeaturedItem(featuredResponse.data[0]);
        setPopularItem(popularResponse.data[0]);
      } catch (err) {
        console.error("Error fetching featured and popular items:", err);
        setError("Failed to load items. Please try again later.");
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="menu-section">
      <div className="logo-container">
        <img
          src="/media/food_images/panda.jpg"
          alt="Panda Express Logo"
          className="logo-image"
        />
      </div>

      <h1>Sizes, Featured & Popular</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="sizes-section">
        <h2>Sizes</h2>
        <ul className="menu-list">
          {sizes.map((size, index) => (
            <li key={index} className="menu-item">
              <img
                src={size.image}
                alt={size.name}
                className="menu-item-image"
              />
              <div className="menu-item-details">
                <h2>{size.name}</h2>
                <p>{size.price}</p>
                <p className="menu-item-description">{size.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="featured-section">
        <h2>Featured</h2>
        {featuredItem ? (
          <div className="menu-item">
            <img
              src={featuredItem.image || "/media/food_images/placeholder.png"}
              alt={featuredItem.name}
              className="menu-item-image"
            />
            <div className="menu-item-details">
              <h2>{featuredItem.name}</h2>
              <p>{featuredItem.calories} Calories</p>
            </div>
          </div>
        ) : (
          <p>Loading featured item...</p>
        )}
      </div>

      <div className="popular-section">
        <h2>Popular</h2>
        {popularItem ? (
          <div className="menu-item">
            <img
              src={popularItem.image || "/media/food_images/placeholder.png"}
              alt={popularItem.name}
              className="menu-item-image"
            />
            <div className="menu-item-details">
              <h2>{popularItem.name}</h2>
              <p>{popularItem.calories} Calories</p>
            </div>
          </div>
        ) : (
          <p>Loading popular item...</p>
        )}
      </div>
    </div>
  );
};

export default SizesFeaturedPopular;
