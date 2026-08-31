import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowLeft
} from 'lucide-react';
import { loginSuccess } from '../redux/slices/authSlice';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';
import '../styles/admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login: contextLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter administrator email address');
      return;
    }
    if (!password) {
      setError('Please enter password');
      return;
    }

    setLoading(true);

    // Validate admin credentials
    if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'root@camerastore.com') {
      const adminUser = {
        id: 'usr-admin',
        name: 'Store Administrator',
        email: email.trim(),
        mobile: '9998887776',
        role: 'admin'
      };

      dispatch(loginSuccess(adminUser));
      if (contextLogin) {
        contextLogin(email.trim(), password);
      }
      setLoading(false);
      navigate('/admin');
    } else {
      setLoading(false);
      setError('Access Denied: Only authorized administrator emails are permitted.');
    }
  };

  return (
    <div className="auth-page-container" style={{ background: '#060911', position: 'relative', overflow: 'hidden' }}>
      
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }}></div>

      <div className="auth-card" style={{ maxWidth: '440px', background: 'rgba(14, 21, 34, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '36px', position: 'relative', zIndex: 1, boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(249, 115, 22, 0.15)' }}>
        
        {/* Pulsing Security Shield */}
        <div className="admin-login-shield">
          <ShieldCheck size={32} />
        </div>

        <div className="auth-header text-center" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Admin Portal Access
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Secure entry for store administrators & catalog controllers
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '18px',
            fontSize: '0.8rem',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleAdminSubmit} className="auth-form" autoComplete="off">
          <div className="form-group">
            <label htmlFor="admin-email" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>Admin Email</label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" style={{ color: 'var(--text-muted)' }} />
              <input
                id="admin-email"
                name="admin_portal_email"
                type="email"
                autoComplete="off"
                placeholder="admin@camerastore.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-password" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>Admin Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" style={{ color: 'var(--text-muted)' }} />
              <input
                id="admin-password"
                name="admin_portal_password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
              <button
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={loading}
            style={{ marginTop: '8px', height: '46px', fontSize: '0.92rem' }}
          >
            <span>{loading ? 'Authenticating Security Token...' : 'Authorize Admin Session'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer text-center" style={{ marginTop: '22px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
