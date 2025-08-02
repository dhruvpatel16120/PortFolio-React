import React, { useState, useEffect } from 'react';
import { 
  HiChartBar, 
  HiDeviceMobile, 
  HiDesktopComputer, 
  HiUsers,
  HiMail,
  HiClock,
  HiTrendingUp,
  HiTrendingDown,
  HiDownload,
  HiEye,
  HiRefresh,
} from 'react-icons/hi';
import { FaMapPin } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getContactAnalytics } from '../../../firebase/contactService';

// Mock analytics data - moved outside component to avoid dependency issues
const mockAnalytics = {
  overview: {
    totalSubmissions: 156,
    newSubmissions: 23,
    repliedSubmissions: 89,
    avgResponseTime: '2.3 hours',
    conversionRate: '68%'
  },
  devices: [
    { type: 'desktop', count: 89, percentage: 57 },
    { type: 'mobile', count: 52, percentage: 33 },
    { type: 'tablet', count: 15, percentage: 10 }
  ],
  locations: [
    { country: 'United States', count: 45, percentage: 29 },
    { country: 'India', count: 32, percentage: 21 },
    { country: 'United Kingdom', count: 28, percentage: 18 },
    { country: 'Canada', count: 18, percentage: 12 },
    { country: 'Australia', count: 15, percentage: 10 },
    { country: 'Others', count: 18, percentage: 12 }
  ],
  // New analytics data
  statusBreakdown: [
    { status: 'new', count: 23, percentage: 15, color: 'blue' },
    { status: 'read', count: 34, percentage: 22, color: 'yellow' },
    { status: 'replied', count: 89, percentage: 57, color: 'green' },
    { status: 'archived', count: 10, percentage: 6, color: 'gray' }
  ],
  responseTimeAnalysis: [
    { range: '0-1 hour', count: 45, percentage: 29 },
    { range: '1-4 hours', count: 67, percentage: 43 },
    { range: '4-24 hours', count: 32, percentage: 21 },
    { range: '24+ hours', count: 12, percentage: 7 }
  ],
  trends: {
    daily: [12, 15, 8, 20, 18, 25, 22, 19, 16, 14, 21, 24, 18, 15, 12, 20, 23, 19, 17, 14, 16, 18, 22, 25, 21, 19, 16, 14, 18, 20],
    weekly: [85, 92, 78, 105, 98, 112, 95],
    monthly: [320, 385, 420, 398, 456, 432]
  },
  topReferrers: [
    { source: 'Direct', count: 45, percentage: 29 },
    { source: 'Google', count: 38, percentage: 24 },
    { source: 'Social Media', count: 32, percentage: 21 },
    { source: 'Email', count: 25, percentage: 16 },
    { source: 'Other', count: 16, percentage: 10 }
  ]
};

const ContactAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [timePeriod, setTimePeriod] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const result = await getContactAnalytics(timePeriod);
        if (result.success && result.data) {
          // Merge with mock data to ensure all required properties exist
          setAnalytics({
            ...mockAnalytics,
            ...result.data,
            // Ensure nested objects are properly merged
            overview: { ...mockAnalytics.overview, ...result.data.overview },
            devices: result.data.devices || mockAnalytics.devices,
            locations: result.data.locations || mockAnalytics.locations,
            statusBreakdown: result.data.statusBreakdown || mockAnalytics.statusBreakdown,
            responseTimeAnalysis: result.data.responseTimeAnalysis || mockAnalytics.responseTimeAnalysis,
            topReferrers: result.data.topReferrers || mockAnalytics.topReferrers,
            trends: { ...mockAnalytics.trends, ...result.data.trends }
          });
        } else {
          toast.error('Failed to load analytics: ' + (result.error || 'Unknown error'));
          // Fallback to mock data
          setAnalytics(mockAnalytics);
        }
      } catch (error) {
        console.error('Load analytics error:', error);
        toast.error('Failed to load analytics');
        // Fallback to mock data
        setAnalytics(mockAnalytics);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timePeriod]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await getContactAnalytics(timePeriod);
      if (result.success && result.data) {
        // Merge with mock data to ensure all required properties exist
        setAnalytics({
          ...mockAnalytics,
          ...result.data,
          // Ensure nested objects are properly merged
          overview: { ...mockAnalytics.overview, ...result.data.overview },
          devices: result.data.devices || mockAnalytics.devices,
          locations: result.data.locations || mockAnalytics.locations,
          statusBreakdown: result.data.statusBreakdown || mockAnalytics.statusBreakdown,
          responseTimeAnalysis: result.data.responseTimeAnalysis || mockAnalytics.responseTimeAnalysis,
          topReferrers: result.data.topReferrers || mockAnalytics.topReferrers,
          trends: { ...mockAnalytics.trends, ...result.data.trends }
        });
        toast.success('Analytics refreshed successfully');
      } else {
        toast.error('Failed to refresh analytics');
      }
    } catch (error) {
      toast.error('Failed to refresh analytics');
    } finally {
      setRefreshing(false);
    }
  };

  const exportAnalytics = () => {
    const data = {
      period: timePeriod,
      timestamp: new Date().toISOString(),
      analytics: analytics
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-analytics-${timePeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Analytics exported successfully');
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-500',
      read: 'bg-yellow-500',
      replied: 'bg-green-500',
      archived: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <HiTrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <HiTrendingDown className="w-4 h-4 text-red-500" />;
    return <HiChartBar className="w-4 h-4 text-gray-500" />;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header with Controls */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Contact Analytics
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Comprehensive analytics and insights about your contact form performance.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 lg:mt-0">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
              >
                <HiRefresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportAnalytics}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center space-x-2 text-sm"
              >
                <HiDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <HiMail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.overview?.totalSubmissions || 0}
                  </p>
                </div>
              </div>
              {getTrendIcon(analytics.overview?.totalSubmissions || 0, 140)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <HiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">New</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.overview?.newSubmissions || 0}
                  </p>
                </div>
              </div>
              {getTrendIcon(analytics.overview?.newSubmissions || 0, 18)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <HiClock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Response Time</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.overview?.avgResponseTime || 'N/A'}
                  </p>
                </div>
              </div>
              {getTrendIcon(2.3, 2.8)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <HiChartBar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Conversion</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.overview?.conversionRate || 'N/A'}
                  </p>
                </div>
              </div>
              {getTrendIcon(68, 65)}
            </div>
          </div>
        </div>

        {/* New Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Status Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <HiEye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Submission Status Breakdown
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {(analytics.statusBreakdown || []).map((status) => (
                <div key={status.status} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status)} mr-3`}></div>
                    <span className="font-medium text-gray-900 dark:text-white capitalize text-sm sm:text-base">
                      {status.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStatusColor(status.status)}`}
                        style={{ width: `${status.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {status.count} ({status.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <HiClock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Response Time Analysis
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {(analytics.responseTimeAnalysis || []).map((timeRange) => (
                <div key={timeRange.range} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <div className="flex items-center">
                    <HiClock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {timeRange.range}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${timeRange.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {timeRange.count} ({timeRange.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Referrer Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <HiChartBar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Traffic Sources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(analytics.topReferrers || []).map((referrer) => (
              <div key={referrer.source} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    {referrer.source}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    {referrer.count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${referrer.percentage}%` }}
                  />
                </div>
                <div className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {referrer.percentage}% of total traffic
                </div>
              </div>
            ))}
          </div>
        </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Device Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Device Breakdown
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {(analytics.devices || []).map((device, index) => (
                <div key={device.type} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <div className="flex items-center">
                    {device.type === 'desktop' ? (
                      <HiDesktopComputer className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-3" />
                    ) : (
                      <HiDeviceMobile className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white capitalize text-sm sm:text-base">
                      {device.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {device.count} ({device.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Geographic Distribution
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {(analytics.locations || []).map((location, index) => (
                <div key={location.country} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <div className="flex items-center">
                    <FaMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 sm:mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {location.country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {location.count} ({location.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAnalytics; 