import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/transactions').then(r => setTransactions(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2>Transactions</h2>
        <p>All purchase transactions in the system</p>
      </div>
      <div className="card">
        {loading ? <p>Loading...</p> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bill No.</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Shop</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No transactions found</td></tr>
                ) : transactions.map(t => (
                  <tr key={t.id}>
                    <td><strong>#{t.billNumber}</strong></td>
                    <td>{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>{t.customerName}</td>
                    <td>{t.shopName}</td>
                    <td>{t.productName}</td>
                    <td>{t.quantity}</td>
                    <td>₹{t.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
