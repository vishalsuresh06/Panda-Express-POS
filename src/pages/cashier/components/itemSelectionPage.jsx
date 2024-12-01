import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiURL } from "../../../config";
import "./components.css";

function ItemSelection() {
  const location = useLocation();
  const { itemType } = location.state || {}; // Get the 'itemType' from state
  const [menuItems, setMenuItems] = useState({
    sides: [],
    entrees: [],
    drinks: [],
    apps: [],
  });
  const [selection, setSelection] = useState({
    side: "",
    entrees: [],
    drink: "",
    price: 0,
  });
  const navigate = useNavigate();

  // Fetch menu items from API
  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch(`${apiURL}/api/menu`);
        if (response.ok) {
          const data = await response.json();
          setMenuItems({
            sides: data.filter((item) => item.type === "Side"),
            entrees: data.filter((item) => item.type === "Entree"),
            drinks: data.filter((item) => item.type === "Drink"),
            apps: data.filter((item) => item.type === "Appetizer"),
          });
        } else {
          console.error("Failed to fetch menu items.");
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    }

    fetchMenu();
  }, []);

  // Confirm Selection and Navigate Back to Cashier
  const confirmClick = () => {
    navigate("/cashier", { state: { selection } });
  };

  // Update Selection for Drinks
  const drinkClick = (drink) => {
    setSelection((prev) => ({
      ...prev,
      drink: drink.name,
      price: (Number(prev.price) + Number(drink.alt_price)).toFixed(2),
    }));
  };

  // Update Selection for Sides
  const sideClick = (side) => {
    setSelection((prev) => ({
      ...prev,
      side: side.name,
      price: (Number(prev.price) + Number(side.alt_price)).toFixed(2),
    }));
  };

  // Update Selection for Entrees
  const entreeClick = (entree) => {
    setSelection((prev) => ({
      ...prev,
      entrees: [...prev.entrees, entree.name],
      price: (Number(prev.price) + Number(entree.alt_price)).toFixed(2),
    }));
  };

  // Render Items Based on `itemType`
  const renderItems = () => {
    switch (itemType) {
      case 0: // Bowl
        return (
          <div>
            <h1>Bowl</h1>
            <h2>Side</h2>
            {menuItems.sides.map((side) => (
              <button key={side.name} onClick={() => sideClick(side)}>
                {side.name} - ${side.alt_price}
              </button>
            ))}
            <h2>Entree</h2>
            {menuItems.entrees.map((entree) => (
              <button key={entree.name} onClick={() => entreeClick(entree)}>
                {entree.name} - ${entree.alt_price}
              </button>
            ))}
          </div>
        );
      case 1: // Plate
        return (
          <div>
            <h1>Plate</h1>
            <h2>Side</h2>
            {menuItems.sides.map((side) => (
              <button key={side.name} onClick={() => sideClick(side)}>
                {side.name} - ${side.alt_price}
              </button>
            ))}
            <h2>Entree 1</h2>
            {menuItems.entrees.map((entree) => (
              <button key={entree.name} onClick={() => entreeClick(entree)}>
                {entree.name} - ${entree.alt_price}
              </button>
            ))}
            <h2>Entree 2</h2>
            {menuItems.entrees.map((entree) => (
              <button key={entree.name} onClick={() => entreeClick(entree)}>
                {entree.name} - ${entree.alt_price}
              </button>
            ))}
          </div>
        );
      case 2: // Bigger Plate
        return (
          <div>
            <h1>Bigger Plate</h1>
            <h2>Side</h2>
            {menuItems.sides.map((side) => (
              <button key={side.name} onClick={() => sideClick(side)}>
                {side.name} - ${side.alt_price}
              </button>
            ))}
            <h2>Entree 1</h2>
            {menuItems.entrees.map((entree) => (
              <button key={entree.name} onClick={() => entreeClick(entree)}>
                {entree.name} - ${entree.alt_price}
              </button>
            ))}
            <h2>Entree 2</h2>
            {menuItems.entrees.map((entree) => (
              <button key={entree.name} onClick={() => entreeClick(entree)}>
                {entree.name} - ${entree.alt_price}
              </button>
            ))}
            <h2>Entree 3</h2>
            {menuItems.entrees.map((entree) => (
              <button key={entree.name} onClick={() => entreeClick(entree)}>
                {entree.name} - ${entree.alt_price}
              </button>
            ))}
          </div>
        );
      case 5: // Drinks
        return (
          <div>
            <h1>Drinks</h1>
            {menuItems.drinks.map((drink) => (
              <button key={drink.name} onClick={() => drinkClick(drink)}>
                {drink.name} - ${drink.alt_price}
              </button>
            ))}
          </div>
        );
      default:
        return <h1>Invalid Item Type</h1>;
    }
  };

  return (
    <div className="itemSelectionContainer">
      {renderItems()}
      <button className="confirmButton" onClick={confirmClick}>
        Confirm
      </button>
    </div>
  );
}

export default ItemSelection;
