import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Menu, X } from 'lucide-react';

export const Navbar = ({ onOpenAbout, onOpenContact }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="brand-logo" aria-label="Digilegal Vault Homepage">
          <div className="brand-logo-icon">
            <Shield size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Digilegal Vault</span>
            <span className="brand-tagline">SECURE. MANAGE. PROTECT.</span>
          </div>
        </Link>

        <nav>
          <ul className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
            <li><a href="#home" className="nav-link active">Home</a></li>
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#workflow" className="nav-link">Workflow</a></li>
            <li><a href="#security" className="nav-link">Security</a></li>
            <li>
              <button 
                type="button" 
                onClick={onOpenAbout} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
              >
                About Us
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={onOpenContact} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
              >
                Contact Us
              </button>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-primary btn-sm">
            <Lock size={15} />
            LOGIN
          </Link>
          <button 
            className="nav-toggle" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

