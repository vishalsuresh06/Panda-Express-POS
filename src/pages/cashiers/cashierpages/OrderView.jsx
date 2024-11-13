import "../cashierstyles/orderView.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function OrderView() {
  const navigate = useNavigate("/cashier");

  const bowlBtnClick = () => {
    navigate("/ItemSelection", { state: { type: 0 } });
  };

  const plateBtnClick = () => {
    navigate("/ItemSelection", { state: { type: 1 } });
  };

  const bigPlateBtnClick = () => {
    navigate("/ItemSelection", { state: { type: 2 } });
  };

  return (
    <div className="cshr_optionContainer">
      <button className="cshr_optionBtn" onClick={bowlBtnClick}>
        Bowl
      </button>
      <button className="cshr_optionBtn" onClick={plateBtnClick}>
        Plate
      </button>
      <button className="cshr_optionBtn" onClick={bigPlateBtnClick}>
        Bigger Plate
      </button>
      <button className="cshr_optionBtn">Family Feast</button>
      <button className="cshr_optionBtn">Cub Meal</button>
      <button className="cshr_optionBtn">Drinks</button>
      <button className="cshr_optionBtn">A La Carte</button>
      <button className="cshr_optionBtn">Sides/Appetizers</button>
    </div>
  );
}

export default OrderView;
