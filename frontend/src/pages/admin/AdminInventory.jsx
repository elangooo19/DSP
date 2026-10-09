import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/inventory').then(r => setProducts(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2>Inventory</h2>
        <p>All products across all shops</p>
      </div>
      <div className="card">
        {loading ? <p>Loading...</p> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No products found</td></tr>
                ) : products.map(p => (
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
        )}
      </div>
    </div>
  );
}
