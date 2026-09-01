import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Filter
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import '../styles/cameras.css';

const categoryList = [
  'All',
  'Cameras',
  'Lenses',
  'Lighting',
  'Tripods',
  'Bags',
  'Accessories'
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allProducts = useSelector(state => state.products.products);

  const queryParam = searchParams.get('q') || searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialBrand = searchParams.get('brand') || 'All';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('search') || '';
    const cat = searchParams.get('category') || 'All';
    const b = searchParams.get('brand') || 'All';
    setSearchTerm(q);
    setSelectedCategory(cat);
    setSelectedBrand(b);
  }, [searchParams]);

  // Count items per category for the current search term
  const categoryCounts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const counts = { All: 0 };
    categoryList.forEach(c => { counts[c] = 0; });

    allProducts.forEach(item => {
      const name = (item.name || '').toLowerCase();
      const brand = (item.brand || '').toLowerCase();
      const cat = (item.category || '');
      const sub = (item.subCategory || item.type || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();

      const matchesSearch = term === '' || 
        name.includes(term) ||
        brand.includes(term) ||
        cat.toLowerCase().includes(term) ||
        sub.includes(term) ||
        desc.includes(term);

      if (matchesSearch) {
        counts.All += 1;
        if (counts[cat] !== undefined) {
          counts[cat] += 1;
        }
      }
    });

    return counts;
  }, [allProducts, searchTerm]);

  // Filtered matching products
  const searchResults = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return allProducts
      .filter(item => {
        const name = (item.name || '').toLowerCase();
        const brand = (item.brand || '').toLowerCase();
        const cat = (item.category || '');
        const sub = (item.subCategory || item.type || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();

        const matchesSearch = term === '' || 
          name.includes(term) ||
          brand.includes(term) ||
          cat.toLowerCase().includes(term) ||
          sub.includes(term) ||
          desc.includes(term);

        const matchesCategory = selectedCategory === 'All' || 
          cat.toLowerCase() === selectedCategory.toLowerCase();

        const matchesBrand = selectedBrand === 'All' || 
          brand === selectedBrand.toLowerCase();

        const matchesPrice = Number(item.price || 0) <= priceRange;
        const matchesRating = selectedRating === 0 || Number(item.rating || 0) >= selectedRating;

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
        if (sortBy === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
        if (sortBy === 'discount') return Number(b.discount || 0) - Number(a.discount || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [allProducts, searchTerm, selectedCategory, selectedBrand, priceRange, selectedRating, sortBy]);

  // Extract available brands for the matching items
  const brandsList = useMemo(() => {
    const matchingCategoryProducts = selectedCategory === 'All' 
      ? allProducts 
      : allProducts.filter(p => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());
    
    const brands = new Set(matchingCategoryProducts.map(p => p.brand).filter(Boolean));
    return ['All', ...Array.from(brands)];
  }, [allProducts, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(searchResults.length / itemsPerPage));
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return searchResults.slice(start, start + itemsPerPage);
  }, [searchResults, currentPage]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setSearchParams(term ? { q: term } : {});
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setPriceRange(10000);
    setSelectedRating(0);
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="category-page-container">
      {/* Search Header Banner */}
      <div className="category-hero-header" style={{ padding: '38px 0 28px' }}>
        <div className="container category-hero-inner">
          <div className="hero-cat-tag">
            <SearchIcon size={14} /> CATALOG SEARCH & DISCOVERY
          </div>
          <h1 className="category-page-title" style={{ fontSize: '2.1rem' }}>
            {searchTerm ? (
              <>Search Results for <span style={{ color: 'var(--primary)' }}>"{searchTerm}"</span></>
            ) : (
              'Browse Complete Equipment Catalog'
            )}
          </h1>
          <p className="category-page-desc">
            Explore our curated pro inventory across Cameras, Lenses, Lighting, Cinema Rigs, Bags, and Accessories.
          </p>

          {/* Category Filter Pills */}
          <div className="subcategory-pills-row" style={{ marginTop: '18px' }}>
            {categoryList.map(cat => {
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  className={`subcat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(cat); setSelectedBrand('All'); setCurrentPage(1); }}
                >
                  {cat} {searchTerm && <span style={{ opacity: 0.75, fontSize: '0.8em', marginLeft: '4px' }}>({count})</span>}
                </button>
              );
            })}
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
              <Filter size={16} /> Filter Results
            </span>
            <span>({searchResults.length} Results)</span>
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${mobileFilterOpen ? 'mobile-show' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">
              <SlidersHorizontal size={18} color="var(--primary)" />
              <span>Search Filters</span>
            </div>
            <button className="reset-filter-btn" onClick={resetFilters}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Equipment Category</h4>
            <div className="filter-options-list">
              {categoryList.map(cat => (
                <label key={cat} className="filter-radio-label">
                  <input
                    type="radio"
                    name="searchCategory"
                    checked={selectedCategory === cat}
                    onChange={() => { setSelectedCategory(cat); setSelectedBrand('All'); setCurrentPage(1); }}
                  />
                  <span>{cat}</span>
                  {categoryCounts[cat] !== undefined && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {categoryCounts[cat]}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Brand</h4>
            <div className="filter-options-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {brandsList.map(brand => (
                <label key={brand} className="filter-radio-label">
                  <input
                    type="radio"
                    name="searchBrand"
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
                    name="searchRating"
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
              setSearchTerm={handleSearchChange}
              placeholder="Search cameras, lenses, lighting, bags..."
            />

            <div className="catalog-toolbar-right">
              <span className="items-count-text">
                Showing <strong>{paginatedResults.length}</strong> of <strong>{searchResults.length}</strong> results
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
          {searchResults.length === 0 ? (
            <div className="empty-catalog-state">
              <SearchIcon size={48} color="var(--primary)" />
              <h3>No Equipment Found</h3>
              <p>
                {searchTerm 
                  ? `No gear in our inventory matched "${searchTerm}". Try checking for typos or searching by brand/category.` 
                  : 'No equipment matches the active filter selections.'}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
                {selectedCategory !== 'All' && (
                  <button onClick={() => setSelectedCategory('All')} className="btn-secondary">
                    Search All Categories
                  </button>
                )}
                {selectedBrand !== 'All' && (
                  <button onClick={() => setSelectedBrand('All')} className="btn-secondary">
                    Show All Brands
                  </button>
                )}
                <button onClick={resetFilters} className="btn-primary">
                  Clear All Filters & Show All Gear
                </button>
              </div>
            </div>
          ) : (
            <div className="product-grid">
              {paginatedResults.map(product => (
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

export default SearchPage;
