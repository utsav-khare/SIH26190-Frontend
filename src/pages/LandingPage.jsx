import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  FolderLock,
  Scale,
  FileCheck2,
  Users2,
  UploadCloud,
  FolderOpen,
  Shield,
  UserCheck,
  Tag,
  ShieldCheck,
  KeyRound,
  FileText,
  Database,
  Share2,
  Play
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AboutModal } from '../components/modals/AboutModal';
import { ContactModal } from '../components/modals/ContactModal';
import { useModal } from '../hooks/useModal';
import '../styles/landing.css';

export const LandingPage = () => {
  const { isOpen: isAboutOpen, openModal: openAbout, closeModal: closeAbout } = useModal();
  const { isOpen: isContactOpen, openModal: openContact, closeModal: closeContact } = useModal();

  return (
    <div className="landing-page-wrapper">
      <Navbar onOpenAbout={openAbout} onOpenContact={openContact} />

      {/* Hero Section */}
      <main id="home">
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">Secure Digital Document Management System</h1>
              <div className="hero-subtitle">for Legal and Investigation Documents</div>
              <div className="hero-divider">
                <Scale size={20} />
              </div>
              <p className="hero-description">
                Digilegal Vault helps legal professionals and investigation teams securely store, manage, access and track sensitive documents with complete confidentiality and control.
              </p>
              <div className="hero-buttons">
                <Link to="/login" className="btn btn-primary btn-lg">
                  <Lock size={18} />
                  LOGIN TO CONTINUE
                </Link>
                <a href="#features" className="btn btn-outline btn-lg">
                  <Play size={16} fill="currentColor" />
                  EXPLORE FEATURES
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <svg className="hero-scene-svg" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#141c2b" />
                      <stop offset="100%" stopColor="#090f1b" />
                    </linearGradient>
                    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3d2112" />
                      <stop offset="50%" stopColor="#693b1d" />
                      <stop offset="100%" stopColor="#2d170a" />
                    </linearGradient>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fce289" />
                      <stop offset="50%" stopColor="#e5b030" />
                      <stop offset="100%" stopColor="#9a6e14" />
                    </linearGradient>
                  </defs>

                  <rect width="600" height="400" fill="url(#bgGrad)" />

                  {/* Bookshelf Backdrop */}
                  <g opacity="0.35">
                    <rect x="30" y="30" width="540" height="15" fill="#2d170a" />
                    <rect x="30" y="140" width="540" height="15" fill="#2d170a" />
                    <rect x="50" y="45" width="22" height="95" fill="#881337" rx="2" />
                    <rect x="74" y="50" width="28" height="90" fill="#1e3a8a" rx="2" />
                    <rect x="104" y="42" width="24" height="98" fill="#14532d" rx="2" />
                    <rect x="130" y="48" width="30" height="92" fill="#78350f" rx="2" />
                    <rect x="162" y="55" width="18" height="85" fill="#312e81" rx="2" />
                    <rect x="380" y="45" width="26" height="95" fill="#831843" rx="2" />
                    <rect x="408" y="40" width="28" height="100" fill="#1e3a8a" rx="2" />
                    <rect x="438" y="50" width="22" height="90" fill="#14532d" rx="2" />
                    <rect x="462" y="44" width="32" height="96" fill="#78350f" rx="2" />
                  </g>

                  {/* Wooden Table Surface */}
                  <rect x="0" y="270" width="600" height="130" fill="url(#woodGrad)" />
                  <rect x="0" y="270" width="600" height="4" fill="#a15829" opacity="0.5" />

                  {/* Stack of Legal Documents */}
                  <g transform="translate(180, 195)">
                    <rect x="4" y="40" width="160" height="45" rx="3" fill="#cbd5e1" />
                    <rect x="2" y="30" width="162" height="45" rx="3" fill="#e2e8f0" />
                    <rect x="0" y="20" width="164" height="45" rx="3" fill="#f8fafc" />
                    <rect x="35" y="32" width="90" height="22" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                    <text x="80" y="47" fill="#713f12" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1">CONFIDENTIAL</text>
                  </g>

                  {/* Golden Scales of Justice */}
                  <g transform="translate(480, 140)">
                    <rect x="-4" y="10" width="8" height="145" fill="url(#goldGrad)" rx="3" />
                    <polygon points="0,0 -8,14 8,14" fill="url(#goldGrad)" />
                    <rect x="-85" y="18" width="170" height="6" fill="url(#goldGrad)" rx="3" />
                    <circle cx="0" cy="21" r="6" fill="url(#goldGrad)" />
                    
                    {/* Left Pan */}
                    <line x1="-80" y1="21" x2="-100" y2="70" stroke="#ca8a04" strokeWidth="1.5" />
                    <line x1="-80" y1="21" x2="-60" y2="70" stroke="#ca8a04" strokeWidth="1.5" />
                    <path d="M-105,70 Q-80,85 -55,70 Z" fill="url(#goldGrad)" />

                    {/* Right Pan */}
                    <line x1="80" y1="21" x2="60" y2="80" stroke="#ca8a04" strokeWidth="1.5" />
                    <line x1="80" y1="21" x2="100" y2="80" stroke="#ca8a04" strokeWidth="1.5" />
                    <path d="M55,80 Q80,95 105,80 Z" fill="url(#goldGrad)" />

                    {/* Base */}
                    <path d="M-30,155 L30,155 L20,145 L-20,145 Z" fill="url(#goldGrad)" />
                  </g>

                  {/* Judge's Gavel */}
                  <g transform="translate(410, 245)">
                    <rect x="0" y="24" width="45" height="10" fill="#451a03" rx="3" />
                    <rect x="5" y="0" width="34" height="24" fill="#78350f" rx="3" />
                    <rect x="5" y="4" width="34" height="3" fill="#ca8a04" />
                    <rect x="5" y="17" width="34" height="3" fill="#ca8a04" />
                    <line x1="22" y1="12" x2="65" y2="-18" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Core Feature Pillars (Matching Image 1) */}
        <section id="features" className="features-section">
          <div className="container">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-card-icon">
                  <Lock size={22} />
                </div>
                <h3 className="feature-card-title">Secure Storage</h3>
                <p className="feature-card-desc">
                  Security store sensitive legal and investigation documents with military-grade encryption.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">
                  <FolderLock size={22} />
                </div>
                <h3 className="feature-card-title">Document Management</h3>
                <p className="feature-card-desc">
                  Organize, categorize, search and manage documents efficiently with smart filters.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">
                  <Scale size={22} />
                </div>
                <h3 className="feature-card-title">Case Management</h3>
                <p className="feature-card-desc">
                  Link documents and evidence with specific cases and keep everything connected.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">
                  <FileCheck2 size={22} />
                </div>
                <h3 className="feature-card-title">Audit Trail</h3>
                <p className="feature-card-desc">
                  Track who accessed, uploaded, modified or shared documents with a detailed audit log.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">
                  <Users2 size={22} />
                </div>
                <h3 className="feature-card-title">Access Control</h3>
                <p className="feature-card-desc">
                  Ensure only authorized users can view or edit sensitive information with role-based access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How Digilegal Vault Works (5-Step Stepper Flow) */}
        <section id="workflow" className="workflow-section">
          <div className="container">
            <h2 className="section-title">How Digilegal Vault Works</h2>
            <div className="section-divider">
              <Scale size={18} />
            </div>

            <div className="workflow-steps">
              <div className="workflow-step-item">
                <div className="workflow-step-node">
                  <UploadCloud size={28} />
                </div>
                <span className="workflow-step-num">01</span>
                <h4 className="workflow-step-title">Upload</h4>
                <p className="workflow-step-desc">Upload legal or investigation documents securely.</p>
              </div>

              <div className="workflow-step-item">
                <div className="workflow-step-node">
                  <FolderOpen size={28} />
                </div>
                <span className="workflow-step-num">02</span>
                <h4 className="workflow-step-title">Organize</h4>
                <p className="workflow-step-desc">Categorize and link documents to cases and tags.</p>
              </div>

              <div className="workflow-step-item">
                <div className="workflow-step-node">
                  <Lock size={28} />
                </div>
                <span className="workflow-step-num">03</span>
                <h4 className="workflow-step-title">Secure</h4>
                <p className="workflow-step-desc">We encrypt and save your documents safely.</p>
              </div>

              <div className="workflow-step-item">
                <div className="workflow-step-node">
                  <UserCheck size={28} />
                </div>
                <span className="workflow-step-num">04</span>
                <h4 className="workflow-step-title">Access</h4>
                <p className="workflow-step-desc">Authorized users access what they are permitted to.</p>
              </div>

              <div className="workflow-step-item">
                <div className="workflow-step-node">
                  <Tag size={28} />
                </div>
                <span className="workflow-step-num">05</span>
                <h4 className="workflow-step-title">Track</h4>
                <p className="workflow-step-desc">All actions are logged for transparency and accountability.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security You Can Rely On Section */}
        <section id="security" className="security-section">
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center' }}>Security You Can Rely On</h2>
            <div className="section-divider">
              <Scale size={18} />
            </div>

            <div className="security-grid">
              <div className="security-visual">
                <div className="security-badge-box">
                  <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    <defs>
                      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                      <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <rect width="400" height="320" fill="#070e1b" />
                    <circle cx="200" cy="150" r="110" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="200" cy="150" r="85" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.4" />
                    
                    {/* Glowing Cyber Shield */}
                    <g filter="url(#neonGlow)">
                      <path
                        d="M200,60 L260,90 L260,170 C260,215 200,245 200,245 C200,245 140,215 140,170 L140,90 Z"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3.5"
                      />
                    </g>
                    {/* Keyhole */}
                    <circle cx="200" cy="135" r="14" fill="#38bdf8" />
                    <polygon points="194,135 206,135 209,175 191,175" fill="#38bdf8" />
                    <text x="200" y="275" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle" letterSpacing="3">CYBERSECURITY GUARANTEED</text>
                  </svg>
                </div>
              </div>

              <div className="security-pillars-list">
                <div className="security-pillar-item">
                  <ShieldCheck size={24} className="security-pillar-icon" />
                  <div>
                    <h4 className="security-pillar-title">End-to-End Encryption</h4>
                    <p className="security-pillar-desc">Your data is encrypted at rest and in transit.</p>
                  </div>
                </div>

                <div className="security-pillar-item">
                  <Users2 size={24} className="security-pillar-icon" />
                  <div>
                    <h4 className="security-pillar-title">Role-Based Access</h4>
                    <p className="security-pillar-desc">Granular permissions for different roles.</p>
                  </div>
                </div>

                <div className="security-pillar-item">
                  <FileText size={24} className="security-pillar-icon" />
                  <div>
                    <h4 className="security-pillar-title">Audit Logging</h4>
                    <p className="security-pillar-desc">Every activity is recorded and tamper-proof.</p>
                  </div>
                </div>

                <div className="security-pillar-item">
                  <KeyRound size={24} className="security-pillar-icon" />
                  <div>
                    <h4 className="security-pillar-title">Multi-Factor Authentication</h4>
                    <p className="security-pillar-desc">Extra layer of protection for authorized users.</p>
                  </div>
                </div>

                <div className="security-pillar-item">
                  <Database size={24} className="security-pillar-icon" />
                  <div>
                    <h4 className="security-pillar-title">Regular Backups</h4>
                    <p className="security-pillar-desc">Your data is backed up securely and regularly.</p>
                  </div>
                </div>

                <div className="security-pillar-item">
                  <Share2 size={24} className="security-pillar-icon" />
                  <div>
                    <h4 className="security-pillar-title">Secure Sharing</h4>
                    <p className="security-pillar-desc">Share documents securely with access control.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modals */}
      <AboutModal isOpen={isAboutOpen} onClose={closeAbout} />
      <ContactModal isOpen={isContactOpen} onClose={closeContact} />
    </div>
  );
};

