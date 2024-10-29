import { useState, useEffect } from "react";
import { apiURL } from './config.js'

function Home() {
    const [message, setMessage] = useState("Loading...");
	const [employees, setEmployees] = useState([]);
	const [orders, setOrders] = useState([]);


    useEffect(() => {
        async function fetchMessage() {
            try {
                let response = await fetch(`${apiURL}/api/helloworld`);

                if (response.ok) {
                    const text = await response.text();
                    setMessage(text);
                } else {
                    setMessage("Failed to fetch data");
                }
            } catch (error) {
                setMessage("Fetch error");
                console.log(error);
            }
        }

        fetchMessage();
    }, [])


	useEffect(() => {
		async function fetchEmployees() {
			try {
				let response = await fetch(`${apiURL}/api/employees`);

				if (response.ok) {
					const data = await response.json();
					const obj = JSON.parse(data);
					console.log(obj);
					setEmployees(obj);
				} else {
					setEmployees([]);
				}
			} catch (error) {
				setEmployees([]);
				console.log(error);
			}
		}

		fetchEmployees();
	}, [])

	useEffect( () => {
		async function fetchOrders() {
			try {

				let response = await fetch(`${apiURL}/api/orders`);

				if (response.ok) {
					const data = await response.json();
					const obj = JSON.parse(JSON.stringify(data));
					console.log(obj);
					setOrders(obj);
				} else {
					setOrders([]);
				}
				
			} catch (error) {
				setOrders([]);
				console.log(error);
			}
		}

		fetchOrders();
	}, [])


    return (
        <>
            <h1>{message}</h1>

			<h2> Employees </h2>	
			<ul>
			{
				employees.map((employee, index) => (
					<li key={index}>{employee.fields.name}</li>
				))
			}
			</ul>

			<h2> Orders </h2>
			<ul>
			{
				orders.map((order, index1) => (
					<li key={index1}>
						<h3> Order for {order.customer_name} </h3>
						<ul>
						{
							order.order_items.map((order_item, index2) => (
								<li key={index2}>
									<h4> {order_item.order_item_type.name} </h4>
									<ul>
									{
										order_item.food_items.map((food_item, index3) => (
											<li key={index3}>{food_item.name}</li>		
										))
									}
									</ul>
								</li>
							))
						}
						</ul>
					</li>
				))
			}
			</ul>

        </>
    )
}

export default Home
