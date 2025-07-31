import React from 'react';

const Section = ({ 
  children, 
  className = '',
  id,
  variant = 'default',
  delay = 0,
  ...props 
}) => {
  const baseClasses = 'py-16 px-4 md:px-8';
  
  const variants = {
    default: '',
    centered: 'flex flex-col justify-center items-center text-center',
    fullHeight: 'min-h-screen flex flex-col justify-center',
    narrow: 'py-8 px-4 md:px-8',
    wide: 'py-20 px-4 md:px-12'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <section
      id={id}
      className={classes}
      {...props}
    >
      {children}
    </section>
  );
};

export default Section; 