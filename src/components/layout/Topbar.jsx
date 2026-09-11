import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, User, Award, Landmark, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Topbar = () => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Formatted date matching mockup: "Thursday, 29 May 2026"
  const todayFormatted = 'Thursday, 29 May 2026';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const officerName = user?.name || 'Aarav Sharma';
  const officerEmail = user?.email || 'aarav.sharma@digilegalworld.com';
  const officerRank = 'Senior Legal Officer';
  const officerDept = user?.department || 'Legal Department';

  return (
    <header className="topbar">
      {/* Date */}
      <div className="topbar-date">
        <Calendar size={16} />
        <span>{todayFormatted}</span>
      </div>

      {/* User Profile Trigger & Popup */}
      <div className="topbar-user-container" ref={dropdownRef} style={{ position: 'relative' }}>
        <div
          className="topbar-user"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          title="View Profile Details"
        >
          <div className="user-avatar-circle">
            <User size={18} />
          </div>
          <div className="user-details">
            <span className="user-name">{officerName}</span>
            <span className="user-role">{officerDept}</span>
          </div>
          {dropdownOpen ? <ChevronUp size={16} color="#cca245" /> : <ChevronDown size={16} color="#64748b" />}
        </div>

        {/* Profile Card Popup */}
        {dropdownOpen && (
          <div className="officer-profile-dropdown-card">
            <div className="officer-profile-card-header">
              <div className="officer-profile-avatar-circle">
                <User size={24} color="#cca245" />
              </div>
              <div className="officer-profile-info">
                <h4 className="officer-profile-name">{officerName}</h4>
                <div className="officer-profile-email">
                  <Mail size={12} />
                  <span>{officerEmail}</span>
                </div>
              </div>
            </div>

            <div className="officer-profile-meta-list">
              <div className="officer-profile-meta-item">
                <Award size={18} color="#cca245" className="meta-gold-icon" />
                <div>
                  <span className="meta-label">Rank</span>
                  <div className="meta-val">{officerRank}</div>
                </div>
              </div>

              <div className="officer-profile-meta-item">
                <Landmark size={18} color="#cca245" className="meta-gold-icon" />
                <div>
                  <span className="meta-label">Department</span>
                  <div className="meta-val">{officerDept}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

