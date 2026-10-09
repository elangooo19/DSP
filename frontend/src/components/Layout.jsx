import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ShieldCheck, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCustomerByUserId, getCustomerBottleBalance, subscribe } from '../services/mockStore';
import { logout } from '../services/auth';
import './Layout.css';

export default function Layout({ links, roleLabel }) {
  const { user, signOut } = useAuth();

  const [customerBalance, setCustomerBalance] = useState(() => {
    if (user?.role === 'CUSTOMER') {
      const c = getCustomerByUserId(user.id);
      return c ? getCustomerBottleBalance(c.id) : null;
    }
    return null;
  });

  useEffect(() => {
    if (user?.role !== 'CUSTOMER') return;
    const update = () => {
      const c = getCustomerByUserId(user.id);
      setCustomerBalance(c ? getCustomerBottleBalance(c.id) : null);
    };
    update();
    return subscribe(update);
  }, [user]);

  // Lock portal session: prevent accidental exit via browser Back button.
  // The user can only exit the authenticated portal by clicking Logout.
  useEffect(() => {
    const portalBase = roleLabel === 'Customer' ? '/customer' : roleLabel === 'Government Wine Shop' ? '/shop' : '/admin';

    // Push history anchor state
    window.history.pushState({ inPortal: true }, '', window.location.href);

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const isInsidePortal = currentPath.startsWith('/customer') || currentPath.startsWith('/shop') || currentPath.startsWith('/admin');
      if (!isInsidePortal) {
        // Intercept back navigation attempting to exit the portal without logging out
        window.history.pushState({ inPortal: true }, '', portalBase);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [roleLabel]);

  const handleLogout = () => {
    signOut();
    logout();
  };

  return (
    <div className="layout">
      {/* Clean, simple sidebar */}
      <aside className="sidebar" aria-label="Portal Navigation">
        <div className="sidebar-brand">
          <span className="brand-icon"><ShieldCheck size={24} color="#f59e0b" /></span>
          <div className="brand-text-block">
            <span className="brand-title">SADMS</span>
            <span className="brand-sub">Distribution System</span>
          </div>
        </div>

        <div className="sidebar-role-indicator">
          <span className="role-tag">{roleLabel}</span>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-role-badge">{roleLabel} Account</div>

            {customerBalance && (
              <div className={`sidebar-quota-pill ${customerBalance.remaining > 0 ? 'quota-ok' : 'quota-zero'}`}>
                {customerBalance.remaining > 0 ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                <span>
                  Quota: <strong>{customerBalance.totalMlRemaining} ml</strong> Left
                </span>
              </div>
            )}
          </div>

          <button onClick={handleLogout} className="logout-btn" title="Sign out and exit portal">
            <LogOut size={15} />
            <span>Logout &amp; Exit</span>
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="page-content" id="main-content" role="main">
        <Outlet />
      </main>
    </div>
  );
}
