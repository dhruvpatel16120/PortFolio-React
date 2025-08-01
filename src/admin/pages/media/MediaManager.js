import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiPhotograph,
  HiVideoCamera,
  HiDownload,
  HiEye,
  HiX,
  HiSearch,
  HiSortAscending,
  HiSortDescending,
  HiCheck,
  HiRefresh,
  HiLink,
  HiViewGrid,
  HiViewList
} from 'react-icons/hi';
import MediaUpload from '../../components/MediaUpload';
import MediaGallery from '../../components/MediaGallery';
import MediaEdit from '../../components/MediaEdit';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { cloudinaryService } from '../../services/fileUploadService';

const MediaManager = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [filter, setFilter] = useState('all'); // all, images, videos
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, name, size, type
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);

  useEffect(() => {
    // Check Cloudinary configuration
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    
    console.log('Cloudinary Config Check:', {
      cloudName: cloudName ? 'Set' : 'Not Set',
      uploadPreset: uploadPreset ? 'Set' : 'Not Set'
    });
    
    if (!cloudName || !uploadPreset) {
      toast.error('Cloudinary configuration missing. Please check your environment variables.');
    }
    
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      
      // Check if Cloudinary is configured
      if (!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME) {
        console.log('Cloudinary not configured, using demo data');
        // Demo data for testing
        const demoFiles = [
          {
            publicId: 'demo/sample-image-1',
            url: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Sample+Image+1',
            type: 'image/jpeg',
            size: 1024000,
            createdAt: new Date('2024-01-15'),
            width: 400,
            height: 300,
            format: 'jpg'
          },
          {
            publicId: 'demo/sample-image-2',
            url: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Sample+Image+2',
            type: 'image/jpeg',
            size: 2048000,
            createdAt: new Date('2024-01-16'),
            width: 400,
            height: 300,
            format: 'jpg'
          },
          {
            publicId: 'demo/sample-video-1',
            url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            type: 'video/mp4',
            size: 1048576,
            createdAt: new Date('2024-01-17'),
            width: 1280,
            height: 720,
            format: 'mp4'
          }
        ];
        setMediaFiles(demoFiles);
        return;
      }
      
      const files = await cloudinaryService.getMediaFiles();
      console.log('Fetched media files:', files); // Debug log
      
      // Show appropriate message based on file count
      if (files.length === 0) {
        toast.info('Media library is empty. Upload your first file to get started!');
      } else {
        toast.success(`Found ${files.length} media file(s)`);
      }
      
      setMediaFiles(files || []);
    } catch (error) {
      console.error('Error fetching media files:', error);
      toast.error('Failed to fetch media files');
      setMediaFiles([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    try {
      setShowUpload(false);
      
      // Check if Cloudinary is configured
      if (!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME) {
        toast.error('Cloudinary is not configured. Please set up your Cloudinary account first.');
        return;
      }
      
      console.log('Uploading files:', files); // Debug log
      
      const uploadPromises = files.map(file => cloudinaryService.uploadToCloudinary(file));
      const results = await Promise.all(uploadPromises);
      
      console.log('Upload results:', results); // Debug log
      
      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);
      
      if (successfulUploads.length > 0) {
        toast.success(`${successfulUploads.length} file(s) uploaded successfully`);
        
        // Debug: Check localStorage after upload
        const storedFiles = localStorage.getItem('cloudinary_media_files');
        console.log('localStorage after upload:', storedFiles ? JSON.parse(storedFiles) : 'No files stored');
        
        // Refresh the media files list
        await fetchMediaFiles();
      }
      
      if (failedUploads.length > 0) {
        failedUploads.forEach(result => {
          toast.error(`Failed to upload: ${result.error}`);
        });
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    }
  };

  const handleDelete = async (file) => {
    if (window.confirm(`Are you sure you want to delete "${file.publicId?.split('/').pop()}"?`)) {
      try {
        // For demo files, just remove from local state
        if (file.publicId?.startsWith('demo/')) {
          setMediaFiles(prev => prev.filter(f => f.publicId !== file.publicId));
          toast.success('Demo file removed');
          return;
        }
        
        // Check if Cloudinary is configured
        if (!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME) {
          // If Cloudinary is not configured, just remove from local state
          setMediaFiles(prev => prev.filter(f => f.publicId !== file.publicId));
          toast.success('File removed from local storage');
          return;
        }
        
        const result = await cloudinaryService.deleteFromCloudinary(file.publicId);
        if (result.success) {
          toast.success('File deleted successfully');
          // Remove from local state immediately
          setMediaFiles(prev => prev.filter(f => f.publicId !== file.publicId));
        } else {
          throw new Error(result.error || 'Failed to delete file');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error(`Failed to delete file: ${error.message}`);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      try {
        // Check if Cloudinary is configured
        if (!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME) {
          // If Cloudinary is not configured, just remove from local state
          setMediaFiles(prev => prev.filter(f => !selectedFiles.find(sf => sf.publicId === f.publicId)));
          toast.success(`${selectedFiles.length} files removed from local storage`);
          setSelectedFiles([]);
          setBulkMode(false);
          return;
        }
        
        const deletePromises = selectedFiles.map(file => 
          cloudinaryService.deleteFromCloudinary(file.publicId)
        );
        const results = await Promise.all(deletePromises);
        
        const successCount = results.filter(r => r.success).length;
        const failedCount = results.length - successCount;
        
        if (successCount > 0) {
          toast.success(`${successCount} files deleted successfully`);
          // Remove successful deletions from local state
          setMediaFiles(prev => prev.filter(f => !selectedFiles.find(sf => sf.publicId === f.publicId)));
          setSelectedFiles([]);
          setBulkMode(false);
        }
        
        if (failedCount > 0) {
          toast.error(`${failedCount} files failed to delete`);
        }
      } catch (error) {
        console.error('Bulk delete error:', error);
        toast.error('Failed to delete files');
      }
    }
  };

  const handleFileSelect = (file) => {
    if (!bulkMode) return;
    
    setSelectedFiles(prev => {
      const isSelected = prev.find(f => f.publicId === file.publicId);
      if (isSelected) {
        return prev.filter(f => f.publicId !== file.publicId);
      } else {
        return [...prev, file];
      }
    });
  };

  const isFileSelected = (file) => {
    return selectedFiles.find(f => f.publicId === file.publicId);
  };

  const handleEdit = (file) => {
    setEditingFile(file);
    setShowEdit(true);
  };

  const handleEditSave = async (updatedFile) => {
    try {
      // Update the file in the local state
      setMediaFiles(prev => prev.map(file => 
        file.publicId === updatedFile.publicId ? updatedFile : file
      ));
      setShowEdit(false);
      setEditingFile(null);
      toast.success('File updated successfully');
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
    }
  };

  const handleEditCancel = () => {
    setShowEdit(false);
    setEditingFile(null);
  };

  const handleView = (file) => {
    setSelectedFile(file);
    setShowGallery(true);
  };

  const filteredAndSortedFiles = useMemo(() => {
    let filtered = mediaFiles.filter(file => {
      const matchesFilter = filter === 'all' || 
        (filter === 'images' && file.type?.startsWith('image/')) ||
        (filter === 'videos' && file.type?.startsWith('video/'));
      
      const matchesSearch = !searchTerm || 
        file.publicId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.url?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });

    // Sort files
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.publicId?.split('/').pop() || '';
          bValue = b.publicId?.split('/').pop() || '';
          break;
        case 'size':
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case 'type':
          aValue = a.type || '';
          bValue = b.type || '';
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [mediaFiles, searchTerm, filter, sortBy, sortOrder]);

  const getFileTypeIcon = (file) => {
    if (file.type?.startsWith('image/')) {
      return <HiPhotograph className="w-5 h-5" />;
    } else if (file.type?.startsWith('video/')) {
      return <HiVideoCamera className="w-5 h-5" />;
    }
    return <HiDownload className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your media files and assets</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <HiPlus className="w-5 h-5" />
          Upload Media
        </button>
      </div>

      {/* Advanced Filters and Search */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search files by name or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
                  <button
          onClick={() => fetchMediaFiles()}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Refresh"
        >
          <HiRefresh className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const storedFiles = localStorage.getItem('cloudinary_media_files');
            console.log('Debug: localStorage contents:', storedFiles ? JSON.parse(storedFiles) : 'No files');
            toast.info(`Found ${storedFiles ? JSON.parse(storedFiles).length : 0} files in localStorage`);
          }}
          className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
          title="Debug localStorage"
        >
          Debug
        </button>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              All Files
            </button>
            <button
              onClick={() => setFilter('images')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'images' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setFilter('videos')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'videos' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Videos
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
            
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {sortOrder === 'asc' ? <HiSortAscending className="w-5 h-5" /> : <HiSortDescending className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <HiViewGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <HiViewList className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setBulkMode(!bulkMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              bulkMode 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {bulkMode ? 'Exit Bulk Mode' : 'Bulk Actions'}
          </button>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedFiles.length} of {mediaFiles.length} files
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {bulkMode && selectedFiles.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {selectedFiles.length} file(s) selected
              </span>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedFiles.map((file) => (
                      <div key={file.publicId} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
              bulkMode && isFileSelected(file) ? 'ring-2 ring-blue-500' : ''
            }`}>
              {/* Selection indicator */}
              {bulkMode && (
                <div className="absolute top-2 left-2 z-10">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isFileSelected(file) 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}>
                    {isFileSelected(file) && <HiCheck className="w-3 h-3 text-white" />}
                  </div>
                </div>
              )}

              {/* File Preview */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                {file.type?.startsWith('image/') ? (
                  <img
                    src={file.url}
                    alt={file.publicId}
                    className="w-full h-full object-cover"
                  />
                ) : file.type?.startsWith('video/') ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-3">
                        <HiVideoCamera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {getFileTypeIcon(file)}
                  </div>
                )}
                
                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(file);
                    }}
                    className="bg-white/90 hover:bg-white text-gray-700 p-1 rounded transition-colors"
                    title="View"
                  >
                    <HiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(file);
                    }}
                    className="bg-white/90 hover:bg-white text-gray-700 p-1 rounded transition-colors"
                    title="Edit"
                  >
                    <HiPencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file);
                    }}
                    className="bg-red-500/90 hover:bg-red-500 text-white p-1 rounded transition-colors"
                    title="Delete"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* File Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getFileTypeIcon(file)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.publicId?.split('/').pop()}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div>Size: {formatFileSize(file.size)}</div>
                  <div>Type: {file.type}</div>
                  {file.createdAt && (
                    <div>Uploaded: {new Date(file.createdAt).toLocaleDateString()}</div>
                  )}
                </div>

                {/* Copy URL Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(file.url);
                    toast.success('URL copied to clipboard');
                  }}
                  className="mt-3 w-full px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Copy URL
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedFiles.map((file) => (
            <div
              key={file.publicId}
              className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
                bulkMode && isFileSelected(file) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => bulkMode ? handleFileSelect(file) : handleView(file)}
            >
              {/* Selection indicator */}
              {bulkMode && (
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isFileSelected(file) 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}>
                    {isFileSelected(file) && <HiCheck className="w-3 h-3 text-white" />}
                  </div>
                </div>
              )}

              {/* Thumbnail */}
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                {file.type?.startsWith('image/') ? (
                  <img
                    src={file.url}
                    alt={file.publicId}
                    className="w-full h-full object-cover"
                  />
                ) : file.type?.startsWith('video/') ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {getFileTypeIcon(file)}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getFileTypeIcon(file)}
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.publicId?.split('/').pop()}
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {formatFileSize(file.size)} • {file.type}
                </div>
                {file.createdAt && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(file.createdAt).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(file.url);
                    toast.success('URL copied to clipboard');
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  title="Copy URL"
                >
                  <HiLink className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(file);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  title="View"
                >
                  <HiEye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(file);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  title="Edit"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file);
                  }}
                  className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  title="Delete"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedFiles.length === 0 && (
        <div className="text-center py-12">
          <HiPhotograph className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No files found' : 'No media files yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms or filters.'
              : 'Get started by uploading your first media file.'
            }
          </p>
          
                     {/* Cloudinary Setup Guide */}
           {!searchTerm && !process.env.REACT_APP_CLOUDINARY_CLOUD_NAME && (
             <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4 max-w-2xl mx-auto">
               <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                 Cloudinary Setup Required
               </h4>
               <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                 To upload and manage media files, you need to configure Cloudinary:
               </p>
               <ol className="text-sm text-yellow-700 dark:text-yellow-300 text-left space-y-1">
                 <li>1. Sign up at <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline">cloudinary.com</a></li>
                 <li>2. Get your Cloud Name from the dashboard</li>
                 <li>3. Create an upload preset (Settings → Upload → Upload presets)</li>
                 <li>4. Run: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">npm run setup-cloudinary</code></li>
                 <li>5. Restart your development server</li>
               </ol>
             </div>
           )}
           
           {/* Upload Success Message */}
           {!searchTerm && process.env.REACT_APP_CLOUDINARY_CLOUD_NAME && mediaFiles.length === 0 && (
             <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4 max-w-2xl mx-auto">
               <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                 Ready to Upload!
               </h4>
               <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                 Your Cloudinary is configured. Upload your first media file to get started.
               </p>
               <p className="text-xs text-blue-600 dark:text-blue-400">
                 💡 Tip: Uploaded files will appear here immediately after upload.
               </p>
             </div>
           )}
          
          {!searchTerm && (
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              disabled={!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
            >
              {process.env.REACT_APP_CLOUDINARY_CLOUD_NAME ? 'Upload Your First File' : 'Configure Cloudinary First'}
            </button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <MediaUpload
          onUpload={handleUpload}
          onCancel={() => {
            setShowUpload(false);
            setEditingFile(null);
          }}
          editingFile={editingFile}
        />
      )}

      {/* Edit Modal */}
      {showEdit && editingFile && (
        <MediaEdit
          file={editingFile}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
          onDelete={handleDelete}
        />
      )}

      {/* Gallery Modal */}
      {showGallery && selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Media Preview
              </h3>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Preview */}
              <div className="flex justify-center">
                {selectedFile.type?.startsWith('image/') ? (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.publicId}
                    className="max-w-full max-h-96 object-contain rounded"
                  />
                ) : selectedFile.type?.startsWith('video/') ? (
                  <video
                    src={selectedFile.url}
                    controls
                    className="max-w-full max-h-96 rounded"
                  />
                ) : (
                  <div className="flex items-center justify-center w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded">
                    {getFileTypeIcon(selectedFile)}
                  </div>
                )}
              </div>

              {/* File Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">File Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <p className="text-gray-900 dark:text-white">{selectedFile.publicId?.split('/').pop()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <p className="text-gray-900 dark:text-white">{selectedFile.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Size:</span>
                    <p className="text-gray-900 dark:text-white">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Public ID:</span>
                    <p className="text-gray-900 dark:text-white text-xs break-all">{selectedFile.publicId}</p>
                  </div>
                </div>
                
                {/* URL */}
                <div className="mt-4">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">URL:</span>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={selectedFile.url}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-gray-50 dark:bg-gray-600 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedFile.url);
                        toast.success('URL copied to clipboard');
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager; 