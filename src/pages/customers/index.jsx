import { useState, useEffect } from "react";
import { apiURL, WEATHER_API_KEY } from "../../config.js";
import CheckoutView from "./CheckoutView";
import Chatbot from '@components/Chatbot/Chatbot';
import "./kiosk.css"
const WEATHER_REFRESH_MIN = 10

/**
 * 
 * @module Kiosk
 */

/** CK
 * Time container, that holds and maintains the time state
 * @returns the current time, using an api
 */
function Time(){
    const [currTime, setTime] = useState(new Date().toLocaleTimeString())
    useEffect(() => {
        const intervalID = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  return <h4 className="notranslate">{currTime}</h4>;
}

/** CK
 * parent component, manages most states and all other components
 * 
 * @returns All the HTML for the kiosk page
 */
export default function Customers() {
    const [currI, setCurr] = useState(0)
    const [sysState, setState] = useState("")
    const [menu, setMenu] = useState([])
    const [ItemList, setItems] = useState([]);
    const [orderTypes, setOrderTypes] = useState([])
    const [currWeather, setWeather] = useState({})
    
    /** CK
     * completes the check out process, recording the current order in the database,
     * and clearing out the kiosk for the next person to order
     * @param {String} name 
     * Name on order for identification
     * @param {Boolean} togo 
     * identifier for togo or here order
     * @returns Nothing
     */
    const check = async (name, togo) => {
        if (name == "" || ItemList.length == 0) {
            return;
        }

        const total = Object.values(ItemList).flat().reduce((sum, item) => {
            return sum + Number(item.price)
        }, 0) * 1.08;

        const orderJSON = {
            "name": name,
            "type": togo ? "togo" : "here",
            "total": total,
            "employee": "kiosk",
            "orderItems": ItemList
        }
        try {
            let response = await fetch(`${apiURL}/api/kiosk/`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderJSON),
            });	

            clear()
			return response.ok;
			
        } catch (error) { return false; }
    }

    const total =
      Object.values(ItemList)
        .flat()
        .reduce((sum, item) => {
          return sum + Number(item.price);
        }, 0) * 1.08;

    console.log(ItemList);

    const orderJSON = {
      name: name,
      type: togo ? "togo" : "here",
      total: total,
      employee: "kiosk",
      orderItems: ItemList,
    };
    try {
      let response = await fetch(`${apiURL}/api/kiosk/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderJSON),
      });

      clear();
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  var translateWidgetAdded = false;
  const googleTranslateElementInit = () => {
    if (!translateWidgetAdded) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          includedLanguages: "en,es,zh,tl,vi,ar,fr,ko,ru,de",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
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
      let response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=30.601389&lon=-96.314445&units=imperial&appid=${WEATHER_API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
      } else {
        setWeather({});
      }
    } catch (error) {
      console.log(error);
      setWeather({});
    }
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      fetchWeather();
    }, WEATHER_REFRESH_MIN * 60 * 1000);

    fetchWeather();
    return () => clearInterval(intervalID);
  }, []);

  async function updateOrders() {
    try {
      let response = await fetch(`${apiURL}/api/kiosk_orders/`);

      if (response.ok) {
        const fetchedMenu = await response.json();
        // console.log("FETCHED TYPES:")
        // console.log(fetchedMenu);
        const menuWithNumbers = fetchedMenu.map((item) => ({
          ...item,
          id: Number(item.id),
          price: parseFloat(item.Base_price),
        }));
        setOrderTypes(menuWithNumbers);
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }

    /**
     * clears out the current order
     */
    const clear = () => {
        setItems([])
    }


    /** CK
     * Adds another item to the order state
     * @param {int} OrderItemTypeID 
     * @param {float} totalPrice 
     * @param {JSON} itemList 
     * @param {string} itemName 
     */
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
    
        // console.log("Item created with id ", currI, " items: ", itemList);
        setCurr(currI + 1); // Increment the current item index
    };

    // const navigate = useNavigate();

    // useEffect(() => {
    //     navigate('base');
    // }, [navigate]);

    /**helper function for right side of screen
     * 
     * @returns given a systate, returns the screen the user wants to see 
     */
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
                orderType={"drink"}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                />)
        }
        if (sysState === "Appetizer"){
            //Appetizer
            return (<SinglePick
                orderType={"appetizer"}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                />)
        }
        if (sysState === "A La Carte"){
            //A La Carte
            return (<><SinglePick
                orderType={"entree"}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                complete = {false}
                />
                <SinglePick
                orderType={"side"}
                menu={menu}
                addItem = {addItem}
                setSys = {setState}
                typeID = {sysState}
                />
                </>)
        }
        return (<OrderButtons setSys={setState} orderTypes={orderTypes}/>)
    }
    
    
    return (
    <>
        <Time />
        <div id="google_translate_element"></div>
        {Object.keys(currWeather).length > 0 && (
            <h4>
                <span className="notranslate">
                    {currWeather.current.temp.toFixed(0)} F
                </span> 
                | {currWeather.current.weather[0].description.toUpperCase()}
            </h4>
        )}
        <div className="CK-screenContainer">
            <CheckoutView
                ItemList={ItemList}
                removeAll={clear}
                checkout={check}
                remove_Item={remove_item}
            />
            <div className="CK-OrderContainer">{Order()}</div>
        </div>
        {/* Chatbot Integration */}
        <div className="chatbot-container">
            <Chatbot menu={menu} />
        </div>
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

/** CK
 *  creates the list of buttons to other screens on startup
 * @param {JSON} {setSys, orderTypes}
 * takes in a json of the sysstate setter and the JSON of ordertypes
 * @returns 
 */
function OrderButtons({setSys, orderTypes}){
    console.log("CONSTRUCTING BUTTONS WITH THE FOLLOWING TYPES:");
    console.log(orderTypes);
    const removeID = ["A La Carte (Side) (L)",
                      "A La Carte (Side) (S)",
                      "A La Carte (Entree) (S)",
                      "A La Carte (Entree) (M)",
                      "A La Carte (Entree) (L)"
    ]
    // console.log(orderTypes)

    // const navigate = useNavigate();

    /**CK
     *  helper actionhandler function
     * @param {int} id 
     */
    function buttonPressAction(id){
        // {id: 1, name: 'Bowl', base_price: '8.30', price: NaN}
        // {id: 2, name: 'Plate', base_price: '9.80', price: NaN}
        // {id: 3, name: 'Cub Meal', base_price: '6.60', price: NaN}
        // {id: 4, name: 'Family Feast', base_price: '43.00', price: NaN}
        // {id: 5, name: 'Bigger Plate'
        //console.log("change state: ", id)
        setSys(id)
    }

    return(
        <ul className="CK-subMenuOptions">
        {orderTypes.filter(type => !removeID.includes(type.name)).map((type) => (
            <div className='CK-subMenuOptionsItem' key={type.id}>
                <button className='CK-subMenuOptionsItemButton' onClick={() => buttonPressAction(type.name)}>
                    <div>{type.name}</div>
                    <div>${type.base_price}</div>
                    </button>
            </div>
        ))}
      {/* <div className='CK-subMenuOptionsItem' key={8}>
            <button onClick={() => buttonPressAction("A La Carte")}>
                <div>A La Carte</div>
            </button>
        </div> */}
    </ul>
  );
}


/** CK
 * 
 * @param {int, JSON, function, int, int, int} input
 * takes in a JSON for data
 * @returns a "food card" HTML object with information on one food, and manages its own button functionality
 */
function FoodCard({id, menu, setOrd, ord, max, upMult}){
    // console.log(menu)
    const  currItem = menu.find(item => item.id === id)
    const [clicked, setclick] = useState(0)
    const [numExtra, setExtra] = useState(0)
    /** CK
     * helper function to return upcharge info conditionally
     * @returns HTML about upcharge information
     */
    function isPrem(){
        // console.log("0.00 === ", currItem.upcharge)
        if(currItem.upcharge === "0.00"){
            return (<h5 className= "CK-FoodCard-Subtitle">normal item</h5>)
        }
        else{
            return(
                <>
                <h5 className= "CK-FoodCard-Subtitle">premium item</h5>
                <div className= "CK-FoodCard-upchargeTag">{(currItem.upcharge * upMult).toFixed(2)}</div>
                </>
            )
        }
    }

    /**
     * handles button clicks-- adds an item on first click, removes all instances of itself on second
     */
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
  }
    /** CK
     * helper function to redefine the tag so that it can be styled differently on click
     * @returns HTML className tag
     */
    function getStatus(){
        if (clicked === 1){
            return "CK-clicked"
        }
        else{
            return "CK-unclicked"
        }
    }

    /**
     * button helper to add one more
     */
    function addAnother(){
        setOrd(current => [...current, {array_id: numExtra+1, alt_price: currItem.alt_price, id: currItem.id, name: currItem.name, upcharge: currItem.upcharge, type: currItem.type}])
        setExtra(numExtra + 1)
    }
    /**
     * button helper to remove one item
     */
    function killAnother(){
        setOrd(current => current.filter(item => !(item.id === currItem.id && item.array_id === numExtra)))
        setExtra(numExtra-1)
    }

    /**
     *  conditionally returns HTML add 1 button using action above
     * @returns HTML button
     */
    function MoreButton(){
        if (clicked===1 && ord.filter(item=> item.type===currItem.type).length < max){
            return (<div><button className="CK-addAnother" onClick={addAnother}>add another</button></div>)
        }
    }

    /**
     * conditionally returns HTML remove 1 button
     * @returns HTML remove button
     */
    function LessButton(){
        if (numExtra > 0){
            return (<div><button className="CK-removeOne" onClick={killAnother}>remove 1</button></div>)
        }
    }

    /**
     * helper to return the current amount of items
     * @returns current amount of items
     */
    function howMuch(){
        if(clicked===1){
            return (<div>{numExtra+1}</div>)
        }
    }
  }
  return (
    <div className="CK-FoodCard">
      <button className={getStatus()} onClick={() => buttonHandle()}>
        <h4>{currItem.name}</h4>
        {isPrem()}
      </button>
      <MoreButton />
      {howMuch()}
      <LessButton />
    </div>
  );
}


/**
 * 
 * @param {int, int, JSON, function, function, int, float, int} param0 
 * @returns HTML of all Entree and Side order options, with limitations for the number of entrees and sides.
 * used with bowls, plates, bigger plates, cub meals, and family feasts
 */
function BuildFood({numEntree, numSide=1, menu, addItem, setSys, typeID, typePrice, upMult=1}){
    // console.log(numEntree)
    // console.log(menu)
    const [currOrder,setOrder] = useState([])
    // console.log("curr order: ", currOrder)

    /**
     * helper function to conditionally return s for entrees
     * @returns conditional "s"
     */
    function Es(){
        if (numEntree === 1){
            return ("")
        }
        else{
            return ("s")
        }
    }

    /**
     * helper function to conditionally return s for sides
     * @returns conditional "s"
     */
    function Ss(){
        if (numSide === 1){
            return ("")
        }
        else{
            return ("s")
        }
    }

    /**
     * helper function to add the current selected item to the order
     */
    function completeOrder(){
        //console.log(typePrice)
        const total = currOrder.reduce((sum, item) => {
            //console.log("add: ", item.upcharge, sum)
            return sum + (Number(item.upcharge) * Number(upMult));
        }, Number(typePrice));
        //console.log(total)
        addItem(typeID, total, currOrder)
        setSys("")
    }

    /**
     * helper function to handle complete button
     * @returns conditionally returns the complete button if all requirements are met
     */
    function CompleteButton(){
        if (numEntree === currOrder.filter(item => item.type === "entree").length && numSide === currOrder.filter(item => item.type === "side").length){
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
            
            {menu.filter(item => item.type === "entree").map((item) => (
                <li key={item.id}>
                    <FoodCard id={item.id} menu={menu} max={numEntree} setOrd={setOrder} ord={currOrder} upMult={upMult}/>
                </li>
            ))}
        </ul>
        <h3>Side</h3>
        <h5>Pick {numSide} side{Ss()}</h5>
        <ul className="CK-sides">
            {menu.filter(item => item.type === "side").map((item) => (
                <li key={item.id}>
                    <FoodCard id={item.id} menu={menu} max={numSide} setOrd={setOrder} ord={currOrder} />
                </li>
            ))}
        </ul>
        <div>
            <CompleteButton/>
        </div>
        
    </div>
  );
}

/**
 * allows picking of a La Carte items, drinks, etc
 * @param {string, int, JSON, function, function} param0 
 * @returns HTML of all foodcards for the ordertype passed in
 */
function SinglePick({orderType, typeID, menu, addItem, setSys, complete=true}){
    const [currOrder,setOrder] = useState([])

    /**
     * function to add the current item to the order
     */
    function completeOrder(){
        //console.log(currOrder)
        currOrder.map(item=> (
            addItem(typeID, item.alt_price, [item])
        ))
        setSys("")
    }

    function getCButton(){
        if (complete)
            return(
                <button className= "CK-CompleteButton" onClick={() => completeOrder()}>
                    Done
                </button>
            )
    }
    return(
    <div className = "CK-singlePick">
        <ul className="CK-singlePickList CK-sides">
            {menu.filter(item => item.type === orderType).map((item) => (
                <li key={item.id}>
                    <FoodCard id={item.id} menu={menu} setOrd={setOrder} ord={currOrder} max={1} upMult={1}/>
                </li>
            ))}
        </ul>
        <div>
            {getCButton()}
        </div>
    </div>
  );
}
