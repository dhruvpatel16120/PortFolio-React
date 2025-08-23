class FileUploadService {
  constructor() {
    this.defaultMaxSize = 10 * 1024 * 1024; // 10MB default
    this.defaultAllowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword'];
  }

  // Validate file upload
  validateFile(file) {
    const maxSize = this.defaultMaxSize;
    const allowedTypes = this.defaultAllowedTypes;

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of 10MB`
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed. Please upload JPEG, PNG, GIF, PDF, or DOC files only.'
      };
    }

    return { valid: true };
  }

  // Get max upload size
  getMaxUploadSize() {
    return this.defaultMaxSize;
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Validate multiple files
  validateFiles(files) {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const result = this.validateFile(files[i]);
      results.push({
        file: files[i],
        index: i,
        ...result
      });
    }

    return results;
  }

  // Check if all files are valid
  areFilesValid(files) {
    const results = this.validateFiles(files);
    return results.every(result => result.valid);
  }

  // Get total size of files
  getTotalSize(files) {
    return files.reduce((total, file) => total + file.size, 0);
  }

  // Check if total size exceeds limit
  checkTotalSize(files) {
    const totalSize = this.getTotalSize(files);
    const maxSize = this.defaultMaxSize;
    
    return {
      valid: totalSize <= maxSize,
      totalSize,
      maxSize,
      error: totalSize > maxSize ? `Total file size exceeds maximum allowed size of 10MB` : null
    };
  }

  // Create file preview URL
  createPreviewUrl(file) {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  }

  // Clean up preview URLs
  cleanupPreviewUrl(url) {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  // Get file extension
  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  // Check if file is an image
  isImage(file) {
    return file.type.startsWith('image/');
  }

  // Check if file is a document
  isDocument(file) {
    return file.type.startsWith('application/') && 
           (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('document'));
  }
}

// Create singleton instance
const fileUploadService = new FileUploadService();
export default fileUploadService; 