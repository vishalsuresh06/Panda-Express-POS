import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../utils/Auth";
import "../cashierstyles/navBar.css";

function NavBar() {
  let navigate = useNavigate()

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const updateInt = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
  });

  function logoutAction() {
    logout()
    navigate('/login')
  }

  return (
    <div className="cshr_NavBar">
      <button onClick={logoutAction} className="cshr_logoutBtn">Log Out</button>
      <h1 className="cshr_currEmployee">Logged In: Bob Bobby</h1>{" "}
      {/* Need to change to update based on login info */}
      <h1 className="cshr_currentTime">{currentTime}</h1>
      <button className="cshr_managerBtn">Manager</button>
      <button className="cshr_inventoryBtn">Inventory</button>
      <button className="cshr_cateringBtn">Catering</button>
    </div>
  );
}

export default NavBar;
