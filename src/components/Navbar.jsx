import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Camera, 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  LogOut,
  Package,
  Shield
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cartQuantity = useSelector(state => state.cart.totalQuantity);
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const products = useSelector(state => state.products.products);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [searchPreviewOpen, setSearchPreviewOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Cameras', path: '/cameras' },
    { label: 'Lenses', path: '/lenses' },
    { label: 'Lighting', path: '/lighting' },
    { label: 'Tripods', path: '/tripods' },
    { label: 'Bags', path: '/bags' },
    { label: 'Accessories', path: '/accessories' },
  ];

  const filteredPreview = navSearch.trim() === '' ? [] : products.filter(p => 
    p.name.toLowerCase().includes(navSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(navSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(navSearch.toLowerCase())
  ).slice(0, 5);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/cameras?search=${encodeURIComponent(navSearch.trim())}`);
      setSearchPreviewOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="site-header">
      {/* Main Navbar */}
      <nav className="main-navbar">
        <div className="container navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon-box">
              <Camera size={22} color="#ffffff" />
            </div>
            <div className="logo-text-group">
              <span className="logo-title">CAMERA<span>STORE</span></span>
              <span className="logo-tagline">PRO PHOTOGRAPHY & CINEMA</span>
            </div>
          </Link>

          {/* Search Bar with live preview */}
          <div className="nav-search-wrapper">
            <form onSubmit={handleSearchSubmit} className="nav-search-form">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search cameras, lenses, lighting, accessories..."
                value={navSearch}
                onChange={(e) => {
                  setNavSearch(e.target.value);
                  setSearchPreviewOpen(true);
                }}
                onFocus={() => setSearchPreviewOpen(true)}
              />
              {navSearch && (
                <button 
                  type="button" 
                  className="clear-search-btn"
                  onClick={() => setNavSearch('')}
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Quick Preview Dropdown */}
            {searchPreviewOpen && filteredPreview.length > 0 && (
              <div className="search-preview-box">
                <div className="search-preview-header">Instant Results</div>
                {filteredPreview.map(item => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    className="search-preview-item"
                    onClick={() => setSearchPreviewOpen(false)}
                  >
                    <img src={item.image} alt={item.name} className="search-preview-img" />
                    <div className="search-preview-info">
                      <div className="search-preview-title">{item.name}</div>
                      <div className="search-preview-meta">
                        <span className="search-preview-brand">{item.brand}</span>
                        <span className="search-preview-price">${item.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav Icons & Account */}
          <div className="navbar-actions">
            {/* Wishlist Link */}
            <Link to="/wishlist" className="action-btn" title="Saved Wishlist">
              <div className="icon-with-badge">
                <Heart size={22} />
                {wishlistItems.length > 0 && (
                  <span className="action-badge">{wishlistItems.length}</span>
                )}
              </div>
              <span className="action-label">Wishlist</span>
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="action-btn cart-btn-accent" title="Shopping Cart">
              <div className="icon-with-badge">
                <ShoppingBag size={22} />
                {cartQuantity > 0 && (
                  <span className="action-badge badge-orange">{cartQuantity}</span>
                )}
              </div>
              <span className="action-label">Cart</span>
            </Link>

            {/* User Profile / Auth */}
            <div className="user-dropdown-container">
              {isAuthenticated && user ? (
                <button
                  className="user-profile-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-name-wrapper">
                    <span className="user-greeting">Hello,</span>
                    <span className="user-name">{user.name.split(' ')[0]}</span>
                  </div>
                  <ChevronDown size={14} />
                </button>
              ) : (
                <Link to="/login" className="login-link-btn">
                  <User size={18} />
                  <span>Sign In</span>
                </Link>
              )}

              {userDropdownOpen && isAuthenticated && (
                <div className="dropdown-menu-card">
                  <div className="dropdown-user-header">
                    <div className="dropdown-user-name">{user.name}</div>
                    <div className="dropdown-user-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link 
                    to="/profile" 
                    className="dropdown-item" 
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="dropdown-item" 
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <Package size={16} /> My Orders
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="dropdown-item" 
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <Heart size={16} /> Wishlist
                  </Link>
                  <Link 
                    to="/admin" 
                    className="dropdown-item" 
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ color: 'var(--primary)', fontWeight: 700 }}
                  >
                    <Shield size={16} /> Admin Studio
                  </Link>

                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <div className="category-nav-bar">
          <div className="container category-nav-inner">
            <div className="nav-links-list">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`category-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mobile-divider" />
              <Link to="/admin" className="mobile-link" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                ⚡ Admin Studio Control Panel
              </Link>
              <div className="mobile-divider" />
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                    My Profile
                  </Link>
                  <Link to="/orders" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                  <button className="mobile-link logout-btn" onClick={handleLogout}>
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
