import React, { useState, useEffect } from 'react';
import { 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiClock, 
  HiSave, 
  HiRefresh,
  HiPlus,
  HiTrash,
  HiEye,
  HiGlobe,
  HiChat,
  HiUser,
  HiAcademicCap,
  HiBriefcase,
  HiHeart,
  HiStar,
  HiLightningBolt,
  HiSparkles,
  HiDocumentText,
  HiInformationCircle,
  HiCollection,
  HiTemplate
} from 'react-icons/hi';

import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getContactContent, saveContactContent } from '../../../firebase/contactService';

const ContactContentManager = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contact-info');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // Contact Information State
  const [contactInfo, setContactInfo] = useState([
    {
      id: 1,
      type: 'email',
      title: 'Email',
      value: 'dhruvpatel16120@gmail.com',
      link: 'mailto:dhruvpatel16120@gmail.com',
      description: 'Send me an email anytime',
      icon: 'HiMail',
      active: true
    },
    {
      id: 2,
      type: 'instagram',
      title: 'Instagram',
      value: '@dhruv_patel_16120',
      link: 'https://instagram.com/dhruv_patel_16120',
      description: 'Follow me on Instagram',
      icon: 'HiGlobe',
      active: true
    },
    {
      id: 3,
      type: 'location',
      title: 'Location',
      value: 'Gujarat, India',
      description: 'Available for remote work worldwide',
      icon: 'HiLocationMarker',
      active: true
    },
    {
      id: 4,
      type: 'response_time',
      title: 'Response Time',
      value: 'Within 24 hours',
      description: 'I usually respond quickly',
      icon: 'HiClock',
      active: true
    }
  ]);

  // Page Content State
  const [pageContent, setPageContent] = useState({
    heroTitle: 'Get In Touch',
    heroDescription: 'Ready to start your next project? Let\'s discuss how I can help bring your ideas to life.',
    sectionTitle: 'Let\'s Connect',
    sectionDescription: 'I\'m always excited to hear about new opportunities and interesting projects.',
    formTitle: 'Send a Message',
    formDescription: 'Tell me about your project and I\'ll get back to you as soon as possible.',
    ctaTitle: 'Ready to Start Your Project?',
    ctaDescription: 'Whether you have a specific project in mind or just want to explore possibilities, I\'m here to help you achieve your goals.',
    services: [
      'Full-stack web development',
      'UI/UX design and optimization',
      'SEO and digital marketing',
      'Technical consulting',
      'Project collaboration'
    ],
    responseTimes: [
      { label: 'Initial response', time: 'Within 24 hours' },
      { label: 'Project discussion', time: '1-2 business days' },
      { label: 'Proposal delivery', time: '3-5 business days' }
    ]
  });

  // Form Fields State
  const [formFields, setFormFields] = useState([
    { id: 'name', label: 'Name', type: 'text', required: true, active: true },
    { id: 'email', label: 'Email', type: 'email', required: true, active: true },
    { id: 'subject', label: 'Subject', type: 'text', required: true, active: true },
    { id: 'message', label: 'Message', type: 'textarea', required: true, active: true }
  ]);

  const iconOptions = [
    { value: 'HiMail', label: 'Email', icon: HiMail },
    { value: 'HiPhone', label: 'Phone', icon: HiPhone },
    { value: 'HiLocationMarker', label: 'Location', icon: HiLocationMarker },
    { value: 'HiClock', label: 'Clock', icon: HiClock },
    { value: 'HiGlobe', label: 'Website', icon: HiGlobe },
    { value: 'HiChat', label: 'Chat', icon: HiChat },
    { value: 'HiUser', label: 'User', icon: HiUser },
    { value: 'HiAcademicCap', label: 'Education', icon: HiAcademicCap },
    { value: 'HiBriefcase', label: 'Work', icon: HiBriefcase },
    { value: 'HiHeart', label: 'Heart', icon: HiHeart },
    { value: 'HiStar', label: 'Star', icon: HiStar },
    { value: 'HiLightningBolt', label: 'Lightning', icon: HiLightningBolt },
    { value: 'HiSparkles', label: 'Sparkles', icon: HiSparkles }
  ];

  const tabs = [
    { id: 'contact-info', label: 'Contact Information', icon: HiInformationCircle },
    { id: 'hero-section', label: 'Hero Section', icon: HiTemplate },
    { id: 'form-section', label: 'Contact Form', icon: HiDocumentText },
    { id: 'services', label: 'Services', icon: HiCollection },
    { id: 'response-times', label: 'Response Times', icon: HiClock },
    { id: 'preview', label: 'Live Preview', icon: HiEye }
  ];

  const getIconComponent = (iconName) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption ? iconOption.icon : HiMail;
  };

  // Load contact content from Firebase
  useEffect(() => {
    const loadContactContent = async () => {
      try {
        setLoading(true);
        const result = await getContactContent();
        if (result.success && result.data) {
          const { contactInfo: loadedContactInfo, pageContent: loadedPageContent, formFields: loadedFormFields } = result.data;
          if (loadedContactInfo && Array.isArray(loadedContactInfo)) setContactInfo(loadedContactInfo);
          if (loadedPageContent && typeof loadedPageContent === 'object') setPageContent(loadedPageContent);
          if (loadedFormFields && Array.isArray(loadedFormFields)) setFormFields(loadedFormFields);
          
          // Store original data for change detection
          setOriginalData({
            contactInfo: loadedContactInfo || contactInfo,
            pageContent: loadedPageContent || pageContent,
            formFields: loadedFormFields || formFields
          });
        } else {
          console.warn('No saved content found, using defaults');
          setOriginalData({
            contactInfo,
            pageContent,
            formFields
          });
        }
      } catch (error) {
        console.error('Load contact content error:', error);
        toast.error('Failed to load contact content, using default values');
        setOriginalData({
          contactInfo,
          pageContent,
          formFields
        });
      } finally {
        setLoading(false);
      }
    };

    loadContactContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const currentData = { contactInfo, pageContent, formFields };
      const hasDataChanged = JSON.stringify(currentData) !== JSON.stringify(originalData);
      setHasChanges(hasDataChanged);
    }
  }, [contactInfo, pageContent, formFields, originalData]);

  // Contact Information Handlers
  const handleContactInfoChange = (id, field, value) => {
    setContactInfo(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addContactInfo = () => {
    const newId = Math.max(...contactInfo.map(item => item.id), 0) + 1;
    setContactInfo(prev => [...prev, {
      id: newId,
      type: 'custom',
      title: '',
      value: '',
      link: '',
      description: '',
      icon: 'HiMail',
      active: true
    }]);
  };

  const removeContactInfo = (id) => {
    if (window.confirm('Are you sure you want to delete this contact information? This action cannot be undone.')) {
      setContactInfo(prev => prev.filter(item => item.id !== id));
      toast.success('Contact information deleted successfully');
    }
  };

  // Page Content Handlers
  const handlePageContentChange = (field, value) => {
    setPageContent(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index, value) => {
    const newServices = [...pageContent.services];
    newServices[index] = value;
    setPageContent(prev => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setPageContent(prev => ({
      ...prev,
      services: [...prev.services, '']
    }));
  };

  const removeService = (index) => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      setPageContent(prev => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index)
      }));
      toast.success('Service deleted successfully');
    }
  };

  const handleResponseTimeChange = (index, field, value) => {
    const newResponseTimes = [...pageContent.responseTimes];
    newResponseTimes[index] = { ...newResponseTimes[index], [field]: value };
    setPageContent(prev => ({ ...prev, responseTimes: newResponseTimes }));
  };

  const addResponseTime = () => {
    setPageContent(prev => ({
      ...prev,
      responseTimes: [...prev.responseTimes, { label: '', time: '' }]
    }));
  };

  const removeResponseTime = (index) => {
    if (window.confirm('Are you sure you want to delete this response time? This action cannot be undone.')) {
      setPageContent(prev => ({
        ...prev,
        responseTimes: prev.responseTimes.filter((_, i) => i !== index)
      }));
      toast.success('Response time deleted successfully');
    }
  };

  // Save Changes
  const saveChanges = async () => {
    try {
      setSaving(true);
      const contactData = {
        contactInfo,
        pageContent,
        formFields
      };
      
      const result = await saveContactContent(contactData);
      
      if (result.success) {
        toast.success('Contact page content saved successfully!');
        setOriginalData(contactData);
        setHasChanges(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving contact content:', error);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to Defaults
  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all changes to default values?')) {
      const defaultContactInfo = [
        {
          id: 1,
          type: 'email',
          title: 'Email',
          value: 'dhruvpatel16120@gmail.com',
          link: 'mailto:dhruvpatel16120@gmail.com',
          description: 'Send me an email anytime',
          icon: 'HiMail',
          active: true
        },
        {
          id: 2,
          type: 'instagram',
          title: 'Instagram',
          value: '@dhruv_patel_16120',
          link: 'https://instagram.com/dhruv_patel_16120',
          description: 'Follow me on Instagram',
          icon: 'HiGlobe',
          active: true
        },
        {
          id: 3,
          type: 'location',
          title: 'Location',
          value: 'Gujarat, India',
          description: 'Available for remote work worldwide',
          icon: 'HiLocationMarker',
          active: true
        },
        {
          id: 4,
          type: 'response_time',
          title: 'Response Time',
          value: 'Within 24 hours',
          description: 'I usually respond quickly',
          icon: 'HiClock',
          active: true
        }
      ];
      
      const defaultPageContent = {
        heroTitle: 'Get In Touch',
        heroDescription: 'Ready to start your next project? Let\'s discuss how I can help bring your ideas to life.',
        sectionTitle: 'Let\'s Connect',
        sectionDescription: 'I\'m always excited to hear about new opportunities and interesting projects.',
        formTitle: 'Send a Message',
        formDescription: 'Tell me about your project and I\'ll get back to you as soon as possible.',
        ctaTitle: 'Ready to Start Your Project?',
        ctaDescription: 'Whether you have a specific project in mind or just want to explore possibilities, I\'m here to help you achieve your goals.',
        services: [
          'Full-stack web development',
          'UI/UX design and optimization',
          'SEO and digital marketing',
          'Technical consulting',
          'Project collaboration'
        ],
        responseTimes: [
          { label: 'Initial response', time: 'Within 24 hours' },
          { label: 'Project discussion', time: '1-2 business days' },
          { label: 'Proposal delivery', time: '3-5 business days' }
        ]
      };
      
      setContactInfo(defaultContactInfo);
      setPageContent(defaultPageContent);
      setOriginalData({
        contactInfo: defaultContactInfo,
        pageContent: defaultPageContent,
        formFields
      });
      
      toast.info('Content reset to default values');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 sm:p-6 w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Contact Content Manager
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Manage your contact page content, contact information, and form settings.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {hasChanges && (
                <div className="flex items-center justify-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  Unsaved changes
                </div>
              )}
              <button
                onClick={saveChanges}
                disabled={saving || !hasChanges}
                className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md text-sm"
              >
                <HiSave className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={resetToDefaults}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md text-sm"
              >
                <HiRefresh className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Contact Information Tab */}
          {activeTab === 'contact-info' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Contact Information
                </h2>
                <button
                  onClick={addContactInfo}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors duration-200"
                >
                  <HiPlus className="w-4 h-4 mr-1" />
                  Add Contact
                </button>
              </div>

              <div className="grid gap-4">
                {contactInfo.map((info, index) => (
                  <div key={info.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <div className="flex items-center space-x-2">
                        {React.createElement(getIconComponent(info.icon), { className: "w-4 h-4 sm:w-5 sm:h-5 text-blue-600" })}
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Contact {index + 1}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={info.active}
                            onChange={(e) => handleContactInfoChange(info.id, 'active', e.target.checked)}
                            className="mr-2 rounded"
                          />
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active</span>
                        </label>
                        <button
                          onClick={() => removeContactInfo(info.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={info.title}
                          onChange={(e) => handleContactInfoChange(info.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Icon
                        </label>
                        <select
                          value={info.icon}
                          onChange={(e) => handleContactInfoChange(info.id, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                        >
                          {iconOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={info.value}
                        onChange={(e) => handleContactInfoChange(info.id, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Link (optional)
                      </label>
                      <input
                        type="text"
                        value={info.link}
                        onChange={(e) => handleContactInfoChange(info.id, 'link', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={info.description}
                        onChange={(e) => handleContactInfoChange(info.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hero Section Tab */}
          {activeTab === 'hero-section' && (
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Hero Section
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={pageContent.heroTitle}
                    onChange={(e) => handlePageContentChange('heroTitle', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-base sm:text-lg"
                    placeholder="Enter hero title..."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hero Description
                  </label>
                  <textarea
                    value={pageContent.heroDescription}
                    onChange={(e) => handlePageContentChange('heroDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                    placeholder="Enter hero description..."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={pageContent.sectionTitle}
                    onChange={(e) => handlePageContentChange('sectionTitle', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                    placeholder="Enter section title..."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Description
                  </label>
                  <textarea
                    value={pageContent.sectionDescription}
                    onChange={(e) => handlePageContentChange('sectionDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                    placeholder="Enter section description..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Form Tab */}
          {activeTab === 'form-section' && (
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Contact Form
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Form Title
                  </label>
                  <input
                    type="text"
                    value={pageContent.formTitle}
                    onChange={(e) => handlePageContentChange('formTitle', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                    placeholder="Enter form title..."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Form Description
                  </label>
                  <textarea
                    value={pageContent.formDescription}
                    onChange={(e) => handlePageContentChange('formDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                    placeholder="Enter form description..."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CTA Title
                  </label>
                  <input
                    type="text"
                    value={pageContent.ctaTitle}
                    onChange={(e) => handlePageContentChange('ctaTitle', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                    placeholder="Enter CTA title..."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CTA Description
                  </label>
                  <textarea
                    value={pageContent.ctaDescription}
                    onChange={(e) => handlePageContentChange('ctaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                    placeholder="Enter CTA description..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Services Offered
                </h2>
                <button
                  onClick={addService}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors duration-200"
                >
                  <HiPlus className="w-4 h-4 mr-1" />
                  Add Service
                </button>
              </div>
              <div className="space-y-3">
                {pageContent.services.map((service, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                      placeholder="Enter service description..."
                    />
                    <button
                      onClick={() => removeService(index)}
                      className="w-full sm:w-auto flex items-center justify-center text-red-600 hover:text-red-800 transition-colors duration-200 p-2"
                    >
                      <HiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response Times Tab */}
          {activeTab === 'response-times' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Response Times
                </h2>
                <button
                  onClick={addResponseTime}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors duration-200"
                >
                  <HiPlus className="w-4 h-4 mr-1" />
                  Add Time
                </button>
              </div>
              <div className="space-y-4">
                {pageContent.responseTimes.map((time, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={time.label}
                      onChange={(e) => handleResponseTimeChange(index, 'label', e.target.value)}
                      placeholder="Label (e.g., Initial response)"
                      className="px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={time.time}
                        onChange={(e) => handleResponseTimeChange(index, 'time', e.target.value)}
                        placeholder="Time (e.g., Within 24 hours)"
                        className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                      />
                      <button
                        onClick={() => removeResponseTime(index)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2"
                      >
                        <HiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h2>
                <button 
                  onClick={() => window.open('/contact', '_blank')}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors duration-200"
                >
                  <HiEye className="w-4 h-4 mr-1" />
                  View Full Page
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Contact Info Preview */}
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {contactInfo.filter(info => info.active).map((info, index) => (
                      <div key={info.id} className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {React.createElement(getIconComponent(info.icon), { className: "w-5 h-5 sm:w-6 sm:h-6 text-blue-600" })}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{info.title}</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{info.value}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{info.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Preview */}
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Form</h3>
                  <div className="space-y-4">
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{pageContent.formTitle}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{pageContent.formDescription}</p>
                    </div>
                    <div className="space-y-2">
                      {formFields.filter(field => field.active).map(field => (
                        <div key={field.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{field.label}</span>
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Section Preview */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">Hero Section Preview</h3>
                <div className="text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {pageContent.heroTitle}
                  </h1>
                  <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {pageContent.heroDescription}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactContentManager;