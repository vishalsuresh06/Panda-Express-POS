import React, { useState, useEffect } from "react";
import { apiURL } from "../../../config.js";
import { useLocation, useNavigate } from "react-router-dom";

function ItemSelection() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderType = state?.type || 0; // Get `type` from state, default to 0

  const [menuItems, setMenuItems] = useState([]); // Store fetched menu items

  // Fetch menu items when component mounts
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch(`${apiURL}/api/menu`);
        if (response.ok) {
          const data = await response.json();
          const availableItems = data.filter((item) => item.on_menu); // Only items on the menu
          setMenuItems(availableItems);
        } else {
          console.error("Failed to fetch menu items");
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    }

    fetchMenuItems();
  }, []);

  // Filter items by type
  const sides = menuItems.filter((item) => item.type === "Side");
  const entrees = menuItems.filter((item) => item.type === "Entree");

  const handleConfirmClick = () => {
    navigate("/cashier");
  };

  if (loading) {
    return <p>Loading menu...</p>;
  }

  return (
    <div>
      <ItemList title="Pick Side" items={sides} />
      <ItemList title="Pick Entree 1" items={entrees} />

      {orderType >= 1 && <ItemList title="Pick Entree 2" items={entrees} />}
      {orderType === 2 && <ItemList title="Pick Entree 3" items={entrees} />}

      <button onClick={handleConfirmClick}>Confirm</button>
    </div>
  );
}

// Helper Component to display items
function ItemList({ title, items }) {
  return (
    <div>
      <h1>{title}</h1>
      {items.length > 0 ? (
        items.map((item) => (
          <p key={item.id}>
            {item.name} - ${item.alt_price}{" "}
            {item.upcharge > 0 && `(+ $${item.upcharge} upcharge)`}
          </p>
        ))
      ) : (
        <p>No items available</p>
      )}
    </div>
  );
}

export default ItemSelection;
