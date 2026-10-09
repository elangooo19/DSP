import { useState, useEffect } from 'react';
import { getCustomers, blockCustomer, subscribe } from '../../services/mockStore';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(getCustomers());
  useEffect(() => subscribe(() => setCustomers(getCustomers())), []);

  return (
    <div>
      <div className="page-header"><h2>Customers</h2><p>All registered customers</p></div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Mobile</th><th>Aadhaar ID</th><th>RFID Card</th><th>Age</th><th>Verified</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.mobile}</td>
                  <td><code style={{ fontSize: '0.8rem' }}>{c.aadhaarId}</code></td>
                  <td><code style={{ fontSize: '0.8rem' }}>{c.rfidCard || '—'}</code></td>
                  <td>{c.age}</td>
                  <td><span className={`badge ${c.verified ? 'badge-success' : 'badge-warning'}`}>{c.verified ? 'Verified' : 'Pending'}</span></td>
                  <td><span className={`badge ${c.blocked ? 'badge-danger' : 'badge-success'}`}>{c.blocked ? 'Blocked' : 'Active'}</span></td>
                  <td>
                    <button className={`btn ${c.blocked ? 'btn-success' : 'btn-danger'}`}
                      style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => blockCustomer(c.id, !c.blocked)}>
                      {c.blocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
