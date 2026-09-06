import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';
import '../styles/auth.css';

export const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsSending(true);
    // Mock reset request — real API integration comes in later steps
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setTimeout(() => navigate('/set-new-password'), 1800);
    }, 900);
  };

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

        {/* Reset Password Card */}
        <div className="auth-card">
          <Link to="/login" className="form-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '18px', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Back to Log In
          </Link>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ color: '#fff', marginBottom: '6px' }}>Reset Link Dispatched</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                A one-time reset token was sent to <strong style={{ color: '#f5b726' }}>{email}</strong>.
                Redirecting you to set your new password...
              </p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div className="auth-logo-badge" style={{ width: '46px', height: '46px', marginBottom: '10px' }}>
                  <KeyRound size={22} />
                </div>
                <h2 style={{ color: '#f5b726', fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>Reset Password</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Enter your registered email address and we will dispatch a one-time reset token to your clearance inbox.
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
                      placeholder={APP_CONFIG.demoCredentials.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-auth-submit"
                  disabled={isSending}
                >
                  {isSending ? (
                    <span>Dispatching Reset Token...</span>
                  ) : (
                    <>
                      <KeyRound size={18} />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mock-credentials-box">
                <strong>Mock mode:</strong> any registered-format email is accepted; the reset flow continues to the Set New Password screen.
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