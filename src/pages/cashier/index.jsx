import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { logout } from "../../utils/Auth";

// Main Cashier Component
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
  const [isTogo, setIsTogo] = useState(false); // New state for to-go checkbox

  const location = useLocation();
  const navigate = useNavigate();

  const { selection } = location.state || {};

  // Handle incoming selection data
  useEffect(() => {
    if (selection && selection.type) {
      const newItem = {
        type: selection.type,
        sides: [selection.side1, selection.side2] || [],
        entrees:
          [selection.entree1, selection.entree2, selection.entree3] || [],
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

  const check = async (name, togo) => {
    if (name === "" || items.length === 0) {
      return;
    }

    const totalWithTax = total * 1.08;

    const orderJSON = {
      name: name,
      type: togo ? "togo" : "here",
      total: totalWithTax,
      employee: "kiosk",
      orderItems: items,
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

  // Handlers
  const handleDeleteItem = (index) => {
    setItems((prevItems) => {
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
    check(employee, isTogo); // Pass isTogo state
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
        isTogo={isTogo}
        setIsTogo={setIsTogo} // Pass setIsTogo handler
        handleDeleteItem={handleDeleteItem}
        deleteCheckout={deleteCheckout}
        handleCheckout={handleCheckout}
      />

      <OrderingSection handleNavigation={handleNavigation} />
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

// CheckoutSection Component
function CheckoutSection({
  items,
  total,
  isTogo,
  setIsTogo,
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
      <div className="cshr_togoContainer">
        <input
          type="checkbox"
          id="togoCheckbox"
          className="cshr_togoCheckbox"
          checked={isTogo} // Bind to state
          onChange={(e) => setIsTogo(e.target.checked)} // Update state
        />
        <label htmlFor="togoCheckbox" className="cshr_togoLabel">
          To-Go
        </label>
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

// OrderingSection Component
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

// Item Component
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
        {entrees?.length > 0 && (
          <>
            <h3 className="cshr_entreesLbl">Entrees:</h3>
            <p className="cshr_entreesValue">{entrees.join(", ")}</p>
          </>
        )}
        {sides?.length > 0 && (
          <>
            <h3 className="cshr_sidesLbl">Sides:</h3>
            <p className="cshr_sidesValue">{sides.join(", ")}</p>
          </>
        )}
        {drink && (
          <>
            <h3 className="cshr_drinkLbl">Drink:</h3>
            <p className="cshr_drinkValue">{drink}</p>
          </>
        )}
        {app && (
          <>
            <h3 className="cshr_appLbl">Appetizer:</h3>
            <p className="cshr_appValue">{app}</p>
          </>
        )}
      </div>
      <button className="cshr_deleteItemBtn" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}

export default Cashier;
