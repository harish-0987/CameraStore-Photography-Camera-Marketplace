import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Plus, 
  ArrowUpRight, 
  LogOut, 
  Activity, 
  Clock, 
  Shield, 
  TrendingUp, 
  Layers, 
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import '../styles/admin.css';

const AdminDashboard = () => {
  const { products, orders } = useCart();
  const { registeredUsers, logout: contextLogout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Real-time Clock State
  const [time, setTime] = useState(new Date());
  const [chartPeriod, setChartPeriod] = useState('7d');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || order.totalAmount || 0), 0);

  // Category counts
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const totalProducts = products.length || 1;

  // Low stock products
  const lowStockCount = products.filter(p => Number(p.stock) < 10).length;

  const handleAdminLogout = () => {
    dispatch(logout());
    if (contextLogout) contextLogout();
    navigate('/');
  };

  // Mock 7-day sales flow for chart visualization
  const weeklySalesData = [
    { day: 'Mon', amount: 4850, orders: 4, height: '48%' },
    { day: 'Tue', amount: 7200, orders: 7, height: '68%' },
    { day: 'Wed', amount: 3900, orders: 3, height: '38%' },
    { day: 'Thu', amount: 8950, orders: 9, height: '84%' },
    { day: 'Fri', amount: 11200, orders: 12, height: '100%' },
    { day: 'Sat', amount: 9800, orders: 10, height: '88%' },
    { day: 'Sun', amount: 6400, orders: 6, height: '62%' },
  ];

  return (
    <div className="admin-layout">
      <div className="container">
        
        {/* Top System Status Bar */}
        <div className="admin-top-bar">
          <div className="admin-sys-status">
            <div className="status-radar">
              <span className="radar-dot"></span>
              <span>PRO CONTROL ENGINE ONLINE</span>
            </div>
            <div className="admin-clock">
              <Clock size={14} color="#38bdf8" />
              <span>{time.toLocaleTimeString()} • {time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="admin-top-actions">
            <Link to="/admin/add-product" className="btn-primary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
              <Plus size={15} /> Add Equipment
            </Link>
            <button onClick={handleAdminLogout} className="btn-secondary" style={{ padding: '7px 12px', fontSize: '0.82rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>

        {/* Header Title */}
        <div className="admin-header">
          <div className="admin-title-group">
            <div className="admin-badge-pill">
              <Sparkles size={12} /> Pro Studio Admin Console
            </div>
            <h1 className="admin-title">CameraStore Control Panel</h1>
            <p className="admin-subtitle">Live analytics, equipment catalog monitoring, customer database & fulfillment status.</p>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-nav-tabs">
          <Link to="/admin" className="admin-tab active">
            <Activity size={16} /> Dashboard
          </Link>
          <Link to="/admin/products" className="admin-tab">
            <Package size={16} /> Inventory <span className="tab-counter">{products.length}</span>
          </Link>
          <Link to="/admin/orders" className="admin-tab">
            <ShoppingBag size={16} /> Orders <span className="tab-counter">{orders.length}</span>
          </Link>
          <Link to="/admin/users" className="admin-tab">
            <Users size={16} /> Customers <span className="tab-counter">{registeredUsers.length}</span>
          </Link>
        </div>

        {/* 4 Glowing Stat Metric Cards with Micro-Sparklines */}
        <div className="stat-grid">
          {/* 1. Products */}
          <div className="stat-card-pro" style={{ '--stat-glow-color': 'var(--primary)', '--stat-halo': 'rgba(249, 115, 22, 0.25)' }}>
            <div className="stat-card-top">
              <div className="stat-icon-wrap" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary)', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                <Package size={22} />
              </div>
              <div className="stat-trend-badge">
                <TrendingUp size={12} /> +12% MoM
              </div>
            </div>
            <div>
              <div className="stat-num">{products.length}</div>
              <div className="stat-label">Active Equipment</div>
            </div>
            <div className="stat-sparkline">
              <div className="spark-bar" style={{ height: '40%' }}></div>
              <div className="spark-bar" style={{ height: '65%' }}></div>
              <div className="spark-bar" style={{ height: '50%' }}></div>
              <div className="spark-bar" style={{ height: '80%' }}></div>
              <div className="spark-bar active" style={{ height: '100%' }}></div>
            </div>
          </div>

          {/* 2. Revenue */}
          <div className="stat-card-pro" style={{ '--stat-glow-color': '#10b981', '--stat-halo': 'rgba(16, 185, 129, 0.25)' }}>
            <div className="stat-card-top">
              <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <DollarSign size={22} />
              </div>
              <div className="stat-trend-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <TrendingUp size={12} /> +24.8% YoY
              </div>
            </div>
            <div>
              <div className="stat-num">₹{totalRevenue.toLocaleString()}</div>
              <div className="stat-label">Gross Revenue</div>
            </div>
            <div className="stat-sparkline">
              <div className="spark-bar" style={{ height: '55%' }}></div>
              <div className="spark-bar" style={{ height: '40%' }}></div>
              <div className="spark-bar" style={{ height: '75%' }}></div>
              <div className="spark-bar" style={{ height: '85%' }}></div>
              <div className="spark-bar active" style={{ height: '100%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
            </div>
          </div>

          {/* 3. Orders */}
          <div className="stat-card-pro" style={{ '--stat-glow-color': '#38bdf8', '--stat-halo': 'rgba(56, 189, 248, 0.25)' }}>
            <div className="stat-card-top">
              <div className="stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <ShoppingBag size={22} />
              </div>
              <div className="stat-trend-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                <TrendingUp size={12} /> +18.2%
              </div>
            </div>
            <div>
              <div className="stat-num">{orders.length}</div>
              <div className="stat-label">Orders Processed</div>
            </div>
            <div className="stat-sparkline">
              <div className="spark-bar" style={{ height: '45%' }}></div>
              <div className="spark-bar" style={{ height: '60%' }}></div>
              <div className="spark-bar" style={{ height: '70%' }}></div>
              <div className="spark-bar" style={{ height: '60%' }}></div>
              <div className="spark-bar active" style={{ height: '90%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}></div>
            </div>
          </div>

          {/* 4. Users */}
          <div className="stat-card-pro" style={{ '--stat-glow-color': '#a855f7', '--stat-halo': 'rgba(168, 85, 247, 0.25)' }}>
            <div className="stat-card-top">
              <div className="stat-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <Users size={22} />
              </div>
              <div className="stat-trend-badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                <TrendingUp size={12} /> +9.4%
              </div>
            </div>
            <div>
              <div className="stat-num">{registeredUsers.length}</div>
              <div className="stat-label">Active Photographers</div>
            </div>
            <div className="stat-sparkline">
              <div className="spark-bar" style={{ height: '30%' }}></div>
              <div className="spark-bar" style={{ height: '50%' }}></div>
              <div className="spark-bar" style={{ height: '65%' }}></div>
              <div className="spark-bar" style={{ height: '80%' }}></div>
              <div className="spark-bar active" style={{ height: '95%', background: '#a855f7', boxShadow: '0 0 8px #a855f7' }}></div>
            </div>
          </div>
        </div>

        {/* Analytics 2-Column Section: Chart + Category Breakdown */}
        <div className="dashboard-analytics-grid">
          
          {/* Revenue & Flow Interactive Visualizer */}
          <div className="analytics-card">
            <div className="analytics-header">
              <div>
                <div className="analytics-title">
                  <TrendingUp size={18} color="var(--primary)" /> Revenue & Flow Trajectory
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Interactive weekly volume and transaction pacing</p>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  onClick={() => setChartPeriod('7d')}
                  className={`filter-chip ${chartPeriod === '7d' ? 'active' : ''}`}
                >
                  7 Days
                </button>
                <button 
                  onClick={() => setChartPeriod('30d')}
                  className={`filter-chip ${chartPeriod === '30d' ? 'active' : ''}`}
                >
                  30 Days
                </button>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="chart-visual-container">
              {weeklySalesData.map((item, idx) => (
                <div key={idx} className={`chart-col ${idx % 2 === 1 ? 'cyan' : ''}`}>
                  <div className="chart-tooltip">
                    ${item.amount.toLocaleString()} ({item.orders} orders)
                  </div>
                  <div className="chart-bar-wrap">
                    <div className="chart-bar-fill" style={{ height: item.height }}></div>
                  </div>
                  <span className="chart-day-label">{item.day}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary)' }}></span> Direct Sales
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#38bdf8' }}></span> Pro Cine Bundles
                </span>
              </div>
              <span style={{ color: '#34d399', fontWeight: 700 }}>● Peak Pacing: ₹11,200 (Friday)</span>
            </div>
          </div>

          {/* Category Share Distribution */}
          <div className="analytics-card">
            <div className="analytics-header">
              <div>
                <div className="analytics-title">
                  <Layers size={18} color="#38bdf8" /> Catalog Allocation
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Inventory distribution across categories</p>
              </div>
            </div>

            <div className="category-progress-list">
              {[
                { name: 'Cameras', count: categoryCounts['Cameras'] || 0, color: 'var(--primary)' },
                { name: 'Lenses', count: categoryCounts['Lenses'] || 0, color: '#38bdf8' },
                { name: 'Lighting', count: categoryCounts['Lighting'] || 0, color: '#f59e0b' },
                { name: 'Tripods & Gimbals', count: categoryCounts['Tripods'] || 0, color: '#10b981' },
                { name: 'Bags & Accessories', count: (categoryCounts['Bags'] || 0) + (categoryCounts['Accessories'] || 0), color: '#a855f7' },
              ].map((cat, idx) => {
                const percent = Math.round((cat.count / totalProducts) * 100);
                return (
                  <div key={idx} className="cat-progress-item">
                    <div className="cat-progress-meta">
                      <span>{cat.name}</span>
                      <span style={{ color: '#ffffff' }}>{cat.count} units ({percent}%)</span>
                    </div>
                    <div className="cat-progress-bar">
                      <div 
                        className="cat-progress-fill" 
                        style={{ width: `${percent}%`, background: cat.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stock Warning Pill */}
            {lowStockCount > 0 && (
              <div style={{ marginTop: '20px', padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#f87171' }}>
                <AlertTriangle size={16} />
                <span><strong>{lowStockCount} items</strong> running critically low on warehouse stock.</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="admin-table-card">
          <div className="admin-table-toolbar">
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 700 }}>Recent Equipment Transactions</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Latest checkout orders requiring processing or shipping</p>
            </div>
            <Link to="/admin/orders" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              View All Orders <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Profile</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Fulfillment Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>
                      #{o.id}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>
                          {(o.customerName || o.shippingAddress?.fullName || 'Alex').charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>
                            {o.customerName || o.shippingAddress?.fullName || 'Alex Vance'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {o.customerEmail || 'alex.vance@studio.pro'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {o.date || 'Recent'}
                    </td>
                    <td style={{ color: '#ffffff', fontWeight: 800, fontFamily: 'Space Grotesk' }}>
                      ${Number(o.total || o.totalAmount || 0).toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-tag ${o.status || 'Delivered'}`}>
                        {o.status || 'Delivered'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
