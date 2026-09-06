import React, { useState } from 'react';
import { Calendar, Bell, ChevronDown, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Topbar = () => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Formatted date matching mockup: "Thursday, 29 May 2026"
  const todayFormatted = 'Thursday, 29 May 2026';

  return (
    <header className="topbar">
      {/* Date */}
      <div className="topbar-date">
        <Calendar size={16} />
        <span>{todayFormatted}</span>
      </div>

      {/* Notifications */}
      <button className="topbar-notification-btn" aria-label="Notifications">
        <Bell size={20} />
        <span className="notification-count">3</span>
      </button>

      {/* User Profile */}
      <div
        className="topbar-user"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title="View Profile Details"
      >
        <div className="user-avatar-circle">
          <User size={18} />
        </div>
        <div className="user-details">
          <span className="user-name">{user?.name || 'Officer'}</span>
          <span className="user-role">{user?.department || 'Legal Department'}</span>
        </div>
        <ChevronDown size={16} color="#64748b" />
      </div>
    </header>
  );
};

