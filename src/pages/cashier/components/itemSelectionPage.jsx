import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiURL } from "../../../config";
import "./components.css";

function ItemSelection() {
  const location = useLocation();
  const { itemType } = location.state || {}; // Get the 'itemType' from state
  const [items, setItems] = useState([]);
  const [sides, setSides] = useState([]);
  const [entree, setEntree] = useState([]);
  const [app, setApps] = useState([]);
  const [drink, setDrinks] = useState([]);

  async function fetchMenu() {
    try {
      let response = await fetch(`${apiURL}/api/menu`);

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async function updateItems() {
    let data = await fetchMenu();
    setItems(data);
  }

  useEffect(() => {
    updateItems();
    setSides(items.filter((i) => i.type === "Side"));
    setEntree(items.filter((i) => i.type === "Entree"));
    setDrinks(items.filter((i) => i.type === "Drink"));
    setApps(items.filter((i) => i.type === "Appetizer"));
  }, []);

  if (itemType === 0) {
    //Bowl
    return (
      <div className="cshr_selectionContainer">
        <h1 className="cshr_classLbl">Bowl</h1>
        <h1 className="cshr_sideLbl">Side</h1>
        <h1 className="cshr_entreeLbl">Entree 1</h1>
      </div>
    );
  } else if (itemType === 1) {
    //Plate
    return (
      <div className="cshr_selectionContainer">
        <h1 className="cshr_classLbl">Bowl</h1>
        <h1 className="cshr_sideLbl">Side</h1>
        <h1 className="cshr_entreeLbl">Entree 1</h1>
        <h1 className="cshr_entreeLbl">Entree 2</h1>
      </div>
    );
  } else if (itemType === 2) {
    //Bigger Plate
    return (
      <div className="cshr_selectionContainer">
        <h1 className="cshr_classLbl">Bowl</h1>
        <h1 className="cshr_sideLbl">Side</h1>
        <h1 className="cshr_entreeLbl">Entree 1</h1>
        <h1 className="cshr_entreeLbl">Entree 2</h1>
        <h1 className="cshr_entreeLbl">Entree 3</h1>
      </div>
    );
  } else if (itemType === 3) {
    //Cub Meal
  } else if (itemType === 4) {
    //Family Feast
  } else if (itemType === 5) {
    //Drinks
  } else if (itemType === 6) {
    //A La Carte
  } else if (itemType === 7) {
    //Sides/Appetizers
  } else return <h1>No Item Selected</h1>;
}

export default ItemSelection;
