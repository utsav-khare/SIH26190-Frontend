import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('attorney@firm.com');
  const [password, setPassword] = useState('vault2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify clearance credentials.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Top Branding & Warning */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Shield size={34} />
          </div>
          <h1 className="auth-title">Digilegal Vault</h1>
          <p className="auth-warning">Access restricted to legal authorities only.</p>
          <p className="auth-warning-sub">Unauthorized access is monitored and logged.</p>
        </div>

        {/* Authentication Card */}
        <div className="auth-card">
          {errorMessage && (
            <div className="auth-error-alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form" noValidate>
            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="authEmail" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="authEmail"
                  type="email"
                  className="form-input"
                  placeholder="attorney@firm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="authPassword" className="form-label">
                  Password
                </label>
                <Link to="/reset-password" className="form-link">
                  Reset Password
                </Link>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="authPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Authenticate Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block btn-auth-submit"
              disabled={loading}
            >
              {loading ? (
                <span>Authenticating Clearance...</span>
              ) : (
                <>
                  <ArrowRight size={18} />
                  <span>Authenticate</span>
                </>
              )}
            </button>
          </form>

          {/* Mock Credentials Box */}
          <div className="mock-credentials-box">
            <strong>Demo Mock Credentials:</strong><br />
            Email: <code>attorney@firm.com</code><br />
            Password: <code>vault2026</code>
          </div>
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

