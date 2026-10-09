import { useEffect, useState } from 'react';
import { IndianRupee, TrendingUp, Receipt, Clock } from 'lucide-react';
import api from '../../services/api';

export default function AdminReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/reports').then(r => setReport(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card">Loading reports...</div>;
  if (!report) return <div className="alert alert-danger">Could not load reports.</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Reports</h2>
        <p>Sales and system summary</p>
      </div>

      <div className="cards-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #f57f17' }}>
          <span className="stat-icon"><IndianRupee size={22} color="#f57f17" /></span>
          <span className="stat-label">Today's Sales</span>
          <span className="stat-value">₹{report.todaySales}</span>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #2e7d32' }}>
          <span className="stat-icon"><TrendingUp size={22} color="#2e7d32" /></span>
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">₹{report.totalRevenue}</span>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #1565c0' }}>
          <span className="stat-icon"><Receipt size={22} color="#1565c0" /></span>
          <span className="stat-label">Total Transactions</span>
          <span className="stat-value">{report.totalTransactions}</span>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #6a1b9a' }}>
          <span className="stat-icon"><Clock size={22} color="#6a1b9a" /></span>
          <span className="stat-label">Today's Transactions</span>
          <span className="stat-value">{report.todayTransactions}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Stock Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#e8f5e9', borderRadius: '6px' }}>
              <span>In Stock</span><strong style={{ color: '#2e7d32' }}>{report.inStockCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#fff8e1', borderRadius: '6px' }}>
              <span>Low Stock</span><strong style={{ color: '#f57f17' }}>{report.lowStockCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#fce4ec', borderRadius: '6px' }}>
              <span>Out of Stock</span><strong style={{ color: '#c62828' }}>{report.outOfStockCount}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Shop-wise Sales</h3>
          {report.shopSales?.length === 0 ? (
            <p style={{ color: '#888' }}>No sales data yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {report.shopSales?.map(s => (
                <div key={s.shopName} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f8f9fa', borderRadius: '6px' }}>
                  <span>{s.shopName}</span>
                  <strong>₹{s.totalSales}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
