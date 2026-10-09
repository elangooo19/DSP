import { useParams, useNavigate } from 'react-router-dom';
import { Receipt, Shield, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerByUserId, getTransactionsByCustomer, getTransactionById, getProductById, getShops } from '../../services/mockStore';
import './Bill.css';

export default function CustomerBill({ selectedBillId, onSelectBill, onBackToList }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const customer = getCustomerByUserId(user?.id);
  const bills = customer ? getTransactionsByCustomer(customer.id) : [];

  const effectiveId = selectedBillId !== undefined ? selectedBillId : paramId;

  if (!effectiveId) return (
    <div>
      <div className="page-header">
        <h2>My Digital Bills</h2>
        <p>View and download official purchase receipts</p>
      </div>
      <div className="card">
        {bills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#888' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#666' }}>
              <Receipt size={44} />
            </div>
            <p>No bills generated yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bill Number</th>
                  <th>Date & Time</th>
                  <th>Government Shop</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total Amount</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(b => {
                  const prod = getProductById(b.productId);
                  const shop = getShops().find(s => s.id === b.shopId);
                  return (
                    <tr key={b.id}>
                      <td><strong>#{b.billNumber}</strong></td>
                      <td>{new Date(b.createdAt).toLocaleDateString('en-IN')} {new Date(b.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{shop?.name}</td>
                      <td>{prod?.name}</td>
                      <td>{b.quantity}</td>
                      <td><strong style={{ color: '#2e7d32' }}>₹{b.totalAmount}</strong></td>
                      <td>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          onClick={() => {
                            if (onSelectBill) onSelectBill(b.id);
                            else navigate(`/customer/bills/${b.id}`);
                          }}
                        >
                          <Eye size={14} /> View
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

  const t = getTransactionById(Number(effectiveId));
  if (!t || t.customerId !== customer?.id) return <div className="alert alert-danger">Bill not found.</div>;

  const product = getProductById(t.productId);
  const shop = getShops().find(s => s.id === t.shopId);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Bill Details</h2>
        <button
          className="btn btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          onClick={() => {
            if (onBackToList) onBackToList();
            else navigate('/customer/bills');
          }}
        >
          ← All Bills
        </button>
      </div>
      <div className="bill-container">
        <div className="bill-header">
          <div className="bill-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Shield size={20} color="#b45309" /> Government of Tamil Nadu &bull; SADMS
          </div>
          <div className="bill-title">OFFICIAL ELECTRONIC RECEIPT / e-CHALLAN</div>
        </div>
        <div className="bill-meta">
          <div><span>e-Receipt No.</span><strong>#{t.billNumber}</strong></div>
          <div><span>Date</span><strong>{new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div>
          <div><span>Time</span><strong>{new Date(t.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} IST</strong></div>
        </div>
        <div className="bill-parties">
          <div><span>Registered Citizen</span><strong>{customer.name} ({customer.aadhaarNumber})</strong></div>
          <div><span>Dispensing Shop</span><strong>{shop?.name}</strong></div>
        </div>
        <table className="bill-table">
          <thead><tr><th>Regulated Product</th><th>Volume / Qty</th><th>Unit Price</th><th>Total (INR)</th></tr></thead>
          <tbody>
            <tr>
              <td>{product?.name} ({product?.bottleSizeMl}ml Standard Bottle)</td>
              <td>{t.quantity * (product?.bottleSizeMl || 250)} ml ({t.quantity} {t.quantity > 1 ? 'Bottles' : 'Bottle'})</td>
              <td>₹{t.unitPrice}</td>
              <td>₹{t.totalAmount}</td>
            </tr>
          </tbody>
        </table>
        <div className="bill-total"><span>Total Payable Amount</span><strong>₹{t.totalAmount}</strong></div>
        <div className="bill-footer">
          <strong>Transaction Authorized &bull; Excise Duty Paid</strong>
          <span>Centralized Excise Distribution Ledger &bull; Department of Prohibition and Excise</span>
        </div>
      </div>
    </div>
  );
}
