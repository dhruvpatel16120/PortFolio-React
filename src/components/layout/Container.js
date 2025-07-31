import React from 'react';

const Container = ({ 
  children, 
  className = '',
  size = 'default',
  ...props 
}) => {
  const sizes = {
    sm: 'max-w-4xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    xl: 'max-w-full',
    full: 'w-full'
  };

  const classes = `mx-auto px-4 md:px-8 ${sizes[size]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Container; 