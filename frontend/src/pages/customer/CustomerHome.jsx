import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Receipt,
  Clock,
  PackageCheck,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getCustomerByUserId,
  getCustomerBottleBalance,
  getTransactionsByCustomer,
  getProductById,
  getShops,
  subscribe,
  BOTTLE_SIZE_ML
} from '../../services/mockStore';
import './CustomerHome.css';

export default function CustomerHome({ onNavigateTab }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNav = (tab, extra) => {
    if (onNavigateTab) {
      onNavigateTab(tab, extra);
    } else {
      if (tab === 'history') navigate('/customer/history');
      else if (tab === 'bills' && extra) navigate(`/customer/bills/${extra}`);
      else if (tab === 'bills') navigate('/customer/bills');
    }
  };

  // Load customer and bottle balance with live subscription
  const [customer, setCustomer] = useState(() => getCustomerByUserId(user?.id));
  const [balance, setBalance] = useState(() => (customer ? getCustomerBottleBalance(customer.id) : null));
  const [transactions, setTransactions] = useState(() => (customer ? getTransactionsByCustomer(customer.id) : []));

  useEffect(() => {
    const refreshData = () => {
      const c = getCustomerByUserId(user?.id);
      setCustomer(c);
      if (c) {
        setBalance(getCustomerBottleBalance(c.id));
        setTransactions(getTransactionsByCustomer(c.id));
      }
    };

    refreshData();
    return subscribe(refreshData);
  }, [user]);

  if (!customer || !balance) {
    return (
      <div className="alert alert-warning">
        <AlertTriangle size={18} />
        Citizen entitlement record not found. Please log in with a registered citizen account.
      </div>
    );
  }

  // Determine current formatted date
  const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const thisMonthTransactions = transactions;

  return (
    <div className="customer-home-container">
      {/* 1. Official Citizen Identity & Status Header */}
      <div className="gov-citizen-header">
        <div className="citizen-info-block">
          <div className="citizen-title-row">
            <h2>Citizen Profile &amp; Quota Ledger</h2>
            <span className={`badge ${customer.verified ? 'badge-success' : 'badge-warning'}`}>
              <ShieldCheck size={14} />
              {customer.verified ? 'Biometrically Verified' : 'Verification Pending'}
            </span>
            {customer.blocked && <span className="badge badge-danger">Account Blocked</span>}
          </div>

          <div className="citizen-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Citizen Name:</span>
              <strong className="meta-val">{customer.name}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">Aadhaar Reference:</span>
              <strong className="meta-val">{customer.aadhaarNumber}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">RFID Identifier:</span>
              <strong className="meta-val">{customer.rfidCard}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">Age / Eligibility:</span>
              <strong className="meta-val">{customer.age} Years (Legal Age Compliant)</strong>
            </div>
          </div>
        </div>

        <button
          className="btn btn-outline"
          onClick={() => handleNav('history')}
          title="Review all official transaction receipts"
        >
          <Receipt size={16} /> View Purchase Ledger
        </button>
      </div>

      {/* 2. Official Daily Quota Entitlement Card */}
      <div className="gov-quota-card">
        <div className="gov-quota-card-header">
          <div className="quota-header-left">
            <span className="gov-dept-tag">Government of Tamil Nadu • Regulated Daily Quota</span>
            <h3 className="quota-headline">Daily Alcohol Entitlement Ledger ({currentDateFormatted})</h3>
            <p className="quota-subline">
              Official ration quota allocated at 250 ml per day for one person daily pursuant to Tamil Nadu Liquor Rules.
            </p>
          </div>

          <div className="quota-status-indicator">
            {balance.remaining > 0 ? (
              <div className="eligibility-badge authorized">
                <CheckCircle2 size={16} />
                <span>PURCHASE AUTHORIZED (250 ml REMAINING TODAY)</span>
              </div>
            ) : (
              <div className="eligibility-badge exhausted">
                <XCircle size={16} />
                <span>DAILY LIMIT EXHAUSTED (0 ml REMAINING TODAY)</span>
              </div>
            )}
            <div className="quota-reset-note">
              <Clock size={13} />
              <span>Next daily quota cycle begins at 00:00 IST midnight</span>
            </div>
          </div>
        </div>

        {/* Quota Numerical Metrics */}
        <div className="gov-metrics-row">
          <div className="gov-metric-item">
            <span className="metric-title">Daily Quota</span>
            <div className="metric-number">250 <span className="metric-unit">ml</span></div>
            <span className="metric-detail">Daily legal quota (1 bottle of 250ml per person daily)</span>
          </div>

          <div className="gov-metric-item">
            <span className="metric-title">Volume Dispensed Today</span>
            <div className="metric-number metric-consumed">{balance.totalMlPurchased} <span className="metric-unit">ml</span></div>
            <span className="metric-detail">{balance.dailyPurchased ?? balance.monthlyPurchased} bottle claimed today</span>
          </div>

          <div className="gov-metric-item highlight-metric">
            <span className="metric-title">Balance Remaining Today</span>
            <div className={`metric-number ${balance.remaining > 0 ? 'metric-available' : 'metric-zero'}`}>
              {balance.totalMlRemaining} <span className="metric-unit">ml</span>
            </div>
            <span className="metric-detail">{balance.remaining} bottle ({balance.totalMlRemaining} ml) available today</span>
          </div>

          <div className="gov-metric-item">
            <span className="metric-title">Today's Utilization</span>
            <div className="metric-number">{balance.percentUsed}%</div>
            <div className="gov-progress-bar-wrap">
              <div
                className={`gov-progress-bar-fill ${balance.remaining === 0 ? 'fill-exhausted' : 'fill-active'}`}
                style={{ width: `${balance.percentUsed}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official Daily 250ml Quota Entitlement Ledger Matrix */}
      <div className="gov-ledger-section">
        <div className="ledger-header">
          <div>
            <h3>Daily Quota Allocation Matrix (250 ml / Day)</h3>
            <p className="ledger-sub">
              250 ml total daily quota (1 standard ration bottle of 250ml) authorized per calendar day for one person.
            </p>
          </div>
          <div className="ledger-legend">
            <div className="legend-entry">
              <span className="legend-chip claimed" />
              <span>Dispensed / Claimed Today ({balance.totalMlPurchased} ml)</span>
            </div>
            <div className="legend-entry">
              <span className="legend-chip available" />
              <span>Available Entitlement Today ({balance.totalMlRemaining} ml)</span>
            </div>
          </div>
        </div>

        {/* Clean Daily 250ml Government Quota Unit Block */}
        <div className="quota-units-grid" style={{ gridTemplateColumns: 'minmax(280px, 360px)' }}>
          <div
            className={`quota-unit-box ${balance.remaining === 0 ? 'unit-claimed' : 'unit-available'}`}
            title={
              balance.remaining === 0
                ? 'Daily Slot (250 ml): Claimed and dispensed today'
                : 'Daily Slot (250 ml): Available in your legal daily quota'
            }
          >
            <div className="unit-top">
              <span className="unit-index">Daily 250 ml Ration</span>
              <span className={`unit-status-badge ${balance.remaining === 0 ? 'badge-claimed' : 'badge-available'}`}>
                {balance.remaining === 0 ? 'DISPENSED TODAY' : 'AVAILABLE TODAY'}
              </span>
            </div>

            <div className="unit-body">
              <div className="unit-icon-wrap">
                {balance.remaining === 0 ? (
                  <CheckCircle2 size={24} className="icon-claimed" />
                ) : (
                  <ShieldCheck size={24} className="icon-available" />
                )}
              </div>
              <div className="unit-volume">{BOTTLE_SIZE_ML} ml</div>
              <div className="unit-type">Daily Standard Allocation (1 Bottle/Day)</div>
            </div>

            <div className="unit-footer">
              {balance.remaining === 0 ? (
                <span className="unit-status-text">Recorded in Ledger Today</span>
              ) : (
                <span className="unit-status-text text-green">Authorized for Purchase Today</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Statutory Regulatory Notice */}
      <div className={`gov-notice-banner ${balance.remaining > 0 ? 'notice-info' : 'notice-warning'}`}>
        <div className="notice-icon">
          {balance.remaining > 0 ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
        </div>
        <div className="notice-body">
          <strong>
            {balance.remaining > 0
              ? 'Official Purchase Authorization Active'
              : 'Daily Regulated Allocation Limit Reached'}
          </strong>
          <p>
            {balance.remaining > 0 ? (
              <>
                You have <strong>{balance.totalMlRemaining} ml authorized quota</strong> ({balance.remaining} standard 250ml bottle)
                remaining for today ({currentDateFormatted}). Present your registered Smart Aadhaar Reference (
                <code>{customer.aadhaarNumber}</code>) or Smart RFID Card at any licensed TASMAC Retail Shop for
                biometric clearance and authorized point-of-sale dispensation.
              </>
            ) : (
              <>
                Under Section 58 of the Tamil Nadu Prohibition Act, 1937, the daily ceiling of{' '}
                <strong>{balance.totalMlAllowed} ml (1 standard bottle for one person daily)</strong> has been completely utilized for today.
                Point-of-sale terminals are automated to refuse transactions until the system resets at midnight (00:00 IST).
              </>
            )}
          </p>
        </div>
      </div>

      {/* 5. Recent Dispensation Records Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#002147' }}>
              Recent Dispensation Records ({thisMonthTransactions.length} Transactions)
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Official electronic receipts logged in the centralized excise database.
            </p>
          </div>

          <button
            className="btn btn-outline"
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
            onClick={() => handleNav('bills')}
          >
            <FileText size={15} /> All Receipts
          </button>
        </div>

        {thisMonthTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
            <PackageCheck size={38} color="#94a3b8" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
            <p style={{ fontWeight: 600, color: '#334155', margin: 0 }}>No dispensations recorded this month</p>
            <span style={{ fontSize: '0.82rem' }}>All {balance.totalMlAllowed} ml quota remains available in your account.</span>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bill / Receipt No.</th>
                  <th>Date &amp; Time (IST)</th>
                  <th>Government Retail Shop</th>
                  <th>Dispensed Product</th>
                  <th>Volume Dispensed (ml)</th>
                  <th>Amount (INR)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {thisMonthTransactions.map(t => {
                  const product = getProductById(t.productId);
                  const shop = getShops().find(s => s.id === t.shopId);
                  return (
                    <tr key={t.id}>
                      <td>
                        <strong style={{ fontFamily: 'var(--gov-font-mono, monospace)', color: '#002147' }}>
                          #{t.billNumber}
                        </strong>
                      </td>
                      <td>
                        {new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {' '}
                        {new Date(t.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </td>
                      <td>{shop?.name || 'TASMAC Government Shop'}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{product?.name || 'Regulated Item'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {product?.category} &bull; {product?.bottleSizeMl}ml Standard Bottle
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">
                          {t.quantity * (product?.bottleSizeMl || 250)} ml ({t.quantity} {t.quantity === 1 ? 'bottle' : 'bottles'})
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: '#15803d' }}>₹{t.totalAmount}</strong>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
                          onClick={() => handleNav('bills', t.id)}
                        >
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
