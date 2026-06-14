import React from 'react';

const Card = ({ children, className = '', noPadding = false, onClick }) => {
  const baseStyle = "bg-surface shadow-level-1 rounded-2xl overflow-hidden transition-shadow duration-300";
  const interactableStyle = onClick ? "cursor-pointer hover:shadow-level-2" : "";
  const paddingStyle = noPadding ? "" : "p-4 sm:p-6";

  return (
    <div 
      className={`${baseStyle} ${interactableStyle} ${paddingStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
