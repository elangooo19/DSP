import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Receipt, CheckCircle2, XCircle, Package, IdCard, ShoppingCart, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getShopByUserId, getShopTodayStats, subscribe } from '../../services/mockStore';

export default function ShopHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const shop = getShopByUserId(user?.id);
  const [stats, setStats] = useState(shop ? getShopTodayStats(shop.id) : {});

  useEffect(() => subscribe(() => setStats(shop ? getShopTodayStats(shop.id) : {})), [shop]);

  const cards = [
    { icon: <IndianRupee size={22} color="#2e7d32" />, label: "Today's Sales",          value: `₹${stats.todaySales ?? 0}`,       color: '#2e7d32' },
    { icon: <Receipt size={22} color="#1565c0" />,     label: "Today's Transactions",   value: stats.todayTransactions ?? 0,       color: '#1565c0' },
    { icon: <CheckCircle2 size={22} color="#6a1b9a" />, label: 'Customers Verified',    value: stats.verifiedToday ?? 0,           color: '#6a1b9a' },
    { icon: <XCircle size={22} color="#c62828" />,      label: 'Rejected Sales Today',  value: stats.rejectedToday ?? 0,           color: '#c62828' },
    { icon: <Package size={22} color="#00838f" />,      label: 'Available Stock',       value: stats.totalStock ?? 0,              color: '#00838f' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Retail Shop Dashboard</h2>
        <p>{shop?.name} — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="cards-grid">
        {cards.map(c => (
          <div key={c.label} className="stat-card" style={{ borderLeft: `4px solid ${c.color}` }}>
            <span className="stat-icon">{c.icon}</span>
            <span className="stat-label">{c.label}</span>
            <span className="stat-value" style={{ color: c.color }}>{c.value}</span>
          </div>
        ))}
      </div>

      {/* Main Action */}
      <div className="card" style={{ textAlign: 'center', padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#1a1a2e' }}>
          <IdCard size={44} />
        </div>
        <h3 style={{ marginBottom: '0.5rem', color: '#1a1a2e' }}>Verify & Sell</h3>
        <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Enter customer Aadhaar or scan QR to verify and complete a sale
        </p>
        <button
          className="btn btn-success"
          style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem', borderRadius: '10px' }}
          onClick={() => navigate('/shop/verify')}
        >
          <CheckCircle2 size={20} /> VERIFY CUSTOMER
        </button>
      </div>

      {/* Quick Links */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/shop/sell')}>
            <ShoppingCart size={16} /> New Sale
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/shop/stock')}>
            <Package size={16} /> Stock
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/shop/sales')}>
            <BarChart3 size={16} /> Sales
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/shop/rejected')}
            style={{ borderColor: '#c62828', color: '#c62828' }}
          >
            <XCircle size={16} /> Rejected Sales
          </button>
        </div>
      </div>
    </div>
  );
}
