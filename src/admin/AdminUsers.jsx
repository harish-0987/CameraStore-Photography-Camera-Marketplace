import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Users, CheckCircle, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const AdminUsers = () => {
  const { registeredUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = registeredUsers.filter(u => {
    const matchesSearch = 
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || (u.role || 'user') === roleFilter;
    return matchesSearch && matchesRole;
  });

  const adminCount = registeredUsers.filter(u => u.role === 'admin').length;
  const userCount = registeredUsers.length - adminCount;

  return (
    <div className="admin-layout">
      <div className="container">
        
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title-group">
            <div className="admin-badge-pill">
              <Users size={12} /> Membership Directory
            </div>
            <h1 className="admin-title">Photographers & Administrators</h1>
            <p className="admin-subtitle">Authenticated user accounts and permissions across the platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <Link to="/admin" className="admin-tab">Dashboard</Link>
          <Link to="/admin/products" className="admin-tab">Products</Link>
          <Link to="/admin/orders" className="admin-tab">Orders</Link>
          <Link to="/admin/users" className="admin-tab active">
            Users <span className="tab-counter">{registeredUsers.length}</span>
          </Link>
        </div>

        {/* User Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(14, 21, 34, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk' }}>{registeredUsers.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Accounts</div>
            </div>
          </div>

          <div style={{ background: 'rgba(14, 21, 34, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'Space Grotesk' }}>{adminCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>System Admins</div>
            </div>
          </div>

          <div style={{ background: 'rgba(14, 21, 34, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'Space Grotesk' }}>{userCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pro Photographers</div>
            </div>
          </div>
        </div>

        {/* Users Table Card */}
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
                placeholder="Search users by name or email..."
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
              <button
                onClick={() => setRoleFilter('All')}
                className={`filter-chip ${roleFilter === 'All' ? 'active' : ''}`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleFilter('admin')}
                className={`filter-chip ${roleFilter === 'admin' ? 'active' : ''}`}
              >
                Admins
              </button>
              <button
                onClick={() => setRoleFilter('user')}
                className={`filter-chip ${roleFilter === 'user' ? 'active' : ''}`}
              >
                Photographers
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Contact Email</th>
                  <th>Access Role</th>
                  <th>Account Created</th>
                  <th>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No user accounts found matching your query.
                    </td>
                  </tr>
                ) : (
                  filtered.map(u => (
                    <tr key={u.id || u.email}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: u.role === 'admin' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                            border: `1px solid ${u.role === 'admin' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: u.role === 'admin' ? '#f59e0b' : '#38bdf8'
                          }}>
                            {u.role === 'admin' ? <Shield size={18} /> : <User size={18} />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff' }}>{u.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: #{u.id || 'usr-gen'}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ color: '#e2e8f0' }}>{u.email}</td>

                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          background: u.role === 'admin' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: u.role === 'admin' ? '#f59e0b' : '#38bdf8',
                          border: `1px solid ${u.role === 'admin' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`
                        }}>
                          {u.role === 'admin' ? '⚡ ADMINISTRATOR' : '📷 PHOTOGRAPHER'}
                        </span>
                      </td>

                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {u.joined || 'Jan 15, 2025'}
                      </td>

                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#34d399',
                          fontWeight: 700,
                          fontSize: '0.78rem'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
                          Active & Verified
                        </span>
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

export default AdminUsers;
