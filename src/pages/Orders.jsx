import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { getOrders } from '../services/api';
import '../styles/cart.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      const data = await getOrders();
      setOrders(data || []);
      setLoading(false);
    };
    fetchUserOrders();
  }, []);

  return (
    <div className="cart-page-container">
      <div className="container">
        {/* Header */}
        <div className="cart-header-row">
          <div>
            <div className="page-tag"><Package size={14} /> ORDER DISPATCH TRACKING</div>
            <h1 className="cart-main-title">My Orders History</h1>
            <p className="cart-subtitle">View and track all past camera equipment and optics orders.</p>
          </div>
          <Link to="/cameras" className="btn-primary">
            <ShoppingBag size={16} /> Browse New Gear
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="empty-cart-card">
            <div className="empty-icon-circle">
              <Package size={36} color="var(--primary)" />
            </div>
            <h2>No Orders Placed Yet</h2>
            <p>You haven't purchased any photography gear yet. Explore our top-rated camera bodies.</p>
            <Link to="/cameras" className="btn-primary" style={{ marginTop: '16px' }}>
              Explore Cameras
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '24px' }}>
                {/* Order Top Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Number</span>
                      <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>#{order.id}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Date</span>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{order.date}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount</span>
                      <div style={{ fontFamily: 'Space Grotesk', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>₹{Number(order.totalAmount).toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                      color: order.status === 'Delivered' ? '#34d399' : '#fb923c',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {order.status === 'Delivered' ? <CheckCircle size={14} /> : <Truck size={14} />}
                      {order.status || 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <Link to={`/product/${item.id}`} style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                            {item.name}
                          </Link>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity} × ${item.price}</div>
                        </div>
                      </div>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#ffffff' }}>
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping summary footer */}
                {order.shippingAddress && (
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="var(--primary)" />
                      <span>Delivered to: {order.shippingAddress.address}, {order.shippingAddress.city}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Invoice downloaded for Order #${order.id}`)}
                      className="btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                    >
                      <Download size={13} /> Invoice
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
