import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { apiURL } from '../../config.js';
import './kitchen.css';


//* Design
// TODO - 	Use a more "Panda Express" like color scheme
// TODO - 	Possibly redesign layout of these cards since there is a lot of empty space only having two column.
// TODO -	Custom scrollbar might look nice: https://www.w3schools.com/howto/howto_css_custom_scrollbar.asp

//* Features
// TODO - 	Add the ability to look back at the latest "completed" or "canceled" orders & revive them
// TODO - 	Allow manager to edit the render limit & other customizable parameters
// TODO -	Maybe add the ability to mark specific order items on individual orders as completed. Would require altering models...

//* Other
// TODO - 	Investigate possible desync on the toggle of order status if you do it too quickly...
// TODO - 	Delay in background color change on order start & stop (its waiting for the db)
// TODO -	Speak with Vishal about how the Cashier page will handle creating new orders. Should they be sent to kitchen or handled there?
// TODO - 	Ask group about navbar/landing page between all non-kiosk screens (or at least, customer shouldn't be able to nav away)


const ORDER_REFRESH_MS = 5000; // How often the screen will update with new orders from the database
const FULL_ORDER_RENDER_LIMIT = 2; // How many order cards in each column will be fully displayed before collapsing
const DEFAULT_RECENT_ORDER_CNT = 10; // Default number of the most recent orders shown in the recent orders screen
const CARD_STATUS_COLORS = {
	"pending": 		"rgb(150, 150, 150)",
	"in_progress": 	"rgb(29, 186, 113)",
	"completed": 	"rgb(29, 200, 113)",
	"canceled": 	"rgb(180, 100, 113)",
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
	// "Time since order"
	const [TOS, setTOS] = useState(calcTOS())
	function calcTOS() {
		let seconds = Math.floor((Date.now()-Date.parse(order.date))/1000);
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
		backgroundColor: CARD_STATUS_COLORS[order.status]
	};

	return (<div style={style} className="kt-orderCard">
		<div className="kt-orderCardHeaders">
			<h3 className="kt-orderInfo"> Order #{order.id} for {order.customer_name} </h3>
			<h3 className="kt-TOS"> {TOS} </h3>
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
	return (<div className="kt-column">
		<h1>{title} {orders.length}</h1>

		<ul className="kt-cardList">
			{orders.map((order, index) => (
				<li key={index}> 
						<OrderCard  order={order} 
									onHandle={onHandle} 
									displayFullCard={!current || index<FULL_ORDER_RENDER_LIMIT} 
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
		}, ORDER_REFRESH_MS);
		
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

	return (<>
		<div className="kt-columnContainer">
			<OrderColumn title={"Here"} orders={ordersHere} onHandle={handleOrder} current={true}/>
			<OrderColumn title={"Togo"} orders={ordersTogo} onHandle={handleOrder} current={true}/>	
		</div>
	</>)
}

function RecentOrders() {
	const [recentOrders, setRecentOrders] = useState([]);

	async function fetchOrders() {
		try {
			let response = await fetch(`${apiURL}/api/kitchen/recentorders?count=${DEFAULT_RECENT_ORDER_CNT}`);

			if (response.ok) {
				const data = await response.json();
				console.log(data);
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
		}, ORDER_REFRESH_MS);
		
		fetchOrders();
		return () => clearInterval(intervalID);
	}, []);	

	return (<div className="kt-columnContainer">
		<OrderColumn title={"RECENT ORDERS"} orders={recentOrders} onHandle={handleOrder}/>
	</div>)
}

function KitchenCustomizer() {
	return (<>
		<h1>KITCHEN CUSTOMIZER</h1>
	</>)
}



//! PARENT COMPONENT
function Kitchen() {
	// MAIN RETURN
	return (<div className="kt-mainDiv">
		<NavBar/>
		<Outlet/>
	</div>)
}

export {Kitchen, KitchenOrders, RecentOrders, KitchenCustomizer}
