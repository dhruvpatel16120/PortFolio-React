import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../../context/AnalyticsContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AnalyticsOverview from './AnalyticsOverview';
import PageViewsChart from './PageViewsChart';
import UserBehaviorChart from './UserBehaviorChart';
import PerformanceMetrics from './PerformanceMetrics';
import TopPagesTable from './TopPagesTable';
import UserInteractionsTable from './UserInteractionsTable';

const AnalyticsDashboard = () => {
  const { getAnalyticsData } = useAnalytics();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnalyticsData(timeRange);
        setAnalyticsData(data);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, getAnalyticsData]);

  const handleRefresh = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnalyticsData(timeRange);
        setAnalyticsData(data);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Analytics Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            No Analytics Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Analytics data will appear here once users start visiting your site.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track user behavior, performance, and engagement metrics
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <AnalyticsOverview summary={analyticsData.summary} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Page Views Over Time
          </h3>
          <PageViewsChart pageViews={analyticsData.pageViews} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Behavior
          </h3>
          <UserBehaviorChart interactions={analyticsData.interactions} />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Metrics
        </h3>
        <PerformanceMetrics performance={analyticsData.performance} />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Pages
          </h3>
          <TopPagesTable topPages={analyticsData.summary.topPages} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Interactions
          </h3>
          <UserInteractionsTable topInteractions={analyticsData.summary.topInteractions} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 