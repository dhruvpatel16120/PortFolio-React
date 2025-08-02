import React from 'react';

const PerformanceMetrics = ({ performance }) => {
  const formatTime = (ms) => {
    if (!ms) return '0ms';
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    } else {
      return `${(ms / 1000).toFixed(2)}s`;
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate performance statistics
  const calculateStats = () => {
    if (!performance || performance.length === 0) {
      return {
        avgPageLoadTime: 0,
        avgDomContentLoaded: 0,
        avgFirstPaint: 0,
        avgFirstContentfulPaint: 0,
        totalResources: 0,
        avgResourceLoadTime: 0,
        totalResourceSize: 0
      };
    }

    const pageLoads = performance.filter(p => p.pageLoadTime);
    const domLoads = performance.filter(p => p.domContentLoaded);
    const firstPaints = performance.filter(p => p.firstPaint);
    const firstContentfulPaints = performance.filter(p => p.firstContentfulPaint);
    const resources = performance.filter(p => p.resourceLoadTime);

    return {
      avgPageLoadTime: pageLoads.length > 0 
        ? pageLoads.reduce((sum, p) => sum + p.pageLoadTime, 0) / pageLoads.length 
        : 0,
      avgDomContentLoaded: domLoads.length > 0 
        ? domLoads.reduce((sum, p) => sum + p.domContentLoaded, 0) / domLoads.length 
        : 0,
      avgFirstPaint: firstPaints.length > 0 
        ? firstPaints.reduce((sum, p) => sum + p.firstPaint, 0) / firstPaints.length 
        : 0,
      avgFirstContentfulPaint: firstContentfulPaints.length > 0 
        ? firstContentfulPaints.reduce((sum, p) => sum + p.firstContentfulPaint, 0) / firstContentfulPaints.length 
        : 0,
      totalResources: resources.length,
      avgResourceLoadTime: resources.length > 0 
        ? resources.reduce((sum, p) => sum + p.resourceLoadTime, 0) / resources.length 
        : 0,
      totalResourceSize: resources.reduce((sum, p) => sum + (p.resourceSize || 0), 0)
    };
  };

  const stats = calculateStats();

  const getPerformanceScore = (loadTime) => {
    if (loadTime < 1000) return { score: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (loadTime < 3000) return { score: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (loadTime < 5000) return { score: 'Fair', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { score: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const pageLoadScore = getPerformanceScore(stats.avgPageLoadTime);

  const metrics = [
    {
      title: 'Page Load Time',
      value: formatTime(stats.avgPageLoadTime),
      description: 'Average time to fully load page',
      icon: '⚡',
      score: pageLoadScore
    },
    {
      title: 'DOM Content Loaded',
      value: formatTime(stats.avgDomContentLoaded),
      description: 'Time to parse and render DOM',
      icon: '📄',
      score: getPerformanceScore(stats.avgDomContentLoaded)
    },
    {
      title: 'First Paint',
      value: formatTime(stats.avgFirstPaint),
      description: 'Time to first pixel on screen',
      icon: '🎨',
      score: getPerformanceScore(stats.avgFirstPaint)
    },
    {
      title: 'First Contentful Paint',
      value: formatTime(stats.avgFirstContentfulPaint),
      description: 'Time to first meaningful content',
      icon: '📝',
      score: getPerformanceScore(stats.avgFirstContentfulPaint)
    },
    {
      title: 'Resource Load Time',
      value: formatTime(stats.avgResourceLoadTime),
      description: 'Average time to load resources',
      icon: '📦',
      score: getPerformanceScore(stats.avgResourceLoadTime)
    },
    {
      title: 'Total Resource Size',
      value: formatBytes(stats.totalResourceSize),
      description: 'Total size of loaded resources',
      icon: '💾'
    }
  ];

  if (performance.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">⚡</div>
          <p>No performance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Overall Performance Score
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Based on average page load times
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full ${pageLoadScore.bg} ${pageLoadScore.color} font-semibold`}>
            {pageLoadScore.score}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">{metric.icon}</div>
              {metric.score && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${metric.score.bg} ${metric.score.color}`}>
                  {metric.score.score}
                </div>
              )}
            </div>
            
            <div className="mb-2">
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                {metric.value}
              </h5>
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

      {/* Performance Insights */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Performance Insights
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Performance Records:</span>
            <span className="font-medium text-gray-900 dark:text-white">{performance.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Resources Tracked:</span>
            <span className="font-medium text-gray-900 dark:text-white">{stats.totalResources}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Average Resource Load:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatTime(stats.avgResourceLoadTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics; 