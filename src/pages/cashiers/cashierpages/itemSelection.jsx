import React, { useState, useEffect } from "react";
import { apiURL } from "../../../config.js";
import { useLocation, useNavigate } from "react-router-dom";

function ItemSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state || {}; // Get `type` from state

  const [menuItems, setMenuItems] = useState([]); // State for menu items
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch menu items from the API when the component mounts
  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch(`${apiURL}/api/menu`);
        if (response.ok) {
          const data = await response.json();
          // Filter items to only include those on the menu
          const availableItems = data.filter((item) => item.on_menu === true);
          setMenuItems(availableItems);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setMenuItems([]);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }

    fetchMenu();
  }, []);

  const confirmClick = () => {
    navigate("/cashier");
  };

  // Filter items based on the type (e.g., sides or entrees based on `type`)
  const sides = menuItems.filter((item) => item.type === "Side");
  const entrees = menuItems.filter((item) => item.type === "Entree");

  if (loading) return <p>Loading menu...</p>;

  return (
    <div>
      <h1>Pick Side</h1>
      <div>
        {sides.length > 0 ? (
          sides.map((side) => (
            <p key={side.id}>
              {side.name} - ${side.alt_price}{" "}
              {side.upcharge > 0 && `(+ $${side.upcharge} upcharge)`}
            </p>
          ))
        ) : (
          <p>No sides available</p>
        )}
      </div>

      <h1>Pick Entree 1</h1>
      <div>
        {entrees.length > 0 ? (
          entrees.map((entree) => (
            <p key={entree.id}>
              {entree.name} - ${entree.alt_price}{" "}
              {entree.upcharge > 0 && `(+ $${entree.upcharge} upcharge)`}
            </p>
          ))
        ) : (
          <p>No entrees available</p>
        )}
      </div>

      {type >= 1 && (
        <>
          <h1>Pick Entree 2</h1>
          <div>
            {entrees.map((entree) => (
              <p key={entree.id}>
                {entree.name} - ${entree.alt_price}{" "}
                {entree.upcharge > 0 && `(+ $${entree.upcharge} upcharge)`}
              </p>
            ))}
          </div>
        </>
      )}

      {type === 2 && (
        <>
          <h1>Pick Entree 3</h1>
          <div>
            {entrees.map((entree) => (
              <p key={entree.id}>
                {entree.name} - ${entree.alt_price}{" "}
                {entree.upcharge > 0 && `(+ $${entree.upcharge} upcharge)`}
              </p>
            ))}
          </div>
        </>
      )}

      <button onClick={confirmClick}>Confirm</button>
    </div>
  );
}

export default ItemSelection;
