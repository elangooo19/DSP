import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Store, IndianRupee, Receipt, Package, Ban } from 'lucide-react';
import { getCustomers, getShops, getTransactions, getProducts, subscribe } from '../../services/mockStore';

export default function AdminHome() {
  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);
  useEffect(() => subscribe(() => forceUpdate(n => n + 1)), []);

  const customers    = getCustomers();
  const transactions = getTransactions();
  const products     = getProducts();
  const today        = new Date().toDateString();
  const todaySales   = transactions.filter(t => new Date(t.createdAt).toDateString() === today).reduce((s, t) => s + t.totalAmount, 0);
  const blocked      = customers.filter(c => c.blocked).length;

  const cards = [
    { icon: <Users size={24} color="#1565c0" />, label: 'Total Customers',    value: customers.length,    color: '#1565c0', path: '/admin/customers' },
    { icon: <Store size={24} color="#2e7d32" />, label: 'Total Shops',        value: getShops().length,   color: '#2e7d32', path: '/admin/shops' },
    { icon: <IndianRupee size={24} color="#f57f17" />, label: "Today's Sales",      value: `₹${todaySales}`,    color: '#f57f17', path: '/admin/reports' },
    { icon: <Receipt size={24} color="#6a1b9a" />, label: 'Total Transactions', value: transactions.length, color: '#6a1b9a', path: '/admin/transactions' },
    { icon: <Package size={24} color="#00838f" />, label: 'Total Stock',        value: products.reduce((s, p) => s + p.availableQuantity, 0), color: '#00838f', path: '/admin/inventory' },
    { icon: <Ban size={24} color="#c62828" />, label: 'Blocked Customers',  value: blocked,             color: '#c62828', path: '/admin/customers' },
  ];

  return (
    <div>
      <div className="page-header"><h2>Admin Dashboard</h2><p>System-wide overview</p></div>
      <div className="cards-grid">
        {cards.map(c => (
          <div key={c.label} className="stat-card" style={{ borderLeft: `4px solid ${c.color}`, cursor: 'pointer' }}
            onClick={() => navigate(c.path)}>
            <span className="stat-icon">{c.icon}</span>
            <span className="stat-label">{c.label}</span>
            <span className="stat-value" style={{ color: c.color }}>{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
