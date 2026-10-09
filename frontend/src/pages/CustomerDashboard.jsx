import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Home,
  IdCard,
  ClipboardList,
  Receipt,
  User,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Lock,
  KeyRound,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login, logout } from '../services/auth';
import {
  getCustomerByUserId,
  getCustomerBottleBalance,
  subscribe
} from '../services/mockStore';

import CustomerHome from './customer/CustomerHome';
import Verification from './customer/Verification';
import PurchaseHistory from './customer/PurchaseHistory';
import CustomerBill from './customer/CustomerBill';
import CustomerProfile from './customer/CustomerProfile';

import '../components/Layout.css';
import './Login.css';
import './CustomerDashboard.css';

const TABS = [
  { id: 'overview', label: 'Home & Quota Ledger', icon: <Home size={18} /> },
  { id: 'verify',   label: 'Verify Identity',     icon: <IdCard size={18} /> },
  { id: 'history',  label: 'Purchase History',    icon: <ClipboardList size={18} /> },
  { id: 'bills',    label: 'Digital Bills',       icon: <Receipt size={18} /> },
  { id: 'profile',  label: 'Citizen Profile',     icon: <User size={18} /> },
];

const DEMO_CITIZENS = [
  { name: 'Arun Kumar', detail: 'Age 29 • 250 ml (1 Bottle) Left Today', u: 'customer1', p: 'cust123' },
  { name: 'Priya Devi', detail: 'Age 26 • 250 ml (1 Bottle) Left Today', u: 'customer2', p: 'cust123' },
  { name: 'Karthik Raja', detail: 'Age 24 • Daily Limit Reached (250 ml Used)', u: 'customer4', p: 'cust123' },
];

