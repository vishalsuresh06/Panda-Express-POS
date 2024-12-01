import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Manager, EmployeeEdit, MenuEdit, InventoryEdit } from './pages/manager';
import Cashiers from './pages/cashiers';
import Customers from './pages/customers';
import {Kitchen, KitchenOrders, RecentOrders, KitchenCustomizer} from './pages/kitchen';
import Menu from './pages/menu';
import NotFound from './pages/notfound';
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="manager" element={<Manager />}>
          <Route path="employees" element={<EmployeeEdit />} />
          <Route path="menu" element={<MenuEdit />} />
          <Route path="inventory" element={<InventoryEdit />} />
        </Route>

        <Route path="/cashier" element={<Cashiers />} />
        <Route path="/customer" element={<Customers />} />

        <Route path="/kitchen" element={<Kitchen />}>
          <Route path="orders" element={<KitchenOrders />} />
          <Route path="customize" element={<KitchenCustomizer />} />
          <Route path="recentorders" element={<RecentOrders />} />
        </Route>


        <Route path="/menu" element={<Menu />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
