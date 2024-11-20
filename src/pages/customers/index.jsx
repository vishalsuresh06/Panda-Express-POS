import { useState } from "react";
import React from 'react';
import { apiURL } from '../../config.js';
import CheckoutView from "./CheckoutView";

export default function Customers() {
    const [currI, setCurr] = useState(0)
    const [menu, setMenu] = useState([])
    const [ItemList, setItems] = useState([
        {array_id : -2, type_id : 9, price : 9.00, name : "chicken"},
        {array_id : -1, type_id : 1, price : 2.00, name : "ghost"}
    ]);

    async function updateMenu(){
        try {
            let response = await fetch(`${apiURL}/api/kiosk_menu/`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });

            if (response.ok) {
                return response
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
            return false
        }
    }

    const remove_item = (id_to_remove)=>{
        setItems(items => 
                items.filter(item => item.array_id !== id_to_remove)
            );
    }

    const clear = () => {
        setItems([])
    }

    const addWater = () =>{
        setItems(current => [...current, {array_id : currI, type_id : 0, price : 1.00, name : "Water"}])
        console.log("water created with id ", currI)
        setCurr(currI + 1)
    }

    return (
        <>
            <CheckoutView ItemList = {ItemList} removeAll = {clear} checkout = {addWater} remove_Item = {remove_item}/>
            
        </>
    );
}



