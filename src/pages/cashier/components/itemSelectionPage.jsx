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
    sides: [],
    entrees: [],
    drink: "",
    app: "",
    price: 0,
  });

  useEffect(() => {
    if (itemType === 0) {
      setSelection((prev) => ({ ...prev, type: "Bowl" }));
    } else if (itemType === 1) {
      setSelection((prev) => ({ ...prev, type: "Plate" }));
    } else if (itemType === 2) {
      setSelection((prev) => ({ ...prev, type: "Bigger Plate" }));
    } else if (itemType === 3) {
      setSelection((prev) => ({ ...prev, type: "Cub Meal" }));
    } else if (itemType === 4) {
      setSelection((prev) => ({ ...prev, type: "Family Feast" }));
    } else if (itemType === 5) {
      setSelection((prev) => ({ ...prev, type: "Drinks" }));
    } else if (itemType === 6) {
      setSelection((prev) => ({ ...prev, type: "A La Carte" }));
    } else if (itemType === 7) {
      setSelection((prev) => ({ ...prev, type: "Sides/Appetizers" }));
    }
  }, [itemType]);

  useEffect(() => {
    async function fetchMenu() {
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
          console.log(data);
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
      app: appItem.name,
    }));
  };

  const handleDrinkSelection = (drinkItem) => {
    setSelection((prev) => ({
      ...prev,
      drink: drinkItem.name,
    }));
  };

  const handleSideSelection = (sideItem) => {
    setSelection((prev) => ({
      ...prev,
      sides: [...(prev.sides || []), sideItem.name],
    }));
  };

  const handleEntreeSelection = (entreeItem) => {
    setSelection((prev) => ({
      ...prev,
      entrees: [...(prev.entrees || []), entreeItem.name],
    }));
  };

  const calculatePrice = () => {
    let basePrice = 0;

    // Set base price based on itemType
    switch (itemType) {
      case 0:
        basePrice = 8.6; // Bowl
        break;
      case 1:
        basePrice = 9.8; // Plate
        break;
      case 2:
        basePrice = 11.3; // Bigger Plate
        break;
      case 3:
        basePrice = 6.6; // Cub Meal
        break;
      case 4:
        basePrice = 35.0; // Family Feast
        break;
      default:
        basePrice = 0;
    }

    // Calculate additional price for entrees
    let entreeUpcharge = 0;
    selection.entrees.forEach((entreeName) => {
      const entree = menuItems.entrees.find((item) => item.name === entreeName);
      if (entree && entree.upcharge) {
        entreeUpcharge += Number(entree.upcharge);
      }
    });

    // Calculate drink price
    let drinkPrice = 0;
    if (selection.drink !== "") {
      const drink = menuItems.drinks.find(
        (item) => item.name === selection.drink
      );
      drinkPrice = drink ? Number(drink.alt_price) : 0;
    }

    // Calculate appetizer price
    let appPrice = 0;
    if (selection.app !== "") {
      const app = menuItems.apps.find((item) => item.name === selection.app);
      appPrice = app ? Number(app.alt_price) : 100;
    }

    // Update the selection with the total price
    setSelection((prev) => ({
      ...prev,
      price: basePrice + entreeUpcharge + drinkPrice + appPrice,
    }));
  };

  const handleConfirm = () => {
    calculatePrice(); // Calculate price but do not rely on setSelection
    const totalPrice = (() => {
      let basePrice = 0;

      switch (itemType) {
        case 0:
          basePrice = 8.6;
          break;
        case 1:
          basePrice = 9.8;
          break;
        case 2:
          basePrice = 11.3;
          break;
        case 3:
          basePrice = 6.6;
          break;
        case 4:
          basePrice = 35.0;
          break;
        default:
          basePrice = 0;
      }

      let entreeUpcharge = 0;
      selection.entrees.forEach((entreeName) => {
        const entree = menuItems.entrees.find(
          (item) => item.name === entreeName
        );
        if (entree?.upcharge) entreeUpcharge += Number(entree.upcharge);
      });

      let drinkPrice = 0;
      if (selection.drink) {
        const drink = menuItems.drinks.find(
          (item) => item.name === selection.drink
        );
        drinkPrice = drink ? Number(drink.alt_price) : 0;
      }

      let appPrice = 0;
      if (selection.app) {
        const app = menuItems.apps.find((item) => item.name === selection.app);
        appPrice = app ? Number(app.alt_price) : 0;
      }

      return (basePrice + entreeUpcharge + drinkPrice + appPrice).toFixed(2);
    })();

    navigate("/cashier", {
      state: { selection: { ...selection, price: totalPrice } },
    });
  };

  if (itemType === 0) {
    // Bowl
    return (
      <div className="cshr_bowlContainer">
        <h1 className="cshr_bowlLabel">Bowl</h1>
        <h1>Side</h1>
        {menuItems.sides.map((sideItem, index) => (
          <button
            key={index}
            className="cshr_sideBtn"
            onClick={() => handleSideSelection(sideItem)}
          >
            {sideItem.name}
          </button>
        ))}
        <h1>Entree</h1>
        {menuItems.entrees.map((entreeItem, index) => (
          <button
            key={index}
            className="cshr_entreeBtn"
            onClick={() => handleEntreeSelection(entreeItem)}
          >
            {entreeItem.name}
          </button>
        ))}
        <button className="cshr_confirmBtn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    );
  } else if (itemType === 1) {
    // Plate
    return (
      <div className="cshr_plateContainer">
        <h1 className="cshr_plateLabel">Plate</h1>
        {menuItems.sides.map((sideItem, index) => (
          <button
            key={index}
            className="cshr_sideBtn"
            onClick={() => handleSideSelection(sideItem)}
          >
            {sideItem.name}
          </button>
        ))}
        <h1>Entree 1</h1>
        {menuItems.entrees.map((entreeItem, index) => (
          <button
            key={index}
            className="cshr_entreeBtn"
            onClick={() => handleEntreeSelection(entreeItem)}
          >
            {entreeItem.name}
          </button>
        ))}
        <h1>Entree 2</h1>
        {menuItems.entrees.map((entreeItem, index) => (
          <button
            key={index}
            className="cshr_entreeBtn"
            onClick={() => handleEntreeSelection(entreeItem)}
          >
            {entreeItem.name}
          </button>
        ))}
        <button className="cshr_confirmBtn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    );
  } else if (itemType === 2) {
    // Bigger Plate
    return (
      <div className="cshr_bPlateContainer">
        <h1 className="cshr_bPlateLabel">Bigger Plate</h1>
        {menuItems.sides.map((sideItem, index) => (
          <button
            key={index}
            className="cshr_sideBtn"
            onClick={() => handleSideSelection(sideItem)}
          >
            {sideItem.name}
          </button>
        ))}
        <h1>Entree 1</h1>
        {menuItems.entrees.map((entreeItem, index) => (
          <button
            key={index}
            className="cshr_entreeBtn"
            onClick={() => handleEntreeSelection(entreeItem)}
          >
            {entreeItem.name}
          </button>
        ))}
        <h1>Entree 2</h1>
        {menuItems.entrees.map((entreeItem, index) => (
          <button
            key={index}
            className="cshr_entreeBtn"
            onClick={() => handleEntreeSelection(entreeItem)}
          >
            {entreeItem.name}
          </button>
        ))}
        <h1>Entree 3</h1>
        {menuItems.entrees.map((entreeItem, index) => (
          <button
            key={index}
            className="cshr_entreeBtn"
            onClick={() => handleEntreeSelection(entreeItem)}
          >
            {entreeItem.name}
          </button>
        ))}
        <button className="cshr_confirmBtn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    );
  } else if (itemType === 3) {
    // Cub Meal
    return (
      <div className="cshr_bowlContainer">
        <h1 className="cshr_bowlLabel">Cub Meal</h1>
        <h1>Side</h1>
        {menuItems.sides.map((sideItem, index) => (
          <button
            key={index}
            className="cshr_sideBtn"
            onClick={() => handleSideSelection(sideItem)}
          >
            {sideItem.name}
          </button>
        ))}
        <h1>Entree</h1>
        {menuItems.entrees.map((entreeItem, index) => (
          <button
            key={index}
            className="cshr_entreeBtn"
            onClick={() => handleEntreeSelection(entreeItem)}
          >
            {entreeItem.name}
          </button>
        ))}
        <button className="cshr_confirmBtn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    );
  } else if (itemType === 4) {
    // Family Feast
    return (
      <div className="cshr_famFeastContainer">
        <h1 className="cshr_famFeastLabel">Family Feast</h1>
        <div className="cshr_famFeastSideContainer">
          <h1 className="cshr_famFeastSideLabel">Side 1</h1>
          {menuItems.sides.map((sideItem, index) => (
            <button
              key={index}
              className="cshr_sideBtn"
              onClick={() => handleSideSelection(sideItem)}
            >
              {sideItem.name}
            </button>
          ))}
          <h1 className="cshr_famFeastSideLabel">Side 2</h1>
          {menuItems.sides.map((sideItem, index) => (
            <button
              key={index}
              className="cshr_sideBtn"
              onClick={() => handleSideSelection(sideItem)}
            >
              {sideItem.name}
            </button>
          ))}
          <h1 className="cshr_famFeastSideLabel">Side 3</h1>
        </div>
        <div className="cshr_famFeastEntreeContainer">
          <h1 className="cshr_famFeastEntreeLabel">Entree 1</h1>
          {menuItems.entrees.map((entreeItem, index) => (
            <button
              key={index}
              className="cshr_entreeBtn"
              onClick={() => handleEntreeSelection(entreeItem)}
            >
              {entreeItem.name}
            </button>
          ))}
          <h1 className="cshr_famFeastEntreeLabel">Entree 2</h1>
          {menuItems.entrees.map((entreeItem, index) => (
            <button
              key={index}
              className="cshr_entreeBtn"
              onClick={() => handleEntreeSelection(entreeItem)}
            >
              {entreeItem.name}
            </button>
          ))}
          <h1 className="cshr_famFeastEntreeLabel">Entree 3</h1>
          {menuItems.entrees.map((entreeItem, index) => (
            <button
              key={index}
              className="cshr_entreeBtn"
              onClick={() => handleEntreeSelection(entreeItem)}
            >
              {entreeItem.name}
            </button>
          ))}
        </div>
        <button className="cshr_confirmBtn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    );
  } else if (itemType === 5) {
    // Drinks
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
  } else if (itemType === 6) {
    // A La Carte
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
  } else if (itemType === 7) {
    // Sides/Appetizers
    return (
      <div className="cshr_sideContainer">
        <h1 className="cshr_sideLabel">Sides</h1>
        <div className="cshr_sideBtnContainer">
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
  } else {
    return null; // Return nothing if no itemType matches
  }
}

export default ItemSelection;
