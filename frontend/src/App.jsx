import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';

import ShopDashboard from './pages/ShopDashboard';
import ShopHome from './pages/shop/ShopHome';
import VerifyCustomer from './pages/shop/VerifyCustomer';
import Sell from './pages/shop/Sell';
import Stock from './pages/shop/Stock';
import ShopSales from './pages/shop/ShopSales';
import RejectedSales from './pages/shop/RejectedSales';

import AdminDashboard from './pages/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminShops from './pages/admin/AdminShops';
import AdminInventory from './pages/admin/AdminInventory';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminReports from './pages/admin/AdminReports';

import CustomerDashboard from './pages/CustomerDashboard';
import './components/Layout.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Homepage */}
          <Route path="/" element={<Home />} />

          {/* Unified Single Login Page for all three logins */}
          <Route path="/login" element={<Login />} />
          <Route path="/customer/login" element={<Navigate to="/login?role=customer" replace />} />
          <Route path="/shop/login" element={<Navigate to="/login?role=shop" replace />} />

          {/* Customer Single Page Hub: Login + After-Login Dashboard in a Single Page */}
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/customer/*" element={<Navigate to="/customer" replace />} />

          {/* Shop Routes */}
          <Route path="/shop" element={<ProtectedRoute role="SHOP"><ShopDashboard /></ProtectedRoute>}>
            <Route index           element={<ShopHome />} />
            <Route path="verify"   element={<VerifyCustomer />} />
            <Route path="sell"     element={<Sell />} />
            <Route path="stock"    element={<Stock />} />
            <Route path="sales"    element={<ShopSales />} />
            <Route path="rejected" element={<RejectedSales />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>}>
            <Route index                element={<AdminHome />} />
            <Route path="customers"     element={<AdminCustomers />} />
            <Route path="shops"         element={<AdminShops />} />
            <Route path="inventory"     element={<AdminInventory />} />
            <Route path="transactions"  element={<AdminTransactions />} />
            <Route path="reports"       element={<AdminReports />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
