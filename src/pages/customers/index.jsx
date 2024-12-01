import { useState, useEffect } from 'react';
import { apiURL } from '../../config.js';
import CheckoutView from "./CheckoutView";
import "./kiosk.css"




function Customers() {
    const [currI, setCurr] = useState(0)
    const [sysState, setState] = useState(-1)
    const [menu, setMenu] = useState([])
    const [ItemList, setItems] = useState([
        {array_id : -2, type_id : 9, price : 9.00, name : "chicken"},
        {array_id : -1, type_id : 1, price : 2.00, name : "ghost"}
    ]);
    const [orderTypes, setOrderTypes] = useState([])

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

    
    const addItem = (OrderItemTypeID, totalPrice, itemList) => {
        setItems(current => [
            ...current, 
            { 
                array_id: currI, 
                type_id: OrderItemTypeID,
                type_name: orderTypes.find(item => item.id === OrderItemTypeID).name,
                price: totalPrice,
                items: itemList
            }
        ]);
    
        console.log("Item created with id ", currI, " items: ", itemList);
        setCurr(currI + 1); // Increment the current item index
    };

    // const navigate = useNavigate();

    // useEffect(() => {
    //     navigate('base');
    // }, [navigate]);


    const Order = () => {
        if (sysState === 1){
            //bowl
            return (<BuildFood
                numEntree={1}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                typePrice = {orderTypes.find(item => item.id === sysState).base_price}
                />)
            
        }
        if (sysState === 2){
            //plate
            return (<BuildFood
                 numEntree={2}
                 menu={menu}
                 addItem = {addItem}
                 setSys = {setState}
                 typeID = {sysState}
                 typePrice = {orderTypes.find(item => item.id === sysState).base_price}
                 />)
        }
        if (sysState === 3){
            //family feast
            
        }
        if (sysState === 4){
            //cub meal
        }
        if (sysState === 5){
            //bigger plate
            return (<BuildFood
                numEntree={3}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                typePrice = {orderTypes.find(item => item.id === sysState).base_price}
                />)
        }
        return (<OrderButtons setSys={setState} orderTypes={orderTypes}/>)
    }
    

    return (
        <>
            <CheckoutView ItemList = {ItemList} removeAll = {clear} checkout = {addWater} remove_Item = {remove_item}/>
            {/* <WaterButton menu= {menu} addItem = {addItem}/> */}
            {Order()}
        </>
    );
}

// function WaterButton({ menu, addItem }){
//     const id = 13
//     console.log(id)
//     return (
//         <button onClick={() => addItem(id)}>
//             add water
//         </button>
//     )
// }

function OrderButtons({setSys, orderTypes}){

    console.log(orderTypes)

    // const navigate = useNavigate();

    function buttonPressAction(id){
        // {id: 1, name: 'Bowl', base_price: '8.30', price: NaN}
        // {id: 2, name: 'Plate', base_price: '9.80', price: NaN}
        // {id: 3, name: 'Cub Meal', base_price: '6.60', price: NaN}
        // {id: 4, name: 'Family Feast', base_price: '43.00', price: NaN}
        // {id: 5, name: 'Bigger Plate'
        console.log("chage state: ", id)
        setSys(id)
    }

    return(
        <ul className="CK-subMenuOptions">
        {orderTypes.map((type) => (
            <div className='CK-subMenuOptionsItem' key={type.id}>
                <button onClick={() => buttonPressAction(type.id)}>
                    <div>{type.name}</div>
                    <div>{type.base_price}</div>
                    </button>
            </div>
        ))}
        </ul>
    );
}


function FoodCard({id, menu, setOrd, ord}){
    // console.log(menu)
    const  currItem = menu.find(item => item.id === id)
    const [clicked, setclick] = useState(0)
    function isPrem(){
        // console.log("0.00 === ", currItem.upcharge)
        if(currItem.upcharge === "0.00"){
            return (<h5 className= "CK-FoodCard-Subtitle">normal item</h5>)
        }
        else{
            return(
                <>
                <h5 className= "CK-FoodCard-Subtitle">premium item</h5>
                <div className= "CK-FoodCard-upchargeTag">{currItem.upcharge}</div>
                </>
            )
        }
    }

    function buttonHandle(){
        console.log("click")
        if (clicked === 0 || clicked === 2){
            setOrd(current => [...current, {id: currItem.id, name: currItem.name, upcharge: currItem.upcharge, type: currItem.type}])
            setclick(1)
        }
        else{
            console.log(ord[0].name)
            setOrd(items => items.filter(item => item.id !== currItem.id))
            setclick(0)
        }
    }

    function getStatus(){
        if (clicked === 1){
            return "CK-clicked"
        }
        else{
            return "CK-unclicked"
        }
    }
    return(
        <div className="CK-FoodCard">
        <button className={getStatus()} onClick={() => buttonHandle()}>
            <h4>{currItem.name}</h4>
            {isPrem()}
        </button>
        </div>
    )
}
function BuildFood({numEntree, menu, addItem, setSys, typeID, typePrice}){
    // console.log(numEntree)
    // console.log(menu)
    const [currOrder,setOrder] = useState([])
    console.log("curr order: ", currOrder)
    function s(){
        if (numEntree === 1){
            return ("")
        }
        else{
            return ("s")
        }
    }

    function completeOrder(){
        console.log(typePrice)
        const total = currOrder.reduce((sum, item) => {
            console.log("add: ", item.upcharge, sum)
            return sum + (Number(item.upcharge));
        }, Number(typePrice));
        console.log(total)
        addItem(typeID, total, currOrder)
        setSys(-1)
    }

    function CompleteButton(){
        if (numEntree === currOrder.filter(item => item.type === "Entree").length && 1 === currOrder.filter(item => item.type === "Side").length){
            return (
                <button className= "CK-CompleteButton" onClick={completeOrder}>
                    Complete
                </button>
            )
        }
        else {
            return(
                <div className="CK-nonCompleteButton">
                    Order incomplete
                </div>
            )
        }
    }

    return (
    <div className = "CK-BuildFoodPage">
        <button onClick={() => setSys(-1)} className="CK-cancelOrder">Back</button>
        <ul className="CK-entrees">
            <h3>Entree</h3>
            <h5>Pick {numEntree} entree{s()}</h5>
            {menu.filter(item => item.type === "Entree").map((item) => (
                <li key={item.id}>
                    <FoodCard id={item.id} menu={menu} setOrd={setOrder} ord={currOrder} />
                </li>
            ))}
            <CompleteButton/>
        </ul>
        <ul className="CK-sides">
            <h3>Side</h3>
            <h5>Pick {numEntree} entree{s()}</h5>
            {menu.filter(item => item.type === "Side").map((item) => (
                <li key={item.id}>
                    <FoodCard id={item.id} menu={menu} setOrd={setOrder} ord={currOrder} />
                </li>
            ))}
        </ul>
        
    </div>
    )
}



export default Customers



