import { useState, useEffect, createContext, useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Compact } from '@uiw/react-color';
import { apiURL } from '../../config.js';
import './manager.css';

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

function SettingsInput({name, desc, field, type}) {
    const {settings, setSettings} = useContext(KitchenSettingsContext);
    const [color, setColor] = useState(type == "color" ? settings[field] : "");

	const changeSettings = async (event) => {
		const settingsCopy = {...settings};
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
		inputComponent = <input type="text" value={settings[field]} onChange={changeSettings}/>;
	} else if (type == "checkbox") {
		inputComponent = <input type="checkbox" defaultChecked={settings[field] == "true"} onChange={changeSettings}/>;
	} else if (type == "color") {
		inputComponent = <Compact color={color} onChange={changeSettings}/>
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
        let reqBody = { action: "restoredefaults"};
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

	return (<KitchenSettingsContext.Provider value={{settings, setSettings}}>
        <div className="mngr-kitchensettings">
            <h2 className="mngr-font">KITCHEN CUSTOMIZER</h2>
            <table className="mngr-settingsTable">
                <thead>
                    <tr>   
                        <th className="mngr-font">Setting</th>
                        <th className="mngr-font">Description</th>
                        <th className="mngr-font">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsInput 	name="Order Refresh Rate (s)"
                                    desc="How pages will refresh with newly entered orders."
                                    field="kt_refreshRate"
                                    type="text"/>
                    
                    <SettingsInput 	name="Full Order Render Count"
                                    desc="How many order cards are automatically expanded in the HERE/TOGO columns."
                                    field="kt_fullOrderCount"
                                    type="text"/>

                    <SettingsInput 	name="Recent Order Count"
                                    desc="How many of the most recent orders will be displayed."
                                    field="kt_recentOrderCount"
                                    type="text"/>

                    <SettingsInput 	name="Here Orders on Left"
                                    desc="Alters which of the two order columns is displayed."
                                    field="kt_hereOrdersLeft"
                                    type="checkbox"/>
                    
                    <SettingsInput  name="Temperature in Fahrenheit"
                                    field="kt_tempUnits"
                                    type="checkbox"/>

                    <SettingsInput  name="Pending Order Color"
                                    field="kt_pendingColor"
                                    type="color"/>

                    <SettingsInput  name="In Progress Order Color"
                                    field="kt_inprogressColor"
                                    type="color"/>

                    <SettingsInput  name="Completed Order Color"
                                    field="kt_completedColor"
                                    type="color"/>
                    
                    <SettingsInput  name="Canceled Order Color"
                                    field="kt_cancelledColor"
                                    type="color"/>

                </tbody>
            </table>

            <button onClick={restoreDefaults}>RESTORE DEFAULTS</button>
        </div>
    </KitchenSettingsContext.Provider>)
}

function Excess() {
    const [targetTime, setTargetTime] = useState('2023-01-12');
    const [loading, setLoading] = useState(false);
    const [excessItems, setExcessItems] = useState(null);

    async function fetchExcessItems() {
        try {
            let response = await fetch(`${apiURL}/api/manager/excess?timestamp=${targetTime}`);

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setExcessItems(data);
            } else {
                setExcessItems({});
            }
        } catch (error) {
            console.log(error)
            setExcessItems({});
        }
    }

    const handleTimeChange = (event) => {
        setTargetTime(event.target.value);
    }

    const queryExcess = () => {
        fetchExcessItems();
    }

    return (<div className="mngr-excess">
        <input type="date" defaultValue={targetTime} onChange={handleTimeChange} key={targetTime}/>
        <button onClick={queryExcess}>QUERY</button>
    </div>)
}

function SellsTogether() {
    return (<div className="mngr-sellstogether">
        SELLS TOGETHER
    </div>)
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
                    <Link to="/manager/kitchensettings" className='mngr-btn'>Kitchen Settings</Link>
                    <Link to="/manager/excess" className='mngr-btn'>Excess Inventory</Link>
                    <Link to="/manager/sellstogether" className='mngr-btn'>What Sells Together</Link>
                </div>
                <Outlet />
            </div>
        </>
    )
}



export { Manager, EmployeeEdit, MenuEdit, InventoryEdit, KitchenSettings, Excess, SellsTogether}
