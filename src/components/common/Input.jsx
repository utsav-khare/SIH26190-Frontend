import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  rightElement,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && (
          <span className="input-icon">
            <Icon size={18} />
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={`form-input ${!Icon ? 'no-icon' : ''} ${className}`.trim()}
          {...props}
        />
        {rightElement}
      </div>
      {error && <span className="text-error text-sm">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

