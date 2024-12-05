/**
 * @module Cashier
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiURL } from "../../config.js";
import { logout } from "../../utils/Auth";
import "./stylesheets/index.css";

/**
 * Main Cashier Component that displays the checkout process and handles item selections, total, and checkout.
 *
 * @component
 */
function Cashier() {
  // State Variables
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [total, setTotal] = useState(
    Number(localStorage.getItem("total")) || 0
  );
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("items")) || []
  );
  const [employee, setEmployee] = useState(
    sessionStorage.getItem("name") || "Error No Name"
  );
  const [isManager, setIsManager] = useState(
    sessionStorage.getItem("isManager") === "true" || false
  );

  const location = useLocation();
  const navigate = useNavigate();

  const { selection } = location.state || {};

  useEffect(() => {});

  // Handle incoming selection data
  useEffect(() => {
    if (selection && selection.type) {
      const newItem = {
        type: selection.type,
        sides:
          [
            selection.side1,
            selection.side2,
            selection.side3,
            selection.side4,
          ] || [],
        entrees:
          [
            selection.entree1,
            selection.entree2,
            selection.entree3,
            selection.entree4,
          ] || [],
        price: selection.price || 0,
        drink: selection.drink || "",
        app: selection.app || "",
      };

      const updatedItems = [...items, newItem];
      const updatedTotal = total + Number(newItem.price);

      setItems(updatedItems);
      setTotal(updatedTotal);

      navigate(location.pathname, { replace: true });
    }
  }, [selection]);

  // Sync items and total with localStorage
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("total", String(total));
  }, [items, total]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleDeleteItem = (index) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems[index];
      const updatedItems = prevItems.filter((_, i) => i !== index);

      // Update total by subtracting the price of the item removed
      const updatedTotal = updatedItems.reduce(
        (total, item) => total + item.price,
        0
      );

      // Update both state and localStorage immediately
      setTotal(updatedTotal);
      localStorage.setItem("items", JSON.stringify(updatedItems));
      localStorage.setItem("total", String(updatedTotal));

      return updatedItems;
    });
  };

  const handleNavigation = (itemType) => {
    navigate("/itemSelection", { state: { itemType } });
  };

  const handleManager = () => {
    if (isManager) {
      navigate("/manager");
    }
  };

  const handleLogout = () => {
    deleteCheckout();
    logout();
    navigate("/login");
  };

  const handleInventory = () => {
    navigate("/manager/inventory", { state: { isManager } });
  };

  const handleCatering = () => {
    navigate("/catering");
  };

  const handleCheckout = () => {
    const check = async (name, togo) => {
      if (name == "" || items.length == 0) {
        return;
      }

      const orderJSON = {
        name: name,
        type: togo ? "togo" : "here",
        total: total,
        employee: "kiosk",
        orderItems: JSON.stringify(items),
      };
      try {
        let response = await fetch(`${apiURL}/api/kiosk/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderJSON),
        });

        clear();
        return response.ok;
      } catch (error) {
        return false;
      }
    };
    check();
    deleteCheckout();
  };

  const deleteCheckout = () => {
    setItems([]);
    setTotal(0);

    localStorage.setItem("items", JSON.stringify([]));
    localStorage.setItem("total", "0");
  };

  return (
    <div className="cshr_container">
      <NavBar
        employee={employee}
        time={time}
        isManager={isManager}
        handleLogout={handleLogout}
        handleManager={handleManager}
        handleInventory={handleInventory}
        handleCatering={handleCatering}
      />

      <CheckoutSection
        items={items}
        total={total}
        handleDeleteItem={handleDeleteItem}
        deleteCheckout={deleteCheckout}
        handleCheckout={handleCheckout}
      />

      <OrderingSection handleNavigation={handleNavigation} />
    </div>
  );
}

/**
 * NavBar Component for displaying employee info, time, and management actions.
 *
 * @param {Object} props
 * @param {string} props.employee - Employee name
 * @param {string} props.time - Current time
 * @param {boolean} props.isManager - Whether the user is a manager
 * @param {function} props.handleLogout - Logout handler
 * @param {function} props.handleManager - Navigate to manager page handler
 * @param {function} props.handleInventory - Navigate to inventory page handler
 * @param {function} props.handleCatering - Navigate to catering page handler
 *
 * @component
 */
function NavBar({
  employee,
  time,
  isManager,
  handleLogout,
  handleManager,
  handleInventory,
  handleCatering,
}) {
  return (
    <div className="cshr_navBar">
      <button className="cshr_logoutBtn" onClick={handleLogout}>
        Logout
      </button>
      <h1 className="cshr_employeeLbl">Logged In: {employee}</h1>
      <h1 className="cshr_timeLbl">{time}</h1>
      <button className="cshr_managerBtn" onClick={handleManager}>
        {isManager ? "Manager" : ""}
      </button>
      <button className="cshr_cateringBtn" onClick={handleCatering}>
        Catering
      </button>
      <button className="cshr_inventoryBtn" onClick={handleInventory}>
        Inventory
      </button>
    </div>
  );
}

/**
 * CheckoutSection Component for displaying the checkout details including items, prices, and checkout buttons.
 *
 * @param {Object} props
 * @param {Array} props.items - List of items in the checkout
 * @param {number} props.total - Total price of the checkout
 * @param {function} props.handleDeleteItem - Function to delete an item from the checkout
 * @param {function} props.deleteCheckout - Function to clear the checkout
 * @param {function} props.handleCheckout - Function to handle the checkout
 *
 * @component
 */
function CheckoutSection({
  items,
  total,
  handleDeleteItem,
  deleteCheckout,
  handleCheckout,
}) {
  return (
    <div className="cshr_checkoutSection">
      <div className="cshr_itemDisplay">
        {items.map((item, index) => (
          <Item
            key={index}
            {...item}
            onDelete={() => handleDeleteItem(index)}
          />
        ))}
      </div>
      <div className="cshr_priceDisplay">
        <h1 className="cshr_taxLbl">Tax: </h1>
        <p className="cshr_tax">{(total * 0.08).toFixed(2)}</p>
        <h1 className="cshr_totalLbl">Total: </h1>
        <p className="cshr_total">{(total * 1.08).toFixed(2)}</p>
      </div>
      <div className="cshr_chckAndClearBtnContainer">
        <button className="clrBtn" onClick={deleteCheckout}>
          Clear
        </button>
        <button className="chkbtn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}

/**
 * OrderingSection Component for displaying the buttons to navigate to different item selection categories.
 *
 * @param {Object} props
 * @param {function} props.handleNavigation - Function to handle navigation based on the item type
 *
 * @component
 */
function OrderingSection({ handleNavigation }) {
  const buttonData = [
    { label: "Bowl", type: 0 },
    { label: "Plate", type: 1 },
    { label: "Bigger Plate", type: 2 },
    { label: "Cub Meal", type: 3 },
    { label: "Family Feast", type: 4 },
    { label: "Drinks", type: 5 },
    { label: "A La Carte", type: 6 },
    { label: "Sides/Appetizers", type: 7 },
  ];

  return (
    <div className="cshr_orderingSection">
      {buttonData.map(({ label, type }) => (
        <button
          key={type}
          className="cshr_typeBtn"
          onClick={() => handleNavigation(type)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/**
 * Item Component for displaying an individual item in the checkout with details like price, sides, and entrees.
 *
 * @param {Object} props
 * @param {string} props.type - Type of the item (e.g., "Bowl", "Plate")
 * @param {Array} props.sides - List of sides for the item
 * @param {Array} props.entrees - List of entrees for the item
 * @param {number} props.price - Price of the item
 * @param {string} props.drink - Drink associated with the item
 * @param {string} props.app - Appetizer associated with the item
 * @param {function} props.onDelete - Function to delete the item from the checkout
 *
 * @component
 */
function Item({ type, sides = [], entrees, price, drink, app, onDelete }) {
  return (
    <div className="cshr_itemContainer">
      <h1 className="cshr_typeLbl">{type}</h1>
      <div className="cshr_detailsContainer">
        {price && (
          <>
            <h3 className="cshr_priceLbl">Price:</h3>
            <p className="cshr_priceValue">${price}</p>
          </>
        )}
      </div>
      {sides[0] !== "" && (
        <div className="cshr_sidesContainer">
          <h3 className="cshr_sidesLbl">Sides:</h3>
          <ul className="cshr_sideList">
            {sides.map((side, index) => (
              <li key={index} className="cshr_sideItem">
                {side}
              </li>
            ))}
          </ul>
        </div>
      )}
      {entrees[0] !== "" && (
        <div className="cshr_entreesContainer">
          <h3 className="cshr_entreesLbl">Entrees:</h3>
          <ul className="cshr_entreeList">
            {entrees.map((entree, index) => (
              <li key={index} className="cshr_entreeItem">
                {entree}
              </li>
            ))}
          </ul>
        </div>
      )}
      {drink && (
        <div>
          <h3>Drinks: </h3>
          <p className="cshr_drinkValue">{drink}</p>
        </div>
      )}
      {app && (
        <div>
          <h3>Appetizers: </h3>
          <p className="cshr_drinkValue">{app}</p>
        </div>
      )}
      <button className="cshr_deleteBtn" onClick={onDelete}>
        X
      </button>
    </div>
  );
}

export default Cashier;
