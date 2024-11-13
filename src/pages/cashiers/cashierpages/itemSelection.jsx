import { apiURL } from "../../../config.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../cashierstyles/itemSelection.css";

function ItemSelection() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderType = state?.type;

  // Arrays that would be populated from the database
  const sides = [
    { name: "Fried Rice", type: "side", upCharge: 0 },
    { name: "Steamed Rice", type: "side", upCharge: 0 },
    { name: "Chow Mein", type: "side", upCharge: 0 },
    { name: "Super Greens", type: "side", upCharge: 1.5 },
  ];

  const entrees = [
    { name: "Orange Chicken", type: "entree", upCharge: 0 },
    { name: "Beijing Beef", type: "entree", upCharge: 0 },
    { name: "Kung Pao Chicken", type: "entree", upCharge: 0 },
    { name: "SweetFire Chicken Breast", type: "entree", upCharge: 1.0 },
    { name: "Broccoli Beef", type: "entree", upCharge: 0 },
    { name: "Grilled Teriyaki Chicken", type: "entree", upCharge: 1.5 },
  ];

  // State to keep track of selected items
  const [selectedSide, setSelectedSide] = useState(null);
  const [selectedEntrees, setSelectedEntrees] = useState(
    Array(orderType === 0 ? 1 : orderType === 1 ? 2 : 3).fill(null)
  );

  const maxEntrees = selectedEntrees.length;

  // Price mapping for different order types
  const priceMapping = {
    0: 8.3, // Bowl
    1: 9.8, // Plate
    2: 11.3, // Bigger Plate
  };

  const orderPrice = priceMapping[orderType];

  // Handle side selection
  const handleSideSelect = (side) => {
    setSelectedSide(side);
  };

  // Handle entree selection for each entree slot
  const handleEntreeSelect = (entree, index) => {
    const updatedEntrees = [...selectedEntrees];
    updatedEntrees[index] = entree;
    setSelectedEntrees(updatedEntrees);
  };

  // Handle confirm button click
  const handleConfirmClick = () => {
    navigate("/cashier", {
      state: { selectedEntrees, selectedSide },
    });
  };

  return (
    <div className="cshr_itemContainer">
      <h1 className="cshr_orderType">
        {orderType === 0 ? "Bowl" : orderType === 1 ? "Plate" : "Bigger Plate"}-
        ${orderPrice.toFixed(2)}
      </h1>

      <h2 className="cshr_sideSelect">Pick a Side</h2>
      <div className="cshr_divBtnContainer">
        {sides.map((side) => (
          <button
            className={`cshr_sideBtn ${
              selectedSide === side ? "selected" : ""
            }`}
            key={side.name}
            onClick={() => handleSideSelect(side)}
          >
            {side.name} {side.upCharge > 0 && `(+$${side.upCharge})`}
          </button>
        ))}
      </div>

      <h2 className="cshr_entreeSelect">
        Pick {maxEntrees} Entree{maxEntrees > 1 && "s"}
      </h2>
      {selectedEntrees.map((_, index) => (
        <div className="cshr_divBtnContainer" key={index}>
          <h3>Entree {index + 1}</h3>
          {entrees.map((entree) => (
            <button
              className={`cshr_sideBtn ${
                selectedEntrees[index] === entree ? "selected" : ""
              }`}
              key={entree.name + index}
              onClick={() => handleEntreeSelect(entree, index)}
            >
              {entree.name} {entree.upCharge > 0 && `(+$${entree.upCharge})`}
            </button>
          ))}
        </div>
      ))}

      <button
        onClick={handleConfirmClick}
        disabled={!selectedSide || selectedEntrees.includes(null)}
      >
        Confirm
      </button>
    </div>
  );
}

export default ItemSelection;
