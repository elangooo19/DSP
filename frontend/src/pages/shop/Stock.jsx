import { useState, useEffect } from 'react';
import { getProducts, addProduct, subscribe } from '../../services/mockStore';

export default function Stock() {
  const [products, setProducts] = useState(getProducts());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', price: '', availableQuantity: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => subscribe(() => setProducts(getProducts())), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct(form);
    setForm({ name: '', category: '', price: '', availableQuantity: '' });
    setShowForm(false);
    setSuccess('Product added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h2>Stock</h2><p>Manage your product inventory</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', maxWidth: 500 }}>
          <h3 style={{ marginBottom: '1rem' }}>Add New Product</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Whisky Premium" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select</option>
                  {['Whisky','Beer','Wine','Rum','Vodka','Brandy'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input required type="number" min="1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="450" />
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input required type="number" min="0" value={form.availableQuantity} onChange={e => setForm({ ...form, availableQuantity: e.target.value })} placeholder="50" />
              </div>
            </div>
            <button type="submit" className="btn btn-success">Add Product</button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{p.availableQuantity}</td>
                  <td>
                    {p.availableQuantity === 0
                      ? <span className="badge badge-danger">Out of Stock</span>
                      : p.availableQuantity <= 5
                      ? <span className="badge badge-warning">Low Stock</span>
                      : <span className="badge badge-success">In Stock</span>}
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
