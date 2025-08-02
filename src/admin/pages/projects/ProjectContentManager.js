import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { toast } from 'react-toastify';
import { 
  HiSave, 
  HiRefresh, 
  HiPlus, 
  HiTrash,
  HiDocumentText,
  HiTag,
  HiChartBar,
  HiCursorClick
} from 'react-icons/hi';

const ProjectContentManager = () => {
  const [content, setContent] = useState({
    hero: {
      title: 'My Projects',
      subtitle: 'A collection of projects that showcase my skills in web development, full-stack applications, and innovative solutions.',
      description: 'Explore my portfolio of web development projects, including full-stack applications, AI integrations, and modern web solutions.'
    },
    filters: [
      { key: 'all', label: 'All Projects' },
      { key: 'web', label: 'Web Development' },
      { key: 'fullstack', label: 'Full Stack' },
      { key: 'ai', label: 'AI & ML' },
      { key: 'mobile', label: 'Mobile Apps' }
    ],
    stats: {
      title: 'Project Statistics',
      subtitle: 'Overview of my development work and achievements',
      items: [
        { label: 'Total Projects', icon: 'FaCode' },
        { label: 'Featured Projects', icon: 'FaReact' },
        { label: 'Full Stack Apps', icon: 'FaDatabase' },
        { label: 'AI Projects', icon: 'SiOpenai' }
      ]
    },
    cta: {
      title: 'Have a Project in Mind?',
      subtitle: "I'm always excited to work on new and challenging projects. Let's discuss how we can bring your ideas to life.",
      primaryButton: 'Start a Project',
      secondaryButton: 'Learn More About Me'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const contentDoc = await getDoc(doc(db, 'content', 'projects'));
      
      if (contentDoc.exists()) {
        setContent(contentDoc.data());
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateDoc(doc(db, 'content', 'projects'), content);
      toast.success('Content saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, field, index, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) => 
          i === index ? { ...item, ...value } : item
        )
      }
    }));
  };

  const addFilter = () => {
    setContent(prev => ({
      ...prev,
      filters: [...prev.filters, { key: '', label: '' }]
    }));
  };

  const removeFilter = (index) => {
    setContent(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }));
  };

  const addStatItem = () => {
    setContent(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        items: [...prev.stats.items, { label: '', icon: '' }]
      }
    }));
  };

  const removeStatItem = (index) => {
    setContent(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        items: prev.stats.items.filter((_, i) => i !== index)
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Project Page Content
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage the content and layout of your projects page
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={fetchContent}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <HiRefresh className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <HiSave className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <HiDocumentText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Hero Section</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md"
              placeholder="Enter the main title for your projects page"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={content.hero.subtitle}
              onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md"
              placeholder="Enter a compelling subtitle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (SEO)
            </label>
            <textarea
              value={content.hero.description}
              onChange={(e) => handleInputChange('hero', 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md resize-none"
              placeholder="Enter SEO description for better search visibility"
            />
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <HiTag className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filter Categories</h2>
          </div>
          <button
            onClick={addFilter}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <HiPlus className="w-4 h-4" />
            Add Filter
          </button>
        </div>
        <div className="space-y-4">
          {content.filters.map((filter, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter Key
                  </label>
                  <input
                    type="text"
                    value={filter.key}
                    onChange={(e) => handleArrayChange('filters', 'key', index, { key: e.target.value })}
                    placeholder="e.g., 'web', 'ai', 'mobile'"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Label
                  </label>
                  <input
                    type="text"
                    value={filter.label}
                    onChange={(e) => handleArrayChange('filters', 'label', index, { label: e.target.value })}
                    placeholder="e.g., 'Web Development', 'AI & ML'"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  />
                </div>
                <button
                  onClick={() => removeFilter(index)}
                  className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 mt-6 sm:mt-0"
                >
                  <HiTrash className="w-4 h-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <HiChartBar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Statistics Section</h2>
          </div>
          <button
            onClick={addStatItem}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <HiPlus className="w-4 h-4" />
            Add Stat
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={content.stats.title}
                onChange={(e) => handleInputChange('stats', 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md"
                placeholder="Enter section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Subtitle
              </label>
              <input
                type="text"
                value={content.stats.subtitle}
                onChange={(e) => handleInputChange('stats', 'subtitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md"
                placeholder="Enter section subtitle"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Statistics Items</h3>
            {content.stats.items.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stat Label
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleArrayChange('stats', 'items', index, { label: e.target.value })}
                      placeholder="e.g., 'Total Projects', 'Featured Projects'"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Icon Name
                    </label>
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => handleArrayChange('stats', 'items', index, { icon: e.target.value })}
                      placeholder="e.g., 'FaCode', 'FaReact'"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={() => removeStatItem(index)}
                    className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 mt-6 sm:mt-0"
                  >
                    <HiTrash className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
            <HiCursorClick className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Call to Action Section</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CTA Title
            </label>
            <input
              type="text"
              value={content.cta.title}
              onChange={(e) => handleInputChange('cta', 'title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md"
              placeholder="Enter compelling CTA title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CTA Subtitle
            </label>
            <textarea
              value={content.cta.subtitle}
              onChange={(e) => handleInputChange('cta', 'subtitle', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md resize-none"
              placeholder="Enter persuasive CTA subtitle"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Button Text
              </label>
              <input
                type="text"
                value={content.cta.primaryButton}
                onChange={(e) => handleInputChange('cta', 'primaryButton', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md"
                placeholder="e.g., 'Start a Project'"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={content.cta.secondaryButton}
                onChange={(e) => handleInputChange('cta', 'secondaryButton', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm focus:shadow-md"
                placeholder="e.g., 'Learn More About Me'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectContentManager; 