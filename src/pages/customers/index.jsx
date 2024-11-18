import { useState } from "react";
import React from 'react';

export default function Customers() {
    const [ItemList, setItems] = useState([
        {id : 2, name : "chicken"},
        {id : 1, name : "ghost"}
    ]);

    return (
        <>
            {CheckoutView(ItemList, removeItem)}
        </>
    );
}

function removeItem({items, mod}, id_to_change) {
    mod(items => 
        items.filter(item => item.id !== id_to_change)
    );
}


function OrderItems(ItemList) {
    return(
        <ul>
        {ItemList.map((item, index) => (
            <li key={index}>{item.name}
                
            </li>
        ))}
        </ul>
    );
}

function CheckoutView(ItemList, removeItem) {
return (
    <div className="cshr_checkoutContainer">
    <div className="cshr_itemListContainer">
        {OrderItems(ItemList, removeItem)}
    </div>
    <div className="cshr_totalContainer">
        <h1 className="cshr_taxAmt">Tax: {getTax(ItemList)}</h1>
        <h1 className="cshr_totAmt">Total: {getTotal(ItemList)}</h1>
        <div className="cshr_btnContainer">
        <button className="cshr_checkoutBtn">Checkout</button>
        <button className="cshr_clearBtn">Clear</button>
        </div>
    </div>
    </div>
);
}

function getTax(items={ItemList}){
    return(
        // {items.map((item) => (
        //     <li key={item.id}>{item.name}</li>
        // ))}
        <>
            Yes
        </>
    )
}

function getTotal(items={ItemList}){
    return(
        // {items.map((item) => (
        //     <li key={item.id}>{item.name}</li>
        // ))}
        <>
            Also Yes
        </>
    )
}



