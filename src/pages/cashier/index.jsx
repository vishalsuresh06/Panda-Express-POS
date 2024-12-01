import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

function Cashier() {
  // State Variables
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [total, setTotal] = useState(
    () => Number(localStorage.getItem("total")) || 0
  );
  const [items, setItems] = useState(
    () => JSON.parse(localStorage.getItem("items")) || []
  );
  const [employee, setEmployee] = useState(
    () => localStorage.getItem("employee") || "Default Employee"
  );
  const location = useLocation();
  const { selection } = location.state || {};
  const { employee: incomingEmployee } = location.state || {};
  const navigate = useNavigate();

  // Sync employee on route change
  useEffect(() => {
    if (incomingEmployee) {
      setEmployee(incomingEmployee);
      localStorage.setItem("employee", incomingEmployee); // Persist to localStorage
    }
  }, [incomingEmployee]);

  // Handle incoming selection data
  useEffect(() => {
    if (selection && selection.type) {
      const newItem = {
        type: selection.type,
        side: selection.side || "",
        entrees: selection.entrees || [],
        price: selection.price || 0,
        drink: selection.drink || "",
        app: selection.app || "None",
      };

      const updatedItems = [...items, newItem];
      const updatedTotal = total + Number(newItem.price);

      setItems(updatedItems);
      setTotal(updatedTotal);

      // Save to localStorage
      localStorage.setItem("items", JSON.stringify(updatedItems));
      localStorage.setItem("total", String(updatedTotal));
    }
  }, [selection]);

  // NavBar
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Remove item from checkout
  const handleDeleteItem = (index) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems[index];
      const updatedItems = prevItems.filter((_, i) => i !== index);
      const updatedTotal = total - itemToRemove.price;

      setTotal(updatedTotal);
      localStorage.setItem("items", JSON.stringify(updatedItems));
      localStorage.setItem("total", String(updatedTotal));

      return updatedItems;
    });
  };

  // Navigation
  const handleNavigation = (itemType) => {
    navigate("/itemSelection", { state: { itemType } });
  };

  const handleLogout = () => {
    deleteCheckout();
    localStorage.setEmployee("");
    navigate("/login");
  };

  const deleteCheckout = () => {
    setItems([]);
    setTotal(0);

    // Clear localStorage
    localStorage.setItem("items", JSON.stringify([]));
    localStorage.setItem("total", "0");
  };

  return (
    <div className="cshr_container">
      {/* NavBar */}
      <div className="cshr_navBar">
        <button className="cshr_logoutBtn" onClick={handleLogout}>
          Logout
        </button>
        <h1 className="cshr_employeeLbl">Logged In: {employee}</h1>
        <h1 className="cshr_timeLbl">{time}</h1>
        <button className="cshr_managerBtn">Manager</button>
        <button className="cshr_cateringBtn">Catering</button>
        <button className="cshr_inventoryBtn">Inventory</button>
      </div>

      {/* Checkout Section */}
      <div className="cshr_checkoutSection">
        <div className="cshr_itemDisplay">
          {items.map((item, index) => (
            <Item
              key={index}
              type={item.type}
              app={item.app}
              drink={item.drink}
              side={item.side}
              entrees={item.entrees}
              price={item.price}
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
          <button className="chkbtn">Checkout</button>
        </div>
      </div>

      {/* Ordering Section */}
      <div className="cshr_orderingSection">
        <button className="cshr_typeBtn" onClick={() => handleNavigation(0)}>
          Bowl
        </button>
        <button className="cshr_typeBtn" onClick={() => handleNavigation(1)}>
          Plate
        </button>
        <button className="cshr_typeBtn" onClick={() => handleNavigation(2)}>
          Bigger Plate
        </button>
        <button className="cshr_typeBtn" onClick={() => handleNavigation(3)}>
          Cub Meal
        </button>
        <button className="cshr_typeBtn" onClick={() => handleNavigation(4)}>
          Family Feast
        </button>
        <button className="cshr_typeBtn" onClick={() => handleNavigation(5)}>
          Drinks
        </button>
        <button className="cshr_typeBtn" onClick={() => handleNavigation(6)}>
          A La Carte
        </button>
        <button className="cshr_typeBtn" onClick={() => handleNavigation(7)}>
          Sides/Appetizers
        </button>
      </div>
    </div>
  );
}

function Item({ type, side, entrees, price, drink, app, onDelete }) {
  return (
    <div className="cshr_itemContainer">
      <h1 className="cshr_typeLbl">{type}</h1>
      <h3 className="cshr_sideLbl">{drink}</h3>
      <h3 className="cshr_sideLbl">{app}</h3>
      <h2 className="cshr_priceLbl">${price}</h2>
      <h3 className="cshr_sideLbl">{side}</h3>
      <ul className="cshr_entreeList">
        {entrees.map((entree, index) => (
          <li key={index}>{entree}</li>
        ))}
      </ul>
      <button className="cshr_deleteBtn" onClick={onDelete}>
        X
      </button>
    </div>
  );
}

export default Cashier;
