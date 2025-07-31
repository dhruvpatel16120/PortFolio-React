import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  as = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-lightAccent text-darkText dark:bg-darkAccent dark:text-lightText hover:scale-105 focus:ring-lightAccent dark:focus:ring-darkAccent',
    secondary: 'bg-white/20 dark:bg-gray-800/50 text-lightText dark:text-darkText border border-lightAccent dark:border-darkAccent hover:bg-lightAccent hover:text-darkText dark:hover:bg-darkAccent dark:hover:text-lightText focus:ring-lightAccent dark:focus:ring-darkAccent',
    outline: 'border-2 border-lightAccent dark:border-darkAccent text-lightAccent dark:text-darkAccent hover:bg-lightAccent hover:text-darkText dark:hover:bg-darkAccent dark:hover:text-lightText focus:ring-lightAccent dark:focus:ring-darkAccent',
    ghost: 'text-lightAccent dark:text-darkAccent hover:bg-lightAccent/10 dark:hover:bg-darkAccent/10 focus:ring-lightAccent dark:focus:ring-darkAccent'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const Component = as;

  return (
    <Component
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </Component>
  );
};

export default Button; 