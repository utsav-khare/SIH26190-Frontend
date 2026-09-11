import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Search,
  CheckCircle2,
  FileCheck2,
  Settings,
  LogOut,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-filtered navigation: each item declares required permission; if none, visible to all authenticated users
  const allNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cases', label: 'Cases', icon: Briefcase },
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/approvals', label: 'Approvals', icon: CheckCircle2, badge: 8, permission: PERMISSIONS.APPROVE_DOCUMENT },
    { to: '/audit-log', label: 'Audit Log', icon: FileCheck2, permission: PERMISSIONS.VIEW_AUDIT_LOG },
    { to: '/settings', label: 'Settings', icon: Settings, permission: PERMISSIONS.MANAGE_USERS }
  ];

  const navItems = allNavItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(user?.role, item.permission);
  });

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
              className={({ isActive }) => {
                const isCurrent = isActive || (item.to === '/cases' && location.pathname.startsWith('/cases'));
                return `sidebar-item ${isCurrent ? 'active' : ''}`;
              }}
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

