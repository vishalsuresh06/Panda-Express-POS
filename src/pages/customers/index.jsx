import { useState } from "react";
import React from 'react';
import CheckoutView from "./CheckoutView";

export default function Customers() {
    const [ItemList, setItems] = useState([
        {id : 9, price : 9.00, name : "chicken"},
        {id : 1, price : 2.00, name : "ghost"}
    ]);

    const remove_item = (id_to_remove)=>{
        setItems(items => 
                items.filter(item => item.id !== id_to_remove)
            );
    }

    const clear = () => {
        setItems([])
    }

    return (
        <>
            <CheckoutView ItemList = {ItemList} removeAll = {clear} remove_Item = {remove_item}/>
        </>
    );
}



