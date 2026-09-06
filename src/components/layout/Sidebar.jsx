import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Search,
  CheckCircle2,
  FileCheck2,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cases', label: 'Cases', icon: Briefcase },
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/approvals', label: 'Approvals', icon: CheckCircle2, badge: 8 },
    { to: '/audit-log', label: 'Audit Log', icon: FileCheck2 },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="brand-logo">
          <div className="brand-logo-icon" style={{ width: '36px', height: '36px' }}>
            <Shield size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-title" style={{ fontSize: '1.1rem' }}>Digilegal Vault</span>
          </div>
        </NavLink>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} className="sidebar-icon" />
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

