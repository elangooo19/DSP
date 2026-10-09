import { useState, useEffect } from 'react';
import { Receipt, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getShopByUserId, getTransactionsByShop, getProductById, getCustomerById, subscribe } from '../../services/mockStore';

export default function ShopSales() {
  const { user } = useAuth();
  const shop = getShopByUserId(user?.id);
  const [transactions, setTransactions] = useState(shop ? getTransactionsByShop(shop.id) : []);

  useEffect(() => subscribe(() => setTransactions(shop ? getTransactionsByShop(shop.id) : [])), [shop]);

  const total = transactions.reduce((s, t) => s + t.totalAmount, 0);

  return (
    <div>
      <div className="page-header"><h2>Sales</h2><p>All transactions at your shop</p></div>

      <div className="cards-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <span className="stat-icon"><Receipt size={22} color="#1565c0" /></span>
          <span className="stat-label">Total Transactions</span>
          <span className="stat-value">{transactions.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon"><IndianRupee size={22} color="#2e7d32" /></span>
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">₹{total}</span>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Bill No.</th><th>Date</th><th>Customer</th><th>Product</th><th>Qty</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No transactions yet</td></tr>
              ) : transactions.map(t => {
                const c = getCustomerById(t.customerId);
                const p = getProductById(t.productId);
                return (
                  <tr key={t.id}>
                    <td><strong>#{t.billNumber}</strong></td>
                    <td>{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>{c?.name}</td>
                    <td>{p?.name}</td>
                    <td>{t.quantity}</td>
                    <td>₹{t.totalAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
