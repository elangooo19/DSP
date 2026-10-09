import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Store,
  User,
  Lock,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const ROLE_ROUTES = {
  ADMIN: '/admin',
  SHOP: '/shop',
  CUSTOMER: '/customer'
};

const ROLE_CONFIG = {
  CUSTOMER: {
    role: 'CUSTOMER',
    label: 'Citizen / Customer',
    tagline: 'CITIZEN ACCESS & QUOTA PORTAL',
    title: 'Citizen / Consumer Login',
    subtitle: 'Smart Alcohol Distribution & Monitoring System (SADMS)',
    accentColor: '#15803d',
    icon: <User size={18} />,
    userLabel: 'Citizen Username or Registered ID',
    userPlaceholder: 'e.g. customer1',
    passLabel: 'Security Password',
    passPlaceholder: 'Enter citizen password',
    submitText: 'Login to Citizen Dashboard',
    defaultUser: 'customer1',
    defaultPass: 'cust123',
    demoAccounts: [
      { name: 'Arun Kumar', detail: 'Age 29 • 250 ml (1 Bottle) Left Today', u: 'customer1', p: 'cust123' },
      { name: 'Priya Devi', detail: 'Age 26 • 250 ml (1 Bottle) Left Today', u: 'customer2', p: 'cust123' },
      { name: 'Karthik Raja', detail: 'Age 24 • Daily Limit Reached (250 ml Used)', u: 'customer4', p: 'cust123' },
    ]
  },
  SHOP: {
    role: 'SHOP',
    label: 'Wine Shop Retailer',
    tagline: 'RETAIL OUTLET POS TERMINAL',
    title: 'Wine Shop Retailer Login',
    subtitle: 'Point-of-Sale Dispensation Terminal & Hardware Interlock',
    accentColor: '#0b5ed7',
    icon: <Store size={18} />,
    userLabel: 'Shop Username / License Code',
    userPlaceholder: 'e.g. shop1',
    passLabel: 'POS Security Password',
    passPlaceholder: 'Enter shop password',
    submitText: 'Login to Retailer Dashboard',
    defaultUser: 'shop1',
    defaultPass: 'shop123',
    demoAccounts: [
      { name: 'Shop 4012', detail: 'Anna Nagar, Chennai (City Outlet)', u: 'shop1', p: 'shop123' },
      { name: 'Shop 4088', detail: 'Alanganallur, Madurai (Village Outlet)', u: 'shop2', p: 'shop123' },
    ]
  },
  ADMIN: {
    role: 'ADMIN',
    label: 'Administrator',
    tagline: 'CENTRALIZED EXCISE CONTROL',
    title: 'Excise Administrator Login',
    subtitle: 'Department of Prohibition and Excise Monitoring Center',
    accentColor: '#002147',
    icon: <ShieldCheck size={18} />,
    userLabel: 'Officer ID / Admin Username',
    userPlaceholder: 'e.g. admin',
    passLabel: 'Administrative Security Key',
    passPlaceholder: 'Enter administrator key',
    submitText: 'Login to State Excise Portal',
    defaultUser: 'admin',
    defaultPass: 'admin123',
    demoAccounts: [
      { name: 'State Administrator', detail: 'Full Excise Audit & Inspection Privileges', u: 'admin', p: 'admin123' },
    ]
  }
};

