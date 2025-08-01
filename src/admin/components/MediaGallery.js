import React, { useState, useEffect, useMemo } from 'react';
import { cloudinaryService } from '../services/fileUploadService';
import { toast } from 'react-toastify';
import { 
  HiX, 
  HiEye, 
  HiTrash, 
  HiPencil,
  HiSearch,
  HiFilter,
  HiDownload,
  HiLink,
  HiPhotograph,
  HiVideoCamera,
  HiDocument,
  HiCheck,
  HiSelector,
  HiDotsVertical,
  HiRefresh,
  HiSortAscending,
  HiSortDescending
} from 'react-icons/hi';

const MediaGallery = ({ 
  files = [], 
  onDelete, 
  onSelect, 
  onEdit,
  selectable = false,
  multiSelect = false,
  className = '',
  onRefresh,
  pickerMode = false,
  selectedFile = null
}) => {
  const [viewingFile, setViewingFile] = useState(null);
  const [mediaFiles, setMediaFiles] = useState(files);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, images, videos
  const [sortBy, setSortBy] = useState('date'); // date, name, size, type
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [loading, setLoading] = useState(false);

  // Update mediaFiles when files prop changes
  useEffect(() => {
    setMediaFiles(files);
  }, [files]);

  // If no files provided, try to fetch from localStorage
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const storedFiles = await cloudinaryService.getMediaFiles();
        console.log('MediaGallery: Fetched files from localStorage:', storedFiles);
        setMediaFiles(storedFiles);
      } catch (error) {
        console.error('Error fetching media files:', error);
        toast.error('Failed to fetch media files');
      } finally {
        setLoading(false);
      }
    };
    
    if (files.length === 0) {
      fetchFiles();
    } else {
      setMediaFiles(files);
    }
  }, [files.length, files]);

  // Filtered and sorted files
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

  const handleFileSelect = (file) => {
    if (!selectable) return;
    
    if (multiSelect) {
      setSelectedFiles(prev => {
        const isSelected = prev.find(f => f.publicId === file.publicId);
        if (isSelected) {
          return prev.filter(f => f.publicId !== file.publicId);
        } else {
          return [...prev, file];
        }
      });
    } else {
      if (onSelect) {
        onSelect(file);
      }
    }
  };

  const handleDelete = async (file) => {
    if (window.confirm(`Are you sure you want to delete "${file.publicId?.split('/').pop()}"?`)) {
    try {
      const result = await cloudinaryService.deleteFromCloudinary(file.publicId);
      if (result.success) {
        toast.success('File deleted successfully');
          setMediaFiles(prev => prev.filter(f => f.publicId !== file.publicId));
        onDelete?.(file);
      } else {
        throw new Error(result.error || 'Failed to delete file');
      }
    } catch (error) {
      toast.error(error.message);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      try {
        const deletePromises = selectedFiles.map(file => 
          cloudinaryService.deleteFromCloudinary(file.publicId)
        );
        const results = await Promise.all(deletePromises);
        
        const successCount = results.filter(r => r.success).length;
        const failedCount = results.length - successCount;
        
        if (successCount > 0) {
          toast.success(`${successCount} files deleted successfully`);
          setMediaFiles(prev => prev.filter(f => 
            !selectedFiles.find(sf => sf.publicId === f.publicId)
          ));
          setSelectedFiles([]);
        }
        
        if (failedCount > 0) {
          toast.error(`${failedCount} files failed to delete`);
        }
      } catch (error) {
        toast.error('Failed to delete files');
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const storedFiles = await cloudinaryService.getMediaFiles();
      console.log('MediaGallery: Refreshed files:', storedFiles);
      setMediaFiles(storedFiles);
      
      if (onRefresh) {
        await onRefresh(storedFiles);
      }
      
      toast.success('Media gallery refreshed');
    } catch (error) {
      console.error('Error refreshing media files:', error);
      toast.error('Failed to refresh media files');
    } finally {
      setLoading(false);
    }
  };

  const isVideo = (file) => {
    return file.resourceType === 'video' || file.type?.startsWith('video/');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeIcon = (file) => {
    if (file.type?.startsWith('image/')) {
      return <HiPhotograph className="w-5 h-5" />;
    } else if (file.type?.startsWith('video/')) {
      return <HiVideoCamera className="w-5 h-5" />;
    }
    return <HiDocument className="w-5 h-5" />;
  };

  const isFileSelected = (file) => {
    if (pickerMode && selectedFile) {
      return selectedFile.publicId === file.publicId;
    }
    return selectedFiles.find(f => f.publicId === file.publicId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (mediaFiles.length === 0) {
    return (
      <div className="text-center py-12">
        <HiPhotograph className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No media files available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your first file to get started
        </p>
      </div>
    );
  }

  return (
    <div className={`media-gallery ${className}`}>
      {/* Header with controls */}
      <div className="mb-6 space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
            </select>
            
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
        </div>

        {/* View Controls and Bulk Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              List
            </button>
          </div>

          <div className="flex items-center gap-2">
            {multiSelect && selectedFiles.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              >
                Delete Selected ({selectedFiles.length})
              </button>
            )}
            
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title="Refresh"
            >
              <HiRefresh className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedFiles.length} of {mediaFiles.length} files
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAndSortedFiles.map((file, index) => (
          <div
            key={file.publicId || index}
              className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectable && isFileSelected(file) ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => selectable ? handleFileSelect(file) : setViewingFile(file)}
          >
              {/* Selection indicator */}
              {multiSelect && (
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
            <div className="relative h-32 bg-gray-200 dark:bg-gray-700">
              {isVideo(file) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <video
                    src={file.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-2">
                      <div className="w-6 h-6 text-white text-center">▶</div>
                    </div>
                  </div>
                </div>
              ) : (
                <img 
                  src={file.url} 
                  alt={file.publicId}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewingFile(file);
                  }}
                    className="bg-white/90 hover:bg-white text-gray-700 p-1 rounded transition-colors"
                    title="View"
                  >
                    <HiEye className="w-4 h-4" />
                  </button>
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(file);
                      }}
                      className="bg-white/90 hover:bg-white text-gray-700 p-1 rounded transition-colors"
                      title="Edit"
                    >
                      <HiPencil className="w-4 h-4" />
                    </button>
                  )}
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
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  {getFileTypeIcon(file)}
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.publicId?.split('/').pop()}
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </div>
                {file.createdAt && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedFiles.map((file, index) => (
            <div
              key={file.publicId || index}
              className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
                selectable && isFileSelected(file) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => selectable ? handleFileSelect(file) : setViewingFile(file)}
            >
              {/* Selection indicator */}
              {multiSelect && (
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
                {isVideo(file) ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  </div>
                ) : (
                  <img 
                    src={file.url} 
                    alt={file.publicId}
                    className="w-full h-full object-cover"
                  />
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
                    setViewingFile(file);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  title="View"
                >
                  <HiEye className="w-4 h-4" />
                </button>
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(file);
                    }}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    title="Edit"
                  >
                    <HiPencil className="w-4 h-4" />
                  </button>
                )}
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

      {/* Preview Modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Media Preview
              </h3>
              <button
                onClick={() => setViewingFile(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Preview */}
              <div className="flex justify-center">
                {isVideo(viewingFile) ? (
                  <video
                    src={viewingFile.url}
                    controls
                    className="max-w-full max-h-96 rounded"
                  />
                ) : (
                  <img
                    src={viewingFile.url}
                    alt={viewingFile.publicId}
                    className="max-w-full max-h-96 object-contain rounded"
                  />
                )}
              </div>

              {/* File Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">File Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <p className="text-gray-900 dark:text-white">{viewingFile.publicId?.split('/').pop()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <p className="text-gray-900 dark:text-white">{viewingFile.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Size:</span>
                    <p className="text-gray-900 dark:text-white">{formatFileSize(viewingFile.size)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Public ID:</span>
                    <p className="text-gray-900 dark:text-white text-xs break-all">{viewingFile.publicId}</p>
                  </div>
                </div>
                
                {/* URL */}
                <div className="mt-4">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">URL:</span>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={viewingFile.url}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-gray-50 dark:bg-gray-600 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(viewingFile.url);
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

export default MediaGallery; 