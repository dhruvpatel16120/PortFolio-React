import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { toast } from 'react-toastify';
import { HiSave, HiRefresh } from 'react-icons/hi';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Page Content</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the content and layout of your projects page</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchContent}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <HiRefresh className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <HiSave className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Categories</h2>
          <button
            onClick={addFilter}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
          >
            Add Filter
          </button>
        </div>
        <div className="space-y-3">
          {content.filters.map((filter, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  value={filter.key}
                  onChange={(e) => handleArrayChange('filters', 'key', index, { key: e.target.value })}
                  placeholder="Filter key (e.g., 'web')"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={filter.label}
                  onChange={(e) => handleArrayChange('filters', 'label', index, { label: e.target.value })}
                  placeholder="Display label (e.g., 'Web Development')"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button
                onClick={() => removeFilter(index)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Statistics Section</h2>
          <button
            onClick={addStatItem}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
          >
            Add Stat
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.stats.title}
              onChange={(e) => handleInputChange('stats', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="space-y-3">
            {content.stats.items.map((item, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleArrayChange('stats', 'items', index, { label: e.target.value })}
                    placeholder="Stat label (e.g., 'Total Projects')"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => handleArrayChange('stats', 'items', index, { icon: e.target.value })}
                    placeholder="Icon name (e.g., 'FaCode')"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => removeStatItem(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Call to Action Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CTA Title
            </label>
            <input
              type="text"
              value={content.cta.title}
              onChange={(e) => handleInputChange('cta', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Button Text
              </label>
              <input
                type="text"
                value={content.cta.primaryButton}
                onChange={(e) => handleInputChange('cta', 'primaryButton', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectContentManager; 