# Analytics System Documentation

## Overview

The analytics system tracks user behavior, website performance, and engagement metrics to provide insights into how users interact with your portfolio website.

## Features

### 🎯 User Behavior Tracking
- **Page Views**: Track which pages users visit most
- **Session Duration**: Monitor how long users stay on your site
- **User Interactions**: Track clicks, scrolls, form submissions, and more
- **Navigation Patterns**: Understand user flow through your site

### ⚡ Performance Monitoring
- **Page Load Times**: Monitor website performance
- **Resource Loading**: Track image, script, and CSS load times
- **Performance Scores**: Get insights into website optimization
- **Real-time Metrics**: View live performance data

### 📊 Analytics Dashboard
- **Overview Cards**: Key metrics at a glance
- **Interactive Charts**: Visualize data trends
- **Performance Insights**: Detailed performance analysis
- **User Behavior Analysis**: Understand user engagement

## How It Works

### Automatic Tracking
The system automatically tracks:
- Page views and navigation
- Session start/end times
- User interactions (clicks, scrolls, form submissions)
- Performance metrics (load times, resource loading)
- Page visibility changes

### Manual Tracking
You can also track custom events using the analytics hooks:

```javascript
import { useAnalyticsTracking } from '../hooks/useAnalyticsTracking';

const MyComponent = () => {
  const { trackButtonClick, trackFormSubmit } = useAnalyticsTracking();

  const handleButtonClick = () => {
    trackButtonClick('cta_button', 'download_resume');
    // Your button logic here
  };

  const handleFormSubmit = (success) => {
    trackFormSubmit('contact_form', success);
    // Your form logic here
  };

  return (
    // Your component JSX
  );
};
```

## Analytics Dashboard

### Overview Metrics
- **Total Sessions**: Number of unique user sessions
- **Page Views**: Total page views across all sessions
- **Average Session Duration**: How long users typically stay
- **Page Views per Session**: Engagement depth
- **Total Interactions**: User engagement level
- **Average Page Load Time**: Website performance

### Charts and Visualizations
- **Page Views Over Time**: Daily page view trends
- **User Behavior**: Interaction type distribution
- **Performance Metrics**: Load time analysis
- **Top Pages**: Most visited pages ranking
- **User Interactions**: Most common user actions

### Performance Insights
- **Performance Score**: Overall website performance rating
- **Load Time Breakdown**: Detailed performance metrics
- **Resource Analysis**: File loading optimization insights

## Data Collection

### What We Track
- Session information (start time, duration, pages visited)
- Page view data (timestamp, page name, URL)
- User interactions (type, element, value)
- Performance metrics (load times, resource loading)
- Device information (screen resolution, user agent)

### Privacy Considerations
- No personally identifiable information is collected
- Data is anonymized and aggregated
- Users can opt out of tracking (if implemented)
- Data is stored securely in Firebase

## Usage Examples

### Tracking Custom Events
```javascript
// Track a button click
trackButtonClick('download_button', 'resume_pdf');

// Track form submission
trackFormSubmit('contact_form', true);

// Track link clicks
trackLinkClick('social_link', 'github');

// Track errors
trackError('form_validation', 'email_required');
```

### Performance Tracking
```javascript
// Track custom performance metrics
trackPerformanceMetric('custom_load_time', 1500);

// Track resource loading
trackPerformanceMetric('image_load_time', 800);
```

## Admin Access

Access the analytics dashboard at `/admin/analytics` in your admin panel. The dashboard provides:

1. **Real-time Data**: View current analytics data
2. **Time Range Selection**: Filter data by date range
3. **Export Options**: Download analytics reports (future feature)
4. **Performance Alerts**: Get notified of performance issues (future feature)

## Configuration

The analytics system can be configured through the admin settings:

- Enable/disable analytics tracking
- Set data retention periods
- Configure performance thresholds
- Set up automated reports

## Best Practices

1. **Respect Privacy**: Only track necessary data
2. **Performance**: Analytics should not impact site performance
3. **Regular Monitoring**: Check analytics regularly for insights
4. **Actionable Insights**: Use data to improve user experience
5. **Data Cleanup**: Regularly clean old analytics data

## Troubleshooting

### Common Issues
- **No Data Showing**: Check if analytics is enabled in settings
- **Performance Impact**: Ensure analytics service is optimized
- **Missing Events**: Verify tracking code is properly implemented

### Support
For issues with the analytics system, check:
1. Browser console for errors
2. Firebase configuration
3. Network connectivity
4. Admin panel settings 