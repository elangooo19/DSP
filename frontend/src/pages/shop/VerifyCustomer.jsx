import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IdCard, QrCode, User, BellRing, CheckCircle2, AlertCircle, XCircle, ArrowRight } from 'lucide-react';
import {
  getCustomerByAadhaar, getCustomerByQR,
  getDailyPurchased, recordRejection,
  getShopByUserId,
  DAILY_BOTTLE_LIMIT, BOTTLE_SIZE_ML, MIN_AGE,
} from '../../services/mockStore';
import { useAuth } from '../../context/AuthContext';
import './Sell.css';

const QR_DEMO = [
  { label: 'Arun Kumar (29, 250ml available today)',  value: 'SADMS-CUSTOMER-1001' },
  { label: 'Priya Devi (26, 250ml available today)',  value: 'SADMS-CUSTOMER-1002' },
  { label: 'Ravi Shankar (19, under-age)',             value: 'SADMS-CUSTOMER-1003' },
  { label: 'Karthik Raja (24, daily quota used)',      value: 'SADMS-CUSTOMER-1004' },
];

export default function VerifyCustomer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const shop = getShopByUserId(user?.id);

  const [mode, setMode]         = useState('aadhaar'); // 'aadhaar' | 'qr'
  const [input, setInput]       = useState('');
  const [qrSim, setQrSim]       = useState('');
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState('');
  const [notification, setNotification] = useState(null);

  const lookup = (customer) => {
    if (!customer) { setError('Customer not found. Check the number and try again.'); return; }
    const purchased = getDailyPurchased(customer.id);
    const remaining = Math.max(0, DAILY_BOTTLE_LIMIT - purchased);
    setResult({ ...customer, purchased, remaining });
    setError('');
    setNotification(null);

    // Auto-record rejection for under-age
    if (customer.age < MIN_AGE && shop) {
      recordRejection(customer.id, shop.id, `Customer age ${customer.age} is below minimum age ${MIN_AGE}`, 'UNDER_AGE');
      setNotification({
        phone: customer.mobile,
        message: 'Under-age purchase attempt detected.',
      });
    }
  };

  const handleAadhaarVerify = () => {
    if (!input.trim()) { setError('Please enter a Mock Aadhaar Number'); return; }
    lookup(getCustomerByAadhaar(input.trim()));
  };

  const handleQRScan = () => {
    if (!qrSim) { setError('Please select a QR to simulate'); return; }
    lookup(getCustomerByQR(qrSim));
  };

  const getStatusInfo = (r) => {
    if (!r.verified || r.blocked)  return { icon: <XCircle size={32} color="#c62828" />, text: 'CUSTOMER NOT VERIFIED',    color: '#c62828', bg: '#fce4ec', canSell: false };
    if (r.age < MIN_AGE)           return { icon: <AlertCircle size={32} color="#c62828" />, text: 'AGE NOT ELIGIBLE',          color: '#c62828', bg: '#fce4ec', canSell: false };
    if (r.remaining === 0)         return { icon: <AlertCircle size={32} color="#c62828" />, text: 'DAILY LIMIT REACHED (250 ML)',     color: '#c62828', bg: '#fce4ec', canSell: false };
    if (r.remaining <= 1)          return { icon: <CheckCircle2 size={32} color="#2e7d32" />, text: 'PURCHASE ALLOWED (250 ML)',         color: '#2e7d32', bg: '#e8f5e9', canSell: true  };
    return                                { icon: <CheckCircle2 size={32} color="#2e7d32" />, text: 'PURCHASE ALLOWED',                  color: '#2e7d32', bg: '#e8f5e9', canSell: true  };
  };

  const status = result ? getStatusInfo(result) : null;

  return (
    <div>
      <div className="page-header">
        <h2>Verify Customer</h2>
        <p>Enter Aadhaar number or scan QR code to verify customer eligibility</p>
      </div>

      <div className="card" style={{ maxWidth: 580 }}>
        <div className="sell-section-title">SADMS — CUSTOMER VERIFICATION</div>
        <div className="sell-divider" />

        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            className={`btn ${mode === 'aadhaar' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setMode('aadhaar'); setResult(null); setError(''); setNotification(null); }}
          >
            <IdCard size={16} /> Enter Aadhaar Number
          </button>
          <button
            className={`btn ${mode === 'qr' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setMode('qr'); setResult(null); setError(''); setNotification(null); }}
          >
            <QrCode size={16} /> Scan Customer QR
          </button>
        </div>

        {/* Aadhaar Input */}
        {mode === 'aadhaar' && (
          <>
            <div className="form-group">
              <label>Mock Aadhaar Number</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="XXXX-XXXX-1234"
                  onKeyDown={e => e.key === 'Enter' && handleAadhaarVerify()}
                  style={{ flex: 1, fontFamily: 'monospace', fontSize: '1.05rem', letterSpacing: '1px' }}
                />
                <button className="btn btn-primary" onClick={handleAadhaarVerify}>VERIFY</button>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.5rem' }}>
              Demo: <strong>XXXX-XXXX-1234</strong> (Arun, 29) &nbsp;|&nbsp;
              <strong>XXXX-XXXX-5678</strong> (Priya, 26) &nbsp;|&nbsp;
              <strong>XXXX-XXXX-9012</strong> (Ravi, 19 — under-age) &nbsp;|&nbsp;
              <strong>XXXX-XXXX-3456</strong> (Karthik, limit full)
            </div>
          </>
        )}

        {/* QR Simulation */}
        {mode === 'qr' && (
          <>
            <div style={{ border: '2px dashed #ccc', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem', background: '#f8f9fa' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <QrCode size={48} />
              </div>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Simulate QR scan — select a customer QR code:
              </p>
              <select
                value={qrSim}
                onChange={e => setQrSim(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '0.9rem', marginBottom: '1rem' }}
              >
                <option value="">-- Select QR to scan --</option>
                {QR_DEMO.map(q => (
                  <option key={q.value} value={q.value}>{q.label} — {q.value}</option>
                ))}
              </select>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleQRScan}>
                <QrCode size={16} /> SCAN QR
              </button>
            </div>
          </>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {/* ── Customer Status Screen ── */}
        {result && (
          <>
            <div className="sell-divider" />

            {/* Customer Info */}
            <div className="sell-customer-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div className="sell-avatar"><User size={24} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{result.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#555', fontFamily: 'monospace' }}>
                    Aadhaar: {result.aadhaarNumber}
                  </div>
                  <div style={{ marginTop: '0.3rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${result.verified && !result.blocked ? 'badge-success' : 'badge-danger'}`}>
                      {result.verified && !result.blocked ? 'Verified' : 'Not Verified'}
                    </span>
                    <span className={`badge ${result.age >= MIN_AGE ? 'badge-success' : 'badge-danger'}`}>
                      Age: {result.age} {result.age >= MIN_AGE ? 'Eligible' : 'Under-age'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Daily Limit Grid */}
              <div className="sell-limit-grid">
                <div className="sell-limit-item">
                  <span className="sell-limit-label">Daily Limit</span>
                  <span className="sell-limit-value">{DAILY_BOTTLE_LIMIT} Bottle ({DAILY_BOTTLE_LIMIT * BOTTLE_SIZE_ML} ml)</span>
                </div>
                <div className="sell-limit-item">
                  <span className="sell-limit-label">Bottle Size</span>
                  <span className="sell-limit-value">{BOTTLE_SIZE_ML} ml</span>
                </div>
                <div className="sell-limit-item">
                  <span className="sell-limit-label">Purchased Today</span>
                  <span className="sell-limit-value" style={{ color: '#c62828' }}>{result.purchased} Bottle ({result.purchased * BOTTLE_SIZE_ML} ml)</span>
                </div>
                <div className="sell-limit-item">
                  <span className="sell-limit-label">Remaining Today</span>
                  <span className="sell-limit-value" style={{ color: result.remaining > 0 ? '#2e7d32' : '#c62828' }}>
                    {result.remaining} Bottle ({result.remaining * BOTTLE_SIZE_ML} ml)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ background: '#e0e0e0', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min((result.purchased / DAILY_BOTTLE_LIMIT) * 100, 100)}%`,
                    background: result.remaining === 0 ? '#c62828' : '#2e7d32',
                    height: '100%', borderRadius: '8px', transition: 'width 0.4s'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginTop: '0.3rem' }}>
                  <span>0</span>
                  <span>{result.purchased} / {DAILY_BOTTLE_LIMIT} bottle used today</span>
                  <span>{DAILY_BOTTLE_LIMIT}</span>
                </div>
              </div>
            </div>

            {/* Status Banner */}
            <div style={{
              margin: '1rem 0', padding: '1rem', borderRadius: '10px', textAlign: 'center',
              background: status.bg, border: `2px solid ${status.color}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>{status.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: status.color, marginTop: '0.3rem' }}>
                {status.text}
              </div>
              {result.remaining === 0 && result.age >= MIN_AGE && (
                <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '0.3rem' }}>
                  No more bottles can be purchased this month.
                </div>
              )}
              {result.age < MIN_AGE && (
                <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '0.3rem' }}>
                  Customer must be {MIN_AGE}+ years old to purchase.
                </div>
              )}
            </div>

            {/* Under-age Notification Record */}
            {notification && (
              <div style={{ padding: '1rem', background: '#fff3e0', border: '1px solid #ffb74d', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BellRing size={16} /> NOTIFICATION SENT
                </div>
                <div style={{ fontSize: '0.85rem', color: '#555' }}>
                  <div>To: <strong>{notification.phone}</strong></div>
                  <div style={{ marginTop: '0.3rem' }}>Reason: <strong>{notification.message}</strong></div>
                  <div style={{ marginTop: '0.3rem' }}>
                    Status: <span className="badge badge-warning">Notification Sent</span>
                  </div>
                </div>
              </div>
            )}

            <div className="sell-divider" />

            {status.canSell ? (
              <button
                className="btn btn-success"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => navigate('/shop/sell', { state: { customer: { ...result } } })}
              >
                Proceed to Sell <ArrowRight size={18} />
              </button>
            ) : (
              <button className="btn btn-danger" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }} disabled>
                Sale Not Allowed — {status.text}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
