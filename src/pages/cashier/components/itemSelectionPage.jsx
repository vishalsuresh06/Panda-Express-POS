import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiURL } from "../../../config";
import "../stylesheets/itemSelection.css";

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

  const [itemPrices, setItemPrices] = useState({
    bowl: 0,
    plate: 0,
    cub_meal: 0,
    family_feast: 0,
    bigger_plate: 0,
    a_la_carte: 0,
  });

  const [selection, setSelection] = useState({
    type: "",
    side1: "",
    side2: "",
    entree1: "",
    entree2: "",
    entree3: "",
    drink: "",
    app: "",
    price: 0,
    id: [],
  });

  useEffect(() => {
    setSelectionType(itemType);
  }, [itemType]);

  useEffect(() => {
    fetchMenuItems();
    fetchOrderTypes();
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

  const fetchOrderTypes = async () => {
    try {
      const response = await fetch(`${apiURL}/api/kiosk_orders`);
      if (response.ok) {
        const data = await response.json();
        setItemPrices({
          bowl: Number(
            data.find((item) => item.name === "Bowl")?.base_price || 0
          ),
          plate: Number(
            data.find((item) => item.name === "Plate")?.base_price || 0
          ),
          cub_meal: Number(
            data.find((item) => item.name === "Cub Meal")?.base_price || 0
          ),
          family_feast: Number(
            data.find((item) => item.name === "Family Feast")?.base_price || 0
          ),
          bigger_plate: Number(
            data.find((item) => item.name === "Bigger Plate")?.base_price || 0
          ),
          a_la_carte: Number(
            data.find((item) => item.name === "A La Carte")?.base_price || 0
          ),
        });
      } else {
        console.error("Failed to fetch orderTypes items.");
      }
    } catch (error) {
      console.error("Error fetching orderTypes items:", error);
    }
  };

  const handleSelection = (type, item, slot = "") => {
    setSelection((prev) => {
      // Special handling for sides in bowl, plate, bigger plate, and cub meal
      if (type === "sides" && [0, 1, 2, 3].includes(itemType)) {
        // If clicked item is already selected in side1, move to side2
        if (prev.side1 === item.name) {
          return {
            ...prev,
            side1: "",
            side2: item.name,
            id: prev.id.filter((id) => id !== item.id),
          };
        }

        // If clicked item is already selected in side2, deselect
        if (prev.side2 === item.name) {
          return {
            ...prev,
            side2: "",
            id: prev.id.filter((id) => id !== item.id),
          };
        }

        // If side1 is empty, select in side1
        if (!prev.side1) {
          return {
            ...prev,
            side1: item.name,
            id: [...prev.id, item.id],
          };
        }

        // If side1 is filled, select in side2
        if (!prev.side2) {
          return {
            ...prev,
            side2: item.name,
            id: [...prev.id, item.id],
          };
        }

        // If both sides are filled, replace side2
        return {
          ...prev,
          side2: item.name,
          id: prev.id
            .filter(
              (id) =>
                id !==
                prev.id.find(
                  (id) =>
                    menuItems.sides.find((side) => side.name === prev.side2)
                      ?.id === id
                )
            )
            .concat(item.id),
        };
      }

      // Existing logic for other types
      const updatedSlot = slot
        ? { [slot]: prev[slot] === item.name ? "" : item.name }
        : {};

      const updatedIds = prev.id.includes(item.id)
        ? prev.id.filter((id) => id !== item.id)
        : [...prev.id, item.id];

      return {
        ...prev,
        ...updatedSlot,
        [type]: !slot && prev[type] === item.name ? "" : item.name,
        id: updatedIds,
      };
    });
  };

  const calculatePrice = () => {
    let basePrice = getBasePrice(itemType);
    let upcharge = calculateUpcharges();
    let drinkPrice = Number(getDrinkPrice());
    let appPrice = Number(getAppPrice());

    return Number(basePrice + upcharge + drinkPrice + appPrice).toFixed(2);
  };

  const getBasePrice = (type) => {
    const prices = [
      itemPrices.bowl,
      itemPrices.plate,
      itemPrices.bigger_plate,
      itemPrices.cub_meal,
      itemPrices.family_feast,
      0,
      itemPrices.a_la_carte,
      0,
    ];
    return Number(prices[type]);
  };

  const calculateUpcharges = () => {
    const entrees = [selection.entree1, selection.entree2, selection.entree3];
    return entrees.reduce((upcharge, entreeName) => {
      const entree = menuItems.entrees.find((item) => item.name === entreeName);
      return entree?.upcharge ? upcharge + Number(entree.upcharge) : upcharge;
    }, 0);
  };

  const getDrinkPrice = () => {
    if (selection.drink && itemType !== 3) {
      const drink = menuItems.drinks.find(
        (item) => item.name === selection.drink
      );
      return drink && drink.alt_price ? Number(drink.alt_price) : 0;
    }
    return 0;
  };

  const getAppPrice = () => {
    if (selection.app) {
      const app = menuItems.apps.find((item) => item.name === selection.app);
      return app && app.alt_price ? Number(app.alt_price) : 0;
    }
    return 0;
  };

  const handleConfirm = () => {
    const totalPrice = calculatePrice();
    navigate("/cashier", {
      state: { selection: { ...selection, price: totalPrice } },
    });
  };

  const renderButtons = (items, type, slot = "") => {
    return items.map((item, index) => {
      // Special handling for sides in bowl, plate, bigger plate, and cub meal
      if (type === "sides" && [0, 1, 2, 3].includes(itemType)) {
        const isSelected =
          selection.side1 === item.name || selection.side2 === item.name;
        return (
          <div key={index} className="cshr_renderBtnContainer">
            <button
              className={`cshr_${type}Btn ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelection(type, item, slot)}
            >
              {item.name}
            </button>
          </div>
        );
      }

      // Existing logic for other types
      return (
        <div key={index} className="cshr_renderBtnContainer">
          <button
            className={`cshr_${type}Btn ${
              (
                slot
                  ? selection[slot] === item.name
                  : selection[type].includes(item.name)
              )
                ? "selected"
                : ""
            }`}
            onClick={() => handleSelection(type, item, slot)}
          >
            {item.name}
          </button>
        </div>
      );
    });
  };

  const renderSection = (label, items, type, slot = "") => (
    <>
      <h1 className="cshr_renderSectionLabel">{label}</h1>
      {renderButtons(items, type, slot)}
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
      {renderSection("Side 1", menuItems.sides, "sides", "side1")}
      {renderSection("Entree", menuItems.entrees, "entrees", "entree1")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderPlate = () => (
    <div className="cshr_plateContainer">
      <h1 className="cshr_plateLabel">Plate</h1>
      {renderSection("Side 1", menuItems.sides, "sides", "side1")}
      {renderSection("Entree 1", menuItems.entrees, "entrees", "entree1")}
      {renderSection("Entree 2", menuItems.entrees, "entrees", "entree2")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderBiggerPlate = () => (
    <div className="cshr_bPlateContainer">
      <h1 className="cshr_bPlateLabel">Bigger Plate</h1>
      {renderSection("Side 1", menuItems.sides, "sides", "side1")}
      {renderSection("Entree 1", menuItems.entrees, "entrees", "entree1")}
      {renderSection("Entree 2", menuItems.entrees, "entrees", "entree2")}
      {renderSection("Entree 3", menuItems.entrees, "entrees", "entree3")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderCubMeal = () => (
    <div className="cshr_bowlContainer">
      <h1 className="cshr_bowlLabel">Cub Meal</h1>
      {renderSection("Side 1", menuItems.sides, "sides", "side1")}
      {renderSection("Entree", menuItems.entrees, "entrees", "entree1")}
      {renderSection("Drink", menuItems.drinks, "drink")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderFamilyFeast = () => (
    <div className="cshr_ffContainer">
      <h1 className="cshr_ffLabel">Family Feast</h1>
      {renderSection("Side 1", menuItems.sides, "sides", "side1")}
      {renderSection("Side 2", menuItems.sides, "sides", "side2")}
      {renderSection("Entree 1", menuItems.entrees, "entrees", "entree1")}
      {renderSection("Entree 2", menuItems.entrees, "entrees", "entree2")}
      {renderSection("Entree 3", menuItems.entrees, "entrees", "entree3")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderDrinks = () => (
    <div className="cshr_drinkContainer">
      {renderSection("Drinks", menuItems.drinks, "drink")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderAlaCarte = () => (
    <div className="cshr_acContainer">
      <h1 className="cshr_acLabel">A La Carte</h1>
      {renderSection(
        "Entrees",
        [...menuItems.entrees, ...menuItems.sides],
        "entrees",
        "entree1"
      )}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  const renderSidesAppetizers = () => (
    <div className="cshr_saContainer">
      {renderSection("Appetizers", menuItems.apps, "app")}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  return <div className="cshr_itemsContainer">{renderTypeSpecificItems()}</div>;
}

export default ItemSelection;
