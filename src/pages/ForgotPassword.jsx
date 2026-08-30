import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  KeyRound, 
  Mail, 
  ShieldCheck, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle 
} from 'lucide-react';
import '../styles/login.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Workflow steps: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid registered email');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.trim().length < 4) {
      setError('Please enter the 6-digit verification OTP (or test OTP 123456)');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setStep(4);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-card">
        {/* Step 1: Enter Email */}
        {step === 1 && (
          <div>
            <div className="auth-header text-center">
              <div className="auth-logo-icon">
                <KeyRound size={26} color="#ffffff" />
              </div>
              <h1 className="auth-title">Password Recovery</h1>
              <p className="auth-subtitle">Step 1: Enter your registered email address to receive an instant verification code.</p>
            </div>

            {error && <div className="field-error" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} /> {error}</div>}

            <form onSubmit={handleVerifyEmail} className="auth-form" autoComplete="off">
              <div className="form-group">
                <label>Registered Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="field-icon" />
                  <input
                    type="email"
                    autoComplete="off"
                    placeholder="name@creator.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary auth-submit-btn">
                <span>Verify Email & Send OTP</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <div>
            <div className="auth-header text-center">
              <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #38bdf8, #0284c7)' }}>
                <ShieldCheck size={26} color="#ffffff" />
              </div>
              <h1 className="auth-title">Verify OTP Code</h1>
              <p className="auth-subtitle">Step 2: We sent a 6-digit security code to <strong>{email}</strong>.</p>
            </div>

            <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#bae6fd', fontSize: '0.82rem', marginBottom: '16px', textAlign: 'center' }}>
              💡 Simulated code: Enter <strong>123456</strong> or any 6 digits
            </div>

            {error && <div className="field-error" style={{ marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleVerifyOtp} className="auth-form" autoComplete="off">
              <div className="form-group">
                <label>6-Digit Verification Code</label>
                <input
                  type="text"
                  autoComplete="one-time-code"
                  placeholder="e.g. 123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.2em', fontWeight: 'bold' }}
                  required
                />
              </div>

              <button type="submit" className="btn-primary auth-submit-btn">
                <span>Confirm Code</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Enter New Password */}
        {step === 3 && (
          <div>
            <div className="auth-header text-center">
              <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Lock size={26} color="#ffffff" />
              </div>
              <h1 className="auth-title">Set New Password</h1>
              <p className="auth-subtitle">Step 3: Enter your new password for account <strong>{email}</strong>.</p>
            </div>

            {error && <div className="field-error" style={{ marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleUpdatePassword} className="auth-form" autoComplete="off">
              <div className="form-group">
                <label>New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary auth-submit-btn">
                <span>Update Password</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Success Confirmation */}
        {step === 4 && (
          <div className="text-center">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={36} color="#10b981" />
            </div>
            <h1 className="auth-title">Password Reset Complete!</h1>
            <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
              Your account password has been updated securely. You can now sign in with your new credentials.
            </p>
            <Link to="/login" className="btn-primary" style={{ width: '100%' }}>
              Proceed to Sign In <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {step < 4 && (
          <div className="auth-footer text-center" style={{ marginTop: '20px' }}>
            <Link to="/login" className="auth-switch-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
