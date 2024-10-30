import { useState } from 'react';
import './manager.css'

function EmployeeManager() {
    const [employees, setEmployees] = useState([
        { id: 1, name: 'Bob China', isManager: false, wage: 12.00 },
        { id: 2, name: 'Jeff America', isManager: false, wage: 11.00 },
        { id: 3, name: 'Jose Canada', isManager: true, wage: 15.00 },
    ]);

    const [isEditing, setIsEditing] = useState(null);

    const handleAdd = () => {
        const nextID = employees.length > 0 ? employees.at(-1).id + 1 : 0;
        const newEmployee = { id: nextID, name: 'Enter Name', isManager: false, wage: 7.00 };
        setEmployees([...employees, newEmployee]);
    }

    const handleRemove = (index) => {
        let copy = [...employees];
        copy.splice(index, 1);
        setEmployees(copy);
    };

    const handleEditSave = (index, element) => {
        const rows = element.closest('tr').children;
        console.log(rows)
        if (isEditing == index) {
            setIsEditing(null);

            let copy = [...employees];
            let entry = copy.at(index);

            for (let [key, value] of Object.entries(rows)) {
                value.contentEditable = false;
            }

            entry.name = rows[1].innerText;
            entry.isManager = Boolean(rows[2].innerText);
            entry.wage = rows[3].innerText;
        } else {
            setIsEditing(index);

            for (let [key, value] of Object.entries(rows)) {
                value.contentEditable = true;
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
                            <td>{+employee.isManager}</td>
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
    return (
        <section>
            <h2>Manage Menu</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>John Doe</td>
                        <td>Chef</td>
                        <td>
                            <button>Edit</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button>Add Employee</button>
        </section>
    )
}

function InventoryManager() {
    return (
        <section>
            <h2>Manage Inventory</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>John Doe</td>
                        <td>Chef</td>
                        <td>
                            <button>Edit</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button>Add Employee</button>
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
