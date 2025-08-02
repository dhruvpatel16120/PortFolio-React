import React from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';

const AnalyticsTracker = ({ 
  eventName, 
  eventType = 'click', 
  element = 'button', 
  value = null, 
  children, 
  className = '',
  ...props 
}) => {
  const { trackCustomEvent } = useAnalytics();

  const handleClick = (e) => {
    // Track the event
    trackCustomEvent(eventType, element, value || eventName);
    
    // Call original onClick if provided
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <div 
      {...props}
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

export default AnalyticsTracker; 