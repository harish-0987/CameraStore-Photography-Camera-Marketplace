import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Ticket, 
  Settings, 
  LogOut, 
  Edit3, 
  Check, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  KeyRound,
  Bell,
  Eye
} from 'lucide-react';
import { logout, updateUser } from '../redux/slices/authSlice';
import { activeCoupons } from '../data/cameraProducts';
import '../styles/login.css';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(state => state.auth);
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);

  const [activeTab, setActiveTab] = useState('profile'); // profile, addresses, coupons, settings
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || 'Alex Vance');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'alex.vance@example.com');
  const [profileMobile, setProfileMobile] = useState(user?.mobile || '9876543210');

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "Primary Studio",
      fullName: "Alex Vance",
      mobile: "9876543210",
      street: "402 Studio Boulevard, Creative District",
      city: "San Francisco",
      state: "California",
      pincode: "94107",
      isDefault: true
    },
    {
      id: 2,
      title: "Home Office",
      fullName: "Alex Vance",
      mobile: "9876543210",
      street: "742 Evergreen Terrace",
      city: "Springfield",
      state: "Oregon",
      pincode: "97477",
      isDefault: false
    }
  ]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ title: '', fullName: '', mobile: '', street: '', city: '', state: '', pincode: '' });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(updateUser({ name: profileName, email: profileEmail, mobile: profileMobile }));
    setIsEditingProfile(false);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newAddr.street && newAddr.city) {
      setAddresses([...addresses, { ...newAddr, id: Date.now(), isDefault: addresses.length === 0 }]);
      setNewAddr({ title: '', fullName: '', mobile: '', street: '', city: '', state: '', pincode: '' });
      setShowAddAddress(false);
    }
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="cart-page-container">
      <div className="container">
        {/* Header */}
        <div className="cart-header-row">
          <div>
            <div className="page-tag"><User size={14} /> CREATOR DASHBOARD</div>
            <h1 className="cart-main-title">My Account & Profile</h1>
            <p className="cart-subtitle">Manage personal information, saved studio addresses, coupons, and orders.</p>
          </div>

          <button className="btn-secondary" onClick={handleLogout} style={{ color: '#ef4444' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="profile-layout-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>
          {/* Left Navigation Sidebar */}
          <aside className="glass-card" style={{ padding: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{user?.name || 'Alex Vance'}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pro Creator Tier</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                className={`profile-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={16} /> Personal Info
              </button>
              <Link to="/orders" className="profile-nav-btn">
                <Package size={16} /> My Orders
              </Link>
              <button
                className={`profile-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <MapPin size={16} /> Saved Addresses
              </button>
              <Link to="/wishlist" className="profile-nav-btn">
                <Heart size={16} /> Wishlist ({wishlistItems.length})
              </Link>
              <button
                className={`profile-nav-btn ${activeTab === 'coupons' ? 'active' : ''}`}
                onClick={() => setActiveTab('coupons')}
              >
                <Ticket size={16} /> Coupons & Vouchers
              </button>
              <button
                className={`profile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={16} /> Account Settings
              </button>
            </div>
          </aside>

          {/* Right Main Content */}
          <main>
            {/* 1. Personal Info Tab */}
            {activeTab === 'profile' && (
              <div className="glass-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>Personal Information</h3>
                  {!isEditingProfile && (
                    <button className="btn-secondary" onClick={() => setIsEditingProfile(true)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      <Edit3 size={14} /> Edit Details
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Mobile Number</label>
                      <input
                        type="tel"
                        value={profileMobile}
                        onChange={(e) => setProfileMobile(e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <button type="submit" className="btn-primary">
                        <Check size={16} /> Save Changes
                      </button>
                      <button type="button" className="btn-secondary" onClick={() => setIsEditingProfile(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</span>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>{user?.name || 'Alex Vance'}</div>
                    </div>
                    <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</span>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>{user?.email || 'alex.vance@example.com'}</div>
                    </div>
                    <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mobile Contact</span>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>{user?.mobile || '+1 (555) 987-6543'}</div>
                    </div>
                    <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Account Status</span>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={16} /> Verified CameraStore Member
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Saved Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="glass-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>Saved Shipping Addresses</h3>
                  <button className="btn-primary" onClick={() => setShowAddAddress(!showAddAddress)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    <Plus size={16} /> Add Address
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ color: '#fff', fontSize: '1rem' }}>New Address Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input placeholder="Address Label (e.g. Studio, Home)" value={newAddr.title} onChange={e => setNewAddr({ ...newAddr, title: e.target.value })} required style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '4px', color: '#fff' }} />
                      <input placeholder="Full Name" value={newAddr.fullName} onChange={e => setNewAddr({ ...newAddr, fullName: e.target.value })} required style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '4px', color: '#fff' }} />
                      <input placeholder="Mobile Number" value={newAddr.mobile} onChange={e => setNewAddr({ ...newAddr, mobile: e.target.value })} required style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '4px', color: '#fff' }} />
                      <input placeholder="City" value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} required style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '4px', color: '#fff' }} />
                      <input placeholder="State" value={newAddr.state} onChange={e => setNewAddr({ ...newAddr, state: e.target.value })} required style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '4px', color: '#fff' }} />
                      <input placeholder="Pincode / Postal" value={newAddr.pincode} onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })} required style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '4px', color: '#fff' }} />
                    </div>
                    <input placeholder="Street Address" value={newAddr.street} onChange={e => setNewAddr({ ...newAddr, street: e.target.value })} required style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '4px', color: '#fff' }} />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Save Address</button>
                      <button type="button" className="btn-secondary" onClick={() => setShowAddAddress(false)} style={{ padding: '8px 16px' }}>Cancel</button>
                    </div>
                  </form>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {addresses.map(addr => (
                    <div key={addr.id} style={{ background: 'var(--bg-input)', border: `1px solid ${addr.isDefault ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', padding: '20px', position: 'relative' }}>
                      {addr.isDefault && (
                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                          DEFAULT
                        </span>
                      )}
                      <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '8px' }}>{addr.title || 'Studio'}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        <strong>{addr.fullName}</strong> • {addr.mobile}<br />
                        {addr.street}<br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        <button className="item-remove-btn" onClick={() => handleDeleteAddress(addr.id)}>
                          <Trash2 size={13} /> Remove Address
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Coupons Tab */}
            {activeTab === 'coupons' && (
              <div className="glass-card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '20px' }}>Active Discount Codes</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {activeCoupons.map(c => (
                    <div key={c.code} style={{ background: 'var(--bg-input)', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{c.code}</span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>ACTIVE</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.description}</p>
                      <Link to="/cart" style={{ display: 'inline-block', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, marginTop: '12px' }}>
                        Use in Shopping Cart →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Settings Tab */}
            {activeTab === 'settings' && (
              <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>Account & Security Settings</h3>
                <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Change Account Password</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Update your secret authentication credentials.</p>
                  </div>
                  <Link to="/forgot-password" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    <KeyRound size={14} /> Update Password
                  </Link>
                </div>
                <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Order & Shipment Notifications</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive email and SMS dispatch tracking updates.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
