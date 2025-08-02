import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiTrendingUp, HiEye, HiClock, HiCursorClick } from 'react-icons/hi';
import { useAnalytics } from '../../context/AnalyticsContext';

const AnalyticsWidget = () => {
  const { getAnalyticsData } = useAnalytics();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const data = await getAnalyticsData(7); // Last 7 days
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [getAnalyticsData]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData || !analyticsData.summary) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <HiTrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Analytics
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            No analytics data available yet
          </p>
          <Link
            to="/admin/analytics"
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Analytics
          </Link>
        </div>
      </div>
    );
  }

  const { summary } = analyticsData;

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDuration = (ms) => {
    if (!ms) return '0s';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const metrics = [
    {
      title: 'Sessions',
      value: formatNumber(summary.totalSessions),
      icon: HiTrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Page Views',
      value: formatNumber(summary.totalPageViews),
      icon: HiEye,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Avg Duration',
      value: formatDuration(summary.avgSessionDuration),
      icon: HiClock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Interactions',
      value: formatNumber(summary.totalInteractions),
      icon: HiCursorClick,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Analytics Overview
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last 7 days
          </p>
        </div>
        <Link
          to="/admin/analytics"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {metric.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Page Views/Session
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {summary.pageViewsPerSession.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500 dark:text-gray-400">
            Avg Load Time
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {summary.avgPageLoadTime ? `${Math.round(summary.avgPageLoadTime)}ms` : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidget; 