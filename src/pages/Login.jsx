import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Camera, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { loginSuccess } from '../redux/slices/authSlice';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { login: contextLogin } = useAuth();

  const fromPath = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Email must have a valid format';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const userObj = {
      id: 'usr-1',
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      mobile: '9876543210',
      role: 'user'
    };

    dispatch(loginSuccess(userObj));
    if (contextLogin) contextLogin(email, password);
    navigate(fromPath.startsWith('/admin') ? '/' : fromPath);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-card">
        {/* Header */}
        <div className="auth-header text-center">
          <div className="auth-logo-icon">
            <Camera size={26} color="#ffffff" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to manage your photography gear, cart, and orders.</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form" autoComplete="off">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email">Email Address *</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                id="login-email"
                name="login_email"
                type="email"
                autoComplete="off"
                placeholder="name@creator.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
              />
            </div>
            {errors.email && <span className="field-error"><AlertCircle size={13} /> {errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password">Password *</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                id="login-password"
                name="login_password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }}
              />
              <button
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="field-error"><AlertCircle size={13} /> {errors.password}</span>}
          </div>

          {/* Options: Remember Me & Forgot Password */}
          <div className="auth-options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
            <Link to="/forgot-password" className="forgot-pw-link">
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary auth-submit-btn">
            <span>Sign In</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer text-center">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-switch-link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
