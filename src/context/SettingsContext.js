import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Create context
const SettingsContext = createContext();

// Custom hook for cleaner usage
export function useSettings() {
  return useContext(SettingsContext);
}

export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    // Site Information
    siteName: 'Portfolio Admin',
    adminEmail: '',
    
    // Security Settings
    maintenanceMode: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableLoginNotifications: true,
    
    // File Upload Settings
    maxUploadSize: 10,
    autoSaveInterval: 30,
    
    // Firebase Integration
    enableFirebaseAnalytics: true,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
    
    // Content Management
    enableDraftMode: true,
    enableVersionControl: false,
    
    // Loading state
    loading: true,
    error: null,
    isAuthenticated: false
  });

  // Load settings from Firestore
  useEffect(() => {
    let unsubscribeAuth = null;
    let unsubscribeSettings = null;

    // Listen to authentication state changes
    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, load settings
        setSettings(prev => ({ 
          ...prev, 
          isAuthenticated: true,
          adminEmail: user.email,
          loading: true 
        }));

        // Listen to settings changes in real-time
        unsubscribeSettings = onSnapshot(
          doc(db, 'admin_settings', 'general'),
          (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setSettings(prev => ({
                ...prev,
                ...data,
                loading: false,
                error: null
              }));
            } else {
              // Use default settings if document doesn't exist
              setSettings(prev => ({
                ...prev,
                loading: false,
                error: null
              }));
            }
          },
          (error) => {
            console.error('Error loading settings:', error);
            setSettings(prev => ({
              ...prev,
              loading: false,
              error: error.message
            }));
          }
        );
      } else {
        // User is not authenticated, use default settings
        setSettings(prev => ({
          ...prev,
          isAuthenticated: false,
          adminEmail: '',
          loading: false,
          error: null
        }));
      }
    });

    // Cleanup function
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, []);

  // Check if site is in maintenance mode
  const isMaintenanceMode = () => {
    return settings.maintenanceMode;
  };

  // Get session timeout in milliseconds
  const getSessionTimeoutMs = () => {
    return settings.sessionTimeout * 60 * 1000; // Convert minutes to milliseconds
  };

  // Get max upload size in bytes
  const getMaxUploadSizeBytes = () => {
    return settings.maxUploadSize * 1024 * 1024; // Convert MB to bytes
  };

  // Check if feature is enabled
  const isFeatureEnabled = (feature) => {
    switch (feature) {
      case 'analytics':
        return settings.enableFirebaseAnalytics;
      case 'errorReporting':
        return settings.enableErrorReporting;
      case 'performanceMonitoring':
        return settings.enablePerformanceMonitoring;
      case 'loginNotifications':
        return settings.enableLoginNotifications;
      case 'draftMode':
        return settings.enableDraftMode;
      case 'versionControl':
        return settings.enableVersionControl;
      default:
        return false;
    }
  };

  const value = {
    settings,
    isMaintenanceMode,
    getSessionTimeoutMs,
    getMaxUploadSizeBytes,
    isFeatureEnabled
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
} 