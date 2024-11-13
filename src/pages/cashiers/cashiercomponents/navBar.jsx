import React from "react";

function NavBar() {
  return (
    <div className="cshr_navBarContainer">
      <button className="cshr_logoutButton">Logout</button>
      <h1 className="cshr_timeLabel"></h1>
      <h1 className="cshr_currentEmployee"></h1>
      <button className="cshr_managerButton"></button>
      <button className="cshr_cateringButton"></button>
      <button className="cshr_inventoryButton"></button>
    </div>
  );
}

export default NavBar;
