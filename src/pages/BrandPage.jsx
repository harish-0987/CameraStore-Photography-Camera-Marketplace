import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  Layers, 
  ChevronRight as ArrowRight,
  Award,
  TrendingUp,
  Package
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { cameraBrands } from '../data/cameraProducts';
import '../styles/cameras.css';
import '../styles/brand.css';

const BrandPage = () => {
  const { brandName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const allProducts = useSelector(state => state.products.products);

  // Normalize brand from URL
  const currentBrandKey = brandName ? decodeURIComponent(brandName).trim() : (searchParams.get('name') || '');

  // Look for brand metadata
  const brandMeta = useMemo(() => {
    if (!currentBrandKey) return null;
    return cameraBrands.find(b => 
      b.name.toLowerCase() === currentBrandKey.toLowerCase() ||
      b.logo.toLowerCase() === currentBrandKey.toLowerCase() ||
      b.name.toLowerCase().replace(/\s+/g, '-') === currentBrandKey.toLowerCase()
    ) || {
      name: currentBrandKey.charAt(0).toUpperCase() + currentBrandKey.slice(1),
      logo: currentBrandKey.toUpperCase(),
      tagline: "Official Authorized Photography & Cinema Gear"
    };
  }, [currentBrandKey]);

  // Products belonging to this brand
  const brandProducts = useMemo(() => {
    if (!brandMeta) return [];
    return allProducts.filter(p => {
      const pBrand = (p.brand || '').toLowerCase().trim();
      const targetBrand = brandMeta.name.toLowerCase().trim();
      return pBrand === targetBrand || pBrand.includes(targetBrand) || targetBrand.includes(pBrand);
    });
  }, [allProducts, brandMeta]);

  // Categories available for this brand
  const brandCategories = useMemo(() => {
    if (!brandProducts.length) return [];
    const counts = {};
    brandProducts.forEach(p => {
      const cat = p.category || 'Gear';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.keys(counts).map(cat => ({
      name: cat,
      count: counts[cat]
    }));
  }, [brandProducts]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const itemsPerPage = 8;

  // Reset filters when brand changes
  useEffect(() => {
    setSelectedCategory('All');
    setSearchTerm('');
    setPriceRange(10000);
    setSelectedRating(0);
    setSortBy('featured');
    setCurrentPage(1);
  }, [brandName]);

  // Filtered Products for this brand
  const filteredProducts = useMemo(() => {
    return brandProducts
      .filter(item => {
        const matchesCategory = selectedCategory === 'All' || 
          item.category?.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch = searchTerm === '' ||
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPrice = item.price <= priceRange;
        const matchesRating = selectedRating === 0 || item.rating >= selectedRating;

        return matchesCategory && matchesSearch && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [brandProducts, selectedCategory, searchTerm, priceRange, selectedRating, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setPriceRange(10000);
    setSelectedRating(0);
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Stats calculation
  const stats = useMemo(() => {
    if (!brandProducts.length) return { count: 0, minPrice: 0, maxPrice: 0, avgRating: 4.8 };
    const prices = brandProducts.map(p => p.price);
    const ratings = brandProducts.map(p => p.rating || 4.5);
    const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
    return {
      count: brandProducts.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgRating: avg
    };
  }, [brandProducts]);

  // If no brand is specified (e.g. /brands directory), show all brands directory
  if (!currentBrandKey || !brandMeta) {
    return (
      <div className="brand-page-container container">
        <div className="brands-directory-header">
          <div className="hero-cat-tag">
            <ShieldCheck size={14} /> AUTHORIZED DIRECTORY
          </div>
          <h1 className="brands-directory-title">World Leading Camera & Optics Brands</h1>
          <p className="brands-directory-desc">
            Explore cutting-edge camera bodies, professional lenses, precision lighting, and cinema support gear from the world's most trusted manufacturers.
          </p>
        </div>

        <div className="all-brands-cards-grid">
          {cameraBrands.map((brand, idx) => {
            const count = allProducts.filter(p => (p.brand || '').toLowerCase() === brand.name.toLowerCase()).length;
            return (
              <Link 
                key={idx} 
                to={`/brand/${encodeURIComponent(brand.name)}`} 
                className="brand-explore-card"
              >
                <div>
                  <div className="brand-explore-card-name">{brand.logo}</div>
                  <div className="brand-explore-card-tagline">{brand.tagline}</div>
                </div>
                <div className="brand-explore-card-footer">
                  <span className="brand-explore-card-count">{count > 0 ? `${count}+ Products` : 'Authorized Lineup'}</span>
                  <span className="brand-explore-card-cta">
                    Explore Lineup <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="brand-page-container">
      {/* Brand Hero Header */}
      <section className="brand-hero-header">
        <div className="container brand-hero-inner">
          <div className="brand-breadcrumbs">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/brands">Brands</Link>
            <ChevronRight size={14} />
            <span>{brandMeta.name}</span>
          </div>

          <div className="brand-header-top">
            <div className="brand-title-wrap">
              <div className="brand-badge-pill">
                <ShieldCheck size={14} /> Official Authorized Partner
              </div>
              <h1 className="brand-main-title">{brandMeta.logo || brandMeta.name}</h1>
              <p className="brand-main-tagline">{brandMeta.tagline}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="brand-stats-row">
              <div className="brand-stat-box">
                <div className="brand-stat-val">{stats.count}</div>
                <div className="brand-stat-lbl">In-Stock Items</div>
              </div>
              <div className="brand-stat-box">
                <div className="brand-stat-val">{stats.avgRating}★</div>
                <div className="brand-stat-lbl">Creator Rating</div>
              </div>
              <div className="brand-stat-box">
                <div className="brand-stat-val">${stats.minPrice} - ${stats.maxPrice.toLocaleString()}</div>
                <div className="brand-stat-lbl">Price Range</div>
              </div>
            </div>
          </div>

          {/* Brand Category Filter Pills */}
          {brandCategories.length > 0 && (
            <div className="brand-category-tabs">
              <button
                className={`brand-cat-tab-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory('All'); setCurrentPage(1); }}
              >
                <Layers size={14} />
                <span>All {brandMeta.name} Gear</span>
                <span className="brand-tab-count">{brandProducts.length}</span>
              </button>

              {brandCategories.map(cat => (
                <button
                  key={cat.name}
                  className={`brand-cat-tab-btn ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(cat.name); setCurrentPage(1); }}
                >
                  <span>{cat.name}</span>
                  <span className="brand-tab-count">{cat.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog Layout */}
      <div className="container category-main-layout">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-bar">
          <button 
            className="btn-secondary" 
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} /> Filter & Sort {brandMeta.name}
            </span>
            <span>({filteredProducts.length} Items)</span>
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${mobileFilterOpen ? 'mobile-show' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">
              <SlidersHorizontal size={18} color="var(--primary)" />
              <span>Filters</span>
            </div>
            <button className="reset-filter-btn" onClick={resetFilters}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {/* Category Filter */}
          {brandCategories.length > 0 && (
            <div className="filter-group">
              <h4 className="filter-group-title">Category</h4>
              <div className="filter-options-list">
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="brandCat"
                    checked={selectedCategory === 'All'}
                    onChange={() => { setSelectedCategory('All'); setCurrentPage(1); }}
                  />
                  <span>All Categories ({brandProducts.length})</span>
                </label>
                {brandCategories.map(cat => (
                  <label key={cat.name} className="filter-radio-label">
                    <input
                      type="radio"
                      name="brandCat"
                      checked={selectedCategory.toLowerCase() === cat.name.toLowerCase()}
                      onChange={() => { setSelectedCategory(cat.name); setCurrentPage(1); }}
                    />
                    <span>{cat.name} ({cat.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Slider */}
          <div className="filter-group">
            <div className="filter-title-row">
              <h4 className="filter-group-title">Max Price</h4>
              <span className="price-val-indicator">${priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50"
              max="10000"
              step="50"
              value={priceRange}
              onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
              className="price-slider-input"
            />
            <div className="slider-limits">
              <span>$50</span>
              <span>$10,000+</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Customer Rating</h4>
            <div className="filter-options-list">
              {[
                { label: 'All Ratings', value: 0 },
                { label: '4.8★ & Above (Top Rated)', value: 4.8 },
                { label: '4.5★ & Above', value: 4.5 },
                { label: '4.0★ & Above', value: 4.0 }
              ].map(r => (
                <label key={r.value} className="filter-radio-label">
                  <input
                    type="radio"
                    name="brandRating"
                    checked={selectedRating === r.value}
                    onChange={() => { setSelectedRating(r.value); setCurrentPage(1); }}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Column */}
        <main className="category-products-area">
          {/* Top Bar: Search & Sort */}
          <div className="catalog-toolbar">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={(term) => { setSearchTerm(term); setCurrentPage(1); }}
              placeholder={`Search ${brandMeta.name} models, series, optics...`}
            />

            <div className="catalog-toolbar-right">
              <span className="items-count-text">
                Showing <strong>{paginatedProducts.length}</strong> of <strong>{filteredProducts.length}</strong> results
              </span>

              <div className="sort-select-wrapper">
                <label htmlFor="brandSortSelect">Sort:</label>
                <select
                  id="brandSortSelect"
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="custom-sort-select"
                >
                  <option value="featured">Featured & Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="empty-catalog-state">
              <Package size={48} color="var(--primary)" />
              <h3>No {brandMeta.name} Products Found</h3>
              <p>No products match your active search or filter selection.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
                <button onClick={resetFilters} className="btn-primary">
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="product-grid">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <button
                className="page-nav-btn"
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 250, behavior: 'smooth' }); }}
              >
                <ChevronLeft size={18} /> Previous
              </button>

              <div className="page-numbers-cluster">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    className={`page-num-btn ${currentPage === num ? 'active' : ''}`}
                    onClick={() => { setCurrentPage(num); window.scrollTo({ top: 250, behavior: 'smooth' }); }}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                className="page-nav-btn"
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 250, behavior: 'smooth' }); }}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Explore Other Popular Brands Switcher */}
      <div className="container other-brands-section">
        <h3 className="other-brands-title">Explore More Leading Photography Brands</h3>
        <div className="other-brands-pill-row">
          {cameraBrands
            .filter(b => b.name.toLowerCase() !== brandMeta.name.toLowerCase())
            .map((b, idx) => (
              <Link 
                key={idx} 
                to={`/brand/${encodeURIComponent(b.name)}`}
                className="other-brand-pill-btn"
              >
                <span>{b.logo}</span>
                <ArrowRight size={12} color="var(--primary)" />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
