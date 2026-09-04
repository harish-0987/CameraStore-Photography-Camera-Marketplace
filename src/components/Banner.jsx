import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Truck, Award } from 'lucide-react';
import '../styles/home.css';

const Banner = ({ type = 'hero' }) => {
  if (type === 'promo') {
    return (
      <div className="promo-banner-card">
        <div className="promo-banner-content">
          <div className="promo-tag"><Sparkles size={14} /> LIMITED CREATOR BUNDLE</div>
          <h2 className="promo-title">Upgrade Your Cinema Rig with 25% Off Cine Primes</h2>
          <p className="promo-desc">
            Pair any mirrorless camera body with high-speed Cine Primes or Master Zooms and receive an instant manufacturer mail-in rebate and pro gear bag.
          </p>
          <div className="promo-buttons">
            <Link to="/lenses" className="btn-primary">
              Shop Cine Lenses <ArrowRight size={18} />
            </Link>
            <Link to="/cameras" className="btn-secondary">
              Browse Cameras
            </Link>
          </div>
        </div>
        <div className="promo-banner-visual">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
            alt="Pro Cinema Rig"
            className="promo-visual-img"
          />
        </div>
      </div>
    );
  }

  // Feature Highlights Bar
  return (
    <div className="trust-features-bar">
      <div className="container trust-features-grid">
        <div className="trust-feature-item">
          <div className="trust-icon-box"><Truck size={22} color="#f97316" /></div>
          <div>
            <div className="trust-item-title">Free Express Shipping</div>
            <div className="trust-item-desc">On all orders over ₹100 worldwide</div>
          </div>
        </div>
        <div className="trust-feature-item">
          <div className="trust-icon-box"><Shield size={22} color="#38bdf8" /></div>
          <div>
            <div className="trust-item-title">2-Year Official Warranty</div>
            <div className="trust-item-desc">100% Genuine authorized products</div>
          </div>
        </div>
        <div className="trust-feature-item">
          <div className="trust-icon-box"><Award size={22} color="#fbbf24" /></div>
          <div>
            <div className="trust-item-title">30-Day Money Back</div>
            <div className="trust-item-desc">Hassle-free return & exchange policy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
