import React, { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  HiX, 
  HiUpload, 
  HiPhotograph, 
  HiVideoCamera,
  HiDocument,
  HiTrash,
  HiCheck,
  HiEye,
  HiPencil,
  HiCloudUpload,
  HiExclamation,
  HiInformationCircle
} from 'react-icons/hi';

const MediaUpload = ({ onUpload, onCancel, editingFile = null, onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [fileErrors, setFileErrors] = useState({});
  const fileInputRef = useRef(null);

  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'
  ];

  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const maxFiles = 10;

  const validateFile = (file) => {
    const errors = [];

    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name} is not a supported file type`);
    }

    if (file.size > maxFileSize) {
      errors.push(`${file.name} is too large. Maximum size is 100MB`);
    }

    return errors;
  };

  const handleFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    const errors = {};
    const validFiles = [];

    // Check file count limit
    if (files.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    fileArray.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        errors[file.name] = fileErrors;
        toast.error(fileErrors.join(', '));
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      setFileErrors(prev => ({ ...prev, ...errors }));
    }
  }, [files]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFileErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[files[index]?.name];
      return newErrors;
    });
    if (previewFile === files[index]) {
      setPreviewFile(null);
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(files);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset after a short delay
      setTimeout(() => {
        setFiles([]);
        setUploadProgress(0);
        setPreviewFile(null);
        setFileErrors({});
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <HiPhotograph className="w-6 h-6" />;
    } else if (file.type.startsWith('video/')) {
      return <HiVideoCamera className="w-6 h-6" />;
    }
    return <HiDocument className="w-6 h-6" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    } else if (file.type.startsWith('video/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingFile ? 'Edit Media File' : 'Upload Media Files'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Upload images and videos to your media library
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <HiCloudUpload className="w-12 h-12 text-gray-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Drop files here or click to browse
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Supports images (JPEG, PNG, GIF, WebP, SVG) and videos (MP4, MOV, AVI, WebM)
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                      <p>Maximum file size: 100MB</p>
                      <p>Maximum files: {maxFiles}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    disabled={uploading}
                  >
                    Choose Files
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={allowedTypes.join(',')}
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={uploading}
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Selected Files ({files.length}/{maxFiles})
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setFiles([]);
                        setFileErrors({});
                        setPreviewFile(null);
                      }}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          fileErrors[file.name] 
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getFileIcon(file)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {formatFileSize(file.size)} • {file.type}
                            </p>
                            {fileErrors[file.name] && (
                              <p className="text-xs text-red-600 dark:text-red-400">
                                {fileErrors[file.name].join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handlePreview(file)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            title="Preview"
                          >
                            <HiEye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                            title="Remove"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Uploading files...
                    </span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={files.length === 0 || uploading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <HiCheck className="w-4 h-4" />
                      Upload Files
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                File Preview
              </h3>
              
              {previewFile ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    {previewFile.type.startsWith('image/') ? (
                      <img
                        src={getFilePreview(previewFile)}
                        alt={previewFile.name}
                        className="w-full h-64 object-contain rounded"
                      />
                    ) : previewFile.type.startsWith('video/') ? (
                      <video
                        src={getFilePreview(previewFile)}
                        controls
                        className="w-full h-64 object-contain rounded"
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center text-gray-400">
                        {getFileIcon(previewFile)}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">File Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Name:</span>
                        <p className="text-gray-900 dark:text-white">{previewFile.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <p className="text-gray-900 dark:text-white">{previewFile.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Size:</span>
                        <p className="text-gray-900 dark:text-white">{formatFileSize(previewFile.size)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Last Modified:</span>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(previewFile.lastModified).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                  <HiInformationCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a file to preview its details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload; 