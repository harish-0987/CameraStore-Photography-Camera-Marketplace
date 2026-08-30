import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { loginSuccess } from '../redux/slices/authSlice';
import '../styles/login.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Email must have a valid format';
    }
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      errs.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Password confirmation is required';
    } else if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const userObj = {
      id: `usr-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      role: 'user'
    };

    dispatch(loginSuccess(userObj));
    navigate('/');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-card">
        <div className="auth-header text-center">
          <div className="auth-logo-icon">
            <Camera size={26} color="#ffffff" />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the CameraStore creator community to unlock trade discounts.</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form" autoComplete="off">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="reg-name">Full Name *</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input
                id="reg-name"
                type="text"
                name="name"
                autoComplete="off"
                placeholder="e.g. Alex Vance"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            {errors.name && <span className="field-error"><AlertCircle size={13} /> {errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email">Email Address *</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                id="reg-email"
                type="email"
                name="email"
                autoComplete="new-password"
                placeholder="name@creator.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            {errors.email && <span className="field-error"><AlertCircle size={13} /> {errors.email}</span>}
          </div>

          {/* Mobile */}
          <div className="form-group">
            <label htmlFor="reg-mobile">Mobile Number *</label>
            <div className="input-with-icon">
              <Phone size={18} className="field-icon" />
              <input
                id="reg-mobile"
                type="tel"
                name="mobile"
                autoComplete="off"
                placeholder="10-digit phone number"
                value={formData.mobile}
                onChange={handleInputChange}
              />
            </div>
            {errors.mobile && <span className="field-error"><AlertCircle size={13} /> {errors.mobile}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password">Password *</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleInputChange}
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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reg-confirm-password">Confirm Password *</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                id="reg-confirm-password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            {errors.confirmPassword && <span className="field-error"><AlertCircle size={13} /> {errors.confirmPassword}</span>}
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary auth-submit-btn">
            <span>Register Account</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer text-center">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-switch-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
