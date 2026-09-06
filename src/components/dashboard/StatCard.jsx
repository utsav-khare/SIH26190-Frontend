import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const StatCard = ({ title, count, linkText, linkTo, icon: Icon }) => {
  return (
    <div className="metric-card">
      <div className="metric-card-top">
        {Icon && <Icon size={18} className="metric-card-icon" />}
        <span>{title}</span>
      </div>
      <div className="metric-card-val">{count}</div>
      <Link to={linkTo} className="metric-card-link">
        <span>{linkText}</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
};

