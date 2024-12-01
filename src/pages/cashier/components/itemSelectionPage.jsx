import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiURL } from "../../../config";
import "./components.css";

function ItemSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemType } = location.state || {}; // Get the 'itemType' from state
  const [menuItems, setMenuItems] = useState({
    sides: [],
    entrees: [],
    drinks: [],
    apps: [],
  });

  const [selection, setSelection] = useState({
    type: "",
    side: [],
    entrees: [],
    drink: "",
    app: "",
    price: 0,
  });

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

  const handleAppSelection = (appItem) => {
    setSelection((prev) => ({
      ...prev,
      type: "Appetizer",
      app: appItem.name,
      price: appItem.alt_price,
    }));
  };

  const handleDrinkSelection = (drinkItem) => {
    setSelection((prev) => ({
      ...prev,
      type: "Drink",
      drink: drinkItem.name,
      price: drinkItem.alt_price,
    }));
  };

  const handleConfirm = () => {
    navigate("/cashier", { state: { selection } });
  };

  switch (itemType) {
    case 0: //Bigger Plate
      break;
    case 1: //Plate
      break;
    case 2: //Bowl
      break;
    case 3: //Cub Meal
      break;
    case 4: //Family Feast
      break;
    case 5: //Drinks
      return (
        <div className="cshr_drinksContainer">
          <h1 className="cshr_drinksLabel">Drinks</h1>
          <div className="cshr_drinkBtnContainer">
            {menuItems.drinks.map((drinkItem, index) => (
              <button
                key={index}
                className="cshr_appBtn"
                onClick={() => handleDrinkSelection(drinkItem)}
              >
                {drinkItem.name}
              </button>
            ))}
          </div>
          <button className="cshr_confirmBtn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      );
    case 6: //A La Carte
      return (
        <div className="cshr_aLCContainer">
          <h1 className="aLCLabel">A La Carte</h1>
          <div className="cshr_appaLCContainer">
            {[...menuItems.sides, ...menuItems.entrees].map((item, index) => (
              <button
                key={index}
                className="cshr_aLCBtn"
                onClick={() => handleAppSelection(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <button className="cshr_confirmBtn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      );
    case 7: // Appetizers
      return (
        <div className="cshr_appContainer">
          <h1 className="cshr_appLabel">Appetizers and Sides</h1>
          <div className="cshr_appBtnContainer">
            {menuItems.apps.map((appItem, index) => (
              <button
                key={index}
                className="cshr_appBtn"
                onClick={() => handleAppSelection(appItem)}
              >
                {appItem.name}
              </button>
            ))}
          </div>
          <button className="cshr_confirmBtn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      );
  }
}

export default ItemSelection;
