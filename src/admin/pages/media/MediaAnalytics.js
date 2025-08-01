import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  HiPhotograph,
  HiVideoCamera,
  HiDownload,
  HiEye,
  HiTrendingUp,
  HiTrendingDown,
  HiCalendar,
  HiChartBar,
  HiInformationCircle
} from 'react-icons/hi';
import { cloudinaryService } from '../../services/fileUploadService';

const MediaAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalFiles: 0,
    totalSize: 0,
    images: 0,
    videos: 0,
    recentUploads: [],
    storageUsage: 0,
    bandwidthUsage: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get media files
      const files = await cloudinaryService.getMediaFiles();
      
      // Calculate analytics
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
      const images = files.filter(file => file.type?.startsWith('image/')).length;
      const videos = files.filter(file => file.type?.startsWith('video/')).length;
      
      // Get recent uploads (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUploads = files
        .filter(file => new Date(file.createdAt) > thirtyDaysAgo)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      // Calculate storage usage (assuming free tier limits)
      const storageUsage = (totalSize / (25 * 1024 * 1024 * 1024)) * 100; // 25GB free tier
      
      setAnalytics({
        totalFiles,
        totalSize,
        images,
        videos,
        recentUploads,
        storageUsage: Math.min(storageUsage, 100),
        bandwidthUsage: Math.random() * 100 // Mock data
      });
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageColor = (usage) => {
    if (usage < 50) return 'text-green-600 dark:text-green-400';
    if (usage < 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStorageBgColor = (usage) => {
    if (usage < 50) return 'bg-green-100 dark:bg-green-900/20';
    if (usage < 80) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your media usage and performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Files */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalFiles}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <HiPhotograph className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Size */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatFileSize(analytics.totalSize)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <HiDownload className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Images</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.images}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <HiPhotograph className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Videos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.videos}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <HiVideoCamera className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Storage and Bandwidth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Storage Usage</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Used Space</span>
              <span className={`text-sm font-medium ${getStorageColor(analytics.storageUsage)}`}>
                {analytics.storageUsage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStorageBgColor(analytics.storageUsage)}`}
                style={{ width: `${analytics.storageUsage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(analytics.totalSize)} of 25 GB used
            </div>
          </div>
        </div>

        {/* Bandwidth Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bandwidth Usage</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {analytics.bandwidthUsage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analytics.bandwidthUsage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(analytics.totalSize * 0.1)} of 25 GB bandwidth used
            </div>
          </div>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Uploads</h3>
          <button
            onClick={fetchAnalytics}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
          >
            Refresh
          </button>
        </div>
        
        {analytics.recentUploads.length > 0 ? (
          <div className="space-y-3">
            {analytics.recentUploads.map((file, index) => (
              <div key={file.publicId || index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                  {file.type?.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.publicId}
                      className="w-full h-full object-cover"
                    />
                  ) : file.type?.startsWith('video/') ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiVideoCamera className="w-6 h-6 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiDownload className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.publicId?.split('/').pop()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <HiInformationCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No recent uploads</p>
          </div>
        )}
      </div>

      {/* Usage Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Usage Tips</h3>
        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <p>• Optimize images before upload to reduce storage usage</p>
          <p>• Use WebP format for better compression</p>
          <p>• Consider video compression for large video files</p>
          <p>• Regular cleanup of unused files helps manage storage</p>
        </div>
      </div>
    </div>
  );
};

export default MediaAnalytics; 