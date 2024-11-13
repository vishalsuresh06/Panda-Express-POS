import React from "react";

function OrderItems(props) {
  return (
    <div className="cshr_itemContainer">
      <h1 className="cshr_type">{props.type}</h1>
      <h1 className="cshr_side">{props.side}</h1>
      <h1 className="cshr_price">${props.price}</h1>
      <h1 className="cshr_e1">{props.entree1}</h1>
      {props.entree2 && <h1 className="cshr_e2">{props.entree2}</h1>}
      {props.entree3 && <h1 className="cshr_e3">{props.entree3}</h1>}
      <button className="cshr_removeButton">X</button>
    </div>
  );
}

export default OrderItems;
