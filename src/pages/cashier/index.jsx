import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

function Cashier() {
  // State Variables
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]); // Store selected items
  const location = useLocation();
  const { selection } = location.state || {};
  const { employee } = location.state || {};
  const employeeName = employee;
  const navigate = useNavigate();

  // Handle incoming selection data
  useEffect(() => {
    if (selection) {
      const newItem = {
        type: selection.side ? "Bowl" : "Drink", // Adjust based on selection
        side: selection.side || "",
        entrees: selection.entrees || [],
        price: parseFloat(selection.price) || 0,
      };

      setItems((prevItems) => [...prevItems, newItem]);
      setTotal((prevTotal) => prevTotal + newItem.price);
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
      setTotal((prevTotal) => prevTotal - itemToRemove.price);
      return prevItems.filter((_, i) => i !== index);
    });
  };

  // Navigation
  const handleNavigation = (itemType) => {
    navigate("/itemSelection", { state: { itemType } });
  };

  return (
    <div className="cshr_container">
      {/* NavBar */}
      <div className="cshr_navBar">
        <button className="cshr_logoutBtn">Logout</button>
        <h1 className="cshr_employeeLbl">Logged In: {employeeName}</h1>
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
          <button
            className="clrBtn"
            onClick={() => {
              setItems([]);
              setTotal(0); // Reset the total to 0
            }}
          >
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

function Item({ type, side, entrees, price, onDelete }) {
  return (
    <div className="cshr_itemContainer">
      <h1 className="cshr_typeLbl">{type}</h1>
      <h2 className="cshr_priceLbl">${price.toFixed(2)}</h2>
      <h3 className="cshr_sideLbl">{side}</h3>
      <ul className="cshr_entreeList">
        {entrees.map((entree) => (
          <li key={entree}>{entree}</li>
        ))}
      </ul>
      <button className="cshr_deleteBtn" onClick={onDelete}>
        X
      </button>
    </div>
  );
}

export default Cashier;