export default function CustomerDashboard() {
  const { user, signIn, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // In-page Active Tab state ('overview' | 'verify' | 'history' | 'bills' | 'profile')
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(
    ['overview', 'verify', 'history', 'bills', 'profile'].includes(initialTab) ? initialTab : 'overview'
  );
  const [selectedBillId, setSelectedBillId] = useState(null);

  // Login form state (used when customer is unauthenticated)
  const [username, setUsername] = useState('customer1');
  const [password, setPassword] = useState('cust123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Customer Quota balance state
  const [customerBalance, setCustomerBalance] = useState(() => {
    if (user?.role === 'CUSTOMER') {
      const c = getCustomerByUserId(user.id);
      return c ? getCustomerBottleBalance(c.id) : null;
    }
    return null;
  });

  // Subscribe to live balance updates when authenticated as CUSTOMER
  useEffect(() => {
    if (user?.role !== 'CUSTOMER') return;
    const update = () => {
      const c = getCustomerByUserId(user.id);
      setCustomerBalance(c ? getCustomerBottleBalance(c.id) : null);
    };
    update();
    return subscribe(update);
  }, [user]);

  // Session Guard: Prevent accidental exit via browser Back button.
  // The customer stays within this single-page portal until clicking "Logout & Exit".
  useEffect(() => {
    if (user?.role !== 'CUSTOMER') return;

    window.history.pushState({ inCustomerPortal: true }, '', window.location.href);

    const handlePopState = () => {
      // Intercept back navigation attempting to exit the portal without logging out
      window.history.pushState({ inCustomerPortal: true }, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user]);

  // Switch tabs in-page without creating new history entries
  const handleTabChange = (tabId, extraData) => {
    setActiveTab(tabId);
    if (tabId === 'bills' && extraData) {
      setSelectedBillId(Number(extraData));
    } else if (tabId !== 'bills') {
      setSelectedBillId(null);
    }
    // Update query param with replace: true to avoid pushing back-history
    setSearchParams(tabId === 'overview' ? {} : { tab: tabId }, { replace: true });
  };

  // Login submission handler on this single page
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = login(username, password);
      if (data.role !== 'CUSTOMER') {
        setError(`This is the Citizen Portal. For ${data.role} login, please use the Wine Shop or Admin portal.`);
        setLoading(false);
        return;
      }
      signIn(data);
      setLoading(false);
    } catch {
      setError('Invalid citizen credentials. Please verify your username and password.');
      setLoading(false);
    }
  };

  // Direct one-click login for demo accounts
  const handleDirectLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
    setLoading(true);
    try {
      const data = login(u, p);
      if (data.role !== 'CUSTOMER') {
        setError(`This is the Citizen Portal. For ${data.role} login, please use the Wine Shop or Admin portal.`);
        setLoading(false);
        return;
      }
      signIn(data);
      setLoading(false);
    } catch {
      setError('Invalid citizen credentials. Please verify your username and password.');
      setLoading(false);
    }
  };

  // Sign out and exit portal
  const handleLogout = () => {
    signOut();
    logout();
    setActiveTab('overview');
    setSelectedBillId(null);
    setSearchParams({}, { replace: true });
  };

  // ─────────────────────────────────────────────────────────────
  // 1. If currently signed in as SHOP or ADMIN, show account switcher
  // ─────────────────────────────────────────────────────────────
  if (user && user.role !== 'CUSTOMER') {
    return (
      <div className="gov-login-wrapper">
        <main className="gov-login-main" role="main">
          <div className="gov-login-card" style={{ borderTop: '4px solid #002147', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#002147' }}>
              <ShieldCheck size={48} />
            </div>
            <h2>Logged in as {user.role === 'SHOP' ? 'Wine Shop Retailer' : 'Excise Administrator'}</h2>
            <p style={{ margin: '0.5rem 0 1.25rem', color: '#64748b', fontSize: '0.88rem' }}>
              You are currently signed in as <strong>{user.username}</strong> ({user.role}). This page is the Citizen / Customer Portal.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to={user.role === 'SHOP' ? '/shop' : '/admin'}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                Go to {user.role === 'SHOP' ? 'Wine Shop Dashboard' : 'Excise Admin Dashboard'}
              </Link>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleLogout}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <LogOut size={15} /> Sign Out to Enter Citizen Portal
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Unauthenticated: Render Citizen Login on this Single Page
  // ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="gov-login-wrapper">
        <main className="gov-login-main" role="main">
          <div className="gov-login-card" style={{ borderTop: '4px solid #15803d' }}>
            {/* Top Navigation Links */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <Link
                to="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.82rem',
                  color: '#0b5ed7',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={14} /> Back to Homepage
              </Link>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                <Link to="/login?role=shop" style={{ color: '#0b5ed7', textDecoration: 'none', fontWeight: 600, marginRight: '0.5rem' }}>
                  Wine Shop Login
                </Link>
                &bull;
                <Link to="/login?role=admin" style={{ color: '#0b5ed7', textDecoration: 'none', fontWeight: 600, marginLeft: '0.5rem' }}>
                  Admin Login
                </Link>
              </div>
            </div>

            {/* Header */}
            <div className="gov-login-card-header">
              <div className="gov-login-badge" style={{ color: '#15803d' }}>
                <ShieldCheck size={18} color="#15803d" />
                <span>CITIZEN ACCESS &amp; QUOTA PORTAL (SINGLE PAGE)</span>
              </div>
              <h2>Citizen / Consumer Portal</h2>
              <p>Login and access your daily 250 ml quota ledger, digital bills, and verification in a single page.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="gov-login-form">
              <div className="form-group">
                <label htmlFor="customer-login-user">
                  Citizen Username or Registered ID <span className="req">*</span>
                </label>
                <input
                  id="customer-login-user"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. customer1"
                  required
                  autoComplete="username"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="customer-login-pass">
                  Security Password <span className="req">*</span>
                </label>
                <input
                  id="customer-login-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter citizen password"
                  required
                  autoComplete="current-password"
                  style={{ width: '100%' }}
                />
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary gov-submit-btn"
                disabled={loading}
                style={{
                  backgroundColor: '#15803d',
                  borderColor: '#15803d',
                }}
              >
                <Lock size={16} />
                <span>{loading ? 'Authenticating...' : 'Login to Citizen Portal'}</span>
              </button>
            </form>

            {/* One-Click Demo Pre-Fill Accounts */}
            <div className="gov-demo-panel">
              <div className="gov-demo-header">
                <KeyRound size={14} />
                <strong>Select Demo Citizen Account (One-Click):</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {DEMO_CITIZENS.map((acc) => (
                  <div
                    key={acc.u}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: username === acc.u ? '#f8fafc' : '#ffffff',
                      border: `1px solid ${username === acc.u ? '#15803d' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      padding: '0.4rem 0.6rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        flex: 1,
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.15rem'
                      }}
                      onClick={() => {
                        setUsername(acc.u);
                        setPassword(acc.p);
                        setError('');
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>
                        {username === acc.u && <CheckCircle2 size={13} color="#15803d" />}
                        {acc.name}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.74rem' }}>{acc.detail}</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <code style={{ fontSize: '0.74rem', background: '#f1f5f9', padding: '0.15rem 0.35rem', borderRadius: '3px' }}>
                        {acc.u}
                      </code>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{
                          padding: '0.25rem 0.55rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderColor: '#15803d',
                          color: '#15803d'
                        }}
                        onClick={() => handleDirectLogin(acc.u, acc.p)}
                        title={`Instantly sign in as ${acc.name}`}
                      >
                        Login &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Single Page Guarantee Banner */}
            <div className="gov-login-disclaimer">
              <Sparkles size={16} color="#15803d" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong>Single-Page Citizen Experience:</strong> Login and the full citizen ledger reside on this single page. Navigation between ledger, verification, and bills operates without pushing multiple history entries.
              </span>
            </div>
          </div>
        </main>

        <footer className="gov-login-footer">
          <p>Smart Alcohol Distribution Management System (SADMS) &bull; Government of Tamil Nadu</p>
        </footer>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Authenticated: Render Single-Page Customer Dashboard Hub
  // ─────────────────────────────────────────────────────────────
  const customerRecord = getCustomerByUserId(user.id);

  return (
    <div className="layout customer-single-page">
      {/* Sidebar Navigation */}
      <aside className="sidebar" aria-label="Citizen Portal Navigation">
        <div className="sidebar-brand">
          <span className="brand-icon"><ShieldCheck size={24} color="#f59e0b" /></span>
          <div className="brand-text-block">
            <span className="brand-title">SADMS</span>
            <span className="brand-sub">Distribution System</span>
          </div>
        </div>

        <div className="sidebar-role-indicator">
          <span className="role-tag" style={{ color: '#86efac' }}>Citizen Portal</span>
        </div>

        {/* In-page Tab Buttons: Switching tabs does NOT push multiple history entries */}
        <nav className="sidebar-nav" role="tablist" aria-label="Customer Sections">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`customer-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Live Quota and Logout & Exit */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-name">{customerRecord?.name || user.username}</div>
            <div className="user-role-badge">Citizen Account</div>

            {customerBalance && (
              <div className={`sidebar-quota-pill ${customerBalance.remaining > 0 ? 'quota-ok' : 'quota-zero'}`}>
                {customerBalance.remaining > 0 ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                <span>
                  Daily Quota: <strong>{customerBalance.totalMlRemaining} ml</strong> Left Today
                </span>
              </div>
            )}
          </div>

          <div className="customer-sidebar-actions">
            <button
              type="button"
              onClick={handleLogout}
              className="logout-btn"
              title="Sign out and exit citizen portal"
            >
              <LogOut size={15} />
              <span>Logout &amp; Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content: Dynamically renders the active section on the single page */}
      <main className="page-content" id="main-content" role="main">
        {activeTab === 'overview' && (
          <CustomerHome onNavigateTab={handleTabChange} />
        )}

        {activeTab === 'verify' && (
          <Verification />
        )}

        {activeTab === 'history' && (
          <PurchaseHistory onNavigateTab={handleTabChange} />
        )}

        {activeTab === 'bills' && (
          <CustomerBill
            selectedBillId={selectedBillId}
            onSelectBill={(id) => setSelectedBillId(id)}
            onBackToList={() => setSelectedBillId(null)}
          />
        )}

        {activeTab === 'profile' && (
          <CustomerProfile />
        )}
      </main>
    </div>
  );
}
