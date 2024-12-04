import { useState, useEffect, createContext, useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Compact } from '@uiw/react-color';
import { Line } from 'react-chartjs-2';
import { ManagerRoute } from '../../utils/Auth';
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
import { apiURL } from '../../config.js';
import './manager.css';
import { OrbitProgress } from 'react-loading-indicators';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

const KitchenSettingsContext = createContext(null);

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
                                <td className='mngr-font' key={index2}>{entry?.toString() || ""}</td>
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

            if (!reqBody?.data?.email.trim()) {
                reqBody.data.email = null
            }
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

function SettingsInput({ name, desc, field, type }) {
    const { settings, setSettings } = useContext(KitchenSettingsContext);
    const [color, setColor] = useState(type == "color" ? settings[field] : "");

    const changeSettings = async (event) => {
        const settingsCopy = { ...settings };
        var data;
        if (type == "text") {

            settingsCopy[field] = event.target.value;
        } else if (type == "checkbox") {
            settingsCopy[field] = (event.target.checked ? "true" : "false");
        } else if (type == "color") {
            setColor(event.hex);
            settingsCopy[field] = event.hex;
        }
        setSettings(settingsCopy);

        let reqBody = { action: "set", field: field, data: settingsCopy[field] };
        try {
            await fetch(`${apiURL}/api/settings`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Prevents while DB settings are still being loaded in

    var inputComponent;
    if (type == "text") {
        inputComponent = <input type="text" value={settings[field]} onChange={changeSettings} />;
    } else if (type == "checkbox") {
        inputComponent = <input type="checkbox" defaultChecked={settings[field] == "true"} onChange={changeSettings} />;
    } else if (type == "color") {
        inputComponent = <Compact color={color} onChange={changeSettings} />
    }

    return (
        <tr>
            <td>{name}</td>
            <td>{desc}</td>
            <td>{inputComponent}</td>
        </tr>
    )
}

function KitchenSettings() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch the current settings from the database
    useEffect(() => {
        async function fetchSettings() {
            try {
                let response = await fetch(`${apiURL}/api/settings`);

                if (response.ok) {
                    const data = await response.json();
                    setSettings(data);
                    setLoading(false);
                } else {
                    setSettings({});
                    setLoading(true);
                }
            } catch (error) {
                console.log(error)
                setSettings({});
                setLoading(true);
            }
        }

        fetchSettings();
    }, []);

    const restoreDefaults = async () => {
        let reqBody = { action: "restoredefaults" };
        try {
            await fetch(`${apiURL}/api/settings`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });
        } catch (error) {
            console.log(error);
        }
        window.location.reload();
    }

    if (loading) {
        return <></>;
    }

    return (<KitchenSettingsContext.Provider value={{ settings, setSettings }}>
        <div className="mngr-kitchensettings">
            <h2 className="mngr-font">KITCHEN CUSTOMIZER</h2>
            <table className="mngr-settingsTable">
                <thead>
                    <tr>
                        <td className="mngr-font">Setting</td>
                        <td className="mngr-font">Description</td>
                        <td className="mngr-font">Value</td>
                    </tr>
                </thead>
                <tbody>
                    <SettingsInput name="Order Refresh Rate (s)"
                        desc="How pages will refresh with newly entered orders."
                        field="kt_refreshRate"
                        type="text" />

                    <SettingsInput name="Full Order Render Count"
                        desc="How many order cards are automatically expanded in the HERE/TOGO columns."
                        field="kt_fullOrderCount"
                        type="text" />

                    <SettingsInput name="Recent Order Count"
                        desc="How many of the most recent orders will be displayed."
                        field="kt_recentOrderCount"
                        type="text" />

                    <SettingsInput name="Here Orders on Left"
                        desc="Alters which of the two order columns is displayed."
                        field="kt_hereOrdersLeft"
                        type="checkbox" />

                    <SettingsInput name="Temperature in Fahrenheit"
                        field="kt_tempUnits"
                        type="checkbox" />

                    <SettingsInput name="Pending Order Color"
                        field="kt_pendingColor"
                        type="color" />

                    <SettingsInput name="In Progress Order Color"
                        field="kt_inprogressColor"
                        type="color" />

                    <SettingsInput name="Completed Order Color"
                        field="kt_completedColor"
                        type="color" />

                    <SettingsInput name="Canceled Order Color"
                        field="kt_cancelledColor"
                        type="color" />

                </tbody>
            </table>

            <button onClick={restoreDefaults}>RESTORE DEFAULTS</button>
        </div>
    </KitchenSettingsContext.Provider>)
}

function Excess() {
    const [targetTime, setTargetTime] = useState("2023-01-01");
    const [excessItems, setExcessItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleTimeChange = (event) => {
        setTargetTime(event.target.value);
    }

    const queryExcess = async () => {
        setLoading(true);
        try {
            let response = await fetch(`${apiURL}/api/manager/excess?timestamp=${targetTime}`);

            if (response.ok) {
                const data = await response.json();
                setExcessItems(data);
            } else {
                setExcessItems([]);
            }
        } catch (error) {
            console.log(error)
            setExcessItems([]);
        }
        setLoading(false);
    }

    return (<div className="mngr-excess mngr-font">
        <h2>Excess Inventory</h2>
        <div className="mngr-excessQuery">
            <input type="date" defaultValue={targetTime} onChange={handleTimeChange} key={targetTime} />
            <button onClick={queryExcess}>QUERY</button>
        </div>

        {loading && <OrbitProgress color="#eb5a16" size="medium" text="Loading" textColor="" />}
        {excessItems.length > 0 && 
            <table className="mngr-settingsTable">
                <thead>
                    <tr>
                        <td>Inventory Item</td>
                        <td>Units Sold</td>
                        <td>Percent of Quantity</td>
                    </tr>
                </thead>
                <tbody>
                    {excessItems.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.quantitySold}</td>
                            <td className={item.percentSold < 10 ? "mngr-excessItem" : "mngr-normalItem"}>{item.percentSold}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        }
    </div>)
}

function SellsTogether() {
    const [startDate, setStartDate] = useState("2023-01-01");
    const [endDate, setEndDate] = useState("2023-12-31");
    const [foodPairs, setFoodPairs] = useState([]);
    const [loading, setLoading] = useState(false);

    const changeStart = (event) => {
        setStartDate(event.target.value);
    }

    const changeEnd = (event) => {
        setEndDate(event.target.value);
    }

    const queryPairs = async () => {
        setLoading(true);
        try {
            let response = await fetch(`${apiURL}/api/manager/sellstogether?startDate=${startDate}&endDate=${endDate}`);

            if (response.ok) {
                const data = await response.json();
                setFoodPairs(data);
            } else {
                setFoodPairs([]);
            }
        } catch (error) {
            console.log(error)
            setFoodPairs([]);
        }
        setLoading(false);
    };

    return (<div className="mngr-sellstogether mngr-font">
        <h2>What Sells Together</h2>
        <h5>Time Period</h5>
        <input type="date" defaultValue={startDate} key={startDate} onChange={changeStart}/>
        <input type="date" defaultValue={endDate} key={endDate} onChange={changeEnd}/>
        <button onClick={queryPairs}>QUERY</button>

        {loading && <OrbitProgress color="#eb5a16" size="medium" text="Loading" textColor="" />}
        {foodPairs.length > 0 && 
            <table className="mngr-settingsTable">
                <thead>
                    <tr>
                        <td>Food Item 1</td>
                        <td>Food Item 2</td>
                        <td>Frequency</td>
                    </tr>
                </thead>
                <tbody>
                    {foodPairs.map((pair, index) => (
                        <tr key={index}>
                            <td>{pair.foodItem1}</td>
                            <td>{pair.foodItem2}</td>
                            <td>{pair.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        }   
    </div>)
}

function Restock() {
    const [restockList, setRestockList] = useState([]);

    const queryRestock = async () => {
        try {
            let response = await fetch(`${apiURL}/api/manager/restock`);

            if (response.ok) {
                const data = await response.json();
                setRestockList(data);
            } else {
                setRestockList([]);
            }
        } catch (error) {
            console.log(error)
            setRestockList([]);
        }
    }

    const restockItem = (item) => async () => {
        let reqBody = { "invItem": item }
        try {
            let response = await fetch(`${apiURL}/api/manager/restock`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });

            queryRestock();
            return response.ok;

        } catch (error) { return false; }
    };

    useEffect(() => {
        queryRestock();
    }, [])

    return (<div className="mngr-restockReport mngr-font">
        <h2>Restock Report</h2>
        <button onClick={queryRestock}>Refresh</button>
        <table className="mngr-settingsTable">
            <thead>
                <tr>
                    <td>Inventory Item</td>
                    <td>Current Stock</td>
                    <td>Restock Threshold</td>
                    <td>Restock</td>
                </tr>
            </thead>
            <tbody>
                {restockList.map((invItem, index) => (
                    <tr key={index}>
                        <td>{invItem.name}</td>
                        <td>{invItem.stock}</td>
                        <td>{invItem.restock_threshold}</td>
                        <td><button onClick={restockItem(invItem)}>Restock (Purchase {invItem.restock_amount})</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>)
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

function ProductUsage() {
    const [startDate, setStartDate] = useState('2023-01-01');
    const [endDate, setEndDate] = useState('2023-01-12');
    const [chartData, setChartData] = useState(null);

    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inventoryItems, setInventoryItems] = useState([]);

    useEffect(() => {
        async function fetchInventory() {
            try {
                let response = await fetch(`${apiURL}/api/inventory`);

                if (response.ok) {
                    const data = await response.json();
                    setInventoryItems(data)
                } else {
                    setInventoryItems([])
                }
            } catch (error) {
                console.log(error)
                setInventoryItems([])
            }
        }

        fetchInventory();
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
                let response = await fetch(`${apiURL}/api/manager/inventory-query/${id}?start_date=${startDate}&end_date=${endDate}`);

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
                        label: inventoryItems.find(item => item.id === id).name,
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
                    {inventoryItems.map((item) => (
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

function XReport() {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchData = async () => {
        setLoading(true)

        let newChartData = {
            labels: [],
            datasets: []
        }

        try {
            let response = await fetch(`${apiURL}/api/manager/xzreports?type=x`);

            if (response.ok) {
                const data = await response.json();
                const color = `rgba($10, 10, 10, 0.7)`;

                let newDataset = {
                    label: "Today's Sales ($)",
                    backgroundColor: color,
                    borderColor: color,
                    data: [],
                }

                data.hourlySales.forEach((datapoint) => {
                    newChartData.labels.push(datapoint.hour)
                    newDataset.data.push(datapoint.sales)
                }); 
                
                setTotalSales(data.totalSales);
                setTotalOrders(data.totalOrders);
                newChartData.datasets.push(newDataset)
            }
        } catch (error) {
            console.log(error)
        }
        
        setChartData(newChartData);
        setLoading(false)
    }
    
    useEffect(() => {
        fetchData();
    }, [])

    return (<div className="mngr-xreport mngr-font">
        <h2>X Report</h2>
        <button onClick={fetchData}>Refresh</button>
        <br></br>
        <p>Sales So Far ($): {Number(totalSales).toFixed(2)}</p>
        <p>Orders So Far: {totalOrders}</p>
        <div className='mngr-salescol'>
                {(chartData && !loading) ? (
                    <Line data={chartData} />
                ) : (
                    <OrbitProgress color="#eb5a16" size="medium" text="Loading" textColor="" />
                )}
        </div>
    </div>)
}

function ZReport() {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchData = async () => {
        setLoading(true)

        let newChartData = {
            labels: [],
            datasets: []
        }

        try {
            let response = await fetch(`${apiURL}/api/manager/xzreports?type=z`);

            if (response.ok) {
                const data = await response.json();
                const color = `rgba($10, 10, 10, 0.7)`;

                let newDataset = {
                    label: "Today's Sales ($)",
                    backgroundColor: color,
                    borderColor: color,
                    data: [],
                }

                data.hourlySales.forEach((datapoint) => {
                    newChartData.labels.push(datapoint.hour)
                    newDataset.data.push(datapoint.sales)
                }); 
                
                setTotalSales(data.totalSales);
                setTotalOrders(data.totalOrders);
                newChartData.datasets.push(newDataset)
            }
        } catch (error) {
            console.log(error)
        }
        
        setChartData(newChartData);
        setLoading(false)
    }
    
    useEffect(() => {
        fetchData();
    }, [])

    return (<div className="mngr-zreport mngr-font">
        <h2>Z Report</h2>
        <button onClick={fetchData}>Refresh</button>
        <br></br>
        <p>Todays Sales ($): {Number(totalSales).toFixed(2)}</p>
        <p>Total Orders: {totalOrders}</p>  
        <div className='mngr-salescol'>
                {(chartData && !loading) ? (
                    <Line data={chartData} />
                ) : (
                    <OrbitProgress color="#eb5a16" size="medium" text="Loading" textColor="" />
                )}
        </div>
    </div>)
}

function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function OrderItemCard({orderItem}) {
	return (<div className="mngr-orderItemCard">
		<h3> {orderItem.order_item_type.name} </h3>
		<ul> {
			
			orderItem.food_items.map((food_item, index) => (
				<li className="notranslate" key={index}>&ensp; {food_item.quantity} x {food_item.food_item} </li>
			))

		} </ul>
	</div>)
}

function OrderCard({order, handleDelete}) {
    return (<div className="mngr-orderCard">
		<div className="mngr-orderCardHeaders">	
			<h3 className="mngr-orderInfo"> #{order.id} for "{order.customer_name}" </h3>
            <h3>{new Date(order.date_created).toDateString()} {new Date(order.date_created).toLocaleTimeString()}</h3>
            <h3>Employee: {order.employee.name}</h3>
            <h3 className="mngr-orderTotal">${order.total_price}</h3>
		</div>

        <div className="mngr-orderCardBody">
            <ul className="mngr-orderItemList"> 
                {
                    order.order_items.map((orderItem, index) => (
                        <li key={index}> <OrderItemCard orderItem={orderItem}/> </li>
                    ))
                } 
            </ul>

            <div className="mngr-cardButtons">
                <button className="kt-cancel" onClick={() => handleDelete(order)}> Delete </button>
		    </div>
        </div>

	</div>)
}

function OrderHistory() {
    const [date, setDate] = useState(getToday());
    const [orders, setOrders] = useState([]);

    const changeDate = (event) => {
        setDate(event.target.value);
    }

    const fetchOrders = async () => {
        try {
            let response = await fetch(`${apiURL}/api/manager/orderhistory?date=${date}`);

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.log(error)
            setOrders([]);
        }
    }

    const handleDelete = async (order) => {
		let reqBody = { orderID: order.id }
        try {
            let response = await fetch(`${apiURL}/api/manager/orderhistory`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody),
            });	

            fetchOrders();
			return response.ok;
			
        } catch (error) { return false; }
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    return (<div className="mngr-orderhist mngr-font">
        <h2>Order History</h2>
        <input type="date" defaultValue={date} key={date} onChange={changeDate}/>
        <button onClick={fetchOrders}>Query Date</button>
        <ul className="mngr-orderList">
            {orders.map((order, index) => (
				<li key={index}> 
					<OrderCard order={order} handleDelete={handleDelete}/> 
				</li>
			))}
        </ul>
    </div>)
}

function Manager() {
    return (
        <>
            <ManagerRoute></ManagerRoute>
            <div>
                <h1 className='mngr-title mngr-font'>Restaurant Manager Dashboard</h1>
                <div className='mngr-nav'>
                    <Link to="/cashier" className='mngr-btn mngr-btn-ret'>Cashier</Link>
                    <Link to="/manager/employees" className='mngr-btn'>Employees</Link>
                    <Link to="/manager/menu" className='mngr-btn'>Menu</Link>
                    <Link to="/manager/inventory" className='mngr-btn'>Inventory</Link>
                    <Link to="/manager/sales" className='mngr-btn'>Sales</Link>
                    <Link to="/manager/productusage" className='mngr-btn'>Product Usage</Link>
                    <Link to="/manager/kitchensettings" className='mngr-btn'>Kitchen Settings</Link>
                </div>
                <div className='mngr-nav'>
                    <Link to="/manager/excess" className='mngr-btn'>Excess Inventory</Link>
                    <Link to="/manager/sellstogether" className='mngr-btn'>What Sells Together</Link>
                    <Link to="/manager/restock" className='mngr-btn'>Restock Report</Link>
                    <Link to="/manager/xreport" className='mngr-btn'>X Report</Link>
                    <Link to="/manager/zreport" className='mngr-btn'>Z Reports</Link>
                    <Link to="/manager/orderhistory" className='mngr-btn'>Order History</Link>
                </div>
                <Outlet />
            </div>
        </>
    )
}

export {Manager, EmployeeEdit, MenuEdit, InventoryEdit, 
        KitchenSettings, Excess, SellsTogether, Restock, 
        Sales, ProductUsage, XReport, ZReport, OrderHistory}