import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'outline' | 'secondary' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  block = false,
  className = '',
  icon: Icon,
  loading = false,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const blockClass = block ? 'btn-block' : '';

  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClass} ${blockClass} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="spinner" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      {children}
    </button>
  );
};

