import "../cashierstyles/orderView.css";

function OrderView() {
  return (
    <div className="cshr_optionContainer">
      <button className="cshr_optionBtn">Bowl</button>
      <button className="cshr_optionBtn">Plate</button>
      <button className="cshr_optionBtn">Bigger Plate</button>
      <button className="cshr_optionBtn">Family Feast</button>
      <button className="cshr_optionBtn">Cub Meal</button>
      <button className="cshr_optionBtn">Drinks</button>
      <button className="cshr_optionBtn">A La Carte</button>
      <button className="cshr_optionBtn">Sides/Appetizers</button>
    </div>
  );
}

export default OrderView;
