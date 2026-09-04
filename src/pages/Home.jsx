import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  CheckCircle, 
  ChevronRight, 
  SlidersHorizontal,
  Camera,
  Layers,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Banner from '../components/Banner';
import { productCategories, trendingBrands } from '../data/cameraProducts';
import '../styles/home.css';

const Home = () => {
  const products = useSelector(state => state.products.products);

  // Flash Sale Countdown Timer (Simulated)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter(p => p.isDeal || (p.discount && p.discount > 10)).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const featuredCameras = products.filter(p => p.category?.toLowerCase() === 'cameras').slice(0, 4);
  const featuredLenses = products.filter(p => p.category?.toLowerCase() === 'lenses').slice(0, 4);

  return (
    <div className="home-page-container">
      {/* 1. Hero Banner Section */}
      <section className="hero-banner-section">
        <div className="container hero-banner-grid">
          <div className="hero-text-content">
            <div className="hero-badge-pill">
              <Sparkles size={14} /> 2026 FLAGSHIP CAMERA & CINEMA RELEASE
            </div>
            <h1 className="hero-headline">
              Elevate Your Vision With <span>Cinema-Grade Precision</span>
            </h1>
            <p className="hero-subtext">
              Discover the world's most acclaimed 8K mirrorless bodies, G-Master primes, studio lighting arrays, and pro cinema accessories.
            </p>
            <div className="hero-cta-group">
              <Link to="/cameras" className="btn-primary">
                <span>Explore Cameras</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/lenses" className="btn-secondary">
                <span>Shop Lenses</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="hero-metrics-row">
              <div className="metric-item">
                <span className="metric-num">500+</span>
                <span className="metric-label">Pro Gear Models</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-num">100%</span>
                <span className="metric-label">Genuine Warranty</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-num">4.9★</span>
                <span className="metric-label">Creator Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Display */}
          <div className="hero-visual-card">
            <div className="hero-main-card">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
                alt="Sony Alpha A7 IV"
                className="hero-main-img"
              />
              <div className="hero-floating-tag top-left">
                <div className="tag-icon"><Zap size={14} color="#f97316" /></div>
                <div>
                  <div className="tag-label">Sony A7 IV</div>
                  <div className="tag-sub">33MP 4K 60p 10-Bit</div>
                </div>
              </div>
              <div className="hero-floating-tag bottom-right">
                <div className="tag-price">₹2,498</div>
                <div className="tag-stock">In Stock & Ready to Ship</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights Bar */}
      <Banner type="features" />

      {/* 2. Photography Categories Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-subtitle">EXPLORE BY GEAR TYPE</div>
              <h2 className="section-title">Photography & Cinema Categories</h2>
            </div>
            <Link to="/cameras" className="view-all-link">
              <span>View All Gear</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="categories-grid-container">
            {productCategories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Deals and Offers (Flash Sale with Countdown) */}
      <section className="deals-flash-section">
        <div className="container">
          <div className="deals-header-bar">
            <div className="deals-header-left">
              <div className="deals-badge"><Flame size={16} /> FLASH DEALS</div>
              <h2 className="deals-title">Limited Time Creator Offers</h2>
            </div>

            <div className="countdown-clock">
              <span className="clock-label"><Clock size={16} /> Offer Ends In:</span>
              <div className="clock-boxes">
                <div className="clock-unit">
                  <span className="unit-digit">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="unit-label">HRS</span>
                </div>
                <span className="clock-colon">:</span>
                <div className="clock-unit">
                  <span className="unit-digit">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="unit-label">MIN</span>
                </div>
                <span className="clock-colon">:</span>
                <div className="clock-unit">
                  <span className="unit-digit">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="unit-label">SEC</span>
                </div>
              </div>
            </div>
          </div>

          <div className="product-grid">
            {dealProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="container promo-banner-wrapper">
        <Banner type="promo" />
      </section>

      {/* 5. Featured Cameras */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-subtitle">FLAGSHIP BODIES</div>
              <h2 className="section-title">Featured Professional Cameras</h2>
            </div>
            <Link to="/cameras" className="view-all-link">
              <span>See All Cameras</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="product-grid">
            {featuredCameras.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Lenses */}
      <section className="section-padding lenses-highlight-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-subtitle">PRECISION OPTICS</div>
              <h2 className="section-title">Top Master Lenses & Zooms</h2>
            </div>
            <Link to="/lenses" className="view-all-link">
              <span>Explore All Lenses</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="product-grid">
            {featuredLenses.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. New Arrivals */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-subtitle">JUST UNVEILED</div>
              <h2 className="section-title">New Photography Arrivals</h2>
            </div>
            <Link to="/accessories" className="view-all-link">
              <span>View Accessories</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="product-grid">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Trending Brands Showcase */}
      <section className="brands-showcase-section">
        <div className="container">
          <div className="brands-header text-center">
            <span className="section-subtitle">AUTHORIZED DISTRIBUTOR</span>
            <h2 className="section-title">World Leading Photography Brands</h2>
          </div>

          <div className="brands-logo-grid">
            {trendingBrands.map((brand, idx) => (
              <Link 
                key={idx} 
                to={`/brand/${encodeURIComponent(brand.name)}`} 
                className="brand-card-item"
                title={`Explore ${brand.name} official gear`}
              >
                <div className="brand-logo-name">{brand.logo}</div>
                <div className="brand-tagline-text">{brand.tagline}</div>
                <span className="brand-card-hover-action">
                  Explore Gear <ChevronRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
