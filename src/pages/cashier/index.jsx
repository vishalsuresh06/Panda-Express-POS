import React, { useEffect } from "react";
import { useState } from "react";
import "./index.css";

function Cashier() {
  //Time for NavBar
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
      <div className="cshr_checkoutSection"></div>
      {/* Ordering Section */}
      <div className="cshr_orderingSection"></div>
    </div>
  );
}

export default Cashier;
