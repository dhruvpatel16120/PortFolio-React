// File Upload Service using Cloudinary (Free Tier Alternative)
// This service provides file upload functionality without using Firebase Storage

export class FileUploadService {
  constructor() {
    this.cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  }

  // Upload file to Cloudinary (supports both images and videos)
  async uploadToCloudinary(file, folder = 'portfolio', options = {}) {
    try {
      if (!this.cloudinaryCloudName || !this.uploadPreset) {
        throw new Error('Cloudinary configuration not found. Please set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET in your .env file');
      }

      // Validate file
      this.validateFile(file);

      // Determine resource type (image or video)
      const isVideo = this.isVideoFile(file);
      const resourceType = isVideo ? 'video' : 'image';

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', folder);

      // Add optional parameters
      if (options.transformation) {
        formData.append('transformation', options.transformation);
      }
      if (options.public_id) {
        formData.append('public_id', options.public_id);
      }
      if (options.tags) {
        formData.append('tags', options.tags);
      }

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudinaryCloudName}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Upload failed: ${response.statusText} - ${errorData.error?.message || ''}`);
      }

      const data = await response.json();

      // Create file metadata
      const fileData = {
        publicId: data.public_id,
        url: data.secure_url,
        type: this.getFileTypeFromUrl(data.secure_url),
        size: data.bytes,
        createdAt: new Date(),
        width: data.width,
        height: data.height,
        format: data.format,
        folder: folder
      };

      // Store file metadata
      this.storeFileMetadata(fileData);

      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        size: data.bytes,
        resourceType: data.resource_type,
        duration: data.duration, // For videos
        thumbnailUrl: isVideo ? this.generateVideoThumbnail(data.public_id) : null
      };

    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, folder = 'portfolio') {
    const uploadPromises = files.map(file => this.uploadToCloudinary(file, folder));
    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);

    return {
      success: failed.length === 0,
      uploaded: successful,
      failed: failed,
      total: files.length,
      successful: successful.length,
      failedCount: failed.length
    };
  }



  // Validate file before upload (supports images and videos)
  validateFile(file) {
    const maxSize = 100 * 1024 * 1024; // 100MB for videos
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
    }
  }

  // Check if file is a video
  isVideoFile(file) {
    const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];
    return videoTypes.includes(file.type);
  }

  // Check if file is an image
  isImageFile(file) {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(file.type);
  }

  // Get file info from URL
  async getFileInfo(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      return {
        size: blob.size,
        type: blob.type,
        lastModified: new Date(blob.lastModified)
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }

  // Get all media files from Cloudinary
  async getMediaFiles() {
    try {
      if (!this.cloudinaryCloudName) {
        console.warn('Cloudinary cloud name not configured');
        return [];
      }

      console.log('Fetching media files from local storage...'); // Debug log

      // Since Cloudinary List API requires authentication, we'll use localStorage
      // to track uploaded files. This is a simple solution for development.
      // In production, you should store this data in your database.
      
      const storedFiles = localStorage.getItem('cloudinary_media_files');
      if (storedFiles) {
        const files = JSON.parse(storedFiles);
        console.log('Found stored files:', files);
        return files;
      }
      
      console.log('No stored files found. Upload your first file to get started.');
      return [];

    } catch (error) {
      console.error('Error fetching media files:', error);
      return [];
    }
  }

  // Delete file from Cloudinary (with better error handling)
  async deleteFromCloudinary(publicId) {
    try {
      if (!this.cloudinaryCloudName) {
        console.warn('Cloudinary not configured, simulating deletion');
        // Remove from localStorage even if Cloudinary is not configured
        this.removeFileMetadata(publicId);
        return { success: true };
      }

      // Try to delete as image first
      let response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudinaryCloudName}/image/destroy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_id: publicId,
          }),
        }
      );

      // If image deletion fails, try video deletion
      if (!response.ok) {
        response = await fetch(
          `https://api.cloudinary.com/v1_1/${this.cloudinaryCloudName}/video/destroy`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              public_id: publicId,
            }),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Delete failed: ${response.statusText} - ${errorData.error?.message || ''}`);
      }

      // Remove file metadata from localStorage
      this.removeFileMetadata(publicId);

      return { success: true };

    } catch (error) {
      console.error('File deletion error:', error);
      // Even if Cloudinary deletion fails, remove from localStorage
      this.removeFileMetadata(publicId);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Store file metadata in localStorage
  storeFileMetadata(fileData) {
    try {
      const storedFiles = localStorage.getItem('cloudinary_media_files');
      const existingFiles = storedFiles ? JSON.parse(storedFiles) : [];
      const updatedFiles = [...existingFiles, fileData];
      localStorage.setItem('cloudinary_media_files', JSON.stringify(updatedFiles));
      console.log('File metadata stored:', fileData);
    } catch (error) {
      console.error('Error storing file metadata:', error);
    }
  }

  // Remove file metadata from localStorage
  removeFileMetadata(publicId) {
    try {
      const storedFiles = localStorage.getItem('cloudinary_media_files');
      const existingFiles = storedFiles ? JSON.parse(storedFiles) : [];
      const updatedFiles = existingFiles.filter(file => file.publicId !== publicId);
      localStorage.setItem('cloudinary_media_files', JSON.stringify(updatedFiles));
      console.log('File metadata removed:', publicId);
    } catch (error) {
      console.error('Error removing file metadata:', error);
    }
  }

  // Helper method to determine file type from URL
  getFileTypeFromUrl(url) {
    const extension = url.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'quicktime'];
    
    if (imageExtensions.includes(extension)) {
      return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    } else if (videoExtensions.includes(extension)) {
      return `video/${extension}`;
    }
    
    return 'application/octet-stream';
  }

  // Generate thumbnail URL
  generateThumbnailUrl(url, width = 300, height = 300) {
    if (!url.includes('cloudinary.com')) {
      return url;
    }

    // Cloudinary transformation for thumbnail
    const baseUrl = url.split('/upload/')[0];
    const publicId = url.split('/upload/')[1];
    
    return `${baseUrl}/upload/c_thumb,g_face,h_${height},w_${width}/${publicId}`;
  }

  // Optimize image URL
  optimizeImageUrl(url, quality = 80, format = 'auto') {
    if (!url.includes('cloudinary.com')) {
      return url;
    }

    const baseUrl = url.split('/upload/')[0];
    const publicId = url.split('/upload/')[1];
    
    return `${baseUrl}/upload/q_${quality},f_${format}/${publicId}`;
  }

  // Generate video thumbnail
  generateVideoThumbnail(publicId, width = 300, height = 300) {
    if (!this.cloudinaryCloudName) {
      return null;
    }

    return `https://res.cloudinary.com/${this.cloudinaryCloudName}/video/upload/c_thumb,w_${width},h_${height}/${publicId}.jpg`;
  }

  // Generate video poster (first frame)
  generateVideoPoster(publicId, width = 800, height = 600) {
    if (!this.cloudinaryCloudName) {
      return null;
    }

    return `https://res.cloudinary.com/${this.cloudinaryCloudName}/video/upload/so_0,w_${width},h_${height}/${publicId}.jpg`;
  }

  // Get video info
  async getVideoInfo(publicId) {
    try {
      const response = await fetch(
        `https://res.cloudinary.com/${this.cloudinaryCloudName}/video/upload/fl_attachment:info/${publicId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get video info');
      }

      const data = await response.json();
      return {
        duration: data.duration,
        width: data.width,
        height: data.height,
        format: data.format,
        size: data.bytes,
        fps: data.fps,
        bitrate: data.bitrate
      };
    } catch (error) {
      console.error('Error getting video info:', error);
      return null;
    }
  }

  // Transform video (resize, crop, etc.)
  transformVideo(publicId, transformations = {}) {
    if (!this.cloudinaryCloudName) {
      return null;
    }

    const transformParams = [];
    
    if (transformations.width) transformParams.push(`w_${transformations.width}`);
    if (transformations.height) transformParams.push(`h_${transformations.height}`);
    if (transformations.crop) transformParams.push(`c_${transformations.crop}`);
    if (transformations.quality) transformParams.push(`q_${transformations.quality}`);
    if (transformations.format) transformParams.push(`f_${transformations.format}`);

    const transformString = transformParams.join(',');
    
    return `https://res.cloudinary.com/${this.cloudinaryCloudName}/video/upload/${transformString}/${publicId}`;
  }

  // Transform image (resize, crop, quality, format)
  transformImage(publicId, transformations = {}) {
    if (!this.cloudinaryCloudName) {
      return null;
    }

    const transformParams = [];
    
    if (transformations.width) transformParams.push(`w_${transformations.width}`);
    if (transformations.height) transformParams.push(`h_${transformations.height}`);
    if (transformations.crop) transformParams.push(`c_${transformations.crop}`);
    if (transformations.quality) transformParams.push(`q_${transformations.quality}`);
    if (transformations.format && transformations.format !== 'auto') {
      transformParams.push(`f_${transformations.format}`);
    }

    const transformString = transformParams.join(',');
    
    return `https://res.cloudinary.com/${this.cloudinaryCloudName}/image/upload/${transformString}/${publicId}`;
  }

  // Delete video from Cloudinary
  async deleteVideo(publicId) {
    return this.deleteFromCloudinary(publicId);
  }
}

// Alternative: Simple file upload using ImgBB (free API)
export class ImgBBUploadService {
  constructor() {
    this.apiKey = process.env.REACT_APP_IMGBB_API_KEY;
  }

  async uploadToImgBB(file) {
    try {
      if (!this.apiKey) {
        throw new Error('ImgBB API key not found. Please set REACT_APP_IMGBB_API_KEY in your .env file');
      }

      this.validateFile(file);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${this.apiKey}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      return {
        success: true,
        url: data.data.url,
        deleteUrl: data.data.delete_url,
        id: data.data.id,
        size: data.data.size,
        width: data.data.width,
        height: data.data.height
      };

    } catch (error) {
      console.error('ImgBB upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  validateFile(file) {
    const maxSize = 32 * 1024 * 1024; // 32MB (ImgBB limit)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
    }
  }
}

// Export singleton instances
export const cloudinaryService = new FileUploadService();
export const imgbbService = new ImgBBUploadService(); 