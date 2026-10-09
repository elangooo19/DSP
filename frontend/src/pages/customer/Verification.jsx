import { useState } from 'react';
import { CheckCircle2, Search, Clock, IdCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerByUserId, verifyCustomer } from '../../services/mockStore';

export default function Verification() {
  const { user } = useAuth();
  const customer = getCustomerByUserId(user?.id);
  const [aadhaarInput, setAadhaarInput] = useState(customer?.aadhaarId || '');
  const [step, setStep] = useState('enter');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  if (customer?.verified && step !== 'done') {
    return (
      <div>
        <div className="page-header"><h2>Identity Verification</h2></div>
        <div className="card" style={{ maxWidth: 500 }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#2e7d32' }}>
              <CheckCircle2 size={54} />
            </div>
            <h3 style={{ color: '#2e7d32' }}>Identity Already Verified</h3>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', color: '#888' }}>Mock Aadhaar ID</div>
              <div style={{ fontWeight: 700 }}>{customer.aadhaarId || 'MOCK-XXXX-1001'}</div>
              <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>RFID Card</div>
              <div style={{ fontWeight: 700, color: '#1565c0' }}>{customer.rfidCard || 'RFID-TN-8821'}</div>
            </div>
            <button
              className="btn btn-outline"
              style={{ marginTop: '1.25rem', width: '100%' }}
              onClick={() => {
                setStep('enter');
                setAadhaarInput(customer.aadhaarId || '');
              }}
            >
              Re-verify / Test Verification
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleVerify = async () => {
    if (!aadhaarInput.startsWith('MOCK-')) {
      setError('Aadhaar ID must start with MOCK- (e.g. MOCK-XXXX-1001)');
      return;
    }
    setError('');
    setStep('verifying');
    await new Promise(r => setTimeout(r, 1800));
    const updated = verifyCustomer(customer.id, aadhaarInput);
    setResult(updated);
    setStep('done');
  };

  return (
    <div>
      <div className="page-header">
        <h2>Identity Verification</h2>
        <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Mock Aadhaar Age &amp; Citizen Verification</span>
      </div>

      <div className="card" style={{ maxWidth: 500 }}>
        {step === 'enter' && (
          <>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#1565c0' }}>
                <IdCard size={18} /> Mock Aadhaar Verification
              </div>
              <div style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#555' }}>
                Format: <code>MOCK-XXXX-1001</code>
              </div>
            </div>
            <div className="form-group">
              <label>Mock Aadhaar ID</label>
              <input value={aadhaarInput} onChange={e => setAadhaarInput(e.target.value)} placeholder="MOCK-XXXX-1001" />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleVerify}>
              Verify Identity
            </button>
          </>
        )}

        {step === 'verifying' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#1565c0' }}>
              <Search size={48} />
            </div>
            <h3>Verifying Identity...</h3>
            <span style={{ color: '#888', fontSize: '0.88rem', display: 'block' }}>Connecting to Mock Aadhaar service</span>
            <div style={{ marginTop: '1rem' }}>
              {['Checking Aadhaar database...', 'Validating identity...', 'Assigning RFID card...'].map((msg, i) => (
                <div key={i} style={{ padding: '0.4rem', color: '#555', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Clock size={14} /> {msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'done' && result && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#2e7d32' }}>
              <CheckCircle2 size={54} />
            </div>
            <h3 style={{ color: '#2e7d32' }}>Identity Verified!</h3>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'left' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>Name</span>
                <div style={{ fontWeight: 700 }}>{result.name}</div>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>Aadhaar ID</span>
                <div style={{ fontWeight: 700 }}>{result.aadhaarId}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>RFID Card Assigned</span>
                <div style={{ fontWeight: 700, color: '#1565c0' }}>{result.rfidCard}</div>
              </div>
            </div>
            <div className="alert alert-success" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> You are now eligible to purchase at registered shops.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
