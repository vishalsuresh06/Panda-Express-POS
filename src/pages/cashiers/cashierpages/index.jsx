import React from "react";
import NavBar from "./NavBar";
import CheckoutView from "./Checkout";
import OrderView from "./OrderView";

function Cashier() {
  return (
    <div>
      <NavBar />
      <CheckoutView />
      <OrderView />
    </div>
  );
}

export default Cashier;
