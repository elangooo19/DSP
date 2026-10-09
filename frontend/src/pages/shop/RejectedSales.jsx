import { useState, useEffect } from 'react';
import { XCircle, BellRing, CheckCircle2 } from 'lucide-react';
import { getRejected, getNotifications, subscribe } from '../../services/mockStore';

const REASON_LABELS = {
  UNDER_AGE:      { label: 'Under Age',           badge: 'badge-danger'  },
  LIMIT_EXCEEDED: { label: 'Daily Limit Reached (250 ml)', badge: 'badge-warning' },
  NOT_VERIFIED:   { label: 'Not Verified',          badge: 'badge-gray'   },
};

export default function RejectedSales() {
  const [rejected,      setRejected]      = useState(getRejected());
  const [notifications, setNotifications] = useState(getNotifications());
  const [tab, setTab] = useState('rejected');

  useEffect(() => subscribe(() => {
    setRejected(getRejected());
    setNotifications(getNotifications());
  }), []);

  return (
    <div>
      <div className="page-header">
        <h2>Rejected Sales</h2>
        <p>All blocked sale attempts and notifications</p>
      </div>

      {/* Tab Toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${tab === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          onClick={() => setTab('rejected')}
        >
          <XCircle size={16} /> Rejected Attempts ({rejected.length})
        </button>
        <button
          className={`btn ${tab === 'notifications' ? 'btn-primary' : 'btn-outline'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          onClick={() => setTab('notifications')}
        >
          <BellRing size={16} /> Notifications ({notifications.length})
        </button>
      </div>

      {/* Rejected Attempts */}
      {tab === 'rejected' && (
        <div className="card">
          {rejected.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#2e7d32' }}>
                <CheckCircle2 size={44} />
              </div>
              <p>No rejected sales yet.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Aadhaar</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rejected.map((r, i) => {
                    const info = REASON_LABELS[r.reasonCode] || { label: r.reason, badge: 'badge-gray' };
                    return (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td><strong>{r.customerName}</strong></td>
                        <td><code style={{ fontSize: '0.8rem' }}>{r.aadhaarNumber}</code></td>
                        <td><span className={`badge ${info.badge}`}>{info.label}</span></td>
                        <td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>{new Date(r.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="card">
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <BellRing size={44} />
              </div>
              <p>No notifications sent yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notifications.map(n => (
                <div key={n.id} style={{ padding: '1rem', background: '#fff3e0', border: '1px solid #ffb74d', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <BellRing size={16} /> NOTIFICATION — {n.customerName}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#555' }}>
                        <div>To: <strong>{n.phone}</strong></div>
                        <div style={{ marginTop: '0.3rem' }}>Reason: <strong>{n.reason}</strong></div>
                        <div style={{ marginTop: '0.3rem' }}>Message: {n.message}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#888' }}>
                      <div>{new Date(n.createdAt).toLocaleDateString('en-IN')}</div>
                      <div>{new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                      <span className="badge badge-warning" style={{ marginTop: '0.3rem' }}>{n.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
