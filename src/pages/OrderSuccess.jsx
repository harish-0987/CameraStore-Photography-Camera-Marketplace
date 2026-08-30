import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ShoppingBag,
  Download,
  ShieldCheck
} from 'lucide-react';
import '../styles/cart.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve placed order or mock fallback
  const order = location.state?.order || {
    id: 'CAM-89421',
    date: new Date().toISOString().split('T')[0],
    items: [
      {
        id: 'cam-1',
        name: 'Sony Alpha A7 IV Full-Frame Mirrorless Camera',
        price: 2498,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 2248.20,
    shippingAddress: {
      fullName: 'Alex Vance',
      mobile: '9876543210',
      address: '402 Studio Boulevard, Creative District',
      city: 'San Francisco',
      state: 'California',
      pincode: '94107'
    }
  };

  return (
    <div className="cart-page-container">
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="glass-card" style={{ padding: '48px 36px', textAlign: 'center' }}>
          {/* Animated Success Badge */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
          }}>
            <CheckCircle2 size={44} color="#10b981" />
          </div>

          <span className="page-tag" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            ORDER CONFIRMED & DISPATCHED
          </span>

          <h1 style={{ fontSize: '2.4rem', color: '#ffffff', margin: '12px 0 8px' }}>
            Thank You For Your Order!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '28px' }}>
            Your photography gear order has been received and is being prepared in our climate-controlled optics cleanroom.
          </p>

          {/* Order Details Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '32px'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Number</span>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                #{order.id}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Delivery</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                3-5 Business Days
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount Paid</span>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                ${Number(order.totalAmount).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Items Breakdown */}
          <div style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '16px' }}>Ordered Equipment</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <img src={item.image} alt={item.name} style={{ width: '54px', height: '54px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity} × ${item.price}</div>
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#ffffff' }}>
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address Summary */}
          {order.shippingAddress && (
            <div style={{ textAlign: 'left', background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                <MapPin size={16} color="var(--primary)" /> Shipping Destination
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {order.shippingAddress.fullName} • {order.shippingAddress.mobile}<br />
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/cameras" className="btn-primary">
              <ShoppingBag size={18} /> Continue Shopping Gear
            </Link>
            <Link to="/orders" className="btn-secondary">
              <Package size={18} /> View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
