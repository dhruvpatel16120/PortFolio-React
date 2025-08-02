import React from 'react';

const AnalyticsOverview = ({ summary }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDuration = (ms) => {
    if (!ms) return '0s';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatTime = (ms) => {
    if (!ms) return '0ms';
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    } else {
      return `${(ms / 1000).toFixed(2)}s`;
    }
  };

  const metrics = [
    {
      title: 'Total Sessions',
      value: formatNumber(summary.totalSessions),
      change: '+12%',
      changeType: 'positive',
      icon: '👥',
      color: 'bg-blue-500',
      description: 'Unique user sessions'
    },
    {
      title: 'Page Views',
      value: formatNumber(summary.totalPageViews),
      change: '+8%',
      changeType: 'positive',
      icon: '📄',
      color: 'bg-green-500',
      description: 'Total page views'
    },
    {
      title: 'Avg Session Duration',
      value: formatDuration(summary.avgSessionDuration),
      change: '+5%',
      changeType: 'positive',
      icon: '⏱️',
      color: 'bg-purple-500',
      description: 'Average time per session'
    },
    {
      title: 'Page Views/Session',
      value: summary.pageViewsPerSession.toFixed(1),
      change: '+3%',
      changeType: 'positive',
      icon: '📊',
      color: 'bg-orange-500',
      description: 'Pages viewed per session'
    },
    {
      title: 'Interactions',
      value: formatNumber(summary.totalInteractions),
      change: '+15%',
      changeType: 'positive',
      icon: '🖱️',
      color: 'bg-red-500',
      description: 'User interactions tracked'
    },
    {
      title: 'Avg Page Load Time',
      value: formatTime(summary.avgPageLoadTime),
      change: '-12%',
      changeType: 'negative',
      icon: '⚡',
      color: 'bg-teal-500',
      description: 'Average page load performance'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${metric.color} bg-opacity-10`}>
              {metric.icon}
            </div>
            <div className={`text-sm font-medium px-2 py-1 rounded-full ${
              metric.changeType === 'positive' 
                ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400' 
                : 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400'
            }`}>
              {metric.change}
            </div>
          </div>
          
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {metric.title}
            </p>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsOverview; 