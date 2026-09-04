import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Compass, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import '../styles/cameras.css';

const tripodSubCategories = [
  "All", 
  "Tripods", 
  "Monopods", 
  "Gimbals", 
  "Tripod Heads"
];

const Tripods = () => {
  const [searchParams] = useSearchParams();
  const allProducts = useSelector(state => state.products.products);

  const initialSearch = searchParams.get('search') || '';
  const initialSub = searchParams.get('subCategory') || searchParams.get('type') || 'All';
  const initialBrand = searchParams.get('brand') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSubCat, setSelectedSubCat] = useState(initialSub);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [priceRange, setPriceRange] = useState(6000);
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
      const match = tripodSubCategories.find(c => c.toLowerCase() === sub.toLowerCase());
      if (match) setSelectedSubCat(match);
    }
    if (b) {
      setSelectedBrand(b);
    }
  }, [searchParams]);

  const tripodProducts = useMemo(() => {
    return allProducts.filter(p => p.category?.toLowerCase() === 'tripods');
  }, [allProducts]);

  const brandsList = useMemo(() => {
    return ['All', ...new Set(tripodProducts.map(p => p.brand).filter(Boolean))];
  }, [tripodProducts]);

  const filteredTripods = useMemo(() => {
    return tripodProducts
      .filter(item => {
        const itemSub = (item.subCategory || item.type || '').toLowerCase().trim();
        const targetSub = selectedSubCat.toLowerCase().trim();

        const matchesSearch = searchTerm === '' || 
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itemSub.includes(searchTerm.toLowerCase());

        const matchesSubCat = selectedSubCat === 'All' || 
          itemSub === targetSub ||
          (targetSub === 'tripods' && itemSub === 'tripod') ||
          (targetSub === 'monopods' && itemSub === 'monopod') ||
          (targetSub === 'gimbals' && itemSub === 'gimbal');

        const matchesBrand = selectedBrand === 'All' || 
          item.brand?.toLowerCase() === selectedBrand.toLowerCase();

        const matchesPrice = item.price <= priceRange;

        return matchesSearch && matchesSubCat && matchesBrand && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [tripodProducts, searchTerm, selectedSubCat, selectedBrand, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTripods.length / itemsPerPage));
  const paginatedTripods = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTripods.slice(start, start + itemsPerPage);
  }, [filteredTripods, currentPage]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubCat('All');
    setSelectedBrand('All');
    setPriceRange(6000);
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="category-page-container">
      <div className="category-hero-header">
        <div className="container category-hero-inner">
          <div className="hero-cat-tag"><Compass size={14} /> CAMERA SUPPORT SYSTEMS</div>
          <h1 className="category-page-title">Tripods, Monopods & Gimbals</h1>
          <p className="category-page-desc">
            Ultra-stable carbon fiber travel legs, heavy-duty fluid video heads, and 3-axis motorized gimbal stabilizers from Peak Design, DJI, and Manfrotto.
          </p>

          <div className="subcategory-pills-row">
            {tripodSubCategories.map(sub => (
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
        <div className="mobile-filter-bar">
          <button 
            className="btn-secondary" 
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
          >
            <span><Filter size={16} /> Filter & Sort Support Gear</span>
            <span>({filteredTripods.length} Items)</span>
          </button>
        </div>

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

          <div className="filter-group">
            <h4 className="filter-group-title">Brand</h4>
            <div className="filter-options-list">
              {brandsList.map(brand => (
                <label key={brand} className="filter-radio-label">
                  <input
                    type="radio"
                    name="tripodBrand"
                    checked={selectedBrand === brand}
                    onChange={() => { setSelectedBrand(brand); setCurrentPage(1); }}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-title-row">
              <h4 className="filter-group-title">Max Price</h4>
              <span className="price-val-indicator">₹{priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50"
              max="6000"
              step="50"
              value={priceRange}
              onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
              className="price-slider-input"
            />
            <div className="slider-limits">
              <span>₹50</span>
              <span>₹6,000+</span>
            </div>
          </div>
        </aside>

        <main className="category-products-area">
          <div className="catalog-toolbar">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={(t) => { setSearchTerm(t); setCurrentPage(1); }}
              placeholder="Search tripods, gimbals, heads..."
            />

            <div className="catalog-toolbar-right">
              <span className="items-count-text">
                Showing <strong>{paginatedTripods.length}</strong> of <strong>{filteredTripods.length}</strong> products
              </span>

              <div className="sort-select-wrapper">
                <label htmlFor="sortSelect">Sort:</label>
                <select
                  id="sortSelect"
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="custom-sort-select"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {filteredTripods.length === 0 ? (
            <div className="empty-catalog-state">
              <Compass size={48} color="var(--primary)" />
              <h3>No Support Gear Matched</h3>
              <p>No products match your exact combination of brand, subcategory, or price.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
                {selectedSubCat !== 'All' && (
                  <button onClick={() => setSelectedSubCat('All')} className="btn-secondary">
                    Show All {selectedBrand !== 'All' ? selectedBrand : ''} Support Gear
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
              {paginatedTripods.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

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

export default Tripods;
