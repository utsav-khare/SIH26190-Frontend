import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import '../styles/auth.css';

export const SetNewPasswordPage = () => {
  const [email, setEmail] = useState('attorney@firm.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({ old: false, next: false, confirm: false });
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage('All password fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setErrorMessage('Password must include a mix of letters, numbers and symbols.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/login'), 2200);
  };

  const renderPasswordInput = (id, placeholder, value, onChange, field) => (
    <div className="input-wrapper">
      <span className="input-icon">
        <Lock size={18} />
      </span>
      <input
        id={id}
        type={showPasswords[field] ? 'text' : 'password'}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        className="input-action-btn"
        onClick={() => toggleVisibility(field)}
        aria-label="Toggle password visibility"
      >
        {showPasswords[field] ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Top Branding */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <KeyRound size={30} />
          </div>
          <h1 className="auth-title">Digilegal Vault</h1>
          <p className="auth-warning-sub">Secure. Private. Protected.</p>
        </div>

        {/* Set New Password Card */}
        <div className="auth-card">
          <Link to="/login" className="form-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '18px', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Back to Log In
          </Link>

          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ color: '#fff', marginBottom: '6px' }}>Password Updated Successfully</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Redirecting you to the secure login...</p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div className="auth-logo-badge" style={{ width: '46px', height: '46px', marginBottom: '10px' }}>
                  <KeyRound size={22} />
                </div>
                <h2 style={{ color: '#f5b726', fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>Set New Password</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  For your security, please enter your old password and choose a new password.
                </p>
              </div>

              {errorMessage && (
                <div className="auth-error-alert">
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="form-group">
                  <label htmlFor="resetEmail" className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <Mail size={18} />
                    </span>
                    <input
                      id="resetEmail"
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="oldPassword" className="form-label">Old Password</label>
                  {renderPasswordInput('oldPassword', 'Enter old password', oldPassword, (e) => setOldPassword(e.target.value), 'old')}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  {renderPasswordInput('newPassword', 'Enter new password', newPassword, (e) => setNewPassword(e.target.value), 'next')}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  {renderPasswordInput('confirmPassword', 'Re-enter new password', confirmPassword, (e) => setConfirmPassword(e.target.value), 'confirm')}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-auth-submit"
                >
                  <KeyRound size={18} />
                  <span>Update Password</span>
                </button>
              </form>

              <div className="mock-credentials-box" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Your password must be at least 8 characters long and include a mix of letters, numbers and symbols.</span>
              </div>
            </>
          )}
        </div>

        {/* Return to Homepage */}
        <Link to="/" className="auth-nav-back">
          <ArrowLeft size={16} />
          Back to Homepage
        </Link>
      </div>

      <footer className="auth-footer">
        <p>© 2026 Digilegal Vault. All rights reserved.</p>
      </footer>
    </div>
  );
};