export default function Login() {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const roleParam = (searchParams.get('role') || '').toUpperCase();
  const selectedRole = (roleParam === 'SHOP' || roleParam === 'ADMIN') ? roleParam : 'CUSTOMER';

  const [username, setUsername] = useState(() => ROLE_CONFIG[selectedRole].defaultUser);
  const [password, setPassword] = useState(() => ROLE_CONFIG[selectedRole].defaultPass);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [currentRole, setCurrentRole] = useState(selectedRole);

  if (currentRole !== selectedRole) {
    setCurrentRole(selectedRole);
    setUsername(ROLE_CONFIG[selectedRole].defaultUser);
    setPassword(ROLE_CONFIG[selectedRole].defaultPass);
    setError('');
  }

  const handleRoleSelect = (role) => {
    setUsername(ROLE_CONFIG[role].defaultUser);
    setPassword(ROLE_CONFIG[role].defaultPass);
    setError('');
    setSearchParams({ role: role.toLowerCase() }, { replace: true });
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  const handleDirectLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
    setLoading(true);

    try {
      const data = login(u, p);
      signIn(data);
      setLoading(false);
      navigate(ROLE_ROUTES[data.role] || '/customer', { replace: true });
    } catch (err) {
      setError(err?.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = login(username.trim(), password.trim());
      // Seamlessly sign in
      signIn(data);
      setLoading(false);
      // Crucial: replace: true replaces the login entry in history
      // so clicking 'Back' does NOT return to this already-gone login page!
      navigate(ROLE_ROUTES[data.role] || '/customer', { replace: true });
    } catch {
      setError(`Invalid credentials for ${ROLE_CONFIG[selectedRole].label}. Please verify username and password.`);
      setLoading(false);
    }
  };

  const currentConfig = ROLE_CONFIG[selectedRole];

  return (
    <div className="gov-login-wrapper">
      <main className="gov-login-main" role="main">
        <div
          className="gov-login-card"
          style={{ borderTop: `4px solid ${currentConfig.accentColor}` }}
        >
          {/* Back to Homepage Link */}
          <div style={{ marginBottom: '1.1rem' }}>
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
          </div>

          {/* Active Session Notice if already signed in */}
          {user && (
            <div style={{
              marginBottom: '1.25rem',
              padding: '0.75rem 0.95rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <span>
                Currently active: <strong>{user.username}</strong> ({user.role})
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => navigate(ROLE_ROUTES[user.role] || '/customer', { replace: true })}
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => signOut()}
                >
                  <LogOut size={13} />
                  <span>Switch Account</span>
                </button>
              </div>
            </div>
          )}

          {/* Unified Single-Page 3-in-1 Role Switcher */}
          <div className="gov-role-selector" style={{ marginBottom: '1.25rem' }}>
            <span className="gov-field-label" style={{ fontSize: '0.82rem', fontWeight: 800 }}>
              Select Login Portal (Single Page Access):
            </span>
            <div className="gov-role-buttons">
              {[
                { role: 'CUSTOMER', label: 'Citizen / Customer', icon: <User size={16} /> },
                { role: 'SHOP',     label: 'Wine Shop Retailer', icon: <Store size={16} /> },
                { role: 'ADMIN',    label: 'Administrator',      icon: <ShieldCheck size={16} /> },
              ].map(({ role, label, icon }) => (
                <button
                  key={role}
                  type="button"
                  className={`gov-role-btn ${selectedRole === role ? 'active' : ''}`}
                  onClick={() => handleRoleSelect(role)}
                  style={{
                    backgroundColor: selectedRole === role ? currentConfig.accentColor : undefined,
                    borderColor: selectedRole === role ? currentConfig.accentColor : undefined,
                  }}
                >
                  <span className="gov-role-btn-icon">{icon}</span>
                  <span className="gov-role-btn-text">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Header Description adapted to active role */}
          <div className="gov-login-card-header">
            <div className="gov-login-badge" style={{ color: currentConfig.accentColor }}>
              <ShieldCheck size={18} color={currentConfig.accentColor} />
              <span>{currentConfig.tagline}</span>
            </div>
            <h2>{currentConfig.title}</h2>
            <p>{currentConfig.subtitle}</p>
          </div>

          {/* Unified Login Form */}
          <form onSubmit={handleSubmit} className="gov-login-form">
            <div className="form-group">
              <label htmlFor="login-username">
                {currentConfig.userLabel} <span className="req">*</span>
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={currentConfig.userPlaceholder}
                required
                autoComplete="username"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">
                {currentConfig.passLabel} <span className="req">*</span>
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={currentConfig.passPlaceholder}
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
                backgroundColor: currentConfig.accentColor,
                borderColor: currentConfig.accentColor,
              }}
            >
              <Lock size={16} />
              <span>{loading ? 'Authenticating...' : currentConfig.submitText}</span>
            </button>
          </form>

          {/* One-Click Demo Pre-Fill Accounts */}
          <div className="gov-demo-panel">
            <div className="gov-demo-header">
              <KeyRound size={14} />
              <strong>Demo {currentConfig.label} Accounts (Click to Select &amp; Login):</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {currentConfig.demoAccounts.map((acc) => (
                <div
                  key={acc.u}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: username === acc.u ? '#f8fafc' : '#ffffff',
                    border: `1px solid ${username === acc.u ? currentConfig.accentColor : '#e2e8f0'}`,
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
                    onClick={() => handleQuickFill(acc.u, acc.p)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>
                      {username === acc.u && <CheckCircle2 size={13} color={currentConfig.accentColor} />}
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
                        borderColor: currentConfig.accentColor,
                        color: currentConfig.accentColor
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

          <div className="gov-login-disclaimer">
            <Sparkles size={16} color="#0b5ed7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Single-Page Identity Authentication:</strong> Switching roles updates this single page without creating multiple history entries.
              {selectedRole === 'CUSTOMER' && (
                <> You can also use the unified <Link to="/customer" style={{ fontWeight: 700, color: '#15803d' }}>Citizen Single-Page Hub (/customer)</Link> where login &amp; dashboard live together.</>
              )}
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
