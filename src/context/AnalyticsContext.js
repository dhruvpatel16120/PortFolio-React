import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsService from '../services/analyticsService';

const AnalyticsContext = createContext();

export function useAnalytics() {
  return useContext(AnalyticsContext);
}

export default function AnalyticsProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const location = useLocation();

  // Initialize analytics when the app loads
  useEffect(() => {
    if (!isInitialized) {
      analyticsService.init();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Track page changes
  useEffect(() => {
    if (isInitialized && location.pathname) {
      const pageName = getPageNameFromPath(location.pathname);
      setCurrentPage(pageName);
      analyticsService.trackPageView(pageName, window.location.href);
    }
  }, [location.pathname, isInitialized]);

  // Track session end when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      analyticsService.endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      analyticsService.endSession();
    };
  }, []);

  // Helper function to get page name from path
  const getPageNameFromPath = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Home';
      case '/about':
        return 'About';
      case '/projects':
        return 'Projects';
      case '/contact':
        return 'Contact';
      case '/resume':
        return 'Resume';
      default:
        return 'Unknown';
    }
  };

  // Manual tracking functions
  const trackEvent = (eventName, properties = {}) => {
    if (isInitialized) {
      analyticsService.trackInteraction(eventName, properties.element, properties.value);
    }
  };

  const trackCustomEvent = (type, element, value) => {
    if (isInitialized) {
      analyticsService.trackInteraction(type, element, value);
    }
  };

  const trackPerformance = (metrics) => {
    if (isInitialized) {
      analyticsService.trackPerformance(metrics);
    }
  };

  const getAnalyticsData = async (days = 30) => {
    return await analyticsService.getAnalyticsData(days);
  };

  const value = {
    isInitialized,
    currentPage,
    trackEvent,
    trackCustomEvent,
    trackPerformance,
    getAnalyticsData
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
} 