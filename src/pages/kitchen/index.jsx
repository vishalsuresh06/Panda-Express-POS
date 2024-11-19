import { createContext, useContext, useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { apiURL } from '../../config.js';
import './kitchen.css';


//* Features
// TODO - 	Allow manager to customize kitchen page
// TODO -	Maybe add the ability to mark specific order items on individual orders as completed. Would require altering models...
// TODO - 	Rather than RECENT_ORDER_COUNT, have a "show more" button which loads another ten or so
// TODO -	Ability to expand some of the nonfull display order cards
// TODO - 	Added settings to the models so that we can save this shit to the database :)

//* Other
// TODO - 	Fix inconsistent button hits (sometime they don't seem to register a click)
// TODO - 	Delay in background color change on order start & stop (its waiting for the db)
// TODO -	Speak with Vishal about how the Cashier page will handle creating new orders. Should they be sent to kitchen or handled there?
// TODO - 	Ask group about navbar/landing page between all non-kiosk screens (or at least, customer shouldn't be able to nav away)

//! GLOBAL CONTEXTS
const SettingsContext = createContext(null);
const DEFAULT_SETTINGS = {
	ORDER_REFRESH_S: 5,
	ORDER_RENDER_LIMIT: 2,
	RECENT_ORDER_COUNT: 10,
	HERE_ORDERS_LEFT: true,
	CARD_COLORS: {
		"pending": 		"rgb(150, 150, 150)",
		"in_progress": 	"rgb(255, 255, 100)",
		"completed": 	"rgb(29, 200, 113)",
		"cancelled": 	"rgb(180, 100, 113)",
	}
}



//! HELPER COMPONENTS
function OrderItemCard({orderItem}) {
		
	return (<div className="kt-orderItemCard">
		<h3> {orderItem.order_item_type.name} </h3>
		<ul> {
			
			orderItem.food_items.map((food_item, index) => (
				<li key={index}> {food_item.quantity} x {food_item.food_item} </li>
			))

		} </ul>
	</div>)
}

function OrderCard({order, onHandle, displayFullCard, inProgress}) {
	const { settings, setSettings } = useContext(SettingsContext);

	// "Time since order"
	const [TOS, setTOS] = useState(calcTOS())
	function calcTOS() {
		let seconds = Math.floor((Date.now()-Date.parse(order.date_created))/1000);
		return `${String(Math.floor(seconds/60)).padStart(2, '0')}:${String(seconds%60).padStart(2, '0')}`
	}

	// Conditional button display
	function CardButtons() {
		if (inProgress) {
			return <>
				<button className="kt-complete" onClick={() => onHandle(order, "complete")}> Complete </button>
				<button className="kt-cancel" onClick={() => onHandle(order, "cancel")}> Cancel </button>
				<button className="kt-toggle" onClick={() => onHandle(order, "toggle")}> {order.status == "pending" ? "Start" : "Stop"} </button>
			</>
		} else {
			return <>
				<button className="kt-restore" onClick={() => onHandle(order, "restore")}> Restore </button>
			</>
		}
	}

	// 1s timer to update the TOS on every card
	useEffect(() => {
		const intervalID = setInterval(() => {
			setTOS(calcTOS());
		}, 1000);
		
		return () => clearInterval(intervalID);
	}, []);	

	const style = {
		backgroundColor: settings.CARD_COLORS[order.status]
	};

	return (<div style={style} className="kt-orderCard">
		<div className="kt-orderCardHeaders">
			<h3 className="kt-orderInfo"> Order #{order.id} for {order.customer_name} </h3>
			<h3 className="kt-TOS"> {inProgress && TOS} </h3>
		</div>

		<div>
			{displayFullCard && <div className="kt-orderCardBody">
				<ul className="kt-orderItemList"> {
					
					order.order_items.map((orderItem, index) => (
						<li key={index}> <OrderItemCard orderItem={orderItem}/> </li>
					))

				} </ul>

				<div className="kt-buttons">
					<CardButtons/>
				</div>
			</div>}	
		</div>

	</div>)
}

function OrderColumn({title, orders, onHandle, current}) {
	const { settings, setSettings } = useContext(SettingsContext);

	return (<div className="kt-column">
		<h1>{title} - {orders.length}</h1>

		<ul className="kt-cardList">
			{orders.map((order, index) => (
				<li key={index}> 
						<OrderCard  order={order} 
									onHandle={onHandle} 
									displayFullCard={!current || index<settings.ORDER_RENDER_LIMIT} 
									inProgress={current}/> 
				</li>
			))}
		</ul>
	</div>)
}



//! MAIN COMPONENTS
function NavBar() {
	return (<div className="kt-navBar">
		<Link className="kt-navBtn" to="/kitchen/orders">Orders</Link>
		<Link className="kt-navBtn" to="/kitchen/recentorders">Recent Orders</Link>
		<Link className="kt-navBtn" to="/kitchen/customize">Customize</Link>
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
		}, settings.ORDER_REFRESH_S*1000);
		
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

	if (settings.HERE_ORDERS_LEFT) {
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
			let response = await fetch(`${apiURL}/api/kitchen/recentorders?count=${settings.RECENT_ORDER_COUNT}`);

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
		}, settings.ORDER_REFRESH_S*1000);
		
		fetchOrders();
		return () => clearInterval(intervalID);
	}, []);	

	return (<div className="kt-columnContainer">
		<OrderColumn title={"RECENT ORDERS"} orders={recentOrders} onHandle={handleOrder}/>
	</div>)
}

