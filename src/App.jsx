import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login'
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
import Cashiers from './pages/cashier';
import Customers from './pages/customers';
import { Kitchen, KitchenOrders, RecentOrders } from './pages/kitchen';
import ItemSelection from "./pages/cashier/components/itemSelectionPage.jsx";
import Menu from './pages/menu';
import SizesFeaturedPopular from './pages/menu/SizesFeaturedPopular';
import Entrees from './pages/menu/Entrees';
import SidesDrinksAppetizers from './pages/menu/SidesDrinksAppetizers';
import NotFound from './pages/notfound';
import { LoginRoute } from './utils/Auth'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

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

        <Route path="/cashier" element={
          <LoginRoute>
            <Cashiers />
          </LoginRoute>
        }
        />

        <Route path="/itemSelection" element={<ItemSelection />} />

        <Route path="/customer" element={<Customers />} />

        <Route path="/kitchen" element={<Kitchen />}>
          <Route path="orders" element={<KitchenOrders />} />
          <Route path="recentorders" element={<RecentOrders />} />
        </Route>

        <Route path="/menu/*" element={<Menu />} />
        <Route path="/menu/sizes-featured-popular" element={<SizesFeaturedPopular />} />
        <Route path="/menu/entrees" element={<Entrees />} />
        <Route path="/menu/sides-drinks-appetizers" element={<SidesDrinksAppetizers />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
