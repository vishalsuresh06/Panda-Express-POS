import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { logout } from "../../utils/Auth";

// Main Cashier Component
function Catering() {
  // State Variables
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [employee, setEmployee] = useState(
    sessionStorage.getItem("name") || "Error No Name"
  );
  const [isManager, setIsManager] = useState(
    sessionStorage.getItem("isManager") === "true" || false
  );

  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleManager = () => {
    if (isManager) {
      navigate("/manager");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleInventory = () => {
    navigate("/manager/inventory", { state: { isManager } });
  };

  const handleCashier = () => {
    navigate("/cashier");
  };

  const handleButtonAction = (action) => {
    console.log(`Button ${action} clicked`);
    // Add navigation or action logic here
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
        handleCashier={handleCashier}
      />

      <div className="cshr_cateringButtonSection">
        {[
          "Party Size Side",
          "Party Size Entree",
          "Party Size Appetizer/Dessert",
          "12-16 Party Person Bundle",
          "18-22 Party Person Bundle",
          "26-30 Party Person Bundle",
        ].map((action, index) => (
          <button
            key={index}
            className="cshr_largeBtn"
            onClick={() => handleButtonAction(action)}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

// NavBar Component
function NavBar({
  employee,
  time,
  isManager,
  handleLogout,
  handleManager,
  handleInventory,
  handleCashier,
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
      <button className="cshr_cateringBtn" onClick={handleCashier}>
        Cashier
      </button>
      <button className="cshr_inventoryBtn" onClick={handleInventory}>
        Inventory
      </button>
    </div>
  );
}

export default Catering;