function KitchenCustomizer() {
	const { settings, setSettings } = useContext(SettingsContext);
	/*
		Order refresh rate 
		Card color dictionary
		How many order cards are full by default
		Default step size for showing recent orders (starting & how many "show more" will display)
		How many here & togo columns (would have to split the orders evenly)
		Here vs. Togo orders on the left or right
	*/
	const inputFieldChange = (field) => (event) => {
		const settingsCopy = {...settings};
		settingsCopy[field] = Number(event.target.value);
		setSettings(settingsCopy);
	};

	const checkboxChange = (field) => (event) => {
		const settingsCopy = {...settings};
		settingsCopy[field] = event.target.checked;
		setSettings(settingsCopy);
	}

	const restoreDefault = () => {
		setSettings(DEFAULT_SETTINGS);
	}
	


	return (<div className="kt-customizerInputs">
		<h1>KITCHEN CUSTOMIZER</h1>
		<table className="kt-inputsTable">
			<tbody>
				<tr>
					<th>Setting</th>
					<th>Description</th>
					<th>Value</th>
				</tr>
				<tr>
					<td>Order Refresh Rate (s)</td>
					<td>How often the "Orders" and "Recent Order" pages will refresh with newly entered orders.</td>
					<td><input type="text" defaultValue={settings.ORDER_REFRESH_S} onChange={inputFieldChange("ORDER_REFRESH_S")}/></td>
				</tr>
				<tr>
					<td>Full Order Render Count</td>
					<td>How many order cards are automatically expanded in the "here" and "togo" columns.</td>
					<td><input type="text" defaultValue={settings.ORDER_RENDER_LIMIT} onChange={inputFieldChange("ORDER_RENDER_LIMIT")}/></td>
				</tr>
				<tr>
					<td>Recent Order Count</td>
					<td>How many of the most recent orders will be displayed in "Recent Orders".</td>
					<td><input type="text" defaultValue={settings.RECENT_ORDER_COUNT} onChange={inputFieldChange("RECENT_ORDER_COUNT")}/></td>
				</tr>
				<tr>
					<td>Here Orders Left</td>
					<td>Alters which of the two order columns is displayed first on the "Orders" page.</td>
					<td><input type="checkbox" defaultChecked={settings.HERE_ORDERS_LEFT} onChange={checkboxChange("HERE_ORDERS_LEFT")}/></td>
				</tr>
			</tbody>
		</table>

		<div className="kt-dftContainer">
			<button className="kt-dftButton" onClick={restoreDefault}>Restore Default</button>
		</div>
	</div>)
}



//! PARENT COMPONENT
function Kitchen() {
	const [settings, setSettings] = useState(DEFAULT_SETTINGS);

	return (
		<SettingsContext.Provider value={{settings, setSettings}}>
			<div className="kt-mainDiv">
				<NavBar/>
				<Outlet/>
			</div>
		</SettingsContext.Provider>
	)
}

export {Kitchen, KitchenOrders, RecentOrders, KitchenCustomizer}