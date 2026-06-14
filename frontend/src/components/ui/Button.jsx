import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  fullWidth = false,
  ...props 
}) => {
  const baseStyle = "font-sans font-semibold rounded-lg px-4 py-2.5 transition-all duration-200 text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-container focus:ring-primary",
    secondary: "bg-tertiary-container text-primary hover:bg-primary/20 focus:ring-primary",
    outline: "border-2 border-primary text-primary hover:bg-surface-neutral focus:ring-primary",
    ghost: "bg-transparent text-primary hover:bg-surface-neutral focus:ring-primary"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      type={type}
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
