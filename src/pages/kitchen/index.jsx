import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { apiURL } from '../../config.js';
import './kitchen.css';

//TODO Add a timer that regularly checks for newly entered order
//TODO Have order card timer be displayed in HH:MM:SS


function OrderItemCard({orderItem}) {
		
	return (<div className="kt-orderItemCard">
		<h5> {orderItem.order_item_type.name} </h5>
		<ul> {
			
			orderItem.food_items.map((food_item, index) => (
				<li key={index}> {food_item.name} </li>
			))

		} </ul>
	</div>)
}



function OrderCard({order, cardIndex, onRemove}) {
	// "Time since order"
	const [TOS, setTOS] = useState(calcTOS())
	function calcTOS() {
		return Math.floor((Date.now()-Date.parse(order.date))/1000);
	}

	// 1s timer to update the TOS on every card
	useEffect(() => {
		const intervalID = setInterval(() => {
			setTOS(getTOS());
		}, 1000);
		
		return () => clearInterval(intervalID);
	}, []);	

	
	return (<div className="kt-orderCard">
		<h3> Order #{order.id} for {order.customer_name} </h3>
		<h4> Time Since Order: {timeSinceOrder}s </h4>
		<ul> {
			
			order.order_items.map((orderItem, index) => (
				<li key={index}> <OrderItemCard orderItem={orderItem}/> </li>
			))

		} </ul>

		<button onClick={() => onRemove(order.id, "confirm")}> Confirm </button>
		<button onClick={() => onRemove(order.id, "cancel")}> Cancel </button>
	</div>)
}


function OrderColumn({title, orders, onRemove}) {
	return (<div className="kt-column">
		<h1>{title}</h1>
		<ul>
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
				console.log(data)
				setOrdersHere(data.here);
				setOrdersTogo(data.togo);

			} else {
				setOrdersHere([]);
				setOrdersTogo([]);
			}
		} catch (error) {
			setOrdersHere([]);
			setOrdersTogo([]);
			console.log(error);
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
            console.log(error);
            return false
        }

	}

	// On page load, fetch all pending orders
	useEffect(() => {
        fetchOrders();
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
