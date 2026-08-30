import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft,
  Ticket, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react';
import { 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart, 
  clearCart, 
  applyCoupon, 
  removeCoupon 
} from '../redux/slices/cartSlice';
import '../styles/cart.css';

const fallbackImg = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    cartItems,
    appliedCoupon,
    couponError,
    totalQuantity,
    subtotal,
    discountAmount,
    deliveryCharges,
    finalAmount
  } = useSelector(state => state.cart);

  const [couponCodeInput, setCouponCodeInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCodeInput.trim()) {
      dispatch(applyCoupon(couponCodeInput.trim()));
      setCouponCodeInput('');
    }
  };

  const handleQuickCoupon = (code) => {
    dispatch(applyCoupon(code));
  };

  return (
    <div className="cart-page-container">
      <div className="container">
        {/* Page Header */}
        <div className="cart-header-row">
          <div>
            <div className="page-tag"><ShoppingBag size={14} /> SHOPPING CART</div>
            <h1 className="cart-main-title">Shopping Cart</h1>
            <p className="cart-subtitle">
              Review your photography gear before proceeding to secure checkout.
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              className="btn-secondary clear-cart-btn"
              onClick={() => dispatch(clearCart())}
            >
              <Trash2 size={16} /> Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-card">
            <div className="empty-icon-circle">
              <ShoppingBag size={36} color="var(--primary)" />
            </div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>Looks like you haven't added any camera gear or master lenses yet.</p>
            <Link to="/cameras" className="btn-primary" style={{ marginTop: '16px' }}>
              Explore Cameras & Optics <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* Left: Cart Items List */}
            <div className="cart-items-section">
              <div className="cart-items-table-header">
                <span>Product Details</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Price</span>
              </div>

              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item-row">
                    {/* Item Info */}
                    <div className="item-main-col">
                      <Link to={`/product/${item.id}`} className="item-thumbnail-wrap">
                        <img
                          src={item.image || fallbackImg}
                          alt={item.name}
                          className="item-thumbnail-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = fallbackImg;
                          }}
                        />
                      </Link>
                      <div className="item-meta-info">
                        <span className="item-brand">{item.brand}</span>
                        <Link to={`/product/${item.id}`} className="item-title-link">
                          <h4>{item.name}</h4>
                        </Link>
                        <span className="item-unit-price">${Number(item.price).toLocaleString()} each</span>
                        <button
                          className="item-remove-btn"
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="item-qty-col">
                      <div className="qty-control-box">
                        <button
                          className="qty-btn"
                          onClick={() => dispatch(decreaseQuantity(item.id))}
                          title="Decrease Quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => dispatch(increaseQuantity(item.id))}
                          title="Increase Quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Total For Item */}
                    <div className="item-total-col">
                      <div className="item-total-price">
                        ${(Number(item.price) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer-nav">
                <Link to="/cameras" className="continue-shopping-link">
                  <ArrowLeft size={16} /> Continue Shopping Gear
                </Link>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="order-summary-sidebar">
              <div className="summary-card">
                <h3 className="summary-title">Order Summary</h3>

                {/* Coupon Input Module */}
                <div className="coupon-module">
                  <div className="coupon-header">
                    <Ticket size={16} color="var(--primary)" />
                    <span>Have a Promo / Creator Code?</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="applied-coupon-pill">
                      <div>
                        <div className="applied-code-text">
                          <CheckCircle size={15} /> <strong>{appliedCoupon.code}</strong> applied
                        </div>
                        <span className="coupon-desc-sub">{appliedCoupon.description}</span>
                      </div>
                      <button
                        className="remove-coupon-btn"
                        onClick={() => dispatch(removeCoupon())}
                        title="Remove coupon"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="coupon-input-group">
                      <input
                        type="text"
                        placeholder="e.g. CAM10"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                      />
                      <button type="submit" className="apply-coupon-btn">
                        Apply
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <div className="coupon-error-msg">
                      <AlertCircle size={14} /> {couponError}
                    </div>
                  )}

                  {/* Quick Clickable Suggestions */}
                  {!appliedCoupon && (
                    <div className="quick-coupons-box">
                      <span className="quick-coupons-label">Try Creator Codes:</span>
                      <div className="quick-coupon-pills">
                        <button type="button" onClick={() => handleQuickCoupon('CAM10')}>
                          CAM10 (10% Off)
                        </button>
                        <button type="button" onClick={() => handleQuickCoupon('PROPHOTO')}>
                          PROPHOTO ($150 Off)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Calculations breakdown */}
                <div className="summary-calculations">
                  <div className="calc-row">
                    <span className="calc-label">Subtotal ({totalQuantity} items)</span>
                    <span className="calc-val">${subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="calc-row discount-row">
                      <span className="calc-label">Coupon Discount ({appliedCoupon?.code})</span>
                      <span className="calc-val">-${discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="calc-row">
                    <span className="calc-label">Priority Insured Shipping</span>
                    <span className="calc-val">
                      {deliveryCharges === 0 ? (
                        <span className="free-shipping-badge">FREE</span>
                      ) : (
                        `$${deliveryCharges}`
                      )}
                    </span>
                  </div>

                  <div className="calc-divider" />

                  <div className="calc-row grand-total-row">
                    <span className="total-label">Grand Total</span>
                    <span className="total-val">${finalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  className="btn-primary checkout-proceed-btn"
                  onClick={() => navigate('/checkout')}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </button>

                {/* Trust mini-badges */}
                <div className="summary-trust-badges">
                  <div className="summary-trust-line">
                    <ShieldCheck size={16} color="#38bdf8" />
                    <span>2-Year Official Manufacturer Warranty</span>
                  </div>
                  <div className="summary-trust-line">
                    <Truck size={16} color="#f97316" />
                    <span>Ships in Tamper-Proof Flight Case</span>
                  </div>
                  <div className="summary-trust-line">
                    <RotateCcw size={16} color="#10b981" />
                    <span>30-Day Hassle-Free Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
