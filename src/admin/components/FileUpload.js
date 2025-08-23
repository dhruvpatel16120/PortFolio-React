import React, { useState, useCallback } from 'react';
import { cloudinaryService } from '../services/fileUploadService';
import fileUploadService from '../../services/fileUploadService';
import { toast } from 'react-toastify';

const FileUpload = ({ 
  onUploadSuccess, 
  onUploadError, 
  folder = 'portfolio',
  maxFiles = 5,
  allowedTypes = ['image', 'video'],
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file selection
  const handleFileSelect = useCallback(async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileArray = Array.from(files);
      
      // Validate file count
      if (fileArray.length > maxFiles) {
        throw new Error(`Maximum ${maxFiles} files allowed`);
      }

      // Validate files
      const validationResults = fileUploadService.validateFiles(fileArray);
      const invalidFiles = validationResults.filter(result => !result.valid);
      
      if (invalidFiles.length > 0) {
        const errorMessages = invalidFiles.map(result => 
          `${result.file.name}: ${result.error}`
        ).join(', ');
        throw new Error(errorMessages);
      }

      // Check total file size
      const totalSizeCheck = fileUploadService.checkTotalSize(fileArray);
      if (!totalSizeCheck.valid) {
        throw new Error(totalSizeCheck.error);
      }

      // Validate file types for Cloudinary
      const validFiles = fileArray.filter(file => {
        const isImage = cloudinaryService.isImageFile(file);
        const isVideo = cloudinaryService.isVideoFile(file);
        return (allowedTypes.includes('image') && isImage) || 
               (allowedTypes.includes('video') && isVideo);
      });

      if (validFiles.length === 0) {
        throw new Error('No valid files selected');
      }

      // Upload files
      const results = await cloudinaryService.uploadMultipleFiles(validFiles, folder);
      
      if (results.success) {
        toast.success(`Successfully uploaded ${results.successful} files`);
        onUploadSuccess?.(results.uploaded);
      } else {
        const errorMessage = results.failed.length > 0 
          ? `Failed to upload ${results.failed.length} files`
          : 'Upload failed';
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message);
      onUploadError?.(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [maxFiles, allowedTypes, folder, onUploadSuccess, onUploadError]);

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  // Get max upload size for display
  const maxUploadSize = 10;

  return (
    <div className={`file-upload ${className}`}>
      <div
        className={`
          upload-area 
          ${isDragOver ? 'drag-over' : ''} 
          ${isUploading ? 'uploading' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p>Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h3>Upload Files</h3>
            <p>Drag and drop files here, or click to select</p>
            <div className="file-types">
              <span>Supported: {allowedTypes.join(', ')}</span>
              <span>Max: {maxFiles} files</span>
              <span>Size: {maxUploadSize}MB per file</span>
            </div>
            <input
              type="file"
              multiple
              accept={allowedTypes.includes('image') && allowedTypes.includes('video') 
                ? 'image/*,video/*' 
                : allowedTypes.includes('image') 
                  ? 'image/*' 
                  : 'video/*'
              }
              onChange={handleFileInputChange}
              className="file-input"
              disabled={isUploading}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .file-upload {
          width: 100%;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: #f9fafb;
          cursor: pointer;
          position: relative;
        }

        .upload-area:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .upload-area.drag-over {
          border-color: #3b82f6;
          background: #dbeafe;
          transform: scale(1.02);
        }

        .upload-area.uploading {
          pointer-events: none;
          opacity: 0.7;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .upload-icon {
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .upload-icon svg {
          width: 48px;
          height: 48px;
        }

        .upload-content h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
        }

        .upload-content p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .file-types {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: #9ca3af;
          flex-wrap: wrap;
          justify-content: center;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .progress-bar {
          width: 100%;
          max-width: 300px;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s ease;
        }

        .upload-progress p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default FileUpload; 