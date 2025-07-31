import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  ...props 
}) => {
  const baseClasses = 'rounded-xl overflow-hidden shadow-lg backdrop-blur-md transition-all duration-300';
  
  const variants = {
    default: 'bg-white/20 dark:bg-gray-800/50',
    elevated: 'bg-white/30 dark:bg-gray-700/60 shadow-xl',
    bordered: 'bg-white/20 dark:bg-gray-800/50 border border-lightAccent/20 dark:border-darkAccent/20',
    glass: 'bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30'
  };

  const classes = `${baseClasses} ${variants[variant]} ${hover ? 'hover:scale-105 hover:-translate-y-1' : ''} ${className}`;

  return (
    <div
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 