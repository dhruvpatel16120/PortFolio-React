import React, { useState } from 'react';
import { cloudinaryService } from '../services/fileUploadService';
import { toast } from 'react-toastify';

const MediaGallery = ({ files = [], onDelete, onSelect, selectable = false }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);

  const handleFileSelect = (file) => {
    if (!selectable) return;
    
    setSelectedFiles(prev => {
      const isSelected = prev.find(f => f.publicId === file.publicId);
      if (isSelected) {
        return prev.filter(f => f.publicId !== file.publicId);
      } else {
        return [...prev, file];
      }
    });
  };

  const handleDelete = async (file) => {
    try {
      const result = await cloudinaryService.deleteFromCloudinary(file.publicId);
      if (result.success) {
        toast.success('File deleted successfully');
        onDelete?.(file);
      } else {
        throw new Error(result.error || 'Failed to delete file');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isVideo = (file) => {
    return file.resourceType === 'video' || file.format?.startsWith('mp4');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return (
      <div className="empty-gallery">
        <p>No media files uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="media-gallery">
      <div className="gallery-grid">
        {files.map((file, index) => (
          <div
            key={file.publicId || index}
            className={`gallery-item ${selectable ? 'selectable' : ''}`}
            onClick={() => selectable ? handleFileSelect(file) : setViewingFile(file)}
          >
            {isVideo(file) ? (
              <div className="video-thumbnail">
                <img 
                  src={file.thumbnailUrl || cloudinaryService.generateVideoThumbnail(file.publicId)} 
                  alt={file.publicId}
                />
                <div className="video-play-icon">▶</div>
              </div>
            ) : (
              <img src={file.url} alt={file.publicId} />
            )}
            
            <div className="item-info">
              <span className="file-name">{file.publicId?.split('/').pop()}</span>
              <span className="file-size">{formatFileSize(file.size)}</span>
            </div>
            
            <div className="item-actions">
              <button onClick={() => setViewingFile(file)}>View</button>
              <button onClick={() => handleDelete(file)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {viewingFile && (
        <div className="modal" onClick={() => setViewingFile(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setViewingFile(null)}>×</button>
            {isVideo(viewingFile) ? (
              <video controls src={viewingFile.url} />
            ) : (
              <img src={viewingFile.url} alt={viewingFile.publicId} />
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .media-gallery {
          width: 100%;
        }

        .empty-gallery {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .gallery-item {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .gallery-item:hover {
          transform: translateY(-2px);
        }

        .gallery-item img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .video-thumbnail {
          position: relative;
          width: 100%;
          height: 150px;
        }

        .video-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-info {
          padding: 0.5rem;
        }

        .file-name {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .file-size {
          display: block;
          font-size: 0.75rem;
          color: #666;
        }

        .item-actions {
          padding: 0.5rem;
          display: flex;
          gap: 0.5rem;
        }

        .item-actions button {
          padding: 0.25rem 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .item-actions button:hover {
          background: #f5f5f5;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          max-width: 90vw;
          max-height: 90vh;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          font-size: 1.5rem;
        }

        .modal-content img,
        .modal-content video {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};

export default MediaGallery; 