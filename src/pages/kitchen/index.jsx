import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { apiURL } from '../../config.js';
import './kitchen.css';

// TODO - 	Use a more "Panda Express" like color scheme

// TODO - 	Add a "working on" (or similar) button to move to the orders to "in_progress" status
// 			so that different kitchen staff can avoid both making the same order.

// TODO - 	Add the ability to look back at the latest "completed" or "canceled" orders 
//			and give the ability to move them back to "pending" or "in_progress" if they want

// TODO - 	Allow manager to edit the render limit

// TODO - 	Investigate possible desync on the toggle of order status if you do it too quickly...

// TODO - 	B/c I only change the order status (and therefore the toggle button's text) after I receive an
//			OK response from the backend, it causes a delay. I hesitate to do it before since if the request fails
// 			the site may become out of sync...

// TODO -	Speak with Vishal about how the Cashier page will handle creating new orders. Because it they are at any 
//			point set to pending or in_progress, they will show up on the kitchen view. Is that what we want? It the
//			cashier just supposed to send the order way away to the kitchen, or is the cashier just doing normal Panda
//			style where they prepare the orders themselves and let the kitchen only handle the kiosk orders.

// TODO -	Try and move buttons to the right side of the text instead of just on a new line, then right-aligned to save space

const ORDER_REFRESH_MS = 5000;
const FULL_ORDER_RENDER_LIMIT = 2;

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

function OrderCard({order, cardIndex, onHandle, displayFullCard}) {
	// "Time since order"
	const [TOS, setTOS] = useState(calcTOS())
	function calcTOS() {
		let seconds = Math.floor((Date.now()-Date.parse(order.date))/1000);
		return `${String(Math.floor(seconds/60)).padStart(2, '0')}:${String(seconds%60).padStart(2, '0')}`
	}

	// 1s timer to update the TOS on every card
	useEffect(() => {
		const intervalID = setInterval(() => {
			setTOS(calcTOS());
		}, 1000);
		
		return () => clearInterval(intervalID);
	}, []);	

	
	const style = {
		backgroundColor: order.status == "pending" ? 'rgb(150, 150, 150)' : 'rgb(29, 186, 113)',
	};

	return (<div style={style} className="kt-orderCard">
		<div className="kt-orderCardHeaders">
			<h3 className="kt-orderInfo"> Order #{order.id} for {order.customer_name} </h3>
			<h3 className="kt-TOS"> {TOS} </h3>
		</div>

		
		{displayFullCard && <>
			<ul> {
				
				order.order_items.map((orderItem, index) => (
					<li key={index}> <OrderItemCard orderItem={orderItem}/> </li>
				))

			} </ul>

			<div className="kt-buttons">
				<button className="kt-confirm" onClick={() => onHandle(order, "confirm")}> Confirm </button>
				<button className="kt-cancel" onClick={() => onHandle(order, "cancel")}> Cancel </button>
				<button className="kt-toggle" onClick={() => onHandle(order, "toggle")}> {order.status == "pending" ? "Start" : "Stop"} </button>
			</div>
		</>}	

	</div>)
}

function OrderColumn({title, orders, onHandle}) {
	return (<div className="kt-column">
		<h1>{title} {orders.length}</h1>
		<ul className="kt-cardList">
			{orders.map((order, index) => (
				<li key={index}> <OrderCard order={order} onHandle={onHandle} displayFullCard={index<FULL_ORDER_RENDER_LIMIT}/> </li>
			))}
		</ul>
	</div>)
}

function Kitchen() {
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

	// Either "confirm" or "cancel" or "toggle" the target order 
	const handleOrder = async (order, action) => {
		if (action == "toggle") {
			toggleOrder(order);
		} else if (action == "confirm" || action == "cancel") {
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



	// MAIN RETURN
	return (<div className="kt-mainDiv">	
		<div className="kt-columnContainer">
			<OrderColumn title={"Here"} orders={ordersHere} onHandle={handleOrder} />
			<OrderColumn title={"Togo"} orders={ordersTogo} onHandle={handleOrder} />
		</div>
	</div>)
}

export default Kitchen
