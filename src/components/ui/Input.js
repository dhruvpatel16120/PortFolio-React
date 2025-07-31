import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  icon: Icon,
  className = '',
  variant = 'default',
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'bg-white/40 dark:bg-gray-700 text-lightText dark:text-darkText focus:ring-lightAccent dark:focus:ring-darkAccent border border-transparent',
    outlined: 'bg-transparent border border-lightAccent/30 dark:border-darkAccent/30 text-lightText dark:text-darkText focus:ring-lightAccent dark:focus:ring-darkAccent',
    filled: 'bg-white/20 dark:bg-gray-800/50 text-lightText dark:text-darkText focus:ring-lightAccent dark:focus:ring-darkAccent border border-transparent'
  };

  const classes = `${baseClasses} ${variants[variant]} ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-lightText dark:text-darkText">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lightAccent dark:text-darkAccent">
            <Icon size={20} />
          </div>
        )}
        <input
          ref={ref}
          className={`${classes} ${Icon ? 'pl-12' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 