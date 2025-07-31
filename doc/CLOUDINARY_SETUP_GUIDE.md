# ☁️ Cloudinary Setup Guide for Image & Video Uploads

## **Overview**

Cloudinary is a cloud-based service that provides solutions for image and video management. It's perfect for your admin panel as it offers a generous free tier and excellent performance.

### **Free Tier Benefits:**
- **25GB storage**
- **25GB bandwidth/month**
- **25GB transformation credits/month**
- **Unlimited transformations**
- **CDN delivery**
- **Automatic optimization**

## **Step 1: Create Cloudinary Account**

1. Go to [Cloudinary Sign Up](https://cloudinary.com/users/register/free)
2. Fill in your details:
   - **Email**: Your email address
   - **Full Name**: Your name
   - **Password**: Strong password
   - **Company**: Your company name (optional)
3. Click "Create Account"
4. Verify your email address

## **Step 2: Get Your Cloud Name**

1. Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Your **Cloud Name** is displayed at the top of the dashboard
3. Copy this value (e.g., `mycloud123`)

## **Step 3: Create Upload Preset**

### **For Unsigned Uploads (Recommended)**

1. In Cloudinary Dashboard, go to **Settings** > **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:

```javascript
// Preset Name: portfolio_uploads
// Signing Mode: Unsigned
// Folder: portfolio
// Allowed Formats: jpg, png, gif, webp, mp4, mov, avi
// Max File Size: 10MB
// Transformation: Auto-optimize
```

### **Settings Configuration:**

| Setting | Value | Description |
|---------|-------|-------------|
| **Preset name** | `portfolio_uploads` | Unique identifier |
| **Signing mode** | `Unsigned` | Allows client-side uploads |
| **Folder** | `portfolio` | Organizes uploads |
| **Allowed formats** | `jpg,png,gif,webp,mp4,mov,avi` | Supported file types |
| **Max file size** | `10MB` | File size limit |
| **Auto-optimize** | `Enabled` | Automatic optimization |

## **Step 4: Update Environment Variables**

Add these variables to your `.env` file:

```env
# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=dxdsy2qwg
REACT_APP_CLOUDINARY_UPLOAD_PRESET=portfolio_uploads
REACT_APP_CLOUDINARY_API_KEY=994657437322239
REACT_APP_CLOUDINARY_API_SECRET=vAP0aWpQRSTJrZ2ITvGJLvaaYW4
```

### **How to Get API Key & Secret:**

1. In Cloudinary Dashboard, go to **Settings** > **Access Keys**
2. Copy your **API Key** and **API Secret**
3. Keep these secure and never commit them to version control

## **Step 5: Test Your Setup**

### **Quick Test**

1. **Add to your `.env` file:**
   ```env
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=portfolio_uploads
   ```

2. **Test upload in your admin panel:**
   ```javascript
   import { cloudinaryService } from '../admin/services/fileUploadService';
   
   // Test image upload
   const file = document.querySelector('input[type="file"]').files[0];
   const result = await cloudinaryService.uploadToCloudinary(file, 'test');
   
   if (result.success) {
     console.log('Upload successful:', result.url);
   } else {
     console.error('Upload failed:', result.error);
   }
   ```

## **Step 6: Usage Examples**

### **Basic Image Upload**
```javascript
import { cloudinaryService } from '../admin/services/fileUploadService';

const handleImageUpload = async (file) => {
  const result = await cloudinaryService.uploadToCloudinary(file, 'portfolio');
  
  if (result.success) {
    console.log('Image URL:', result.url);
    console.log('Public ID:', result.publicId);
    console.log('Dimensions:', result.width, 'x', result.height);
  }
};
```

### **Video Upload**
```javascript
const handleVideoUpload = async (file) => {
  const result = await cloudinaryService.uploadToCloudinary(file, 'portfolio', {
    transformation: 'c_thumb,w_400,h_300'
  });
  
  if (result.success) {
    console.log('Video URL:', result.url);
    console.log('Duration:', result.duration);
    console.log('Thumbnail:', result.thumbnailUrl);
  }
};
```

### **Multiple File Upload**
```javascript
const handleMultipleUpload = async (files) => {
  const result = await cloudinaryService.uploadMultipleFiles(files, 'portfolio');
  
  if (result.success) {
    console.log(`Uploaded ${result.successful} files`);
    result.uploaded.forEach(file => {
      console.log('File:', file.url);
    });
  }
};
```

## **Step 7: React Components**

### **File Upload Component**
```javascript
import FileUpload from '../admin/components/FileUpload';

<FileUpload
  onUploadSuccess={(files) => console.log('Uploaded:', files)}
  onUploadError={(error) => console.error('Error:', error)}
  folder="portfolio"
  maxFiles={5}
  allowedTypes={['image', 'video']}
/>
```

### **Media Gallery Component**
```javascript
import MediaGallery from '../admin/components/MediaGallery';

<MediaGallery
  files={uploadedFiles}
  onDelete={(file) => console.log('Deleted:', file)}
  onSelect={(files) => console.log('Selected:', files)}
  selectable={true}
/>
```

### **Complete Media Manager**
```javascript
import MediaManager from '../admin/components/MediaManager';

<MediaManager
  onMediaSelect={(selectedFiles) => {
    console.log('Selected media:', selectedFiles);
  }}
  maxSelection={5}
/>
```

## **Step 8: Best Practices**

### **Performance Optimization**
- **Use appropriate image formats**: WebP for web, JPEG for photos
- **Implement lazy loading**: Load images only when needed
- **Use transformations**: Resize images on upload
- **Cache URLs**: Store transformed URLs in your database

### **Security**
- **Use unsigned uploads**: For client-side uploads
- **Validate file types**: Server-side validation
- **Set upload limits**: Prevent abuse
- **Monitor usage**: Track bandwidth and storage

### **Cost Management**
- **Monitor usage**: Check Cloudinary dashboard regularly
- **Optimize transformations**: Use efficient parameters
- **Clean up unused files**: Delete old files regularly
- **Use appropriate quality**: Balance quality vs file size

## **Step 9: Troubleshooting**

### **Common Issues**

1. **"Upload preset not found"**
   - Check your preset name in `.env`
   - Ensure preset is set to "Unsigned"
   - Verify preset is active in Cloudinary dashboard

2. **"Invalid file type"**
   - Check allowed file types in upload preset
   - Verify file extension matches MIME type
   - Update preset to include needed formats

3. **"File too large"**
   - Check file size limits in preset
   - Compress files before upload
   - Update preset limits if needed

4. **"Network error"**
   - Check internet connection
   - Verify Cloudinary service status
   - Try uploading smaller files

### **Debug Tips**
```javascript
// Enable detailed logging
console.log('Cloudinary config:', {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
});

// Test with small file first
const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const result = await cloudinaryService.uploadToCloudinary(testFile, 'test');
```

## **Step 10: Monitoring & Analytics**

### **Cloudinary Dashboard**
- **Usage Statistics**: Monitor bandwidth and storage
- **Upload History**: Track all uploads
- **Error Logs**: View failed uploads
- **Performance**: Check response times

### **Custom Analytics**
```javascript
// Track upload success rate
const trackUpload = async (file) => {
  const startTime = Date.now();
  const result = await cloudinaryService.uploadToCloudinary(file);
  const duration = Date.now() - startTime;
  
  // Send analytics
  analytics.track('file_upload', {
    success: result.success,
    fileSize: file.size,
    fileType: file.type,
    duration: duration
  });
};
```

This setup provides a complete, production-ready file upload solution using Cloudinary's free tier. You can now upload both images and videos with automatic optimization, transformations, and a beautiful user interface.