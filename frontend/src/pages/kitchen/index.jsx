import { useState, useEffect } from 'react';
import './kitchen.css';

function OrderItemCard({order_item}) {
		
	return (<>
		<h5> {order_item.type} </h5>
		<ul> {
			
			order_item.food_items.map((food_item, index) => (
				<li key={index}> {food_item} </li>
			))

		} </ul>
	</>)
}



function OrderCard({order}) {
	
	// TOS - Time Since Order
	function getTOS() {
		return Math.floor((Date.now()-order.date)/1000);
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
		<div className="orderCard">
			<h3> Order #{order.id} </h3>
			<h4> Time Since Order: {timeSinceOrder}s </h4>
			<ul> {
				
				order.order_items.map((order_item, index) => (
					<li key={index}> <OrderItemCard order_item={order_item} /> </li>
				))

			} </ul>
		</div>
	)
}



function Kitchen() {
	const [orders, setOrders] = useState([
		{"id": 1, "type": "Here", "date": Date.parse("2024-10-30T12:00:00Z"), "customer_name": "Ryan", "order_items":
			[
				{"type": "Bowl", "food_items": ["Orange Chicken", "Chow Mein"]},
				{"type": "Bowl", "food_items": ["Beijing Beef", "Chow Mein"]}
			]
		},
		{"id": 2, "type": "Here", "date": Date.parse("2024-10-30T12:30:00Z"), "customer_name": "Duncan", "order_items":
			[
				{"type": "Plate", "food_items": ["Orange Chicken","Honey Walnut Shrimp", "Fried Rice"]},
				{"type": "Bowl", "food_items": ["Beijing Beef", "Chow Mein"]}
			]
		},
		{"id": 3, "type": "Togo", "date": Date.parse("2024-10-30T13:00:00Z"), "customer_name": "Gideon", "order_items":
			[
				{"type": "Bowl", "food_items": ["Orange Chicken", "Chow Mein"]}
			]
		}
	]);
	

	return (<>	
		<div className="columnContainer">

			<div className="column">
				<h1> HERE </h1>
				<ul>
					{orders.map((order, index) => (
						<li key={index}> <OrderCard order={order} /> </li>
					))}
				</ul>
			</div>

			<div className="column">
				<h1> TOGO </h1>
				<ul>
					{orders.map((order, index) => (
						<li key={index}> <OrderCard order={order} /> </li>
					))}
				</ul>
			</div>
		</div>
	</>)
}

export default Kitchen
