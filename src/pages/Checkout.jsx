import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  ShoppingBag,
  Building,
  QrCode,
  DollarSign
} from 'lucide-react';
import { clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../services/api';
import '../styles/cart.css';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    cartItems,
    appliedCoupon,
    subtotal,
    discountAmount,
    deliveryCharges,
    finalAmount,
    totalQuantity
  } = useSelector(state => state.cart);

  const authUser = useSelector(state => state.auth.user);

  // Form State matching Section 33 validation
  const [formData, setFormData] = useState({
    fullName: authUser?.address?.fullName || authUser?.name || '',
    mobileNumber: authUser?.address?.mobile || authUser?.mobile || '',
    address: authUser?.address?.address || '',
    city: authUser?.address?.city || '',
    state: authUser?.address?.state || '',
    pincode: authUser?.address?.pincode || '',
    paymentMethod: 'card', // 'cod', 'card', 'upi', 'netbanking'
    // Card inputs
    cardNumber: '4532 •••• •••• 8892',
    cardExpiry: '08/29',
    cardCvv: '842',
    upiId: 'creator@okaxis'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      errs.mobileNumber = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.address.trim()) errs.address = 'Street Address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim()) errs.pincode = 'Pincode / Postal Code is required';
    if (!formData.paymentMethod) errs.paymentMethod = 'Payment method must be selected';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      navigate('/cameras');
      return;
    }

    setIsSubmitting(true);

    const generatedOrderId = `CAM-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: generatedOrderId,
      date: new Date().toISOString().split('T')[0],
      items: cartItems,
      subtotal,
      discount: discountAmount,
      shipping: deliveryCharges,
      totalAmount: finalAmount,
      couponApplied: appliedCoupon?.code || null,
      paymentMethod: formData.paymentMethod.toUpperCase(),
      status: 'Processing',
      shippingAddress: {
        fullName: formData.fullName,
        mobile: formData.mobileNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }
    };

    // Save order in API / LocalStorage
    await createOrder(newOrder);

    // Clear cart and redirect
    dispatch(clearCart());
    setIsSubmitting(false);
    navigate('/ordersuccess', { state: { order: newOrder } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-container">
        <div className="container">
          <div className="empty-cart-card">
            <h2>No Items in Checkout</h2>
            <p>Your shopping cart is empty. Add products before proceeding.</p>
            <Link to="/cameras" className="btn-primary" style={{ marginTop: '16px' }}>
              Explore Cameras & Optics
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="container">
        <div className="cart-header-row">
          <div>
            <div className="page-tag"><Lock size={14} /> SECURE 256-BIT CHECKOUT</div>
            <h1 className="cart-main-title">Complete Your Order</h1>
            <p className="cart-subtitle">
              Verify your delivery address, select payment method, and confirm order.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="cart-layout-grid">
          {/* Left Column: Delivery Address & Payment Method */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step 1: Shipping Address */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>1</div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Delivery & Shipping Address</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex Vance"
                    style={{ width: '100%', background: 'var(--bg-input)', border: `1px solid ${errors.fullName ? '#ef4444' : 'var(--border-color)'}`, padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                  {errors.fullName && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.fullName}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    style={{ width: '100%', background: 'var(--bg-input)', border: `1px solid ${errors.mobileNumber ? '#ef4444' : 'var(--border-color)'}`, padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                  {errors.mobileNumber && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.mobileNumber}</span>}
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. 402 Studio Boulevard, Creative District"
                    style={{ width: '100%', background: 'var(--bg-input)', border: `1px solid ${errors.address ? '#ef4444' : 'var(--border-color)'}`, padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                  {errors.address && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.address}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. San Francisco"
                    style={{ width: '100%', background: 'var(--bg-input)', border: `1px solid ${errors.city ? '#ef4444' : 'var(--border-color)'}`, padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                  {errors.city && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.city}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>State / Province *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. California"
                    style={{ width: '100%', background: 'var(--bg-input)', border: `1px solid ${errors.state ? '#ef4444' : 'var(--border-color)'}`, padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                  {errors.state && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.state}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Postal / Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 94107"
                    style={{ width: '100%', background: 'var(--bg-input)', border: `1px solid ${errors.pincode ? '#ef4444' : 'var(--border-color)'}`, padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                  {errors.pincode && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.pincode}</span>}
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>2</div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Select Payment Method</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Credit / Debit Card */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: 'var(--radius-md)', background: formData.paymentMethod === 'card' ? 'rgba(249, 115, 22, 0.1)' : 'var(--bg-input)', border: `1px solid ${formData.paymentMethod === 'card' ? 'var(--primary)' : 'var(--border-color)'}`, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    style={{ accentColor: 'var(--primary)', marginTop: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                      <CreditCard size={18} color="var(--primary)" /> Credit / Debit Card (Visa, MasterCard, Amex)
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Instant authorization with encrypted bank gateway.</p>
                  </div>
                </label>

                {/* UPI / Instant Transfer */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: 'var(--radius-md)', background: formData.paymentMethod === 'upi' ? 'rgba(249, 115, 22, 0.1)' : 'var(--bg-input)', border: `1px solid ${formData.paymentMethod === 'upi' ? 'var(--primary)' : 'var(--border-color)'}`, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    style={{ accentColor: 'var(--primary)', marginTop: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                      <QrCode size={18} color="#38bdf8" /> UPI / Google Pay / PhonePe / QR Code
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Pay directly from your mobile UPI application.</p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: 'var(--radius-md)', background: formData.paymentMethod === 'cod' ? 'rgba(249, 115, 22, 0.1)' : 'var(--bg-input)', border: `1px solid ${formData.paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border-color)'}`, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    style={{ accentColor: 'var(--primary)', marginTop: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                      <DollarSign size={18} color="#10b981" /> Cash On Delivery (COD) / Pay Upon Delivery
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Pay cash or card to courier upon safe doorstep handover.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Review */}
          <div className="order-summary-sidebar">
            <div className="summary-card">
              <h3 className="summary-title">Order Review ({totalQuantity} Items)</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.price}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>${(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="summary-calculations">
                <div className="calc-row">
                  <span className="calc-label">Subtotal</span>
                  <span className="calc-val">${subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="calc-row discount-row">
                    <span className="calc-label">Coupon Rebate ({appliedCoupon?.code})</span>
                    <span className="calc-val">-${discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="calc-row">
                  <span className="calc-label">Priority Courier Shipping</span>
                  <span className="calc-val">{deliveryCharges === 0 ? 'FREE' : `$${deliveryCharges}`}</span>
                </div>
                <div className="calc-divider" />
                <div className="calc-row grand-total-row">
                  <span className="total-label">Grand Total</span>
                  <span className="total-val">${finalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary checkout-proceed-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Securing Your Order...' : `Place Order • $${finalAmount.toLocaleString()}`}
              </button>

              <div className="summary-trust-badges">
                <div className="summary-trust-line">
                  <ShieldCheck size={16} color="#38bdf8" />
                  <span>Official Authorized Brand Invoices</span>
                </div>
                <div className="summary-trust-line">
                  <Truck size={16} color="#f97316" />
                  <span>Ships in Insured Tamper-Evident Flight Case</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
