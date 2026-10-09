import { useEffect, useState } from 'react';
import { Store, Landmark, MapPin, Building2, Plus, CheckCircle2, Search } from 'lucide-react';
import api from '../../services/api';
import { getShops, addShop, toggleShopStatus, subscribe } from '../../services/mockStore';

export default function AdminShops() {
  const [shops, setShops] = useState(getShops());
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New shop form state
  const [formData, setFormData] = useState({
    locationType: 'City',
    locationName: '',
    name: '',
    licenseNumber: '',
    address: '',
    ownerName: 'Government of Tamil Nadu (TASMAC)'
  });

  const loadShops = () => {
    api.get('/admin/shops')
      .then(r => {
        if (r.data && Array.isArray(r.data) && r.data.length > 0) {
          setShops(r.data);
        } else {
          setShops(getShops());
        }
      })
      .catch(() => setShops(getShops()))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadShops();
    return subscribe(() => setShops(getShops()));
  }, []);

  const handleLocationTypeChange = (type) => {
    const locName = formData.locationName;
    setFormData({
      ...formData,
      locationType: type,
      name: locName ? `Government Wine Shop - ${locName}` : formData.name
    });
  };

  const handleLocationNameChange = (val) => {
    setFormData({
      ...formData,
      locationName: val,
      name: val ? `Government Wine Shop - ${val}` : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.locationName) return;

    const newShop = addShop({
      name: formData.name || `Government Wine Shop - ${formData.locationName}`,
      locationType: formData.locationType,
      locationName: formData.locationName,
      ownerName: formData.ownerName,
      licenseNumber: formData.licenseNumber || `TASMAC-TN-${Math.floor(1000 + Math.random() * 9000)}`,
      address: formData.address || `${formData.locationName}, Tamil Nadu`,
      active: true
    });

    // Also attempt POST to backend if available
    api.post('/admin/shops', newShop).catch(() => {});

    setShowAddModal(false);
    setFormData({
      locationType: 'City',
      locationName: '',
      name: '',
      licenseNumber: '',
      address: '',
      ownerName: 'Government of Tamil Nadu (TASMAC)'
    });
  };

  const filteredShops = shops.filter(s => {
    const matchesFilter =
      filterType === 'ALL' ||
      (s.locationType && s.locationType.toLowerCase() === filterType.toLowerCase());

    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.locationName && s.locationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.address && s.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.licenseNumber && s.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const cityCount = shops.filter(s => (s.locationType || '').toLowerCase() === 'city').length;
  const villageCount = shops.filter(s => (s.locationType || '').toLowerCase() === 'village').length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Government Wine Shops & Retail Outlets</h2>
          <p>State-regulated alcohol distribution centers identified by City or Village jurisdiction</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Register Government Outlet
        </button>
      </div>

      {/* Governance Notice Banner */}
      <div style={{
        background: '#e8f4fd',
        border: '1px solid #b6e0fe',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <Landmark size={28} color="#0f52ba" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.88rem', color: '#0d3c61', lineHeight: 1.5 }}>
          <strong>State Controlled Distribution:</strong> In accordance with Tamil Nadu state policy, private wine shops are strictly prohibited. All retail distribution is administered exclusively by the <strong>Government (TASMAC)</strong> and titled according to the <strong>City or Village location</strong> where the shop is situated.
        </div>
      </div>

      {/* Summary Cards */}
      <div className="cards-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #1a1a2e', cursor: 'pointer' }} onClick={() => setFilterType('ALL')}>
          <span className="stat-icon"><Store size={22} color="#1a1a2e" /></span>
          <span className="stat-label">Total Outlets</span>
          <span className="stat-value">{shops.length}</span>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #1565c0', cursor: 'pointer' }} onClick={() => setFilterType('City')}>
          <span className="stat-icon"><Building2 size={22} color="#1565c0" /></span>
          <span className="stat-label">City Outlets</span>
          <span className="stat-value">{cityCount}</span>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #2e7d32', cursor: 'pointer' }} onClick={() => setFilterType('Village')}>
          <span className="stat-icon"><MapPin size={22} color="#2e7d32" /></span>
          <span className="stat-label">Village Outlets</span>
          <span className="stat-value">{villageCount}</span>
        </div>
      </div>

      <div className="card">
        {/* Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${filterType === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setFilterType('ALL')}
            >
              All Outlets ({shops.length})
            </button>
            <button
              className={`btn ${filterType === 'City' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => setFilterType('City')}
            >
              <Building2 size={14} /> City ({cityCount})
            </button>
            <button
              className={`btn ${filterType === 'Village' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => setFilterType('Village')}
            >
              <MapPin size={14} /> Village ({villageCount})
            </button>
          </div>

          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} color="#888" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by location, city, village..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: '0.45rem 0.8rem 0.45rem 2rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.85rem',
                width: '100%'
              }}
            />
          </div>
        </div>

        {loading ? <p>Loading outlets...</p> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Government Wine Shop</th>
                  <th>Location Type</th>
                  <th>City / Village Jurisdiction</th>
                  <th>Operating Authority</th>
                  <th>License / Outlet No.</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredShops.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '2.5rem' }}>
                      No government wine shops found for selected filter
                    </td>
                  </tr>
                ) : filteredShops.map(s => {
                  const isVillage = (s.locationType || '').toLowerCase() === 'village';
                  return (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Landmark size={18} color={isVillage ? '#2e7d32' : '#1565c0'} />
                          <strong>{s.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${isVillage ? 'badge-success' : 'badge-info'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          {isVillage ? <><MapPin size={12} /> Village</> : <><Building2 size={12} /> City</>}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#333' }}>
                          {s.locationName || s.name.replace(/^Government Wine Shop - /i, '')}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle2 size={14} />
                          {s.ownerName || 'Government of Tamil Nadu (TASMAC)'}
                        </span>
                      </td>
                      <td><code style={{ fontSize: '0.8rem', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>{s.licenseNumber}</code></td>
                      <td style={{ maxWidth: '220px', fontSize: '0.85rem', color: '#555' }}>{s.address}</td>
                      <td>
                        <span
                          className={`badge ${s.active ? 'badge-success' : 'badge-danger'}`}
                          style={{ cursor: 'pointer' }}
                          title="Click to toggle status"
                          onClick={() => toggleShopStatus(s.id)}
                        >
                          {s.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Government Wine Shop */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            maxWidth: '540px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginBottom: '0.25rem', color: '#1a1a2e' }}>Register Government Wine Shop</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.25rem' }}>
              Create a new state-run TASMAC wine shop outlet named after its City or Village location.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Location Category</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="locationType"
                      value="City"
                      checked={formData.locationType === 'City'}
                      onChange={() => handleLocationTypeChange('City')}
                    />
                    <Building2 size={15} color="#1565c0" /> City Outlet
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="locationType"
                      value="Village"
                      checked={formData.locationType === 'Village'}
                      onChange={() => handleLocationTypeChange('Village')}
                    />
                    <MapPin size={15} color="#2e7d32" /> Village Outlet
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>{formData.locationType === 'City' ? 'City / Area Name' : 'Village / Panchayat Name'}</label>
                <input
                  type="text"
                  placeholder={formData.locationType === 'City' ? 'e.g. Coimbatore Central, Chennai T. Nagar' : 'e.g. Alanganallur Village, Madurai'}
                  value={formData.locationName}
                  onChange={e => handleLocationNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Official Shop Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Government Wine Shop - [Location]"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Outlet License / Code</label>
                  <input
                    type="text"
                    placeholder="e.g. TASMAC-TN-3042"
                    value={formData.licenseNumber}
                    onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Operating Authority</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    disabled
                    style={{ background: '#f8f9fa', color: '#666' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <textarea
                  rows={2}
                  placeholder="Shop No., Main Road, City/Village, Pincode"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  <CheckCircle2 size={16} /> Save Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
