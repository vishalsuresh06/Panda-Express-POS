import { useState, useEffect } from 'react';
import { apiURL } from '../../config.js';
import './manager.css';

function EmployeeManager() {
    const [employees, setEmployees] = useState([]);
    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => {
        async function fetchEmployees() {
            try {
                let response = await fetch(`${apiURL}/api/employees`);

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setEmployees(data);
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

    const handleAdd = () => {
        const nextID = employees.length > 0 ? employees.at(-1).id + 1 : 0;
        const newEmployee = { id: nextID, name: 'Enter Name', is_manager: false, wage: 7.00 };

        if (modifyEmployees(newEmployee, "add")) {
            setEmployees([...employees, newEmployee]);
        }
    }

    const handleRemove = (index) => {
        if (modifyEmployees(employees.at(index).id, "delete")) {
            let copy = [...employees];
            copy.splice(index, 1);
            setEmployees(copy);
        }
    };

    const handleEditSave = (index, element) => {
        const rows = element.closest('tr').children;

        if (isEditing == index) {
            setIsEditing(null);

            let copy = [...employees];
            let entry = copy.at(index);

            for (let [key, value] of Object.entries(rows)) {
                value.contentEditable = false;
            }


            let modifyRequest = structuredClone(entry)
            modifyRequest.name = rows[1].innerText;
            modifyRequest.is_manager = Boolean(rows[2].innerText);
            modifyRequest.wage = rows[3].innerText;
            if (modifyEmployees(modifyRequest, "modify")) {

                entry.name = rows[1].innerText;
                entry.is_manager = +Boolean(rows[2].innerText);
                entry.wage = rows[3].innerText;
            }
        } else {
            setIsEditing(index);

            for (let [key, value] of Object.entries(rows)) {
                if (value.innerText != "ID") {
                    value.contentEditable = true;
                }
            }
        }
    }

    return (
        <section>
            <h2>Manage Employees</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Manager</th>
                        <th>Wage</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{+employee.is_manager}</td>
                            <td>{employee.wage}</td>
                            <td>
                                <button onClick={(event) => handleEditSave(index, event.target)}>{isEditing === index ? 'Save' : 'Edit'}</button>
                                <button onClick={() => handleRemove(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAdd}>Add Employee</button>
        </section>
    )
}

function MenuManager() {
    const [menuItems, setMenuItems] = useState([
        { id: 1, name: 'Orange Chicken' },
        { id: 2, name: 'Beijing Beef', },
        { id: 3, name: 'Honey Walnut Shrimp' },
    ]);

    const [isEditing, setIsEditing] = useState(null);

    const handleAdd = () => {
        const nextID = menuItems.length > 0 ? menuItems.at(-1).id + 1 : 0;
        const newMenuItem = { id: nextID, name: 'Enter Name' };
        setMenuItems([...menuItems, newMenuItem]);
    }

    const handleRemove = (index) => {
        let copy = [...menuItems];
        copy.splice(index, 1);
        setMenuItems(copy);
    };

    const handleEditSave = (index, element) => {
        const rows = element.closest('tr').children;
        console.log(rows)
        if (isEditing == index) {
            setIsEditing(null);

            let copy = [...menuItems];
            let entry = copy.at(index);

            for (let [key, value] of Object.entries(rows)) {
                value.contentEditable = false;
            }

            entry.name = rows[1].innerText;
        } else {
            setIsEditing(index);

            for (let [key, value] of Object.entries(rows)) {
                value.contentEditable = true;
            }
        }
    }

    return (
        <section>
            <h2>Manage Menu Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map((menuItem, index) => (
                        <tr key={index}>
                            <td>{menuItem.id}</td>
                            <td>{menuItem.name}</td>
                            <td>
                                <button onClick={(event) => handleEditSave(index, event.target)}>{isEditing === index ? 'Save' : 'Edit'}</button>
                                <button onClick={() => handleRemove(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAdd}>Add Menu Item</button>
        </section>
    )
}

function InventoryManager() {
    const [inventoryItems, setInventoryItems] = useState([
        { id: 1, name: 'Breaded Chicken' },
        { id: 2, name: 'Sliced Beef', },
        { id: 3, name: 'Shrimp' },
    ]);

    const [isEditing, setIsEditing] = useState(null);

    const handleAdd = () => {
        const nextID = inventoryItems.length > 0 ? inventoryItems.at(-1).id + 1 : 0;
        const newMenuItem = { id: nextID, name: 'Enter Name' };
        setInventoryItems([...inventoryItems, newMenuItem]);
    }

    const handleRemove = (index) => {
        let copy = [...inventoryItems];
        copy.splice(index, 1);
        setInventoryItems(copy);
    };

    const handleEditSave = (index, element) => {
        const rows = element.closest('tr').children;
        console.log(rows)
        if (isEditing == index) {
            setIsEditing(null);

            let copy = [...inventoryItems];
            let entry = copy.at(index);

            for (let [key, value] of Object.entries(rows)) {
                value.contentEditable = false;
            }

            entry.name = rows[1].innerText;
        } else {
            setIsEditing(index);

            for (let [key, value] of Object.entries(rows)) {
                value.contentEditable = true;
            }
        }
    }

    return (
        <section>
            <h2>Manage Inventory Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryItems.map((inventoryItem, index) => (
                        <tr key={index}>
                            <td>{inventoryItem.id}</td>
                            <td>{inventoryItem.name}</td>
                            <td>
                                <button onClick={(event) => handleEditSave(index, event.target)}>{isEditing === index ? 'Save' : 'Edit'}</button>
                                <button onClick={() => handleRemove(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAdd}>Add Inventory Item</button>
        </section>
    )
}

function Managers() {
    return (
        <>
            <div>
                <h1>Restaurant Manager Dashboard</h1>

                <div className="row">
                    <div className="column">
                        <EmployeeManager />
                    </div>
                    <div className="column">
                        <MenuManager />
                    </div>
                    <div className="column">
                        <InventoryManager />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Managers
