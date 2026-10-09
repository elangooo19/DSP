import { User, Calendar, Clock, Phone, IdCard, Radio, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerByUserId, getCustomerBottleBalance } from '../../services/mockStore';

export default function CustomerProfile() {
  const { user } = useAuth();
  const c = getCustomerByUserId(user?.id);
  const balance = c ? getCustomerBottleBalance(c.id) : null;

  if (!c) return <div className="alert alert-danger">Profile not found.</div>;

  return (
    <div>
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Your personal and verification details</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#1a1a2e',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{c.name}</h3>
            <span className={`badge ${c.verified ? 'badge-success' : 'badge-warning'}`}>
              {c.verified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[
            { label: 'Full Name',        value: c.name,                        icon: <User size={18} color="#1565c0" /> },
            { label: 'Date of Birth',    value: c.dateOfBirth,                 icon: <Calendar size={18} color="#e91e63" /> },
            { label: 'Age',              value: `${c.age} years`,              icon: <Clock size={18} color="#f57f17" /> },
            { label: 'Mobile Number',    value: c.mobile,                      icon: <Phone size={18} color="#2e7d32" /> },
            { label: 'Mock Aadhaar ID',  value: c.aadhaarId || 'Not Set',      icon: <IdCard size={18} color="#6a1b9a" /> },
            { label: 'RFID / NFC Card',  value: c.rfidCard  || 'Not Assigned', icon: <Radio size={18} color="#00838f" /> },
            { label: 'Daily Regulated Quota', value: '250 ml per day for one person daily (1 Standard Bottle × 250ml)', icon: <ShieldCheck size={18} color="#002147" /> },
            { label: "Today's Quota Balance", value: `${balance?.totalMlRemaining ?? 0} ml Available Today (${balance?.remaining ?? 0} bottle remaining)`, icon: <CheckCircle2 size={18} color="#15803d" /> },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: c.verified ? '#e8f5e9' : '#fff8e1', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: c.verified ? '#2e7d32' : '#f57f17' }}>
            {c.verified ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            {c.verified ? 'Identity Verified' : 'Identity Not Verified'}
          </div>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#666' }}>
            {c.verified
              ? 'Your Aadhaar identity has been verified. You are eligible to purchase.'
              : 'Please complete identity verification to enable purchases.'}
          </p>
        </div>
      </div>
    </div>
  );
}
