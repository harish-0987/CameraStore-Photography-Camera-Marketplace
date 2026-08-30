import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Eye, Save } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/admin.css';

const categorySubCategoriesMap = {
  Cameras: ["Mirrorless Cameras", "DSLR Cameras", "Compact Cameras", "Action Cameras", "Professional Cameras"],
  Lenses: ["Prime Lenses", "Zoom Lenses", "Wide-Angle Lenses", "Telephoto Lenses", "Macro Lenses"],
  Lighting: ["Flash Units", "LED Panels", "Softboxes", "Ring Lights", "Continuous Lights"],
  Tripods: ["Tripods", "Monopods", "Gimbals", "Tripod Heads"],
  Bags: ["Backpacks", "Shoulder Bags", "Sling Bags", "Hard Cases"],
  Accessories: ["Memory Cards", "Batteries", "Chargers", "Filters", "Cleaning Kits", "Straps"]
};

const defaultFallbackImg = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80";

const EditProduct = () => {
  const { id } = useParams();
  const { products, updateProduct } = useCart();
  const navigate = useNavigate();

  const product = products.find(p => String(p.id) === String(id));

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Cameras',
    subCategory: 'Mirrorless Cameras',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || 'Cameras',
        subCategory: product.subCategory || product.type || categorySubCategoriesMap[product.category || 'Cameras']?.[0] || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stock: product.stock || '',
        image: product.image || '',
        description: product.description || ''
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="admin-layout">
        <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff' }}>Equipment not found in catalog</h2>
          <Link to="/admin/products" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
            Return to Inventory List
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const defaultSub = categorySubCategoriesMap[value]?.[0] || '';
      setFormData(prev => ({
        ...prev,
        category: value,
        subCategory: defaultSub
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const priceNum = Number(formData.price) || 0;
  const originalPriceNum = Number(formData.originalPrice) || priceNum;
  const discountPercent = originalPriceNum > priceNum 
    ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100) 
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...product,
      ...formData,
      type: formData.subCategory,
      price: priceNum,
      originalPrice: originalPriceNum,
      stock: Number(formData.stock)
    };
    updateProduct(updated);
    navigate('/admin/products');
  };

  return (
    <div className="admin-layout">
      <div className="container" style={{ maxWidth: '1180px' }}>
        
        {/* Navigation & Header */}
        <Link to="/admin/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Products Catalog
        </Link>

        <div className="admin-split-grid">
          
          {/* Form Left Side */}
          <div className="admin-form-card">
            <div className="admin-badge-pill" style={{ marginBottom: '10px' }}>
              <Sparkles size={12} /> Edit Mode • #{product.id}
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              Modify Equipment Specifications
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '24px' }}>
              Updates are applied instantly across the entire store upon saving.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Product Title / Model Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="Cameras">Cameras</option>
                    <option value="Lenses">Lenses</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Tripods">Tripods</option>
                    <option value="Bags">Bags</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>SubCategory</label>
                  <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
                    {(categorySubCategoriesMap[formData.category] || []).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Brand</label>
                  <select name="brand" value={formData.brand} onChange={handleChange}>
                    <option value="Sony">Sony</option>
                    <option value="Canon">Canon</option>
                    <option value="Nikon">Nikon</option>
                    <option value="Fujifilm">Fujifilm</option>
                    <option value="Leica">Leica</option>
                    <option value="DJI">DJI</option>
                    <option value="Sigma">Sigma</option>
                    <option value="Godox">Godox</option>
                    <option value="Peak Design">Peak Design</option>
                    <option value="Manfrotto">Manfrotto</option>
                    <option value="SanDisk">SanDisk</option>
                    <option value="Zeiss">Zeiss</option>
                    <option value="PolarPro">PolarPro</option>
                    <option value="Nitecore">Nitecore</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label>Retail Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>MSRP / Original ($)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Stock Available</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Direct Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label>Technical Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '11px 26px', fontSize: '0.92rem' }}>
                  <Save size={16} /> Save Product Updates
                </button>
                <button type="button" className="btn-secondary" onClick={() => navigate('/admin/products')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Interactive Live Preview Right Side */}
          <div className="admin-preview-sticky">
            <div className="admin-preview-box">
              <div className="preview-badge-header">
                <span className="preview-live-indicator">
                  <Eye size={12} /> Live Card Preview
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Storefront View</span>
              </div>

              {/* Preview Image with Discount Pill */}
              <div className="preview-img-wrap">
                <img
                  src={formData.image || defaultFallbackImg}
                  alt={formData.name || product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultFallbackImg;
                  }}
                />
                {discountPercent > 0 && (
                  <div className="preview-discount-pill">
                    {discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Card Meta */}
              <div className="preview-card-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {formData.brand}
                  </span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {formData.category} • {formData.subCategory}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                  {formData.name || 'Equipment Title'}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Space Grotesk' }}>
                    ${priceNum ? priceNum.toLocaleString() : '0'}
                  </span>
                  {originalPriceNum > priceNum && (
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ${originalPriceNum.toLocaleString()}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.78rem' }}>
                  <span style={{ color: Number(formData.stock) < 10 ? '#f87171' : '#34d399', fontWeight: 700 }}>
                    ● {formData.stock || 0} units in inventory
                  </span>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                    ★ {product.rating || 4.8} ({product.reviewsCount || 18} reviews)
                  </span>
                </div>
              </div>

              {/* Live Margin Calculation Widget */}
              <div className="margin-calculator-box">
                <span style={{ color: 'var(--text-muted)' }}>Customer Savings:</span>
                <span style={{ color: '#34d399', fontWeight: 800 }}>
                  ${(originalPriceNum - priceNum).toLocaleString()} ({discountPercent}% Discount)
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EditProduct;
