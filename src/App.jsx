import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Manager,
  EmployeeEdit,
  MenuEdit,
  InventoryEdit,
  KitchenSettings,
  Excess,
  SellsTogether,
  Restock,
  Sales,
  ProductUsage,
} from "./pages/manager";
import Cashiers from "./pages/cashier";
import Customers from "./pages/customers";
import { Kitchen, KitchenOrders, RecentOrders } from "./pages/kitchen";
import Menu from "./pages/menu";
import ItemSelection from "./pages/cashier/components/itemSelectionPage.jsx";
import NotFound from "./pages/notfound";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="manager" element={<Manager />}>
          <Route path="employees" element={<EmployeeEdit />} />
          <Route path="menu" element={<MenuEdit />} />
          <Route path="inventory" element={<InventoryEdit />} />
          <Route path="kitchensettings" element={<KitchenSettings />} />
          <Route path="excess" element={<Excess />} />
          <Route path="sellstogether" element={<SellsTogether />} />
          <Route path="restock" element={<Restock />} />
          <Route path="sales" element={<Sales />} />
          <Route path="productusage" element={<ProductUsage />} />
        </Route>

        <Route path="/cashier" element={<Cashiers />} />
        <Route path="/itemSelection" element={<ItemSelection />} />
        <Route path="/customer" element={<Customers />} />

        <Route path="/kitchen" element={<Kitchen />}>
          <Route path="orders" element={<KitchenOrders />} />
          <Route path="recentorders" element={<RecentOrders />} />
        </Route>

        <Route path="/menu" element={<Menu />} />

        {/* Fallback for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
