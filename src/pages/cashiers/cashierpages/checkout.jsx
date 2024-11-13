import React, { useState } from "react";
import "../cashierstyles/checkoutView.css";
import OrderItems from "./items";

function CheckoutView() {
  const [items, setItems] = useState([]);
  const totPrice = items.reduce((total, item) => total + item.price, 0);

  // Function to add an item
  const addItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const clearBtn = () => {
    setItems([]);
  };

  return (
    <div className="cshr_checkoutContainer">
      <div className="cshr_itemListContainer">
        {items.map((item, index) => (
          <OrderItems
            key={index}
            type={item.type}
            side={item.side}
            price={item.price}
            entree1={item.entree1}
            entree2={item.entree2}
            entree3={item.entree3}
          />
        ))}
      </div>
      <div className="cshr_totalContainer">
        <h1 className="cshr_taxAmt">Tax: ${totPrice * 0.08}</h1>
        <h1 className="cshr_totAmt">Total: ${totPrice * 1.08}</h1>
        <div className="cshr_btnContainer">
          <button className="cshr_checkoutBtn">Checkout</button>
          <button className="cshr_clearBtn" onClick={clearBtn}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutView;
