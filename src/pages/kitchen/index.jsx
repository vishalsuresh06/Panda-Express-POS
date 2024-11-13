import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { apiURL } from '../../config.js';
import './kitchen.css';

// TODO - 	Add a "working on" (or similar) button to move to the orders to "in_progress" status
// 			so that different kitchen staff can avoid both making the same order.

// TODO -	Collapase order cards after the first X cards (like in initial wireframe sketch)

// TODO - 	Add the ability to look back at the latest "completed" or "canceled" orders 
//			and give the ability to move them back to "pending" or "in_progress" if they want

// TODO - 	Try reduce button latency on order buttons by not refetching everytime

// TODO - 	Only render the top X orders to reduce latency. Add a ... if it goes over the limit parameter


const ORDER_REFRESH_MS = 5000;

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

function OrderCard({order, cardIndex, onHandle}) {
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

	
	return (<div className="kt-orderCard">
		<div className="kt-orderCardHeaders">
			<h3 className="kt-orderInfo"> Order #{order.id} for {order.customer_name} </h3>
			<h3 className="kt-TOS"> {TOS} </h3>
		</div>
		<ul> {
			
			order.order_items.map((orderItem, index) => (
				<li key={index}> <OrderItemCard orderItem={orderItem}/> </li>
			))

		} </ul>

		<div className="kt-buttons">
			<button className="kt-confirm" onClick={() => onHandle(order, "confirm")}> Confirm </button>
			<button className="kt-cancel" onClick={() => onHandle(order, "cancel")}> Cancel </button>
		</div>
	</div>)
}

function OrderColumn({title, orders, onHandle}) {
	return (<div className="kt-column">
		<h1>{title} {orders.length}</h1>
		<ul className="kt-cardList">
			{orders.map((order, index) => (
				<li key={index}> <OrderCard order={order} onHandle={onHandle}/> </li>
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
			let response = await fetch(`${apiURL}/api/kitchen/pendingorders`);

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

	// "confirm" or "cancel" the target order 
	const handleOrder = async (order, action) => {

		// Update database with POST request
		let reqBody = { action: action, orderID: order.id }
        try {
            let response = await fetch(`${apiURL}/api/kitchen/pendingorders`, {
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

	// Request pending orders on page load & fresh periodically
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



	// MAIN RETURN
	return (<div className="kt-mainDiv">	
		<div className="kt-columnContainer">
			<OrderColumn title={"Here"} orders={ordersHere} onHandle={handleOrder} />
			<OrderColumn title={"Togo"} orders={ordersTogo} onHandle={handleOrder} />
		</div>
	</div>)
}

export default Kitchen
