import NavBar from "./cashierpages/NavBar";
import CheckoutView from "./cashierpages/checkout";
import OrderView from "./cashierpages/OrderView";

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
