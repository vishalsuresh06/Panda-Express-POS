import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Manager,
  EmployeeEdit,
  MenuEdit,
  InventoryEdit,
} from "./pages/manager";
import Cashier from "./pages/cashier";
import Customers from "./pages/customers";
import Kitchen from "./pages/kitchen";
import Menu from "./pages/menu";
import NotFound from "./pages/notfound";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Cashier />} />
        {/* Manager and its subpages */}
        <Route path="manager" element={<Manager />}>
          <Route path="employees" element={<EmployeeEdit />} />
          <Route path="menu" element={<MenuEdit />} />
          <Route path="inventory" element={<InventoryEdit />} />
        </Route>

        {/* Other main routes */}
        <Route path="/customer" element={<Customers />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/menu" element={<Menu />} />

        {/* Fallback for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
