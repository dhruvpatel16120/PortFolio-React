import { useAnalytics } from '../context/AnalyticsContext';

export const useAnalyticsTracking = () => {
  const { trackEvent, trackCustomEvent, trackPerformance } = useAnalytics();

  const trackPageView = (pageName) => {
    trackCustomEvent('page_view', 'navigation', pageName);
  };

  const trackButtonClick = (buttonName, value = null) => {
    trackCustomEvent('click', buttonName, value);
  };

  const trackFormSubmit = (formName, success = true) => {
    trackCustomEvent('form_submit', formName, success ? 'success' : 'error');
  };

  const trackLinkClick = (linkName, destination) => {
    trackCustomEvent('link_click', linkName, destination);
  };

  const trackScroll = (depth) => {
    trackCustomEvent('scroll_depth', 'page', depth);
  };

  const trackTimeOnPage = (timeInSeconds) => {
    trackCustomEvent('time_on_page', 'engagement', timeInSeconds);
  };

  const trackError = (errorType, errorMessage) => {
    trackCustomEvent('error', errorType, errorMessage);
  };

  const trackPerformanceMetric = (metricName, value) => {
    trackPerformance({ [metricName]: value });
  };

  return {
    trackPageView,
    trackButtonClick,
    trackFormSubmit,
    trackLinkClick,
    trackScroll,
    trackTimeOnPage,
    trackError,
    trackPerformanceMetric,
    trackEvent,
    trackCustomEvent,
    trackPerformance
  };
}; 