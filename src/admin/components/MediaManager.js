import React, { useState } from 'react';
import FileUpload from './FileUpload';
import MediaGallery from './MediaGallery';
import { toast } from 'react-toastify';

const MediaManager = ({ 
  onMediaSelect, 
  selectedMedia = [], 
  maxSelection = 5,
  className = ''
}) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  // Handle successful uploads
  const handleUploadSuccess = (uploadedFiles) => {
    setMediaFiles(prev => [...prev, ...uploadedFiles]);
    toast.success(`Successfully uploaded ${uploadedFiles.length} files`);
  };

  // Handle upload errors
  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    toast.error(error.message);
  };

  // Handle file deletion
  const handleFileDelete = (deletedFile) => {
    setMediaFiles(prev => prev.filter(file => file.publicId !== deletedFile.publicId));
    toast.success('File deleted successfully');
  };

  // Handle media selection
  const handleMediaSelect = (selectedFiles) => {
    onMediaSelect?.(selectedFiles);
  };

  return (
    <div className={`media-manager ${className}`}>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload Media
        </button>
        <button
          className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Media Gallery ({mediaFiles.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'upload' && (
          <div className="upload-section">
            <h3>Upload Images & Videos</h3>
            <p>Drag and drop files or click to select. Supports images (JPG, PNG, GIF, WebP) and videos (MP4, MOV, AVI).</p>
            
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              folder="portfolio"
              maxFiles={10}
              allowedTypes={['image', 'video']}
            />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="gallery-section">
            <div className="gallery-header">
              <h3>Media Gallery</h3>
              {mediaFiles.length > 0 && (
                <button
                  className="clear-all-btn"
                  onClick={() => {
                    setMediaFiles([]);
                    toast.success('All files cleared');
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            <MediaGallery
              files={mediaFiles}
              onDelete={handleFileDelete}
              onSelect={handleMediaSelect}
              selectable={!!onMediaSelect}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .media-manager {
          width: 100%;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1rem;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab:hover {
          color: #374151;
        }

        .tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .tab-content {
          min-height: 400px;
        }

        .upload-section h3,
        .gallery-section h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
        }

        .upload-section p {
          margin: 0 0 1rem 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .clear-all-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #ef4444;
          border-radius: 6px;
          background: white;
          color: #ef4444;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .clear-all-btn:hover {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default MediaManager; 