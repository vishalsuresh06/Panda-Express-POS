import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiURL } from "../../../config";
import "./components.css";

function CateringItemSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemType } = location.state || {};

  const [menuItems, setMenuItems] = useState({
    sides: [],
    entrees: [],
    apps: [],
  });

  const [itemPrices, setItemPrices] = useState({
    party_side: 0,
    party_entree: 0,
    party_app: 0,
    bundle1: 0,
    bundle2: 0,
    bundle3: 0,
  });

  const [selection, setSelection] = useState({
    type: "",
    side1: "",
    side2: "",
    side3: "",
    side4: "",
    entree1: "",
    entree2: "",
    entree3: "",
    entree4: "",
    app: "",
    price: 0,
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
      "Party Size Side",
      "Party Size Entree",
      "Party Size Appetizer",
      "12-16 Person Party Bundle", // 2 Party Sides and 2 Party Entrees
      "18-22 Person Party Bundle", // 3 Party Sides and 3 Party Entrees
      "26-30 Person Party Bundle", // 4 Party Sides and 4 Party Entrees
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
          party_side: Number(
            data.find((item) => item.name === "Party Size Side")?.base_price ||
              0
          ),
          party_entree: Number(
            data.find((item) => item.name === "Party Size Entree")
              ?.base_price || 0
          ),
          party_app: Number(
            data.find((item) => item.name === "Party Size Appetizer")
              ?.base_price || 0
          ),
          bundle1: Number(
            data.find((item) => item.name === "Bundle One")?.base_price || 0
          ),
          bundle2: Number(
            data.find((item) => item.name === "Bundle Two")?.base_price || 0
          ),
          bundle3: Number(
            data.find((item) => item.name === "Bundle Three")?.base_price || 0
          ),
        });
      } else {
        console.error("Failed to fetch order types.");
      }
    } catch (error) {
      console.error("Error fetching order types:", error);
    }
  };

  const handleSelection = (type, item, slot = "") => {
    setSelection((prev) => {
      if (type === "entrees" || type === "sides") {
        return {
          ...prev,
          [slot]: prev[slot] === item.name ? "" : item.name,
        };
      }

      return {
        ...prev,
        [type]: prev[type] === item.name ? "" : item.name,
      };
    });
  };

  const calculatePrice = () => {
    const basePrice = getBasePrice(itemType);
    return Number(basePrice).toFixed(2);
  };

  const getBasePrice = (type) => {
    const prices = [
      itemPrices.party_side,
      itemPrices.party_entree,
      itemPrices.party_app,
      itemPrices.bundle1,
      itemPrices.bundle2,
      itemPrices.bundle3,
    ];
    return Number(prices[type]);
  };

  const handleConfirm = () => {
    const totalPrice = calculatePrice();
    navigate("/cashier", {
      state: { selection: { ...selection, price: totalPrice } },
    });
  };

  const renderButtons = (items, type, slot = "") =>
    items.map((item, index) => (
      <button
        key={index}
        className={`cshr_${type}Btn ${
          slot ? selection[slot] === item.name : selection[type] === item.name
        }`}
        onClick={() => handleSelection(type, item, slot)}
      >
        {item.name}
      </button>
    ));

  const renderSection = (label, items, type, slot = "") => (
    <>
      <h1>{label}</h1>
      {renderButtons(items, type, slot)}
    </>
  );

  const renderTypeSpecificItems = () => {
    switch (itemType) {
      case 0:
      case 1:
      case 2:
        return renderSection(
          "Choose Item",
          menuItems[
            itemType === 0 ? "sides" : itemType === 1 ? "entrees" : "apps"
          ],
          itemType === 0 ? "sides" : itemType === 1 ? "entrees" : "app"
        );
      case 3:
        return renderBundle(2, 2);
      case 4:
        return renderBundle(3, 3);
      case 5:
        return renderBundle(4, 4);
      default:
        return null;
    }
  };

  const renderBundle = (sideCount, entreeCount) => (
    <div className="cshr_bundleContainer">
      {[...Array(sideCount)].map((_, i) =>
        renderSection(`Side ${i + 1}`, menuItems.sides, "sides", `side${i + 1}`)
      )}
      {[...Array(entreeCount)].map((_, i) =>
        renderSection(
          `Entree ${i + 1}`,
          menuItems.entrees,
          "entrees",
          `entree${i + 1}`
        )
      )}
      <button className="cshr_confirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  return <div className="cshr_itemsContainer">{renderTypeSpecificItems()}</div>;
}

export default CateringItemSelection;
