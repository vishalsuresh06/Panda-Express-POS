import "../cashierstyles/checkoutView.css";
import OrderItems from "./items";

function CheckoutView() {
  return (
    <div className="cshr_checkoutContainer">
      <div className="cshr_itemListContainer"></div>
      <div className="cshr_totalContainer">
        <h1 className="cshr_taxAmt">Tax: </h1>
        <h1 className="cshr_totAmt">Total: </h1>
        <div className="cshr_btnContainer">
          <button className="cshr_checkoutBtn">Checkout</button>
          <button className="cshr_clearBtn">Clear</button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutView;
