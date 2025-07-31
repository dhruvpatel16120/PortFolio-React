import React from 'react';

const LoadingSpinner = ({ 
  size = 'md',
  color = 'primary',
  text = '',
  className = ''
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colors = {
    primary: 'border-lightAccent dark:border-darkAccent',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  const classes = `${sizes[size]} ${colors[color]} ${className}`;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${classes} border-2 border-t-transparent rounded-full animate-spin`}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 