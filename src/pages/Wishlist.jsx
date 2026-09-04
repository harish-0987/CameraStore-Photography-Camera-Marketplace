import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Check 
} from 'lucide-react';
import { removeFromWishlist, clearWishlist, moveToCart } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import '../styles/cart.css';

const fallbackImg = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => {
      dispatch(addToCart({ ...item, quantity: 1 }));
    });
    dispatch(clearWishlist());
  };

  return (
    <div className="cart-page-container">
      <div className="container">
        {/* Header */}
        <div className="cart-header-row">
          <div>
            <div className="page-tag"><Heart size={14} /> SAVED CREATOR GEAR</div>
            <h1 className="cart-main-title">My Wishlist</h1>
            <p className="cart-subtitle">
              You have <strong>{wishlistItems.length}</strong> items saved in your gear wishlist.
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-primary"
                onClick={handleMoveAllToCart}
              >
                <ShoppingBag size={16} /> Move All To Cart
              </button>
              <button
                className="btn-secondary"
                onClick={() => dispatch(clearWishlist())}
              >
                <Trash2 size={16} /> Clear Wishlist
              </button>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-cart-card">
            <div className="empty-icon-circle">
              <Heart size={36} color="var(--primary)" />
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save cameras, master lenses, and cinema accessories to compare or buy later.</p>
            <Link to="/cameras" className="btn-primary" style={{ marginTop: '16px' }}>
              Explore Cameras & Gear <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid-layout">
            {wishlistItems.map(item => (
              <div key={item.id} className="wishlist-item-card">
                <Link to={`/product/${item.id}`} className="wishlist-img-wrap">
                  <img
                    src={item.image || fallbackImg}
                    alt={item.name}
                    className="wishlist-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImg;
                    }}
                  />
                </Link>

                <div className="wishlist-item-details">
                  <div className="wishlist-brand-text">{item.brand}</div>
                  <Link to={`/product/${item.id}`} className="wishlist-name-link">
                    <h3>{item.name}</h3>
                  </Link>

                  <div className="wishlist-stock-status">
                    <Check size={14} color="#10b981" /> In Stock & Ready to Ship
                  </div>

                  <div className="wishlist-price-row">
                    <span className="wishlist-current-price">₹{Number(item.price).toLocaleString()}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="wishlist-orig-price">₹{Number(item.originalPrice).toLocaleString()}</span>
                    )}
                  </div>

                  <div className="wishlist-card-actions">
                    <button
                      className="btn-primary move-cart-btn"
                      onClick={() => dispatch(moveToCart(item))}
                    >
                      <ShoppingBag size={16} /> Move To Cart
                    </button>
                    <button
                      className="remove-wishlist-icon-btn"
                      onClick={() => dispatch(removeFromWishlist(item.id))}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
