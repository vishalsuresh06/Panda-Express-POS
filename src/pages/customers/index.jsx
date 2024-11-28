import { createContext, useContext, useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { apiURL } from '../../config.js';
import CheckoutView from "./CheckoutView";

function Customers() {
    const [currI, setCurr] = useState(0)
    const [menu, setMenu] = useState([])
    const [orderTypes, setOrderTypes] = useState([])
    const [ItemList, setItems] = useState([
        {array_id : -2, type_id : 9, price : 9.00, name : "chicken"},
        {array_id : -1, type_id : 1, price : 2.00, name : "ghost"}
    ]);

    

    useEffect( () => async function updateMenu(){
        try {
            let response = await fetch(`${apiURL}/api/kiosk_menu/`, {
                method: "GET"
            });

            if (response.ok) {
                const fetchedMenu = await response.json()
                const menuWithNumbers = fetchedMenu.map(item => ({
                    ...item,
                    id: Number(item.id),
                    alt_price: parseFloat(item.alt_price)
                }));
                setMenu(menuWithNumbers)
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
            return false
        }
    }, [])

    useEffect( () => async function updateOrders(){
        try {
            let response = await fetch(`${apiURL}/api/kiosk_orders/`, {
                method: "GET"
            });

            if (response.ok) {
                const fetchedMenu = await response.json()
                const menuWithNumbers = fetchedMenu.map(item => ({
                    ...item,
                    id: Number(item.id),
                    price: parseFloat(item.Base_price)
                }));
                setOrderTypes(menuWithNumbers)
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
            return false
        }
    }, [])

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

    
    const addItem = (id) => {
        // Find the item in the menu array by matching the id
        const item = menu.find(item => item.id === id);
    
        // If the item isn't found, log an error and return early
        if (!item) {
            console.error(`Item with id ${id} not found in the menu.`);
            return;  // Stop execution if no matching item is found
        }
    
        // Proceed to add the item to the ItemList
        setItems(current => [
            ...current, 
            { 
                array_id: currI, 
                type_id: item.id, 
                price: parseFloat(item.alt_price), // Use alt_price for price
                name: item.name
            }
        ]);
    
        console.log("Item created with id ", currI, " item: ", item);
        setCurr(currI + 1); // Increment the current item index
    };
    

    return (
        <>
            <CheckoutView ItemList = {ItemList} removeAll = {clear} checkout = {addWater} remove_Item = {remove_item}/>
            <WaterButton menu= {menu} addItem = {addItem}/>
            <Outlet/>
        </>
    );
}

function WaterButton({ menu, addItem }){
    const id = 13
    console.log(id)
    return (
        <button onClick={() => addItem(id)}>
            add water
        </button>
    )
}

function OrderButtons(){
    return(
        <></>
    )
}

export {Customers,OrderButtons}



