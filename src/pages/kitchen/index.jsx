import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { apiURL } from '../../config.js';
import './kitchen.css';

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

function OrderCard({order, cardIndex, onRemove}) {
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
			<button className="kt-confirm" onClick={() => onRemove(order.id, "confirm")}> Confirm </button>
			<button className="kt-cancel" onClick={() => onRemove(order.id, "cancel")}> Cancel </button>
		</div>
	</div>)
}

function OrderColumn({title, orders, onRemove}) {
	return (<div className="kt-column">
		<h1>{title}</h1>
		<ul className="kt-cardList">
			{orders.map((order, index) => (
				<li key={index}> <OrderCard order={order} onRemove={onRemove}/> </li>
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
			let response = await fetch(`${apiURL}/api/orders`);

			if (response.ok) {
				const data = await response.json();
				setOrdersHere(data.here);
				setOrdersTogo(data.togo);

			} else {
				setOrdersHere([]);
				setOrdersTogo([]);
			}
		} catch (error) {
			setOrdersHere([]);
			setOrdersTogo([]);
		}
	}

	// Sends a POST request to API to either "confirm" or "cancel" a specific order (via order id)
	const removeOrder = async (id, action) => {
		let reqBody = { action: action, orderID: id }

        try {
            let response = await fetch(`${apiURL}/api/orders/`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });
			
            if (response.ok) {
				fetchOrders();
			}
			return response.ok;
			
        } catch (error) {
            return false
        }

	}

	// On page load, fetch all pending orders
	useEffect(() => {
        fetchOrders();
	}, []);	

	// Check for now orders periodically
	useEffect(() => {
		const intervalID = setInterval(() => {
			fetchOrders();
		}, ORDER_REFRESH_MS);
		
		return () => clearInterval(intervalID);
	}, []);	

	// Main component return
	return (<div className="kt-mainDiv">	
		<div className="kt-columnContainer">
			<OrderColumn title={"Here"} orders={ordersHere} onRemove={removeOrder} />
			<OrderColumn title={"Togo"} orders={ordersTogo} onRemove={removeOrder} />
		</div>
	</div>)
}

export default Kitchen
