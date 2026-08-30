import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Camera, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Filter
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import '../styles/cameras.css';

const cameraSubCategories = [
  "All", 
  "DSLR Cameras", 
  "Mirrorless Cameras", 
  "Compact Cameras", 
  "Action Cameras", 
  "Professional Cameras"
];

const Cameras = () => {
  const [searchParams] = useSearchParams();
  const allProducts = useSelector(state => state.products.products);

  const initialSearch = searchParams.get('search') || '';
  const initialSub = searchParams.get('subCategory') || searchParams.get('type') || 'All';
  const initialBrand = searchParams.get('brand') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSubCat, setSelectedSubCat] = useState(initialSub);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const s = searchParams.get('search');
    const sub = searchParams.get('subCategory') || searchParams.get('type');
    const b = searchParams.get('brand');
    if (s !== null) setSearchTerm(s);
    if (sub) {
      const match = cameraSubCategories.find(c => c.toLowerCase() === sub.toLowerCase() || c.toLowerCase().includes(sub.toLowerCase()));
      if (match) setSelectedSubCat(match);
    }
    if (b) {
      setSelectedBrand(b);
    }
  }, [searchParams]);

  // Filter cameras
  const cameraProducts = useMemo(() => {
    return allProducts.filter(p => p.category?.toLowerCase() === 'cameras');
  }, [allProducts]);

  const brandsList = useMemo(() => {
    return ['All', ...new Set(cameraProducts.map(p => p.brand).filter(Boolean))];
  }, [cameraProducts]);

  const filteredCameras = useMemo(() => {
    return cameraProducts
      .filter(item => {
        const itemSub = (item.subCategory || item.type || '').toLowerCase().trim();
        const targetSub = selectedSubCat.toLowerCase().trim();

        const matchesSearch = searchTerm === '' || 
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itemSub.includes(searchTerm.toLowerCase());

        const matchesSubCat = selectedSubCat === 'All' || 
          itemSub === targetSub ||
          itemSub.replace(/ cameras$/i, '') === targetSub.replace(/ cameras$/i, '');

        const matchesBrand = selectedBrand === 'All' || 
          item.brand?.toLowerCase() === selectedBrand.toLowerCase();

        const matchesPrice = item.price <= priceRange;
        const matchesRating = selectedRating === 0 || item.rating >= selectedRating;

        return matchesSearch && matchesSubCat && matchesBrand && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [cameraProducts, searchTerm, selectedSubCat, selectedBrand, priceRange, selectedRating, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCameras.length / itemsPerPage));
  const paginatedCameras = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCameras.slice(start, start + itemsPerPage);
  }, [filteredCameras, currentPage]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubCat('All');
    setSelectedBrand('All');
    setPriceRange(10000);
    setSelectedRating(0);
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="category-page-container">
      {/* Category Hero Banner */}
      <div className="category-hero-header">
        <div className="container category-hero-inner">
          <div className="hero-cat-tag"><Camera size={14} /> PRO CAMERA MARKETPLACE</div>
          <h1 className="category-page-title">Digital Cameras & Cinema Bodies</h1>
          <p className="category-page-desc">
            Explore industry leading Full-Frame Mirrorless, DSLRs, 8K Cinema Rigs, and compact street photography cameras from Sony, Canon, Nikon, Leica, and Fujifilm.
          </p>

          {/* Subcategory Pills */}
          <div className="subcategory-pills-row">
            {cameraSubCategories.map(sub => (
              <button
                key={sub}
                className={`subcat-pill-btn ${selectedSubCat === sub ? 'active' : ''}`}
                onClick={() => { setSelectedSubCat(sub); setCurrentPage(1); }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container category-main-layout">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-bar">
          <button 
            className="btn-secondary" 
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} /> Filter & Sort Cameras
            </span>
            <span>({filteredCameras.length} Items)</span>
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
              <RotateCcw size={14} /> Reset All
            </button>
          </div>

          {/* Brand Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Brand</h4>
            <div className="filter-options-list">
              {brandsList.map(brand => (
                <label key={brand} className="filter-radio-label">
                  <input
                    type="radio"
                    name="cameraBrand"
                    checked={selectedBrand === brand}
                    onChange={() => { setSelectedBrand(brand); setCurrentPage(1); }}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="filter-group">
            <div className="filter-title-row">
              <h4 className="filter-group-title">Max Price</h4>
              <span className="price-val-indicator">${priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="300"
              max="10000"
              step="100"
              value={priceRange}
              onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
              className="price-slider-input"
            />
            <div className="slider-limits">
              <span>$300</span>
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
                    name="cameraRating"
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
              placeholder="Search cameras by model, sensor..."
            />

            <div className="catalog-toolbar-right">
              <span className="items-count-text">
                Showing <strong>{paginatedCameras.length}</strong> of <strong>{filteredCameras.length}</strong> results
              </span>

              <div className="sort-select-wrapper">
                <label htmlFor="sortSelect">Sort:</label>
                <select
                  id="sortSelect"
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
          {filteredCameras.length === 0 ? (
            <div className="empty-catalog-state">
              <Camera size={48} color="var(--primary)" />
              <h3>No Cameras Match Your Criteria</h3>
              <p>No products match your exact combination of brand, subcategory, or price.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
                {selectedSubCat !== 'All' && (
                  <button onClick={() => setSelectedSubCat('All')} className="btn-secondary">
                    Show All {selectedBrand !== 'All' ? selectedBrand : ''} Cameras
                  </button>
                )}
                {selectedBrand !== 'All' && (
                  <button onClick={() => setSelectedBrand('All')} className="btn-secondary">
                    Show All Brands for {selectedSubCat}
                  </button>
                )}
                <button onClick={resetFilters} className="btn-primary">
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="product-grid">
              {paginatedCameras.map(product => (
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
    </div>
  );
};

export default Cameras;
