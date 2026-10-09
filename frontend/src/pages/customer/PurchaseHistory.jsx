import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerByUserId, getTransactionsByCustomer, getProductById, getShops } from '../../services/mockStore';

export default function PurchaseHistory({ onNavigateTab }) {
  const { user } = useAuth();
  const customer = getCustomerByUserId(user?.id);
  const history = customer ? getTransactionsByCustomer(customer.id) : [];
  const navigate = useNavigate();

  const handleViewReceipt = (id) => {
    if (onNavigateTab) {
      onNavigateTab('bills', id);
    } else {
      navigate(`/customer/bills/${id}`);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Purchase History</h2>
        <p>All your past transactions</p>
      </div>
      <div className="card">
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#666' }}>
              <ShoppingCart size={44} />
            </div>
            <p>No purchases yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Receipt / Bill No.</th>
                  <th>Date</th>
                  <th>Government Retail Shop</th>
                  <th>Regulated Product</th>
                  <th>Volume / Qty</th>
                  <th>Total (INR)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map(t => {
                  const product = getProductById(t.productId);
                  const shop = getShops().find(s => s.id === t.shopId);
                  return (
                    <tr key={t.id}>
                      <td><strong style={{ fontFamily: 'var(--gov-font-mono, monospace)', color: '#002147' }}>#{t.billNumber}</strong></td>
                      <td>{new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{shop?.name || 'TASMAC Government Shop'}</td>
                      <td>
                        <strong>{product?.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{product?.bottleSizeMl}ml Standard Bottle</div>
                      </td>
                      <td>
                        <span className="badge badge-info">{t.quantity * (product?.bottleSizeMl || 250)} ml ({t.quantity} {t.quantity > 1 ? 'bottles' : 'bottle'})</span>
                      </td>
                      <td><strong style={{ color: '#15803d' }}>₹{t.totalAmount}</strong></td>
                      <td>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
                          onClick={() => handleViewReceipt(t.id)}>
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
