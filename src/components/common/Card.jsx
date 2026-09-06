import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`section-box ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

