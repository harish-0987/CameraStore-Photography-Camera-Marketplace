import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import '../styles/product.css';

const fallbackImg = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const isWishlisted = wishlistItems.some(item => String(item.id) === String(product.id));

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  const discountPercent = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        {/* Card Image Container */}
        <div className="product-image-wrap">
          <img
            src={product.image || fallbackImg}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImg;
            }}
          />

          {/* Badges */}
          <div className="product-badges-corner">
            {discountPercent > 0 && (
              <span className="badge-discount">-{discountPercent}%</span>
            )}
            {product.isNewArrival && (
              <span className="badge-new-item">NEW</span>
            )}
            {product.isDeal && (
              <span className="badge-deal-flash"><Zap size={11} /> DEAL</span>
            )}
          </div>

          {/* Wishlist Floating Button */}
          <button
            type="button"
            className={`wishlist-float-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleToggleWishlist}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "#ffffff"} />
          </button>
        </div>

        {/* Product Details Info */}
        <div className="product-info-block">
          <div className="product-meta-row">
            <span className="product-brand-tag">{product.brand}</span>
            <div className="product-rating-pill">
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>

          <div className="product-pricing-row">
            <div className="price-group">
              <span className="current-price">${Number(product.price).toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price">${Number(product.originalPrice).toLocaleString()}</span>
              )}
            </div>

            <button
              type="button"
              className="quick-add-cart-btn"
              onClick={handleAddToCart}
              title="Add to Shopping Cart"
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
