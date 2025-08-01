import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { 
  HiX, 
  HiSave, 
  HiTrash, 
  HiPhotograph,
  HiVideoCamera,
  HiDownload,
  HiLink,
  HiRefresh,
  HiCog,
  HiInformationCircle
} from 'react-icons/hi';
import { cloudinaryService } from '../services/fileUploadService';

const MediaEdit = ({ file, onSave, onCancel, onDelete }) => {
  const [editedFile, setEditedFile] = useState(file);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [transformations, setTransformations] = useState({
    width: file?.width || 0,
    height: file?.height || 0,
    quality: 80,
    format: 'auto',
    crop: 'scale'
  });
  const [metadata, setMetadata] = useState({
    title: file?.publicId?.split('/').pop() || '',
    description: '',
    tags: [],
    alt: ''
  });

  useEffect(() => {
    if (file) {
      setEditedFile(file);
      setTransformations({
        width: file.width || 0,
        height: file.height || 0,
        quality: 80,
        format: 'auto',
        crop: 'scale'
      });
    }
  }, [file]);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update metadata
      const updatedFile = {
        ...editedFile,
        metadata: metadata
      };

      // Apply transformations if needed
      if (transformations.width || transformations.height || transformations.quality !== 80) {
        const transformedUrl = cloudinaryService.transformImage(
          file.publicId,
          transformations
        );
        updatedFile.url = transformedUrl;
      }

      await onSave(updatedFile);
      toast.success('Media file updated successfully');
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        setLoading(true);
        await onDelete(file);
        // The success message will be handled by the parent component
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error('Failed to delete file');
      } finally {
        setLoading(false);
      }
    }
  };

  const addTag = (tag) => {
    if (tag.trim() && !metadata.tags.includes(tag.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const isVideo = file?.type?.startsWith('video/');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Media File
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {file?.publicId?.split('/').pop()}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 border-b-2 transition-colors ${
                    activeTab === 'preview'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('transform')}
                  className={`px-4 py-2 border-b-2 transition-colors ${
                    activeTab === 'transform'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Transform
                </button>
                <button
                  onClick={() => setActiveTab('metadata')}
                  className={`px-4 py-2 border-b-2 transition-colors ${
                    activeTab === 'metadata'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Metadata
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'preview' && (
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    {isVideo ? (
                      <video
                        src={file?.url}
                        controls
                        className="w-full max-h-96 rounded"
                      />
                    ) : (
                      <img
                        src={file?.url}
                        alt={file?.publicId}
                        className="w-full max-h-96 object-contain rounded"
                      />
                    )}
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">File Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <p className="text-gray-900 dark:text-white">{file?.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Size:</span>
                        <p className="text-gray-900 dark:text-white">
                          {file?.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                        <p className="text-gray-900 dark:text-white">
                          {file?.width} × {file?.height}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Uploaded:</span>
                        <p className="text-gray-900 dark:text-white">
                          {file?.createdAt ? new Date(file.createdAt).toLocaleString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transform' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <HiInformationCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                          Image Transformations
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          Transformations will create a new version of the image. The original file will remain unchanged.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={transformations.width}
                        onChange={(e) => setTransformations(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Auto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={transformations.height}
                        onChange={(e) => setTransformations(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Auto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quality (%)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={transformations.quality}
                        onChange={(e) => setTransformations(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {transformations.quality}%
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Format
                      </label>
                      <select
                        value={transformations.format}
                        onChange={(e) => setTransformations(prev => ({ ...prev, format: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="auto">Auto</option>
                        <option value="jpg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Transformed URL Preview</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 break-all">
                      {cloudinaryService.transformImage(file?.publicId, transformations)}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={metadata.title}
                      onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={metadata.description}
                      onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={metadata.alt}
                      onChange={(e) => setMetadata(prev => ({ ...prev, alt: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter alt text for accessibility"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add tag"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          addTag(input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {metadata.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(file?.url)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    <HiLink className="w-4 h-4" />
                    Copy URL
                  </button>
                  <button
                    onClick={() => window.open(file?.url, '_blank')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    <HiDownload className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => window.open(file?.url, '_blank')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    <HiPhotograph className="w-4 h-4" />
                    View Original
                  </button>
                </div>
              </div>

              {/* File Stats */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">File Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                    <span className="text-gray-900 dark:text-white">
                      {file?.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                    <span className="text-gray-900 dark:text-white">
                      {file?.width} × {file?.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Format:</span>
                    <span className="text-gray-900 dark:text-white">{file?.format?.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Upload Date:</span>
                    <span className="text-gray-900 dark:text-white">
                      {file?.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <HiTrash className="w-4 h-4" />
            Delete File
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <HiSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaEdit; 