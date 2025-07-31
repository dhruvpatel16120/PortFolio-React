import { useEffect } from 'react';

const SEOHead = ({ 
  title,
  description,
  keywords = [],
  image = '/logo.png',
  url,
  type = 'website',
  author = 'Dhruv Patel',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const siteName = "Dhruv Patel - Portfolio";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullUrl = url ? `https://yourdomain.com${url}` : 'https://yourdomain.com';

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const updateMetaTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    
    // Open Graph
    updatePropertyTag('og:title', fullTitle);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:url', fullUrl);
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:site_name', siteName);
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

    // Article specific meta tags
    if (type === 'article') {
      if (publishedTime) updatePropertyTag('article:published_time', publishedTime);
      if (modifiedTime) updatePropertyTag('article:modified_time', modifiedTime);
      if (section) updatePropertyTag('article:section', section);
      tags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.content = tag;
        document.head.appendChild(meta);
      });
    }

    // Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? 'Article' : 'WebPage',
      "name": fullTitle,
      "description": description,
      "url": fullUrl,
      "author": {
        "@type": "Person",
        "name": author,
        "url": "https://yourdomain.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "url": "https://yourdomain.com"
      },
      "image": image,
      ...(type === 'article' && {
        "datePublished": publishedTime,
        "dateModified": modifiedTime,
        "articleSection": section
      })
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Clean up meta tags that we added
      const metaTags = document.querySelectorAll('meta[name="keywords"], meta[name="author"], meta[property^="og:"], meta[name^="twitter:"]');
      metaTags.forEach(tag => {
        if (tag.content === description || tag.content === keywords.join(', ') || tag.content === author) {
          tag.remove();
        }
      });
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, section, tags, fullTitle, fullUrl]);

  return null;
};

export default SEOHead; 