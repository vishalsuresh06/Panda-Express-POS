import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiURL } from "../../../config";
import "./components.css";

function ItemSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemType } = location.state || {};

  const [menuItems, setMenuItems] = useState({
    sides: [],
    entrees: [],
    drinks: [],
    apps: [],
  });

  const [selection, setSelection] = useState({
    type: "",
    sides: [],
    entrees: [],
    drink: "",
    app: "",
    price: 0,
  });

  useEffect(() => {
    setSelectionType(itemType);
  }, [itemType]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const setSelectionType = (type) => {
    const types = [
      "Bowl",
      "Plate",
      "Bigger Plate",
      "Cub Meal",
      "Family Feast",
      "Drinks",
      "A La Carte",
      "Sides/Appetizers",
    ];
    setSelection((prev) => ({ ...prev, type: types[type] || "" }));
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${apiURL}/api/menu`);
      if (response.ok) {
        const data = await response.json();
        setMenuItems({
          sides: data.filter((item) => item.type === "side"),
          entrees: data.filter((item) => item.type === "entree"),
          drinks: data.filter((item) => item.type === "drink"),
          apps: data.filter((item) => item.type === "appetizer"),
        });
      } else {
        console.error("Failed to fetch menu items.");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleSelection = (type, item) => {
    setSelection((prev) => ({
      ...prev,
      [type]:
        type === "sides" || type === "entrees"
          ? [...prev[type], item.name]
          : item.name,
    }));
  };

  const calculatePrice = () => {
    let basePrice = getBasePrice(itemType);
    let upcharge = calculateUpcharges();
    let drinkPrice = getDrinkPrice();
    let appPrice = getAppPrice();

    return (basePrice + upcharge + drinkPrice + appPrice).toFixed(2);
  };

  const getBasePrice = (type) => {
    const prices = [8.6, 9.8, 11.3, 6.6, 35.0];
    return prices[type] || 0;
  };

  const calculateUpcharges = () => {
    return selection.entrees.reduce((upcharge, entreeName) => {
      const entree = menuItems.entrees.find((item) => item.name === entreeName);
      return entree?.upcharge ? upcharge + Number(entree.upcharge) : upcharge;
    }, 0);
  };

  const getDrinkPrice = () => {
    if (selection.drink) {
      const drink = menuItems.drinks.find(
        (item) => item.name === selection.drink
      );
      return drink ? Number(drink.alt_price) : 0;
    }
    return 0;
  };

  const getAppPrice = () => {
    if (selection.app) {
      const app = menuItems.apps.find((item) => item.name === selection.app);
      return app ? Number(app.alt_price) : 100;
    }
    return 0;
  };

  const handleConfirm = () => {
    const totalPrice = calculatePrice();
    navigate("/cashier", {
      state: { selection: { ...selection, price: totalPrice } },
    });
  };

  const renderButtons = (items, type) => {
    return items.map((item, index) => (
      <button
        key={index}
        className={`cshr_${type}Btn`}
        onClick={() => handleSelection(type, item)}
      >
        {item.name}
      </button>
    ));
  };

  const renderSection = (label, items, type) => (
    <>
      <h1>{label}</h1>
      {renderButtons(items, type)}
    </>
  );

  const renderTypeSpecificItems = () => {
    switch (itemType) {
      case 0:
        return renderBowl();
      case 1:
        return renderPlate();
      case 2:
        return renderBiggerPlate();
      case 3:
        return renderCubMeal();
      case 4:
        return renderFamilyFeast();
      case 5:
        return renderDrinks();
      case 6:
        return renderAlaCarte();
      case 7:
        return renderSidesAppetizers();
      default:
        return null;
    }
  };

  const renderBowl = () => (
    <div className="cshr_bowlContainer">
      <h1 className="cshr_bowlLabel">Bowl</h1>
      {renderSection("Side", menuItems.sides, "sides")}
      {renderSection("Entree", menuItems.entrees, "entrees")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderPlate = () => (
    <div className="cshr_plateContainer">
      <h1 className="cshr_plateLabel">Plate</h1>
      {renderSection("Side", menuItems.sides, "sides")}
      {renderSection("Entree 1", menuItems.entrees, "entrees")}
      {renderSection("Entree 2", menuItems.entrees, "entrees")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderBiggerPlate = () => (
    <div className="cshr_bPlateContainer">
      <h1 className="cshr_bPlateLabel">Bigger Plate</h1>
      {renderSection("Side", menuItems.sides, "sides")}
      {renderSection("Entree 1", menuItems.entrees, "entrees")}
      {renderSection("Entree 2", menuItems.entrees, "entrees")}
      {renderSection("Entree 3", menuItems.entrees, "entrees")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderCubMeal = () => (
    <div className="cshr_bowlContainer">
      <h1 className="cshr_bowlLabel">Cub Meal</h1>
      {renderSection("Side", menuItems.sides, "sides")}
      {renderSection("Entree", menuItems.entrees, "entrees")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderFamilyFeast = () => (
    <div className="cshr_famFeastContainer">
      <h1 className="cshr_famFeastLabel">Family Feast</h1>
      {renderSection("Side 1", menuItems.sides, "sides")}
      {renderSection("Side 2", menuItems.sides, "sides")}
      {renderSection("Side 3", menuItems.sides, "sides")}
      {renderSection("Entree 1", menuItems.entrees, "entrees")}
      {renderSection("Entree 2", menuItems.entrees, "entrees")}
      {renderSection("Entree 3", menuItems.entrees, "entrees")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderDrinks = () => (
    <div className="cshr_drinksContainer">
      <h1 className="cshr_drinksLabel">Drinks</h1>
      {renderButtons(menuItems.drinks, "drink")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderAlaCarte = () => (
    <div className="cshr_aLCContainer">
      <h1 className="aLCLabel">A La Carte</h1>
      {renderButtons([...menuItems.sides, ...menuItems.entrees], "app")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderSidesAppetizers = () => (
    <div className="cshr_sideContainer">
      <h1 className="cshr_sideLabel">Sides</h1>
      {renderButtons(menuItems.apps, "app")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  return renderTypeSpecificItems();
}

export default ItemSelection;
