import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  id,
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold tracking-wider text-on-surface uppercase font-sans">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`w-full px-4 py-3 rounded-lg font-sans text-on-surface bg-surface-neutral border border-transparent transition-all duration-200 focus:bg-surface focus:border-primary focus:outline-none focus:ring-0 placeholder:text-gray-400 ${error ? 'border-error bg-error-container/20 focus:border-error' : ''}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-error font-sans mt-0.5">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
