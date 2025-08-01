import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  HiX, 
  HiPhotograph,
  HiCheck,
  HiRefresh,
  HiSearch,
  HiFilter
} from 'react-icons/hi';
import { cloudinaryService } from '../services/fileUploadService';

const ImagePicker = ({ 
  onSelect, 
  onCancel, 
  selectedImage = null,
  title = "Select Image",
  description = "Choose an image from your media library",
  showUploadButton = true
}) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchMediaFiles = useCallback(async () => {
    try {
      setLoading(true);
      const files = await cloudinaryService.getMediaFiles();
      const imageFiles = files.filter(file => file.type?.startsWith('image/'));
      setMediaFiles(imageFiles);
      console.log('ImagePicker: Fetched', imageFiles.length, 'images');
    } catch (error) {
      console.error('Error fetching media files:', error);
      toast.error('Failed to fetch media files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('ImagePicker: Component mounted');
    fetchMediaFiles();
  }, [fetchMediaFiles]);

  // Filter images based on search term
  const filteredFiles = mediaFiles.filter(file => 
    file.publicId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageSelect = useCallback((file, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('ImagePicker: Image selected:', file);
    setSelectedFile(file);
  }, []);

  const handleUseSelectedImage = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('ImagePicker: Use Selected Image clicked');
    if (selectedFile && onSelect) {
      console.log('ImagePicker: Calling onSelect with:', selectedFile);
      onSelect(selectedFile);
    }
  }, [selectedFile, onSelect]);

  const handleCancel = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('ImagePicker: Cancel clicked');
    onCancel();
  }, [onCancel]);

  const handleRefresh = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await fetchMediaFiles();
    toast.success('Image library refreshed');
  }, [fetchMediaFiles]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      console.log('ImagePicker: Escape key pressed');
      handleCancel();
    }
  }, [handleCancel]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading images...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
          
          {/* Search and Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* View Mode Toggle */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors"
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              <HiFilter className="w-5 h-5" />
            </button>
            
            {/* Refresh */}
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors"
              title="Refresh"
            >
              <HiRefresh className="w-5 h-5" />
            </button>
            
            {/* Close */}
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <HiPhotograph className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No images found' : 'No images available'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Upload your first image to get started'}
              </p>
              {showUploadButton && !searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    toast.info('Please upload images from the Media Manager first');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Upload Images
                </button>
              )}
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                : 'space-y-2'
            }`}>
              {filteredFiles.map((file) => (
                <div
                  key={file.publicId}
                  onClick={(e) => handleImageSelect(file, e)}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-lg ${
                    viewMode === 'grid' 
                      ? 'aspect-square' 
                      : 'flex items-center p-2'
                  } ${
                    (selectedFile && selectedFile.publicId === file.publicId) || selectedImage === file.url
                      ? 'border-blue-500 ring-2 ring-blue-500' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  {/* Image */}
                  <div className={`${
                    viewMode === 'grid' 
                      ? 'w-full h-full bg-gray-100 dark:bg-gray-700' 
                      : 'w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0'
                  }`}>
                    <img
                      src={file.url}
                      alt={file.publicId?.split('/').pop() || 'Image'}
                      className={`${
                        viewMode === 'grid' 
                          ? 'w-full h-full object-cover' 
                          : 'w-full h-full object-cover rounded-lg'
                      }`}
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Selection Indicator */}
                  {((selectedFile && selectedFile.publicId === file.publicId) || selectedImage === file.url) && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <HiCheck className="w-4 h-4" />
                    </div>
                  )}
                  
                  {/* Overlay for grid view */}
                  {viewMode === 'grid' && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-1 text-sm font-medium">
                          Click to select
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* File Info */}
                  {viewMode === 'grid' ? (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs truncate">
                        {file.publicId?.split('/').pop() || 'Image'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 ml-3 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.publicId?.split('/').pop() || 'Image'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {file.url}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredFiles.length} of {mediaFiles.length} image{mediaFiles.length !== 1 ? 's' : ''} available
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 sm:flex-none px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            {selectedFile && (
              <button
                type="button"
                onClick={handleUseSelectedImage}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Use Selected Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePicker; 