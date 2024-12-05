/**
 * @module Cashier
 * @description The `CateringItemSelection` component is used for selecting catering items based on the selected catering type.
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiURL } from "../../../config";
import "../stylesheets/CateringItemSelection.css";

function CateringItemSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemType } = location.state || {};

  /**
   * State variables
   */
  const [menuItems, setMenuItems] = useState({
    sides: [], // Array of side items
    entrees: [], // Array of entree items
    apps: [], // Array of appetizer items
  });

  const [itemPrices, setItemPrices] = useState({
    party_side: 0, // Price for party-sized side
    party_entree: 0, // Price for party-sized entree
    party_app: 0, // Price for party-sized appetizer
    bundle1: 0, // Price for 12-16 person bundle
    bundle2: 0, // Price for 18-22 person bundle
    bundle3: 0, // Price for 26-30 person bundle
  });

  const [selection, setSelection] = useState({
    type: "", // Type of catering order
    side1: "", // Selected side 1
    side2: "", // Selected side 2
    side3: "", // Selected side 3
    side4: "", // Selected side 4
    entree1: "", // Selected entree 1
    entree2: "", // Selected entree 2
    entree3: "", // Selected entree 3
    entree4: "", // Selected entree 4
    app: "", // Selected appetizer
    price: 0, // Total calculated price
  });

  /**
   * @description Sets the selection type based on the provided type index.
   * @param {number} type - index representing the catering type.
   */
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

  /**
   * @description Fetches menu items from the API and groups them into categories.
   * @async
   */
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

  /**
   * @description Fetches order types and their base prices from the API.
   * @async
   */
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

  /**
   * @description Handles selection of menu items and updates the selection state.
   * @param {string} type - Type of item being selected
   * @param {object} item - Selected menu item.
   * @param {string} [slot=""] - Slot name for the selection
   */
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
        app: item.name,
      };
    });
  };

  /**
   * @description Calculates the total price based on the selected type.
   * @returns {string} - The calculated total price as a string.
   */
  const calculatePrice = () => {
    const basePrice = getBasePrice(itemType);
    return Number(basePrice).toFixed(2);
  };

  /**
   * @description Gets the base price for the selected type.
   * @param {number} type - Numeric index representing the catering type.
   * @returns {number} - The base price for the catering type.
   */
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

  /**
   * @description Finalizes the selection and navigates to the cashier page.
   */
  const handleConfirm = () => {
    const totalPrice = calculatePrice();
    navigate("/cashier", {
      state: { selection: { ...selection, price: totalPrice } },
    });
  };

  /**
   * @description Renders buttons for the given items.
   * @param {Array} items - List of menu items to render as buttons.
   * @param {string} type - Type of items
   * @param {string} [slot=""] - Slot name for selection tracking.
   * @returns {JSX.Element[]} - Array of button components.
   */
  const renderButtons = (items, type, slot = "") =>
    items.map((item, index) => (
      <div className="cshr_cateringRenderBtnContainer" key={index}>
        <button
          className={`cshr_${type}Btn ${
            slot
              ? selection[slot] === item.name && "highlighted"
              : selection[type] === item.name && "highlighted"
          }`}
          onClick={() => handleSelection(type, item, slot)}
        >
          {item.name}
        </button>
      </div>
    ));

  /**
   * @description Renders a labeled section of buttons for item selection.
   * @param {string} label - Label for the section.
   * @param {Array} items - List of menu items for the section.
   * @param {string} type - Type of items (e.g., "entrees", "sides").
   * @param {string} [slot=""] - Slot name for selection tracking.
   * @returns {JSX.Element} - Rendered section component.
   */
  const renderSection = (label, items, type, slot = "") => (
    <div className="cshr_cateringRenderSectionContainer">
      <h1>{label}</h1>
      {renderButtons(items, type, slot)}
    </div>
  );

  /**
   * @description Renders a catering bundle with a given number of sides and entrees.
   * @param {number} sideCount - Number of sides in the bundle.
   * @param {number} entreeCount - Number of entrees in the bundle.
   * @returns {JSX.Element} - Rendered bundle component.
   */
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
      <button className="cshr_cateringConfirmBtn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );

  return (
    <div className="cshr_cateringItemsContainer">
      {renderTypeSpecificItems()}
    </div>
  );
}

export default CateringItemSelection;
