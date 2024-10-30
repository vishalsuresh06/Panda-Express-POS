import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Managers from './pages/managers';
import Cashiers from './pages/cashiers';
import Customers from './pages/customers';
import Kitchen from './pages/kitchen';
import Menu from './pages/menu';
import NotFound from './pages/notfound';
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/manager" element={<Managers />} />
        <Route path="/cashier" element={<Cashiers />} />
        <Route path="/customer" element={<Customers />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
