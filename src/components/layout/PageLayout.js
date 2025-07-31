import React from 'react';
import SEOHead from '../seo/SEOHead';

const PageLayout = ({ 
  children, 
  title,
  description,
  keywords = [],
  className = '',
  ...seoProps 
}) => {
  return (
    <>
      <SEOHead 
        title={title}
        description={description}
        keywords={keywords}
        {...seoProps}
      />
      <div
        className={`min-h-screen bg-gradient-to-r from-lightBgFrom via-lightBgVia to-lightBgTo dark:from-darkBgFrom dark:via-darkBgVia dark:to-darkBgTo text-lightText dark:text-darkText pt-16 ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default PageLayout; 