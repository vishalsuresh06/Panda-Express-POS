/**
 * @module Menu
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./menu.css";
/**
 * A React component for displaying Sides, Drinks, and Appetizers.
 *
 * @function SidesDrinksAppetizers
 * @returns {JSX.Element} A categorized menu section for Sides, Drinks, and Appetizers.
 */
const SidesDrinksAppetizers = () => {
  /**
   * @typedef {Object} MenuItem
   * @property {number} id - Unique identifier for the menu item.
   * @property {string} name - Name of the menu item.
   * @property {string} image - URL or path of the item's image.
   * @property {number} calories - Number of calories in the item.
   * @property {boolean} is_spicy - Indicates if the item is spicy.
   * @property {boolean} is_premium - Indicates if the item is premium.
   * @property {boolean} is_gluten_free - Indicates if the item is gluten-free.
   */
  // States for Sides, Drinks, and Appetizers
  const [sides, setSides] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [appetizers, setAppetizers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches data for Sides, Drinks, and Appetizers from the backend API.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Sides, Drinks, and Appetizers separately
        const [sidesResponse, drinksResponse, appetizersResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/food-items/?type=Side`),
          axios.get(`${apiUrl}/api/food-items/?type=Drink`),
          axios.get(`${apiUrl}/api/food-items/?type=Appetizer`),
        ]);

        // Update states with fetched data
        setSides(sidesResponse.data || []);
        setDrinks(drinksResponse.data || []);
        setAppetizers(appetizersResponse.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="loading-message">Loading menu...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="menu-section">
      <h1>Sides, Drinks & Appetizers</h1>

      {/* Sides Section */}
      <div className="menu-category">
        <h2>Sides</h2>
        {sides.length > 0 ? (
          <ul className="menu-list">
            {sides.map((item) => (
              <li key={item.id} className="menu-item">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="menu-item-image"
                />
                <div className="menu-item-details">
                  <h2>{item.name}</h2>
                  <p>{item.calories || "N/A"} Calories</p>
                  <div className="menu-item-icons">
                    {item.is_spicy && <span className="spicy-icon">🌶️ Spicy</span>}
                    {item.is_premium && <span className="premium-icon">⭐ Premium</span>}
                    {item.is_gluten_free && (
                      <span className="gluten-free-icon">🌾 Gluten-Free</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sides available at the moment.</p>
        )}
      </div>

      {/* Drinks Section */}
      <div className="menu-category">
        <h2>Drinks</h2>
        {drinks.length > 0 ? (
          <ul className="menu-list">
            {drinks.map((item) => (
              <li key={item.id} className="menu-item">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="menu-item-image"
                />
                <div className="menu-item-details">
                  <h2>{item.name}</h2>
                  <p>{item.calories || "N/A"} Calories</p>
                  <div className="menu-item-icons">
                    {item.is_spicy && <span className="spicy-icon">🌶️ Spicy</span>}
                    {item.is_premium && <span className="premium-icon">⭐ Premium</span>}
                    {item.is_gluten_free && (
                      <span className="gluten-free-icon">🌾 Gluten-Free</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No drinks available at the moment.</p>
        )}
      </div>

      {/* Appetizers Section */}
      <div className="menu-category">
        <h2>Appetizers</h2>
        {appetizers.length > 0 ? (
          <ul className="menu-list">
            {appetizers.map((item) => (
              <li key={item.id} className="menu-item">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="menu-item-image"
                />
                <div className="menu-item-details">
                  <h2>{item.name}</h2>
                  <p>{item.calories || "N/A"} Calories</p>
                  <div className="menu-item-icons">
                    {item.is_spicy && <span className="spicy-icon">🌶️ Spicy</span>}
                    {item.is_premium && <span className="premium-icon">⭐ Premium</span>}
                    {item.is_gluten_free && (
                      <span className="gluten-free-icon">🌾 Gluten-Free</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appetizers available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default SidesDrinksAppetizers;
