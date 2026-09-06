import React from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  Briefcase,
  Search,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';

export const QuickActionGrid = ({ onOpenUpload, onOpenNewCase }) => {
  return (
    <div className="quick-actions-bar">
      {/* Upload Document */}
      <button 
        type="button" 
        onClick={onOpenUpload} 
        className="quick-action-tile"
      >
        <UploadCloud size={24} className="quick-action-icon" />
        <div className="quick-action-info">
          <span className="quick-action-title">Upload Document</span>
          <span className="quick-action-sub">Upload new documents</span>
        </div>
      </button>

      {/* New Case */}
      <button 
        type="button" 
        onClick={onOpenNewCase} 
        className="quick-action-tile"
      >
        <Briefcase size={24} className="quick-action-icon" />
        <div className="quick-action-info">
          <span className="quick-action-title">New Case</span>
          <span className="quick-action-sub">Create a new case</span>
        </div>
      </button>

      {/* Search Documents */}
      <Link to="/search" className="quick-action-tile">
        <Search size={24} className="quick-action-icon" />
        <div className="quick-action-info">
          <span className="quick-action-title">Search Documents</span>
          <span className="quick-action-sub">Find documents quickly</span>
        </div>
      </Link>

      {/* Pending Approvals */}
      <Link to="/approvals" className="quick-action-tile">
        <CheckCircle2 size={24} className="quick-action-icon" />
        <div className="quick-action-info">
          <span className="quick-action-title">Pending Approvals</span>
          <span className="quick-action-sub">Review pending items</span>
        </div>
      </Link>

      {/* Audit Log */}
      <Link to="/audit-log" className="quick-action-tile">
        <FileCheck2 size={24} className="quick-action-icon" />
        <div className="quick-action-info">
          <span className="quick-action-title">Audit Log</span>
          <span className="quick-action-sub">View system activity</span>
        </div>
      </Link>
    </div>
  );
};

