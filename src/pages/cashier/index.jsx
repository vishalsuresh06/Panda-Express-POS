import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function Cashier() {
  // NavBar
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Checkout
  const [total, setTotal] = useState(0); // Store total cost

  // Navigation
  const navigate = useNavigate();

  const handleNavigation = (itemType) => {
    // Navigate to a new page with the state object containing the type
    navigate("/itemSelection", { state: { itemType } });
  };

  return (
    <div className="cshr_container">
      {/* NavBar */}
      <div className="cshr_navBar">
        <button className="cshr_logoutBtn">Logout</button>
        <h1 className="cshr_employeeLbl">Logged In: Bob Bobby</h1>
        <h1 className="cshr_timeLbl">{time}</h1>
        <button className="cshr_managerBtn">Manager</button>
        <button className="cshr_cateringBtn">Catering</button>
        <button className="cshr_inventoryBtn">Inventory</button>
      </div>

      {/* Checkout Section */}
      <div className="cshr_checkoutSection">
        <div className="cshr_itemDisplay">
          <h1>Sample item</h1>
        </div>
        <div className="cshr_priceDisplay">
          <h1 className="cshr_taxLbl">Tax: </h1>
          <p className="cshr_tax">{(total * 0.08).toFixed(2)}</p>
          <h1 className="cshr_totalLbl">Total: </h1>
          <p className="cshr_total">{(total * 1.08).toFixed(2)}</p>
        </div>
        <div className="cshr_chckAndClearBtnContainer">
          <button className="clrBtn">Clear</button>
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

export default Cashier;
