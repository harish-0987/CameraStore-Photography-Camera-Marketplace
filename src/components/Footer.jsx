import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  RotateCcw,
  Sparkles,
  Share2,
  Globe
} from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebookF } from 'react-icons/fa6';
import '../styles/footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="site-footer">
      {/* Newsletter Banner */}
      <div className="newsletter-section">
        <div className="container newsletter-container">
          <div className="newsletter-text-col">
            <div className="newsletter-badge">
              <Sparkles size={14} /> VIP CREATOR CLUB
            </div>
            <h3 className="newsletter-title">Get $50 Off Your First Pro Camera Order</h3>
            <p className="newsletter-desc">
              Subscribe for exclusive flash deals, firmware updates, cinema lens masterclasses, and photography gear announcements.
            </p>
          </div>

          <div className="newsletter-form-col">
            {subscribed ? (
              <div className="subscribed-success-message">
                <CheckCircle2 size={20} color="#10b981" />
                <span>Thank you! Your $50 VIP coupon code <strong>CREATOR50</strong> has been activated.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-input-box">
                <Mail size={18} className="newsletter-icon" />
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-submit-btn">
                  <span>Subscribe</span>
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="main-footer-body">
        <div className="container footer-grid">
          {/* Col 1: Brand Info */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <Camera size={22} color="#ffffff" />
              </div>
              <span className="footer-logo-text">CAMERA<span>STORE</span></span>
            </Link>
            <p className="footer-about">
              The premier destination for professional photographers, filmmakers, and digital creators worldwide. Authentic cameras, cinema glass, studio lighting, and pro gear.
            </p>
            <div className="footer-contact-info">
              <div className="contact-line">
                <MapPin size={16} color="var(--primary)" />
                <span>402 Studio Boulevard, Creative Arts District, SF, CA 94107</span>
              </div>
              <div className="contact-line">
                <Phone size={16} color="var(--primary)" />
                <span>+1 (800) 555-CAMPRO / Mon-Sat 9AM-7PM EST</span>
              </div>
              <div className="contact-line">
                <Mail size={16} color="var(--primary)" />
                <span>concierge@camerastore.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">Gear Categories</h4>
            <ul className="footer-links-list">
              <li><Link to="/cameras">Mirrorless Cameras</Link></li>
              <li><Link to="/cameras">DSLR Cinema Bodies</Link></li>
              <li><Link to="/lenses">Prime & Zoom Lenses</Link></li>
              <li><Link to="/lighting">Studio Strobes & LED</Link></li>
              <li><Link to="/tripods">Carbon Fiber Tripods</Link></li>
              <li><Link to="/bags">Camera Bags & Slings</Link></li>
              <li><Link to="/accessories">High-Speed SD Cards</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">Customer Support</h4>
            <ul className="footer-links-list">
              <li><Link to="/orders">Track My Order</Link></li>
              <li><Link to="/profile">My Account & Addresses</Link></li>
              <li><Link to="/cart">Shopping Cart & Coupons</Link></li>
              <li><Link to="/wishlist">Saved Wishlist</Link></li>
              <li><Link to="/profile">Shipping Rates & Timelines</Link></li>
              <li><Link to="/profile">2-Year Official Warranty</Link></li>
              <li><Link to="/profile">30-Day Hassle-Free Returns</Link></li>
            </ul>
          </div>

          {/* Col 4: Top Brands & Social */}
          <div className="footer-col">
            <h4 className="footer-col-title">Featured Brands</h4>
            <div className="brand-tags-cloud">
              <Link to="/brand/Sony" className="brand-pill">Sony Alpha</Link>
              <Link to="/brand/Canon" className="brand-pill">Canon EOS R</Link>
              <Link to="/brand/Nikon" className="brand-pill">Nikon Z</Link>
              <Link to="/brand/Fujifilm" className="brand-pill">Fujifilm X</Link>
              <Link to="/brand/Leica" className="brand-pill">Leica</Link>
              <Link to="/brand/DJI" className="brand-pill">DJI Pro</Link>
              <Link to="/brand/Sigma" className="brand-pill">Sigma Art</Link>
              <Link to="/brand/Peak Design" className="brand-pill">Peak Design</Link>
              <Link to="/brand/Godox" className="brand-pill">Godox</Link>
              <Link to="/brand/Manfrotto" className="brand-pill">Manfrotto</Link>
              <Link to="/brand/SanDisk" className="brand-pill">SanDisk</Link>
              <Link to="/brand/Aputure" className="brand-pill">Aputure</Link>
            </div>

            <h4 className="footer-col-title" style={{ marginTop: '24px' }}>Connect With Us</h4>
            <div className="social-links-row">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-circle" title="Instagram">
                <FaInstagram size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-circle" title="YouTube">
                <FaYoutube size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-circle" title="Twitter">
                <FaXTwitter size={15} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-circle" title="Facebook">
                <FaFacebookF size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <div className="copyright-text">
            © 2026 CameraStore – Photography & Camera Marketplace. All rights reserved.
          </div>

          <div className="trust-badges-list">
            <div className="trust-badge-pill">
              <Lock size={13} color="#10b981" /> 256-Bit SSL Encrypted
            </div>
            <div className="trust-badge-pill">
              <ShieldCheck size={13} color="#38bdf8" /> Authorized Dealer
            </div>
            <div className="trust-badge-pill">
              <RotateCcw size={13} color="#fbbf24" /> 30-Day Returns
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
