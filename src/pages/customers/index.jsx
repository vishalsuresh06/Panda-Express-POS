import { useState, useEffect } from 'react';
import { apiURL, WEATHER_API_KEY } from '../../config.js';
import CheckoutView from "./CheckoutView";

import "./kiosk.css"


const WEATHER_REFRESH_MIN = 10

function Customers() {
    
    const [ItemList, setItems] = useState([]);
    const check = (name, togo) =>{
        // try {
        //     let response = await fetch(`${apiURL}/api/kiosk/`, {
        //         method: "POST"
        //     });

        //     if (response.ok) {
        //         const fetchedMenu = await response.json()
        //         const menuWithNumbers = fetchedMenu.map(item => ({
        //             ...item,
        //             id: Number(item.id),
        //             alt_price: parseFloat(item.alt_price)
        //         }));
        //         setMenu(menuWithNumbers)
        //     } else {
        //         return false
        //     }
        // } catch (error) {
        //     console.log(error);
        //     return false
        // }
        const subtotal = Object.values(ItemList).flat().reduce((sum, item) => {
            return sum + Number(item.price)
            
        }, 0)
        const total = subtotal * 1.08
        console.log("name: ",name)
        console.log("togo: ", togo)
        console.log("totalCost: ", total)
        console.log("employee: " , "Kiosk")
        clear()
    }


    const [currI, setCurr] = useState(0)
    const [sysState, setState] = useState("")
    const [menu, setMenu] = useState([])
    const [orderTypes, setOrderTypes] = useState([])
    const [currTime, setTime] = useState(new Date().toLocaleTimeString())
    const [currWeather, setWeather] = useState({})

    useEffect(() => {
        const intervalID = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(intervalID);
    }, []);

    var translateWidgetAdded = false;
    const googleTranslateElementInit = () => {
        if (!translateWidgetAdded) {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    autoDisplay: false,
                    includedLanguages: "en,es,zh,tl,vi,ar,fr,ko,ru,de", 
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                },
                "google_translate_element"
            );

            translateWidgetAdded = true;
        }
    };

    useEffect(() => {
        var addScript = document.createElement("script");
        addScript.setAttribute(
            "src",
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        );
        document.body.appendChild(addScript);
        window.googleTranslateElementInit = googleTranslateElementInit;
    }, []);


    async function fetchWeather() {
        try {
            console.log(WEATHER_API_KEY)
            let response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=30.601389&lon=-96.314445&units=imperial&appid=${WEATHER_API_KEY}`);
            if (response.ok) {
                const data = await response.json();
                setWeather(data)
            } else {
                setWeather({})
            }
        } catch (error) {
            console.log(error);
            setWeather({});
        }
    }

    useEffect(() => {
        const intervalID = setInterval(() => {
            fetchWeather();
        }, WEATHER_REFRESH_MIN*60*1000);
        
        fetchWeather();
        return () => clearInterval(intervalID);
    }, []);    

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
            let response = await fetch(`${apiURL}/api/kiosk/`, {
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


    
    const addItem = (OrderItemTypeID, totalPrice, itemList, itemName) => {
        setItems(current => [
            ...current, 
            { 
                array_id: currI, 
                type_id: orderTypes.find(item => item.name === OrderItemTypeID).id,
                name: OrderItemTypeID,
                price: totalPrice,
                items: itemList,
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
        if (sysState === "Bowl"){
            //bowl
            return (<BuildFood
                numEntree={1}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                typePrice = {orderTypes.find(item => item.name === sysState).base_price}
                />)
            
        }
        if (sysState === "Plate"){
            //plate
            return (<BuildFood
                 numEntree={2}
                 menu={menu}
                 addItem = {addItem}
                 setSys = {setState}
                 typeID = {sysState}
                 typePrice = {orderTypes.find(item => item.name === sysState).base_price}
                 />)
        }
        if (sysState === "Cub Meal"){
            //cub meal
            return (<BuildFood
                numEntree={1}
                numSide={2}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                upMult={0.666}
                typePrice = {orderTypes.find(item => item.name === sysState).base_price}
                />)
            
        }
        if (sysState === "Family Feast"){
            //family feast
            return (<BuildFood
                numEntree={3}
                numSide={2}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                typePrice = {orderTypes.find(item => item.name === sysState).base_price}
                upMult={3}
                />)
        }
        if (sysState === "Bigger Plate"){
            //bigger plate
            return (<BuildFood
                numEntree={3}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                typePrice = {orderTypes.find(item => item.name === sysState).base_price}
                />)
        }
        if (sysState === "Drink"){
            //Drink
            return (<SinglePick
                orderType={"Drink"}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                />)
        }
        if (sysState === "Appetizer"){
            //Appetizer
            return (<SinglePick
                orderType={"Appetizer"}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                />)
        }
        // if (sysState === "A La Carte"){
        //     //A La Carte
        //     return (<SinglePick
        //         orderType={"A La Carte"}
        //         menu={menu}
        //         addItem = {addItem}
        //         setSys = {setState}
        //         typeID = {sysState}
        //         />)
        // }
        return (<OrderButtons setSys={setState} orderTypes={orderTypes}/>)
    }
    
    
    return (
        <>
            <h4 className="notranslate">{currTime}</h4>
            <div id="google_translate_element"></div>
            {Object.keys(currWeather).length > 0 && <h4><span className="notranslate">{currWeather.current.temp.toFixed(0)} F</span> | {currWeather.current.weather[0].description.toUpperCase()}</h4>}
            <CheckoutView ItemList = {ItemList} removeAll = {clear} checkout = {check} remove_Item = {remove_item}/>
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
    const removeID = ["A La Carte (Side) (L)",
                      "A La Carte (Side) (S)",
                      "A La Carte (Entree) (S)",
                      "A La Carte (Entree) (M)",
                      "A La Carte (Entree) (L)"
    ]
    // console.log(orderTypes)

    // const navigate = useNavigate();

    function buttonPressAction(id){
        // {id: 1, name: 'Bowl', base_price: '8.30', price: NaN}
        // {id: 2, name: 'Plate', base_price: '9.80', price: NaN}
        // {id: 3, name: 'Cub Meal', base_price: '6.60', price: NaN}
        // {id: 4, name: 'Family Feast', base_price: '43.00', price: NaN}
        // {id: 5, name: 'Bigger Plate'
        console.log("change state: ", id)
        setSys(id)
    }

    return(
        <ul className="CK-subMenuOptions">
        {orderTypes.filter(type => !removeID.includes(type.name)).map((type) => (
            <div className='CK-subMenuOptionsItem' key={type.id}>
                <button onClick={() => buttonPressAction(type.name)}>
                    <div>{type.name}</div>
                    <div>${type.base_price}</div>
                    </button>
            </div>
        ))}
        <div className='CK-subMenuOptionsItem' key={8}>
            <button onClick={() => buttonPressAction("A La Carte")}>
                <div>A La Carte</div>
            </button>
        </div>
        </ul>
    );
}


function FoodCard({id, menu, setOrd, ord, max}){
    // console.log(menu)
    const  currItem = menu.find(item => item.id === id)
    const [clicked, setclick] = useState(0)
    const [numExtra, setExtra] = useState(0)
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
        // console.log("click")
        if (clicked === 0 && ord.filter(item=> item.type===currItem.type).length < max){
            setOrd(current => [...current, {array_id: numExtra, alt_price: currItem.alt_price, id: currItem.id, name: currItem.name, upcharge: currItem.upcharge, type: currItem.type}])
            setclick(1)
        }
        else{
            // console.log(ord[0].name)
            setExtra(0)
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
    function addAnother(){
        setOrd(current => [...current, {array_id: numExtra+1, alt_price: currItem.alt_price, id: currItem.id, name: currItem.name, upcharge: currItem.upcharge, type: currItem.type}])
        setExtra(numExtra + 1)
    }
    function killAnother(){
        setOrd(current => current.filter(item => !(item.id === currItem.id && item.array_id === numExtra)))
        setExtra(numExtra-1)
    }
    function MoreButton(){
        if (clicked===1 && ord.filter(item=> item.type===currItem.type).length < max){
            return (<div><button className="CK-addAnother" onClick={addAnother}>add another</button></div>)
        }
    }
    function LessButton(){
        if (numExtra > 0){
            return (<div><button className="CK-removeOne" onClick={killAnother}>remove 1</button></div>)
        }
    }
    function howMuch(){
        if(clicked===1){
            return (<div>{numExtra+1}</div>)
        }
    }
    return(
        <div className="CK-FoodCard">
        <button className={getStatus()} onClick={() => buttonHandle()}>
            <h4>{currItem.name}</h4>
            {isPrem()}
        </button>
        <MoreButton/>
        {howMuch()}
        <LessButton/>
        </div>
    )
}

function BuildFood({numEntree, numSide=1, menu, addItem, setSys, typeID, typePrice, upMult=1}){
    // console.log(numEntree)
    // console.log(menu)
    const [currOrder,setOrder] = useState([])
    console.log("curr order: ", currOrder)
    function Es(){
        if (numEntree === 1){
            return ("")
        }
        else{
            return ("s")
        }
    }
    function Ss(){
        if (numSide === 1){
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
            return sum + (Number(item.upcharge) * Number(upMult));
        }, Number(typePrice));
        console.log(total)
        addItem(typeID, total, currOrder)
        setSys("")
    }

    function CompleteButton(){
        if (numEntree === currOrder.filter(item => item.type === "Entree").length && numSide === currOrder.filter(item => item.type === "Side").length){
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
        <h3>Entree</h3>
        <h5>Pick {numEntree} entree{Es()}</h5>
        <ul className="CK-entrees">
            
            {menu.filter(item => item.type === "Entree").map((item) => (
                <li key={item.id}>
                    <FoodCard id={item.id} menu={menu} max={numEntree} setOrd={setOrder} ord={currOrder} />
                </li>
            ))}
        </ul>
        <h3>Side</h3>
        <h5>Pick {numSide} side{Ss()}</h5>
        <ul className="CK-sides">
            {menu.filter(item => item.type === "Side").map((item) => (
                <li key={item.id}>
                    <FoodCard id={item.id} menu={menu} max={numSide} setOrd={setOrder} ord={currOrder} />
                </li>
            ))}
        </ul>
        <div>
            <CompleteButton/>
        </div>
        
    </div>
    )
}

function SinglePick({orderType, typeID, menu, addItem, setSys}){
    const [currOrder,setOrder] = useState([])
    function completeOrder(){
        console.log(currOrder)
        currOrder.map(item=> (
            addItem(typeID, item.alt_price, [item])
        ))
        setSys("")
    }
    return(
    <div className = "CK-singlePick">
        <button onClick={() => setSys(-1)} className="CK-cancelOrder">Back</button>
        <ul className="CK-singlePickList CK-sides">
            {menu.filter(item => item.type === orderType).map((item) => (
                <li key={item.id}>
                    <FoodCard id={item.id} menu={menu} setOrd={setOrder} ord={currOrder} max={1}/>
                </li>
            ))}
        </ul>
        <div>
            <button className= "CK-CompleteButton" onClick={() => completeOrder()}>
                    Complete
                </button>
        </div>
    </div>
    )
}



export default Customers



