import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { apiURL } from '../../config.js';
import './kitchen.css';

//TODO Add a timer that regularly checks for newly entered order


function OrderItemCard({orderItem}) {
		
	return (<>
		<h5> {orderItem.order_item_type.name} </h5>
		<ul> {
			
			orderItem.food_items.map((food_item, index) => (
				<li key={index}> {food_item.name} </li>
			))

		} </ul>
	</>)
}



function OrderCard({order, cardIndex, onConfirm}) {
	
	// TOS - Time Since Order
	function getTOS() {
		return Math.floor((Date.now()-Date.parse(order.date))/1000);
	}

	// Set the timeSinceOrder field to be updated every second
	const [timeSinceOrder, setTOS] = useState(getTOS())
	useEffect(() => {
		const intervalID = setInterval(() => {
			setTOS(getTOS());
		}, 1000);
		

		return () => clearInterval(intervalID);
	}, []);	

	

	return (
		<div className="kt-orderCard">
			<h3> Order #{order.id} for {order.customer_name} </h3>
			<h4> Time Since Order: {timeSinceOrder}s </h4>
			<ul> {
				
				order.order_items.map((orderItem, index) => (
					<li key={index}> <OrderItemCard orderItem={orderItem}/> </li>
				))

			} </ul>

			<button onClick={() => onConfirm(order.id, "confirm")}> Confirm </button>
		</div>
	)
}



function Kitchen() {
	const [ordersHere, setOrdersHere] = useState([]);
	const [ordersTogo, setOrdersTogo] = useState([]);

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

	useEffect(() => {
        fetchOrders();
	}, []);	
	

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



	return (<>	
		<div className="kt-columnContainer">

			<div className="kt-column">
				<h1> HERE </h1>
				<ul>
					{ordersHere.map((order, index) => (
						<li key={index}> <OrderCard order={order} onConfirm={removeOrder}/> </li>
					))}
				</ul>
			</div>

			<div className="kt-column">
				<h1> TOGO </h1>
				<ul>
					{ordersTogo.map((order, index) => (
						<li key={index}> <OrderCard order={order} onConfirm={removeOrder}/> </li>
					))}
				</ul>
			</div>
		</div>
	</>)
}

export default Kitchen
