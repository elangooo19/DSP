import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, User, CheckCircle2, XCircle, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getProducts, getShopByUserId, sell, recordRejection,
  getCustomerByAadhaar, getDailyPurchased,
  DAILY_BOTTLE_LIMIT, BOTTLE_SIZE_ML, MIN_AGE,
} from '../../services/mockStore';
import '../customer/Bill.css';
import './Sell.css';

export default function Sell() {
  const { state }  = useLocation();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const shop       = getShopByUserId(user?.id);

  const [aadhaar, setAadhaar]   = useState('');
  const [customer, setCustomer] = useState(state?.customer || null);
  const [lookupErr, setLookupErr] = useState('');

  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [bill, setBill]         = useState(null);
  const [error, setError]       = useState('');
  const [checks, setChecks]     = useState(null);

  const products = getProducts().filter(p => p.bottleSizeMl === BOTTLE_SIZE_ML);
  const product  = products.find(p => p.id === parseInt(selectedProductId));

  const getStatus = (c) => {
    const purchased = getDailyPurchased(c.id);
    const remaining = Math.max(0, DAILY_BOTTLE_LIMIT - purchased);
    return { purchased, remaining };
  };

  const currentStatus = customer ? getStatus(customer) : null;
  const remaining = currentStatus?.remaining ?? 0;

  // Inline Aadhaar lookup
  const handleLookup = () => {
    if (!aadhaar.trim()) { setLookupErr('Please enter a Mock Aadhaar Number'); return; }
    const c = getCustomerByAadhaar(aadhaar.trim());
    if (!c) { setLookupErr('Customer not found for: ' + aadhaar.trim()); return; }
    setLookupErr('');
    setCustomer(c);
    setChecks(null);
    setSelectedProductId('');
    setQuantity(1);
    setError('');
  };

  const handleQty = (d) =>
    setQuantity(q => Math.max(1, Math.min(q + d, remaining, product?.availableQuantity || 99)));

  const runChecks = () => {
    if (!customer || !product) return;
    const { purchased, remaining: rem } = getStatus(customer);
    setChecks({
      verified:  customer.verified && !customer.blocked,
      ageOk:     customer.age >= MIN_AGE,
      limitOk:   rem >= quantity,
      stockOk:   product.availableQuantity >= quantity,
      purchased, remaining: rem,
    });
    setError('');
  };

  const handleSell = () => {
    if (!customer)          { setError('No customer selected.'); return; }
    if (!selectedProductId) { setError('Please select a product.'); return; }
    if (quantity < 1)       { setError('Quantity must be at least 1.'); return; }

    // Block under-age — record rejection
    if (customer.age < MIN_AGE) {
      recordRejection(customer.id, shop.id, `Under-age: ${customer.age} < ${MIN_AGE}`, 'UNDER_AGE');
      setError(`SALE BLOCKED — Customer is below ${MIN_AGE} years old.`);
      return;
    }
    // Block limit exceeded — record rejection
    const { remaining: rem } = getStatus(customer);
    if (quantity > rem) {
      recordRejection(customer.id, shop.id,
        rem === 0 ? 'Daily limit reached' : `Requested ${quantity}, only ${rem} remaining`,
        'LIMIT_EXCEEDED');
      setError(rem === 0
        ? `DAILY LIMIT REACHED — ${DAILY_BOTTLE_LIMIT * BOTTLE_SIZE_ML} ml quota used for today.`
        : `Only ${rem * BOTTLE_SIZE_ML} ml (${rem} bottle(s)) remaining today.`);
      return;
    }

    setError('');
    try {
      setBill(sell(customer.id, parseInt(selectedProductId), quantity, shop.id));
    } catch (e) {
      setError(e.message);
    }
  };

  // ── Bill Screen ──────────────────────────────────────────────────────────
  if (bill) return (
    <div>
      <div className="page-header"><h2>Sale Completed</h2></div>
      <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CheckCircle2 size={18} /> SALE COMPLETED SUCCESSFULLY
      </div>

      <div className="bill-container">
        <div className="bill-header">
          <div className="bill-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={20} /> SADMS
          </div>
          <div className="bill-title">DIGITAL BILL</div>
        </div>
        <div className="bill-meta">
          <div><span>Bill No.</span><strong>{bill.billNumber}</strong></div>
          <div><span>Date</span><strong>{new Date(bill.createdAt).toLocaleDateString('en-IN')}</strong></div>
          <div><span>Time</span><strong>{new Date(bill.createdAt).toLocaleTimeString('en-IN')}</strong></div>
        </div>
        <div className="bill-parties">
          <div><span>Customer</span><strong>{bill.customerName}</strong></div>
          <div><span>Aadhaar</span><strong style={{ fontFamily: 'monospace' }}>{bill.aadhaarNumber}</strong></div>
          <div><span>Shop</span><strong>{bill.shopName}</strong></div>
        </div>
        <table className="bill-table">
          <thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>
            <tr>
              <td>{bill.productName}</td>
              <td>{bill.bottleSizeMl} ml</td>
              <td>{bill.quantity}</td>
              <td>₹{bill.unitPrice}</td>
              <td>₹{bill.totalAmount}</td>
            </tr>
          </tbody>
        </table>
        <div className="bill-total"><span>Total Amount</span><strong>₹{bill.totalAmount}</strong></div>

        <div style={{ margin: '1rem 0', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span>Daily Limit (250 ml/day)</span><strong>{((bill.dailyLimit ?? bill.monthlyLimit) || 1) * bill.bottleSizeMl} ml ({(bill.dailyLimit ?? bill.monthlyLimit ?? 1)} bottle)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span>Purchased Today</span><strong>{(bill.dailyPurchased ?? bill.monthlyPurchased ?? 0) * bill.bottleSizeMl} ml ({(bill.dailyPurchased ?? bill.monthlyPurchased ?? 0)} bottle)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Remaining Today</span>
            <strong style={{ color: (bill.dailyRemaining ?? bill.monthlyRemaining) === 0 ? '#c62828' : '#2e7d32' }}>
              {(bill.dailyRemaining ?? bill.monthlyRemaining ?? 0) * bill.bottleSizeMl} ml ({(bill.dailyRemaining ?? bill.monthlyRemaining ?? 0)} bottle)
            </strong>
          </div>
        </div>

        <div className="bill-footer">
          {(bill.dailyRemaining ?? bill.monthlyRemaining) === 0
            ? 'Daily limit reached (250 ml). Quota resets at midnight.'
            : 'PURCHASE SUCCESSFUL — 250 ML DAILY QUOTA RECORDED'}
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button className="btn btn-primary" onClick={() => { setBill(null); setCustomer(null); setAadhaar(''); setSelectedProductId(''); setQuantity(1); setChecks(null); navigate('/shop/verify'); }}>
          New Sale
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/shop/sales')}>View Sales</button>
      </div>
    </div>
  );

  // ── Sell Screen ──────────────────────────────────────────────────────────
  const allChecksPass = checks && checks.verified && checks.ageOk && checks.limitOk && checks.stockOk;

  return (
    <div>
      <div className="page-header"><h2>Sell Product</h2><p>Verify customer and complete sale</p></div>

      <div className="card" style={{ maxWidth: 580 }}>
        <div className="sell-section-title">SADMS — SELL PRODUCT</div>
        <div className="sell-divider" />

        {/* Aadhaar lookup if no customer */}
        {!customer && (
          <>
            <div className="form-group">
              <label>Mock Aadhaar Number</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={aadhaar}
                  onChange={e => setAadhaar(e.target.value)}
                  placeholder="XXXX-XXXX-1234"
                  onKeyDown={e => e.key === 'Enter' && handleLookup()}
                  style={{ flex: 1, fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '1px' }}
                />
                <button className="btn btn-primary" onClick={handleLookup}>VERIFY</button>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.5rem' }}>
              Demo: XXXX-XXXX-1234 | XXXX-XXXX-5678 | XXXX-XXXX-9012 | XXXX-XXXX-3456
            </div>
            {lookupErr && <div className="alert alert-danger">{lookupErr}</div>}
            <div className="sell-divider" />
          </>
        )}

        {/* Customer Info */}
        {customer && (
          <>
            <div className="sell-customer-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div className="sell-avatar"><User size={24} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{customer.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#555', fontFamily: 'monospace' }}>
                    Aadhaar: {customer.aadhaarNumber}
                  </div>
                  <div style={{ marginTop: '0.3rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${customer.verified && !customer.blocked ? 'badge-success' : 'badge-danger'}`}>
                      {customer.verified && !customer.blocked ? 'Verified' : 'Not Verified'}
                    </span>
                    <span className={`badge ${customer.age >= MIN_AGE ? 'badge-success' : 'badge-danger'}`}>
                      Age {customer.age} — {customer.age >= MIN_AGE ? 'Eligible' : `Under ${MIN_AGE}`}
                    </span>
                  </div>
                </div>
                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}
                  onClick={() => { setCustomer(null); setAadhaar(''); setChecks(null); setSelectedProductId(''); setQuantity(1); setError(''); }}>
                  Change
                </button>
              </div>

              <div className="sell-limit-grid">
                <div className="sell-limit-item">
                  <span className="sell-limit-label">Daily Limit</span>
                  <span className="sell-limit-value">{DAILY_BOTTLE_LIMIT * BOTTLE_SIZE_ML} ml ({DAILY_BOTTLE_LIMIT} Bottle)</span>
                </div>
                <div className="sell-limit-item">
                  <span className="sell-limit-label">Bottle Size</span>
                  <span className="sell-limit-value">{BOTTLE_SIZE_ML} ml</span>
                </div>
                <div className="sell-limit-item">
                  <span className="sell-limit-label">Purchased Today</span>
                  <span className="sell-limit-value" style={{ color: '#c62828' }}>
                    {(currentStatus?.purchased ?? 0) * BOTTLE_SIZE_ML} ml ({(currentStatus?.purchased ?? 0)} Bottle)
                  </span>
                </div>
                <div className="sell-limit-item">
                  <span className="sell-limit-label">Remaining Today</span>
                  <span className="sell-limit-value" style={{ color: remaining > 0 ? '#2e7d32' : '#c62828' }}>
                    {remaining * BOTTLE_SIZE_ML} ml ({remaining} Bottle)
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ background: '#e0e0e0', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(((currentStatus?.purchased ?? 0) / DAILY_BOTTLE_LIMIT) * 100, 100)}%`,
                    background: remaining === 0 ? '#c62828' : '#2e7d32',
                    height: '100%', borderRadius: '8px', transition: 'width 0.4s'
                  }} />
                </div>
              </div>
            </div>

            <div className="sell-divider" style={{ margin: '1rem 0' }} />

            {/* Product + Quantity */}
            <div className="form-group">
              <label>Select Product (250 ml)</label>
              <select value={selectedProductId} onChange={e => { setSelectedProductId(e.target.value); setChecks(null); }}>
                <option value="">-- Choose a product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id} disabled={p.availableQuantity === 0}>
                    {p.name} — ₹{p.price} &nbsp;(Stock: {p.availableQuantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ width: 40, padding: '0.4rem' }} onClick={() => handleQty(-1)}>−</button>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{quantity}</span>
                <button className="btn btn-outline" style={{ width: 40, padding: '0.4rem' }} onClick={() => handleQty(1)}>+</button>
                <span style={{ fontSize: '0.82rem', color: '#888' }}>Max allowed: {remaining}</span>
              </div>
            </div>

            {/* Price summary */}
            {product && (
              <div style={{ padding: '0.85rem 1rem', background: '#f0f4ff', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Unit Price</span><strong>₹{product.price}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Quantity</span><strong>{quantity} bottle(s)</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', marginTop: '0.5rem', paddingTop: '0.5rem', fontSize: '1rem' }}>
                  <strong>Total</strong><strong>₹{product.price * quantity}</strong>
                </div>
              </div>
            )}

            {/* Check Limit */}
            {!checks && selectedProductId && (
              <button className="btn btn-outline" style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }} onClick={runChecks}>
                <Search size={16} /> CHECK LIMIT
              </button>
            )}

            {/* Checks Result */}
            {checks && (
              <div style={{ marginBottom: '1rem' }}>
                {[
                  { ok: checks.verified, label: checks.verified ? 'CUSTOMER VERIFIED'        : 'CUSTOMER NOT VERIFIED'    },
                  { ok: checks.ageOk,    label: checks.ageOk    ? `AGE VERIFIED (${customer.age} ≥ ${MIN_AGE})` : `AGE NOT ELIGIBLE (${customer.age} < ${MIN_AGE})` },
                  { ok: checks.limitOk,  label: checks.limitOk  ? `DAILY LIMIT AVAILABLE (${checks.remaining * BOTTLE_SIZE_ML} ml / ${checks.remaining} bottle left today)` : 'DAILY LIMIT EXCEEDED (250 ml used today)' },
                  { ok: checks.stockOk,  label: checks.stockOk  ? 'STOCK AVAILABLE'          : 'INSUFFICIENT STOCK'       },
                ].map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem 0.75rem', borderRadius: '8px', marginBottom: '0.4rem',
                    background: c.ok ? '#e8f5e9' : '#fce4ec'
                  }}>
                    {c.ok ? <CheckCircle2 size={16} color="#2e7d32" /> : <XCircle size={16} color="#c62828" />}
                    <span style={{ fontWeight: 700, color: c.ok ? '#2e7d32' : '#c62828', fontSize: '0.9rem' }}>{c.label}</span>
                  </div>
                ))}
                {allChecksPass && (
                  <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center', fontWeight: 700, color: '#2e7d32', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} /> ALL CHECKS PASSED — READY TO DISPENSE 250 ML
                  </div>
                )}
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="sell-divider" style={{ margin: '1rem 0' }} />

            <button
              className={`btn ${allChecksPass ? 'btn-success' : 'btn-danger'}`}
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={handleSell}
              disabled={!selectedProductId || (checks && !allChecksPass)}
            >
              {allChecksPass && <CheckCircle2 size={18} />}
              {allChecksPass ? 'COMPLETE SALE (250 ML)' : remaining === 0 ? 'DAILY LIMIT REACHED (250 ML)' : customer.age < MIN_AGE ? 'AGE NOT ELIGIBLE' : 'SELL'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
