/**
 * @module Menu
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiURL } from '../../config.js';
import "./menu.css";

/**
 * A component that fetches and displays a list of entrees from the backend.
 *
 * @function Entrees
 * @returns {JSX.Element} The rendered Entrees component.
 */

const Entrees = () => {
  // State to store entrees data, error messages, and loading status
  const [entrees, setEntrees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches entrees from the backend API.
   *
   * @async
   * @function fetchEntrees
   */
  
  useEffect(() => {
    const fetchEntrees = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/food-items/?type=Entree`);
        console.log("API Response:", response.data); // Debug log
        setEntrees(response.data || []); // Fallback to empty array
      } catch (err) {
        console.error("Error fetching entrees:", err);
        setError("Failed to load entrees. Please try again later.");
      } finally {
        setLoading(false); // Ensure loading stops in both success and error cases
      }
    };

    fetchEntrees();
  }, []);

  // Show a loading indicator while fetching data
  if (loading) {
    return <p className="loading-message">Loading entrees...</p>;
  }

  // Show an error message if something went wrong
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="menu-section">
      <h1>Entrees</h1>
      {/* Check if data exists */}
      {Array.isArray(entrees) && entrees.length > 0 ? (
        <ul className="menu-list">
          {entrees.map((item) => (
            <li key={item.id} className="menu-item">
              <img
                src={item.image || "/placeholder.png"} // Fallback to placeholder image
                alt={item.name}
                className="menu-item-image"
              />
              <div className="menu-item-details">
                <h2>{item.name}</h2>
                <p>{item.calories || "N/A"} Calories</p> {/* Ensure fallback for missing calories */}
                <div className="menu-item-icons">
                  {item.is_spicy && <span className="spicy-icon">🌶️ Spicy</span>}
                  {item.is_premium && (
                    <span className="premium-icon">
                      ⭐ Premium <span className="premium-price">+$1.50</span>
                    </span>
                  )}
                  {item.is_gluten_free && (
                    <span className="gluten-free-icon">🌾 Gluten-Free</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No entrees available at the moment.</p>
      )}
    </div>
  );
};

export default Entrees;
