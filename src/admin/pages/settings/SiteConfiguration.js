import React, { useState, useEffect, useCallback } from 'react';
import { HiGlobeAlt, HiSave, HiRefresh, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

const SiteConfiguration = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [config, setConfig] = useState({
    // SEO Settings
    seo: {
      title: 'Portfolio - Professional Developer',
      description: 'Professional portfolio showcasing web development projects and skills',
      keywords: 'web developer, portfolio, react, javascript, frontend',
      author: 'Portfolio Admin',
      robots: 'index, follow',
      canonicalUrl: 'https://portfolio.com',
      ogImage: 'https://portfolio.com/og-image.jpg',
      twitterCard: 'summary_large_image'
    },
    // Social Media
    social: {
      facebook: 'https://facebook.com/portfolio',
      twitter: 'https://twitter.com/portfolio',
      instagram: 'https://instagram.com/portfolio',
      linkedin: 'https://linkedin.com/in/portfolio',
      github: 'https://github.com/portfolio',
      youtube: 'https://youtube.com/portfolio'
    },
    // Contact Information
    contact: {
      email: 'contact@portfolio.com',
      phone: '+1 (555) 123-4567',
      address: '123 Portfolio Street, New York, NY 10001',
      businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM'
    },
    // Site Settings
    site: {
      domain: 'portfolio.com',
      sslEnabled: true,
      maintenanceMode: false,
      cacheEnabled: true,
      compressionEnabled: true,
      analyticsEnabled: true,
      googleAnalyticsId: 'GA-XXXXXXXXX',
      googleTagManagerId: 'GTM-XXXXXXX'
    },
    // Content Settings
    content: {
      postsPerPage: 10,
      commentsEnabled: true,
      moderationEnabled: true,
      autoSave: true,
      autoSaveInterval: 5,
      maxUploadSize: 10,
      allowedFileTypes: ['jpg', 'png', 'gif', 'pdf', 'doc', 'docx']
    }
  });

  const [originalConfig, setOriginalConfig] = useState({});

  const loadConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call to load configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would come from your backend
      const savedConfig = localStorage.getItem('adminSiteConfiguration');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        setOriginalConfig(parsed);
      } else {
        setOriginalConfig(config);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load configuration' });
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  const handleInputChange = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call to save configuration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for demo purposes
      localStorage.setItem('adminSiteConfiguration', JSON.stringify(config));
      setOriginalConfig(config);
      
      setMessage({ type: 'success', text: 'Site configuration saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfig(originalConfig);
    setMessage({ type: 'info', text: 'Configuration reset to last saved state' });
  };

  const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig);

  return (
    <div className="p-6 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <HiGlobeAlt className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Configuration</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Configure site-wide settings, SEO, and social media integration
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
            message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
            'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
          }`}>
            {message.type === 'success' ? <HiCheckCircle className="w-5 h-5" /> :
             message.type === 'error' ? <HiExclamationCircle className="w-5 h-5" /> :
             <HiGlobeAlt className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* SEO Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={config.seo.title}
                  onChange={(e) => handleInputChange('seo', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter page title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={config.seo.description}
                  onChange={(e) => handleInputChange('seo', 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter meta description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={config.seo.keywords}
                  onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter keywords separated by commas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={config.seo.author}
                  onChange={(e) => handleInputChange('seo', 'author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={config.seo.canonicalUrl}
                  onChange={(e) => handleInputChange('seo', 'canonicalUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  OG Image URL
                </label>
                <input
                  type="url"
                  value={config.seo.ogImage}
                  onChange={(e) => handleInputChange('seo', 'ogImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={config.social.facebook}
                  onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={config.social.twitter}
                  onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={config.social.instagram}
                  onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={config.social.linkedin}
                  onChange={(e) => handleInputChange('social', 'linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  value={config.social.github}
                  onChange={(e) => handleInputChange('social', 'github', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  value={config.social.youtube}
                  onChange={(e) => handleInputChange('social', 'youtube', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://youtube.com/channel"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={config.contact.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={config.contact.phone}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={config.contact.address}
                  onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter business address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={config.contact.businessHours}
                  onChange={(e) => handleInputChange('contact', 'businessHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Site Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Site Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Domain
                </label>
                <input
                  type="text"
                  value={config.site.domain}
                  onChange={(e) => handleInputChange('site', 'domain', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={config.site.googleAnalyticsId}
                  onChange={(e) => handleInputChange('site', 'googleAnalyticsId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="GA-XXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  value={config.site.googleTagManagerId}
                  onChange={(e) => handleInputChange('site', 'googleTagManagerId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="GTM-XXXXXXX"
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">SSL Enabled</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enable HTTPS for secure connections</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.site.sslEnabled}
                    onChange={(e) => handleInputChange('site', 'sslEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Cache Enabled</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enable page caching for better performance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.site.cacheEnabled}
                    onChange={(e) => handleInputChange('site', 'cacheEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Analytics Enabled</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enable website analytics tracking</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.site.analyticsEnabled}
                    onChange={(e) => handleInputChange('site', 'analyticsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasChanges || loading}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <HiRefresh className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              disabled={!hasChanges || loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <HiSave className="w-4 h-4" />
              )}
              <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteConfiguration; 