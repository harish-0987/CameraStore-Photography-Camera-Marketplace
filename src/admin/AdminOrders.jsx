import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Clock, Truck, XCircle, Search, DollarSign } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/admin.css';

const fallbackGearImg = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useCart();
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'All' || (o.status || 'Processing') === statusFilter;
    const matchesSearch = 
      String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customerName || o.shippingAddress?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalVolume = orders.reduce((sum, o) => sum + Number(o.total || o.totalAmount || 0), 0);
  const deliveredCount = orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
  const processingCount = orders.filter(o => (o.status || '').toLowerCase() === 'processing' || !o.status).length;
  const shippedCount = orders.filter(o => (o.status || '').toLowerCase() === 'shipped').length;

  return (
    <div className="admin-layout">
      <div className="container">
        
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title-group">
            <div className="admin-badge-pill">
              <ShoppingBag size={12} /> Dispatch & Fulfillment
            </div>
            <h1 className="admin-title">Customer Orders Management</h1>
            <p className="admin-subtitle">Live tracking of transactions, customer delivery status, and invoice totals</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <Link to="/admin" className="admin-tab">Dashboard</Link>
          <Link to="/admin/products" className="admin-tab">Products</Link>
          <Link to="/admin/orders" className="admin-tab active">
            Orders <span className="tab-counter">{orders.length}</span>
          </Link>
          <Link to="/admin/users" className="admin-tab">Users</Link>
        </div>

        {/* Order Metric Summary Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(14, 21, 34, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk' }}>{orders.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Placed</div>
            </div>
          </div>

          <div style={{ background: 'rgba(14, 21, 34, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fb923c', fontFamily: 'Space Grotesk' }}>{processingCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>In Processing</div>
            </div>
          </div>

          <div style={{ background: 'rgba(14, 21, 34, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'Space Grotesk' }}>{shippedCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>In Transit</div>
            </div>
          </div>

          <div style={{ background: 'rgba(14, 21, 34, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'Space Grotesk' }}>{deliveredCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Delivered</div>
            </div>
          </div>
        </div>

        {/* Orders Table Card */}
        <div className="admin-table-card">
          <div className="admin-table-toolbar">
            
            {/* Search */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search 
                size={16} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input
                type="text"
                placeholder="Search by ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '9px 14px 9px 38px',
                  fontSize: '0.86rem'
                }}
              />
            </div>

            {/* Filter Chips */}
            <div className="table-filter-chips">
              {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`filter-chip ${statusFilter === st ? 'active' : ''}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer Information</th>
                  <th>Equipment Manifest</th>
                  <th>Date Placed</th>
                  <th>Invoice Total</th>
                  <th>Fulfillment Status</th>
                  <th>Update Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No orders match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>
                        #{order.id}
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                            {(order.customerName || order.shippingAddress?.fullName || 'Alex').charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff' }}>
                              {order.customerName || order.shippingAddress?.fullName || 'Alex Vance'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {order.customerEmail || order.shippingAddress?.city || 'San Francisco, CA'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {order.items?.map((it, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                              <img
                                src={it.image || fallbackGearImg}
                                alt={it.name}
                                style={{ width: '26px', height: '26px', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = fallbackGearImg;
                                }}
                              />
                              <span style={{ color: '#e2e8f0' }}>
                                <strong style={{ color: 'var(--primary)' }}>{it.quantity}x</strong> {it.name?.substring(0, 26)}...
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {order.date || 'Recent'}
                      </td>

                      <td style={{ color: '#ffffff', fontWeight: 800, fontFamily: 'Space Grotesk' }}>
                        ${Number(order.total || order.totalAmount || 0).toLocaleString()}
                      </td>

                      <td>
                        <span className={`status-tag ${order.status || 'Processing'}`}>
                          {order.status || 'Processing'}
                        </span>
                      </td>

                      <td>
                        <select
                          value={order.status || 'Processing'}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            background: 'rgba(11, 16, 26, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOrders;
