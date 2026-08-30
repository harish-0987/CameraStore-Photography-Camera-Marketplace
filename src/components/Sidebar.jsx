import React from 'react';
import { Filter, X } from 'lucide-react';

const Sidebar = ({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  brands = [],
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  maxPrice = 5000,
  sortBy,
  setSortBy,
  resetFilters
}) => {
  return (
    <aside style={{
      background: '#ffffff',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-md)',
      padding: '22px',
      height: 'fit-content',
      position: 'sticky',
      top: '86px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
          <Filter size={16} color="var(--text-primary)" />
          <span>Filters</span>
        </div>
        <button
          onClick={resetFilters}
          style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <X size={13} /> Reset
        </button>
      </div>

      {/* Sort Section */}
      <div style={{ marginBottom: '22px' }}>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            width: '100%',
            background: '#f8fafc',
            border: '1px solid var(--border-light)',
            color: 'var(--text-primary)',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        >
          <option value="featured">Featured / Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Brands</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setSelectedBrand('all')}
              style={{
                textAlign: 'left',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                background: selectedBrand === 'all' ? '#0f172a' : 'transparent',
                color: selectedBrand === 'all' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: selectedBrand === 'all' ? 600 : 500
              }}
            >
              All Brands
            </button>
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  background: selectedBrand === brand ? '#0f172a' : 'transparent',
                  color: selectedBrand === brand ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: selectedBrand === brand ? 600 : 500
                }}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span>Max Price</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>${priceRange}</span>
        </div>
        <input
          type="range"
          min="100"
          max={maxPrice}
          step="50"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--text-primary)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>$100</span>
          <span>${maxPrice}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
