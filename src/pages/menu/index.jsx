/**
 * @module Menu
 */
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Entrees from "./Entrees";
import SidesDrinksAppetizers from "./SidesDrinksAppetizers";
import SizesFeaturedPopular from "./SizesFeaturedPopular";
import { apiURL } from '../../config.js';
import axios from "axios";
import "./menu.css";
/**
 * The main component for the menu view.
 * Displays navigation links for different menu categories and allows adding, editing, and deleting menu items.
 *
 * @function Index
 * @returns {JSX.Element} The rendered menu index component.
 */
const Index = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    type: "entree", // default lowercase value
    calories: "",
    alt_price: "",
    upcharge: "0.00",
    image: null,
    is_spicy: false,
    is_premium: false,
    is_gluten_free: false,
    on_menu: true,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Fetches all menu items from the backend when the component mounts.
   */
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/food-items/`);
        setMenuItems(response.data);
      } catch (err) {
        console.error("Error fetching menu items:", err);
      }
    };

    fetchMenuItems();
  }, []);

  /**
   * Handles form input changes for adding or editing menu items.
   *
   * @param {Object} e The input change event.
   * @param {boolean} isEdit Specifies if the form is for editing an item.
   */
  const handleFormChange = (e, isEdit = false) => {
    const { name, value, type, checked } = e.target;
    const updatedItem = {
      ...(isEdit ? editingItem : newItem),
      [name]: type === "checkbox" ? checked : value,
    };

    if (isEdit) setEditingItem(updatedItem);
    else setNewItem(updatedItem);
  };
  /**
   * Handles file input changes for adding or editing menu items.
   *
   * @param {Object} e The input change event for file uploads.
   * @param {boolean} isEdit Specifies if the form is for editing an item.
   */
  const handleFileChange = (e, isEdit = false) => {
    const updatedItem = { ...(isEdit ? editingItem : newItem), image: e.target.files[0] };
    if (isEdit) setEditingItem(updatedItem);
    else setNewItem(updatedItem);
  };

   /**
   * Submits the form to add a new menu item to the backend.
   *
   * @param {Object} e The form submission event.
   */
  const handleAddItem = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in newItem) {
      const value = newItem[key];
      if (value !== null && value !== "") {
        formData.append(key, value);
      }
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/food-items/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Item added successfully!");
      setErrorMessage("");
      setNewItem({
        name: "",
        type: "entree",
        calories: "",
        alt_price: "",
        upcharge: "0.00",
        image: null,
        is_spicy: false,
        is_premium: false,
        is_gluten_free: false,
        on_menu: true,
      });
      const updatedMenu = await axios.get(`${apiUrl}/api/food-items/`);
      setMenuItems(updatedMenu.data);
    } catch (err) {
      console.error("Error adding item:", err.response?.data || err.message);
      setErrorMessage("Error adding item. Please check required fields and try again.");
    }
  };

  /**
   * Submits the form to update an existing menu item in the backend.
   *
   * @param {Object} e The form submission event.
   */
  const handleUpdateItem = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in editingItem) {
      const value = editingItem[key];
      if (value !== null && value !== "") {
        formData.append(key, value);
      }
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/food-items/${editingItem.id}/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSuccessMessage("Item updated successfully!");
      setErrorMessage("");
      setEditingItem(null);
      const updatedMenu = await axios.get(`${apiUrl}/api/food-items/`);
      setMenuItems(updatedMenu.data);
    } catch (err) {
      console.error("Error updating item:", err.response?.data || err.message);
      setErrorMessage("Error updating item. Please try again.");
    }
  };

  /**
   * Deletes a menu item from the backend.
   *
   * @param {number} id The ID of the menu item to delete.
   */
  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/food-items/${id}/`);
        setSuccessMessage("Item deleted successfully!");
        setMenuItems(menuItems.filter((menuItem) => menuItem.id !== id));
      } catch (err) {
        console.error("Error deleting item:", err.response?.data || err.message);
        setErrorMessage("Error deleting item. Please try again.");
      }
    }
  };

  return (
    <div className="menu-navigation">
      <h1>Our Menu</h1>
      <nav>
        <ul className="menu-nav-list">
          <li>
            <Link to="entrees">Entrees</Link>
          </li>
          <li>
            <Link to="sides-drinks-appetizers">Sides, Drinks & Appetizers</Link>
          </li>
          <li>
            <Link to="sizes-featured-popular">Sizes, Featured & Popular</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="entrees" element={<Entrees />} />
        <Route path="sides-drinks-appetizers" element={<SidesDrinksAppetizers />} />
        <Route path="sizes-featured-popular" element={<SizesFeaturedPopular />} />
      </Routes>

      <div className="manager-menu-container">
        <h2>Manage Menu</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleAddItem} className="add-item-form">
          <h3>Add New Menu Item</h3>
          <input
            type="text"
            name="name"
            placeholder="Name (required)"
            value={newItem.name}
            onChange={handleFormChange}
            required
          />
          <select name="type" value={newItem.type} onChange={handleFormChange}>
            <option value="entree">Entree</option>
            <option value="side">Side</option>
            <option value="drink">Drink</option>
            <option value="appetizer">Appetizer</option>
            <option value="dessert">Dessert</option>
          </select>
          <input
            type="number"
            name="alt_price"
            placeholder="Price (required)"
            value={newItem.alt_price}
            onChange={handleFormChange}
            required
          />
          <input
            type="number"
            name="upcharge"
            placeholder="Upcharge"
            value={newItem.upcharge}
            onChange={handleFormChange}
          />
          <input
            type="number"
            name="calories"
            placeholder="Calories"
            value={newItem.calories}
            onChange={handleFormChange}
          />
          <input type="file" name="image" onChange={handleFileChange} />
          <label>
            <input
              type="checkbox"
              name="is_spicy"
              checked={newItem.is_spicy}
              onChange={handleFormChange}
            />
            Spicy
          </label>
          <label>
            <input
              type="checkbox"
              name="is_premium"
              checked={newItem.is_premium}
              onChange={handleFormChange}
            />
            Premium
          </label>
          <label>
            <input
              type="checkbox"
              name="is_gluten_free"
              checked={newItem.is_gluten_free}
              onChange={handleFormChange}
            />
            Gluten-Free
          </label>
          <label>
            <input
              type="checkbox"
              name="on_menu"
              checked={newItem.on_menu}
              onChange={handleFormChange}
            />
            On Menu
          </label>
          <button type="submit">Add Item</button>
        </form>

        {editingItem && (
          <form onSubmit={handleUpdateItem} className="edit-item-form">
            <h3>Edit Menu Item</h3>
            <input
              type="text"
              name="name"
              placeholder="Name (required)"
              value={editingItem.name || ""}
              onChange={(e) => handleFormChange(e, true)}
              required
            />
            <select
              name="type"
              value={editingItem.type || "entree"}
              onChange={(e) => handleFormChange(e, true)}
            >
              <option value="entree">Entree</option>
              <option value="side">Side</option>
              <option value="drink">Drink</option>
              <option value="appetizer">Appetizer</option>
              <option value="dessert">Dessert</option>
            </select>
            <input
              type="number"
              name="alt_price"
              placeholder="Price (required)"
              value={editingItem.alt_price || ""}
              onChange={(e) => handleFormChange(e, true)}
              required
            />
            <input
              type="number"
              name="upcharge"
              placeholder="Upcharge"
              value={editingItem.upcharge || ""}
              onChange={(e) => handleFormChange(e, true)}
            />
            <input
              type="number"
              name="calories"
              placeholder="Calories"
              value={editingItem.calories || ""}
              onChange={(e) => handleFormChange(e, true)}
            />
            <input type="file" name="image" onChange={(e) => handleFileChange(e, true)} />
            <label>
              <input
                type="checkbox"
                name="is_spicy"
                checked={editingItem.is_spicy || false}
                onChange={(e) => handleFormChange(e, true)}
              />
              Spicy
            </label>
            <label>
              <input
                type="checkbox"
                name="is_premium"
                checked={editingItem.is_premium || false}
                onChange={(e) => handleFormChange(e, true)}
              />
              Premium
            </label>
            <label>
              <input
                type="checkbox"
                name="is_gluten_free"
                checked={editingItem.is_gluten_free || false}
                onChange={(e) => handleFormChange(e, true)}
              />
              Gluten-Free
            </label>
            <label>
              <input
                type="checkbox"
                name="on_menu"
                checked={editingItem.on_menu || false}
                onChange={(e) => handleFormChange(e, true)}
              />
              On Menu
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingItem(null)}>
              Cancel
            </button>
          </form>
        )}

        <div className="menu-list-container">
          {/* Side Menu */}
  <ul className="side-menu">
    {menuItems.map((item) => (
      <li key={item.id} className="side-menu-item">
        <span>{item.name}</span>
        <button onClick={() => setEditingItem(item)}>Edit</button>
        <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
      </li>
    ))}
  </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
