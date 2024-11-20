import { useState } from "react";
import React from 'react';

export default function Customers() {
    const [ItemList, setItems] = useState([
        {id : 9, price : 9, name : "chicken"},
        {id : 1, price : 2, name : "ghost"}
    ]);

    const remove_item = (id_to_remove)=>{
        setItems(items => 
                items.filter(item => item.id !== id_to_remove)
            );
    }

    return (
        <>
            <CheckoutView ItemList = {ItemList} set = {setItems} remove_Item = {remove_item}/>
        </>
    );
}



function OrderItems({ItemList, set, remove_Item}) {
    return(
        <ul>
        {ItemList.map((item, index) => (
            <li key={item.id}>
                {item.name}
                <div className="Cust_killOrderButton">
                <button onClick={() => remove_Item(item.id)}> exit</button>
                </div>
            </li>
        ))}
        </ul>
    );
}

function Subtotal(items){
    console.log(Object.values(items).flat())
    const total = Object.values(items).flat().reduce((sum, item) => {
        console.log(sum)
        return sum + Number(item.price)
        
    }, 0)
    console.log(total)
    return(
        // {items.map((item) => (
        //     <li key={item.id}>{item.name}</li>
        // ))}
        <>
            {total}
        </>
    );
}

function CheckoutView({ItemList, set, remove_Item}) {
return (
    <div className="cshr_checkoutContainer">
    <div className="cshr_itemListContainer">
        <OrderItems ItemList = {ItemList} set = {set}  remove_Item = {remove_Item}/>
    </div>
    <div className="cshr_totalContainer">
        <h1 className="cshr_taxAmt">Subtotal: <Subtotal items = {ItemList}/></h1>
        
        <h1 className="cshr_totAmt">Total: {getTotal(ItemList)}</h1>
        <div className="cshr_btnContainer">
        <button className="cshr_checkoutBtn">Checkout</button>
        <button className="cshr_clearBtn">Clear</button>
        </div>
    </div>
    </div>
);
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



