import { createContext, useContext, useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { apiURL, WEATHER_API_KEY} from '../../config.js';
import './kitchen.css';


//! PAGE SETTINGS
const SettingsContext = createContext(null);
const WEATHER_REFRESH_MIN = 10;					// DON'T INCREASE THIS, >1000 API calls charges Ryan (please no)

//! HELPER COMPONENTS
function CardButtons({onHandle, inProgress, order}) {
	if (inProgress) {
		return <div className="kt-buttons">
			<button className="kt-toggle" onClick={() => onHandle(order, "toggle")}> {order.status == "pending" ? "Start" : "Stop"} </button>
			<button className="kt-cancel" onClick={() => onHandle(order, "cancel")}> Cancel </button>
			<button className="kt-complete" onClick={() => onHandle(order, "complete")}> Confirm </button>
		</div>
	} else {
		return <div className="kt-buttons">
			<button className="kt-restore" onClick={() => onHandle(order, "restore")}> Restore </button>
		</div>
	}
}

function OrderItemCard({orderItem}) {
		
	return (<div className="kt-orderItemCard">
		<h3> {orderItem.order_item_type.name} </h3>
		<ul> {
			
			orderItem.food_items.map((food_item, index) => (
				<li className="notranslate" key={index}>&ensp; {food_item.quantity} x {food_item.food_item} </li>
			))

		} </ul>
	</div>)
}

function OrderCard({order, onHandle, displayFullCard, inProgress}) {
	const { settings, setSettings } = useContext(SettingsContext);

	// "Time since order"
	const [TOS, setTOS] = useState(calcTOS())
	function calcTOS() {
		function padnum(num) {
			return String(num).padStart(2, '0');
		}

		let sec = Math.floor((Date.now()-Date.parse(order.date_created))/1000);
		let min = Math.floor(sec/60);
		let hr = Math.floor(min/60);
		return `${hr>0 ? `${hr}h` : ''} ${min>0 ? `${padnum(min%60)}m` : ''} ${padnum(sec%60)}s`
	}

	// 1s timer to update the TOS on every card
	useEffect(() => {
		const intervalID = setInterval(() => {
			setTOS(calcTOS());
		}, 1000);
		
		return () => clearInterval(intervalID);
	}, []);	

	
	const cardColors = {
		"pending": settings.kt_pendingColor,
		"in_progress": settings.kt_inprogressColor,
		"completed": settings.kt_completedColor,
		"cancelled": settings.kt_cancelledColor,
	}

	const style = {
		backgroundColor: cardColors[order.status]
	};

	return (<div style={style} className="kt-orderCard">
		<div className="kt-orderCardHeaders">	
			<h3 className="kt-orderInfo"> #{order.id} for "{order.customer_name}" </h3>
			<h3 className="kt-TOS notranslate"> {inProgress && TOS} </h3>
		</div>

		<div>
			{displayFullCard && <div className="kt-orderCardBody">
				<ul className="kt-orderItemList"> {
					
					order.order_items.map((orderItem, index) => (
						<li key={index}> <OrderItemCard orderItem={orderItem}/> </li>
					))

				} </ul>

				
				<CardButtons onHandle={onHandle} inProgress={inProgress} order={order}/>
			</div>}	
		</div>

	</div>)
}

function OrderColumn({title, orders, onHandle, current}) {
	const { settings, setSettings } = useContext(SettingsContext);

	return (<div className="kt-column">
		<h1>{title} ({orders.length})</h1>

		<ul className="kt-cardList">
			{orders.map((order, index) => (
				<li key={index}> 
						<OrderCard  order={order} 
									onHandle={onHandle} 
									displayFullCard={!current || index<Number(settings.kt_fullOrderCount)} 
									inProgress={current}/> 
				</li>
			))}
		</ul>
	</div>)
}



//! MAIN COMPONENTS
function NavBar() {
	const {settings, setSettings} = useContext(SettingsContext);
	const [weather, setWeather] = useState({});
	const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());


	async function fetchWeather() {
		try {
			let response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=30.601389&
																						lon=-96.314445&
																						units=${settings.kt_tempUnits == "F" ? "imperial" : "metric"}&
																						appid=${WEATHER_API_KEY}`);
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
			setCurrentTime(new Date().toLocaleTimeString());
		}, 1000);
		
		return () => clearInterval(intervalID);
	}, []);	

	useEffect(() => {
		const intervalID = setInterval(() => {
			fetchWeather();
		}, WEATHER_REFRESH_MIN*60*1000);
		
		fetchWeather();
		return () => clearInterval(intervalID);
	}, [settings.kt_tempUnits]);	

	return (<div className="kt-navBar">
		<div id="google_translate_element"></div>
		<h4 className="notranslate">{currentTime}</h4>
			<Link className="kt-navBtn" to="/kitchen/orders">Orders</Link>
			<Link className="kt-navBtn" to="/kitchen/recentorders">Recent Orders</Link>
		{Object.keys(weather).length > 0 && <h4><span className="notranslate">{weather.current.temp} {settings.kt_tempUnits}</span> | {weather.current.weather[0].description.toUpperCase()}</h4>}
	</div>)
}

function KitchenOrders() {
	const [ordersHere, setOrdersHere] = useState([]);
	const [ordersTogo, setOrdersTogo] = useState([]);
	const { settings, setSettings } = useContext(SettingsContext);

	// Fetches the pending orders from the database
	async function fetchOrders() {
		try {
			let response = await fetch(`${apiURL}/api/kitchen/orders`);

			if (response.ok) {
				const data = await response.json();
				sethooks(data.here, data.togo);

			} else {
				sethooks([], []);
			}
		} catch (error) {
			sethooks([], []);
		}
	}

	// Either "comlete" or "cancel" or "toggle" the target order 
	const handleOrder = async (order, action) => {
		console.log(action);

		if (action == "toggle") {
			toggleOrder(order);
		} else if (action == "complete" || action == "cancel") {
			removeOrder(order, action);
		}
	}

	// Request "pending" & "in-progress" orders on page load & fresh periodically
	useEffect(() => {
		const intervalID = setInterval(() => {
			fetchOrders();
		}, parseInt(settings.kt_refreshRate)*1000);
		
		fetchOrders();	
		return () => clearInterval(intervalID);
	}, []);	


	// HELPER METHODS
	function sethooks(here, togo) {
		setOrdersHere(here);
		setOrdersTogo(togo);
	}

	async function toggleOrder(order) {
		
		// Update database with POST request
		let reqBody = { action: "toggle", orderID: order.id }
        try {
            let response = await fetch(`${apiURL}/api/kitchen/orders`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });	

			// Toggles the items locally w/o refetching to reduce latency
            if (response.ok) {
				order.status = order.status == "pending" ? "in_progress" : "pending";
			}
			return response.ok;
			
        } catch (error) { return false; }
	}

	async function removeOrder(order, action) {
		// Update database with POST request
		let reqBody = { action: action, orderID: order.id }
        try {
            let response = await fetch(`${apiURL}/api/kitchen/orders`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });	

			// Removes the items locally w/o refetching to reduce latency
            if (response.ok) {
				if (order.type == "here") {
					setOrdersHere(ordersHere => ordersHere.filter(o => o !== order));
				} else if (order.type == "togo") {
					setOrdersTogo(ordersTogo => ordersTogo.filter(o => o !== order));
				}
			}
			return response.ok;
			
        } catch (error) { return false; }
	}

	if (settings.kt_hereOrdersLeft == "true") {
		return (<>
			<div className="kt-columnContainer">
				<OrderColumn title={"Here"} orders={ordersHere} onHandle={handleOrder} current={true}/>
				<OrderColumn title={"Togo"} orders={ordersTogo} onHandle={handleOrder} current={true}/>	
			</div>
		</>)
	} else {
		return (<>
			<div className="kt-columnContainer">
				<OrderColumn title={"Togo"} orders={ordersTogo} onHandle={handleOrder} current={true}/>	
				<OrderColumn title={"Here"} orders={ordersHere} onHandle={handleOrder} current={true}/>
			</div>
		</>)
	}
	
}

function RecentOrders() {
	const [recentOrders, setRecentOrders] = useState([]);
	const { settings, setSettings } = useContext(SettingsContext);

	async function fetchOrders() {
		try {
			let response = await fetch(`${apiURL}/api/kitchen/recentorders?count=${parseInt(settings.kt_recentOrderCount)}`);

			if (response.ok) {
				const data = await response.json();
				setRecentOrders(data);

			} else {
				setRecentOrders([]);
			}
		} catch (error) {
			setRecentOrders([]);
		}
	}

	const handleOrder = async (order, action) => {
		if (action == "restore") {
			// Update database with POST request
		let reqBody = { action: "restore", orderID: order.id }
        try {
            let response = await fetch(`${apiURL}/api/kitchen/recentorders`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });	

			// Toggles the items locally w/o refetching to reduce latency
            if (response.ok) {
				setRecentOrders(ordersHere => ordersHere.filter(o => o !== order));
			}
			return response.ok;
			
        } catch (error) { return false; }
		} else {
			throw "Invalid action on ordercard in kitchen/recentorders";
		}
	}

	useEffect(() => {
		const intervalID = setInterval(() => {
			fetchOrders();
		}, parseInt(settings.kt_refreshRate)*1000);
		
		fetchOrders();
		return () => clearInterval(intervalID);
	}, []);	

	return (<div className="kt-columnContainer">
		<OrderColumn title={"RECENT ORDERS"} orders={recentOrders} onHandle={handleOrder}/>
	</div>)
}


//! PARENT COMPONENT
function Kitchen() {
	const [settings, setSettings] = useState({});
	const [loading, setLoading] = useState(true);
	
	// Load settings from database into context
	useEffect(() => {
		async function fetchSettings() {
			try {
				let response = await fetch(`${apiURL}/api/settings`);

				if (response.ok) {
					const data = await response.json();
					setSettings(data);
					setLoading(false);
				} else {
					setSettings({});
					setLoading(true);
				}
			} catch (error) {
				console.log(error)
				setSettings({});
				setLoading(true);
			}
		}

		fetchSettings();
	}, []);

	// var translateWidgetAdded = false;
	// const googleTranslateElementInit = () => {
	// 	if (!translateWidgetAdded) {
	// 		new window.google.translate.TranslateElement(
	// 			{
	// 				pageLanguage: "en",
	// 				autoDisplay: false,
	// 				includedLanguages: "en,es,zh,tl,vi,ar,fr,ko,ru,de", 
    //     			layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
	// 			},
	// 			"google_translate_element"
	// 		);

	// 		translateWidgetAdded = true;
	// 	}
	// };

	// useEffect(() => {
	// 	var addScript = document.createElement("script");
	// 	addScript.setAttribute(
	// 		"src",
	// 		"//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
	// 	);
	// 	document.body.appendChild(addScript);
	// 	window.googleTranslateElementInit = googleTranslateElementInit;
	// }, []);

	if (loading) {
		return <></>;
	}

	return (<>
		<SettingsContext.Provider value={{settings, setSettings}}>
			<div className="kt-mainDiv">
				<NavBar/>
				<Outlet/>
			</div>
		</SettingsContext.Provider>
	</>)
}

export {Kitchen, KitchenOrders, RecentOrders}