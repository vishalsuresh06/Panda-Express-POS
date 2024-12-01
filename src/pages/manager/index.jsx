import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);
import { apiURL } from '../../config.js';
import './manager.css';

function DBEditorTable({ title, fetchData, addData, removeData, modifyData }) {
    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(null);

    async function updateItems() {
        let data = await fetchData();
        setItems(data)
    }

    useEffect(() => {
        updateItems();
    }, [])

    async function handleAdd(defaultData) {
        await addData(defaultData)

        await updateItems();
    }

    async function handleRemove(index) {
        if (await removeData(items.at(index).id)) {
            let copy = [...items];
            copy.splice(index, 1);
            setItems(copy);
        }
    }

    async function handleEditSave(index, element) {
        const rows = element.closest('tr').children;

        if (isEditing == index) {
            setIsEditing(null);

            for (let [key, value] of Object.entries(rows)) {
                value.contentEditable = false;
            }

            let modifiedItem = structuredClone(items.at(index))

            const keys = Object.keys(modifiedItem);

            for (let i = 0; i < keys.length; i++) {
                modifiedItem[keys[i]] = rows[i].innerText;
            }

            await modifyData(modifiedItem)

            await updateItems();
        } else {
            setIsEditing(index);

            for (let [key, value] of Object.entries(rows)) {
                // Prevent changing id
                if (key != 0) {
                    value.contentEditable = true;
                }
            }
        }
    }

    return (
        <section>
            <h2 className='mngr-font'>Edit {title}</h2>
            <table className='mngr-table'>
                <thead>
                    <tr>
                        {items.length > 0 && Object.keys(items[0]).map((key, index) => (
                            <td className='mngr-font' key={index}>{key}</td>
                        ))}
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {items.map((menuItem, index) => (
                        <tr key={index}>
                            {Object.values(items[index]).map((entry, index2) => (
                                <td className='mngr-font' key={index2}>{entry.toString()}</td>
                            ))}
                            <td>
                                <button onClick={(event) => handleEditSave(index, event.target)}>{isEditing === index ? 'Save' : 'Edit'}</button>
                                <button onClick={() => handleRemove(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="mngr-createbutton" onClick={() => handleAdd()}>Create {title}</button>
        </section>
    )
}

function EmployeeEdit() {
    async function fetchEmployees() {
        try {
            let response = await fetch(`${apiURL}/api/employees`);

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async function modifyEmployees(data, action) {
        let reqBody = { action: null, data: null }
        if (action == "delete") {
            reqBody.action = "delete"
            reqBody.data = data

        } else if (action == "add") {
            reqBody.action = "add"
            reqBody.data = data

        } else {
            reqBody.action = "modify"
            reqBody.data = data
        }

        try {
            let response = await fetch(`${apiURL}/api/employees/`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });

            if (response.ok) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
            return false
        }
    }

    async function addEmployee(data) {
        const newEmployee = { name: 'Enter Name', is_manager: false, wage: 7.00 };
        return modifyEmployees(newEmployee, "add");
    }

    async function removeEmployee(id) {
        return modifyEmployees(id, "delete")
    }

    async function modifyEmployee(modifiedItem) {
        return modifyEmployees(modifiedItem, "modify")
    }

    return (
        <DBEditorTable title="Employee" fetchData={fetchEmployees} addData={addEmployee} removeData={removeEmployee} modifyData={modifyEmployee} />
    )
}

function MenuEdit() {
    async function fetchMenu() {
        try {
            let response = await fetch(`${apiURL}/api/menu`);

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async function modifyMenus(data, action) {
        let reqBody = { action: null, data: null }
        if (action == "delete") {
            reqBody.action = "delete"
            reqBody.data = data

        } else if (action == "add") {
            reqBody.action = "add"
            reqBody.data = data

        } else {
            reqBody.action = "modify"
            reqBody.data = data
        }

        try {
            let response = await fetch(`${apiURL}/api/menu/`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });

            if (response.ok) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
            return false
        }
    }

    async function addMenu(data) {
        const newMenu = { name: '? Chicken', type: "Entree", alt_price: 6.00, upcharge: 0, on_menu: true };
        return modifyMenus(newMenu, "add");
    }

    async function removeMenu(id) {
        return modifyMenus(id, "delete")
    }

    async function modifyMenu(modifiedItem) {
        return modifyMenus(modifiedItem, "modify")
    }

    return (
        <DBEditorTable title="Menu" fetchData={fetchMenu} addData={addMenu} removeData={removeMenu} modifyData={modifyMenu} />
    )
}

function InventoryEdit() {
    async function fetchInventory() {
        try {
            let response = await fetch(`${apiURL}/api/inventory`);

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async function modifyInventorys(data, action) {
        let reqBody = { action: null, data: null }
        if (action == "delete") {
            reqBody.action = "delete"
            reqBody.data = data

        } else if (action == "add") {
            reqBody.action = "add"
            reqBody.data = data

        } else {
            reqBody.action = "modify"
            reqBody.data = data
        }

        try {
            let response = await fetch(`${apiURL}/api/inventory/`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });

            if (response.ok) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
            return false
        }
    }

    async function addInventory(data) {
        const newMenu = { name: '? Item', is_food: true, stock: 0, restock_threshold: 100, restock_amount: 100 };
        return modifyInventory(newMenu, "add");
    }

    async function removeInventory(id) {
        return modifyInventory(id, "delete")
    }

    async function modifyInventory(modifiedInventory) {
        return modifyInventorys(modifiedInventory, "modify")
    }

    return (
        <DBEditorTable title="Inventory" fetchData={fetchInventory} addData={addInventory} removeData={removeInventory} modifyData={modifyInventory} />
    )
}

function Sales() {
    const [startDate, setStartDate] = useState('2023-01-01');
    const [endDate, setEndDate] = useState('2023-01-12');
    const [chartData, setChartData] = useState(null);

    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        async function fetchMenu() {
            try {
                let response = await fetch(`${apiURL}/api/menu`);

                if (response.ok) {
                    const data = await response.json();
                    setMenuItems(data)
                } else {
                    setMenuItems([])
                }
            } catch (error) {
                console.log(error)
                setMenuItems([])
            }
        }

        fetchMenu();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter((item) => item !== id);
            } else {
                return [...prevSelectedIds, id];
            }
        });
    };

    const handleStartChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndChange = (event) => {
        setEndDate(event.target.value);
    };

    const fetchData = async () => {
        setLoading(true)

        let newChartData = {
            labels: [],
            datasets: []
        }

        let datesPopulated = false

        const promises = selectedIds.map(async (id) => {
            try {
                let response = await fetch(`${apiURL}/api/manager/menu-query/${id}?start_date=${startDate}&end_date=${endDate}`);

                if (response.ok) {
                    const data = await response.json();

                    function getRandomColor() {
                        const r = Math.floor(Math.random() * 256);
                        const g = Math.floor(Math.random() * 256);
                        const b = Math.floor(Math.random() * 256);
                        return `rgba(${r}, ${g}, ${b}, 0.7)`; // Adjust alpha for transparency
                    }

                    const color = getRandomColor()

                    let newDataset = {
                        label: menuItems.find(item => item.id === id).name,
                        backgroundColor: color,
                        borderColor: color,
                        data: [],
                    }

                    let populateDates = false
                    if (!datesPopulated) {
                        datesPopulated = true
                        populateDates = true
                    }
                    data.forEach((day) => {
                        if (populateDates) {
                            newChartData.labels.push(day.date)
                        }
                        newDataset.data.push(day.quantity)
                    })

                    newChartData.datasets.push(newDataset)
                }
            } catch (error) {
                console.log(error)
            }
        })

        await Promise.all(promises);

        setChartData(newChartData);

        setLoading(false)
    }

    return (
        <div className='mngr-salescontainer'>
            <div className='mngr-salescol'>
                {chartData ? (
                    <Line data={chartData} />
                ) : (
                    <p>Send a query</p>
                )}
            </div>
            <div className='mngr-salescol'>
                <div>
                    <h3>Select Items</h3>
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => handleCheckboxChange(item.id)}
                            />
                            <label> {item.name}</label>
                        </div>
                    ))}
                </div>
                <input type="date" value={startDate} onChange={handleStartChange} />
                <input type="date" value={endDate} onChange={handleEndChange} />
                <button onClick={fetchData} disabled={loading}>Query</button>
            </div>
        </div>
    )
}

function Manager() {
    return (
        <>
            <div>
                <h1 className='mngr-title mngr-font'>Restaurant Manager Dashboard</h1>
                <div className='mngr-nav'>
                    <Link to="/manager/employees" className='mngr-btn'>Employees</Link>
                    <Link to="/manager/menu" className='mngr-btn'>Menu</Link>
                    <Link to="/manager/inventory" className='mngr-btn'>Inventory</Link>
                    <Link to="/manager/sales" className='mngr-btn'>Sales</Link>
                    <Link to="/manager/xreport" className='mngr-btn'>X Report</Link>
                    <Link to="/manager/zreport" className='mngr-btn'>Z Report</Link>
                </div>
                <Outlet />
            </div>
        </>
    )
}

export { Manager, EmployeeEdit, MenuEdit, InventoryEdit, Sales }
