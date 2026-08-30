import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Package, AlertTriangle, Sparkles, Filter, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/admin.css';

const fallbackGearImg = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";

const AdminProducts = () => {
  const { products, deleteProduct } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const categories = ['All', 'Cameras', 'Lenses', 'Lighting', 'Tripods', 'Bags', 'Accessories'];

  const filtered = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesLowStock = !showLowStockOnly || Number(p.stock) < 10;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from store inventory?`)) {
      deleteProduct(id);
    }
  };

  const getStockHealthClass = (stock) => {
    const s = Number(stock);
    if (s <= 5) return { cls: 'stock-low', label: 'Critical', fill: `${Math.min(s * 10, 100)}%` };
    if (s <= 12) return { cls: 'stock-med', label: 'Medium', fill: `${Math.min(s * 5, 100)}%` };
    return { cls: 'stock-high', label: 'Optimal', fill: '100%' };
  };

  return (
    <div className="admin-layout">
      <div className="container">
        
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title-group">
            <div className="admin-badge-pill">
              <Package size={12} /> Catalog Repository
            </div>
            <h1 className="admin-title">Product Inventory Management</h1>
            <p className="admin-subtitle">Live stock status, pricing configuration, and catalog modifications</p>
          </div>

          <Link to="/admin/add-product" className="btn-primary">
            <Plus size={16} /> Add New Equipment
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <Link to="/admin" className="admin-tab">Dashboard</Link>
          <Link to="/admin/products" className="admin-tab active">
            Products <span className="tab-counter">{products.length}</span>
          </Link>
          <Link to="/admin/orders" className="admin-tab">Orders</Link>
          <Link to="/admin/users" className="admin-tab">Users</Link>
        </div>

        {/* Table Filter & Search Card */}
        <div className="admin-table-card">
          <div className="admin-table-toolbar">
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <Search 
                size={16} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input
                type="text"
                placeholder="Search gear by name, brand, optics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '9px 14px 9px 38px',
                  fontSize: '0.86rem'
                }}
              />
            </div>

            {/* Category Filter Chips */}
            <div className="table-filter-chips">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}

              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`filter-chip ${showLowStockOnly ? 'active' : ''}`}
                style={showLowStockOnly ? { background: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444', color: '#f87171' } : {}}
              >
                ⚠️ Low Stock Only
              </button>
            </div>
          </div>

          {/* Product Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Equipment Item</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Warehouse Stock</th>
                  <th>Customer Rating</th>
                  <th>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No matching equipment found in inventory.
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => {
                    const health = getStockHealthClass(p.stock);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <img
                              src={p.image || fallbackGearImg}
                              alt={p.name}
                              className="admin-prod-thumb"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = fallbackGearImg;
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {p.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>
                                #{p.id} • {p.type || p.subCategory || 'Pro Gear'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontSize: '0.82rem', background: 'rgba(255, 255, 255, 0.05)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            {p.category}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 600, color: '#38bdf8' }}>{p.brand}</span>
                        </td>

                        <td style={{ color: '#fff', fontWeight: 800, fontFamily: 'Space Grotesk' }}>
                          ${Number(p.price).toLocaleString()}
                        </td>

                        <td>
                          <div className="stock-meter-wrap">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                              <span style={{ color: health.cls === 'stock-low' ? '#f87171' : health.cls === 'stock-med' ? '#fbbf24' : '#34d399' }}>
                                {p.stock} in stock
                              </span>
                            </div>
                            <div className="stock-meter-bar">
                              <div className={`stock-meter-fill ${health.cls}`} style={{ width: health.fill }}></div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.84rem' }}>
                            ★ {p.rating || 4.8}
                          </span>
                        </td>

                        <td>
                          <div className="admin-table-actions">
                            <Link to={`/admin/edit-product/${p.id}`} className="action-icon-btn" title="Edit Gear Configuration">
                              <Edit2 size={15} />
                            </Link>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="action-icon-btn delete"
                              title="Delete from Inventory"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProducts;
