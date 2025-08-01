import React, { useState, useEffect, useCallback } from 'react';
import { HiCog, HiSave, HiRefresh, HiCheckCircle, HiExclamationCircle, HiShieldCheck } from 'react-icons/hi';
import { auth, db } from '../../../firebase/config';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ensureAdminUserExists } from '../../utils/adminUserUtils';

const GeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState({
    // Essential Admin Settings
    siteName: 'Portfolio Admin',
    adminEmail: '',
    maintenanceMode: false,
    sessionTimeout: 30,
    maxUploadSize: 10,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'doc'],
    
    // Firebase Integration Settings
    enableFirebaseAnalytics: true,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
    
    // Security Settings
    requirePasswordChange: false,
    enableLoginNotifications: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    
    // Content Management
    autoSaveInterval: 30,
    enableDraftMode: true,
    enableVersionControl: false
  });

  const [originalSettings, setOriginalSettings] = useState({});

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user. Please log in again.');
      }

      // Ensure admin user document exists
      await ensureAdminUserExists(user.email);

      // Load settings from Firestore
      const settingsDoc = await getDoc(doc(db, 'admin_settings', 'general'));
      
      if (settingsDoc.exists()) {
        const savedSettings = settingsDoc.data();
        const mergedSettings = {
          ...settings,
          ...savedSettings,
          adminEmail: user.email // Always use current user's email
        };
        setSettings(mergedSettings);
        setOriginalSettings(mergedSettings);
      } else {
        // Create default settings
        const defaultSettings = {
          ...settings,
          adminEmail: user.email
        };
        setSettings(defaultSettings);
        setOriginalSettings(defaultSettings);
        
        // Save default settings to Firestore
        try {
          await setDoc(doc(db, 'admin_settings', 'general'), defaultSettings);
        } catch (error) {
          console.error('Failed to create default settings:', error);
          // Don't throw error here, just use default settings
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      let errorMessage = 'Failed to load settings';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your Firestore security rules.';
      } else if (error.message.includes('No authenticated user')) {
        errorMessage = 'Please log in again to access settings.';
      } else {
        errorMessage = error.message;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user. Please log in again.');
      }

      // Validate settings
      if (settings.sessionTimeout < 5 || settings.sessionTimeout > 480) {
        throw new Error('Session timeout must be between 5 and 480 minutes');
      }

      if (settings.maxUploadSize < 1 || settings.maxUploadSize > 100) {
        throw new Error('Max upload size must be between 1 and 100 MB');
      }

      if (settings.maxLoginAttempts < 1 || settings.maxLoginAttempts > 10) {
        throw new Error('Max login attempts must be between 1 and 10');
      }

      // Save to Firestore
      await updateDoc(doc(db, 'admin_settings', 'general'), {
        ...settings,
        lastUpdated: new Date(),
        updatedBy: user.email
      });

      setOriginalSettings(settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      let errorMessage = 'Failed to save settings';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your Firestore security rules. Make sure you have write access to the admin_settings collection.';
      } else if (error.message.includes('No authenticated user')) {
        errorMessage = 'Please log in again to save settings.';
      } else {
        errorMessage = error.message;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setMessage({ type: 'info', text: 'Settings reset to last saved state' });
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  return (
    <div className="p-6 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <HiCog className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">General Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Configure essential admin panel settings and Firebase integration
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
             <HiCog className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Basic Admin Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <HiCog className="w-5 h-5 mr-2" />
              Basic Admin Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter site name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  placeholder="admin@example.com"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email is managed by Firebase Authentication
                </p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <HiShieldCheck className="w-5 h-5 mr-2" />
              Security Settings
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Restrict access to admin panel</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lockout Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={settings.lockoutDuration}
                    onChange={(e) => handleInputChange('lockoutDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Login Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get notified of login attempts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableLoginNotifications}
                    onChange={(e) => handleInputChange('enableLoginNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* File Upload Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Upload Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Upload Size (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxUploadSize}
                  onChange={(e) => handleInputChange('maxUploadSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto Save Interval (seconds)
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={settings.autoSaveInterval}
                  onChange={(e) => handleInputChange('autoSaveInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Firebase Integration */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Firebase Integration</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Analytics</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Track admin panel usage</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableFirebaseAnalytics}
                    onChange={(e) => handleInputChange('enableFirebaseAnalytics', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Error Reporting</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Report errors to Firebase</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableErrorReporting}
                    onChange={(e) => handleInputChange('enableErrorReporting', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Performance Monitoring</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monitor admin panel performance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enablePerformanceMonitoring}
                    onChange={(e) => handleInputChange('enablePerformanceMonitoring', e.target.checked)}
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
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneralSettings;
