import React from 'react';

export const Badge = ({ children, variant = 'pdf', className = '' }) => {
  const badgeType = variant.toLowerCase();
  const badgeClass = `doc-badge doc-badge-${badgeType}`;

  return <span className={`${badgeClass} ${className}`.trim()}>{children}</span>;
};

