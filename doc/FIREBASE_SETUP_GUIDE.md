# 🔥 Firebase Environment Variables Setup Guide

## **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "portfolio-admin")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## **Step 2: Enable Firebase Services (Free Tier Only)**

### **Authentication**
1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable "Email/Password" authentication
3. Optionally enable other providers (Google, GitHub, etc.)

### **Firestore Database**
1. Go to "Firestore Database" > "Create database"
2. Choose "Start in test mode" for development
3. Select a location close to your users
4. Click "Done"

### **Note: Storage Service Skipped**
- Firebase Storage has usage limits and potential costs
- For file uploads, we'll use external free services like Cloudinary or ImgBB
- This keeps your Firebase usage within the free tier limits

## **Step 3: Get Firebase Configuration**

1. In Firebase Console, go to "Project Settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" > "Web" (</>) 
4. Register your app with a nickname (e.g., "portfolio-admin-web")
5. Copy the configuration object

## **Step 4: Create Environment Variables File**

Create a `.env` file in your project root with the following variables:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Admin Panel Configuration
REACT_APP_ADMIN_EMAIL=admin@yourdomain.com
REACT_APP_ADMIN_PASSWORD=your_secure_password
REACT_APP_ADMIN_ROLE=super_admin

# Development Configuration
REACT_APP_USE_FIREBASE_EMULATORS=false
REACT_APP_EMULATOR_HOST=localhost
REACT_APP_EMULATOR_PORT=8080

# Security Configuration
REACT_APP_MAX_LOGIN_ATTEMPTS=5
REACT_APP_LOCKOUT_DURATION=900000
REACT_APP_SESSION_TIMEOUT=3600000

# File Upload Configuration
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Notification Configuration
REACT_APP_ENABLE_PUSH_NOTIFICATIONS=true
REACT_APP_ENABLE_EMAIL_NOTIFICATIONS=true
```

## **Step 5: Update Firebase Configuration**

Update your `src/firebase/config.js` file to use environment variables:

```javascript
// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATORS === 'true') {
  const host = process.env.REACT_APP_EMULATOR_HOST || 'localhost';
  const port = process.env.REACT_APP_EMULATOR_PORT || 8080;
  
  connectAuthEmulator(auth, `http://${host}:9099`);
  connectFirestoreEmulator(db, host, 8080);
  connectStorageEmulator(storage, host, 9199);
}

export default app;
```

## **Step 6: Set Up Firestore Security Rules**

In Firebase Console > Firestore Database > Rules, update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users collection
    match /admin_users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role == 'super_admin');
    }
    
    // Contact submissions
    match /contact_submissions/{submissionId} {
      allow read, write: if request.auth != null;
    }
    
    // Content management
    match /content/{contentId} {
      allow read, write: if request.auth != null;
    }
    
    // Admin activity logs
    match /admin_activity_logs/{logId} {
      allow read, write: if request.auth != null;
    }
    
    // Blog posts
    match /blog_posts/{postId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
  }
}
```

## **Step 7: Optional File Upload Services**

Since we're not using Firebase Storage (to stay within free tier), you can set up external file upload services:

### **Option 1: Cloudinary (Recommended)**
1. Sign up at [Cloudinary](https://cloudinary.com/) (free tier: 25GB storage, 25GB bandwidth/month)
2. Get your Cloud Name and Upload Preset
3. Add to your `.env` file:
   ```env
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

### **Option 2: ImgBB (Simple Alternative)**
1. Get API key from [ImgBB](https://imgbb.com/)
2. Add to your `.env` file:
   ```env
   REACT_APP_IMGBB_API_KEY=your_api_key
   ```

### **Option 3: Store URLs in Firestore**
- Store external image URLs directly in Firestore
- No additional setup required
- Use any image hosting service

## **Step 8: Create Initial Admin User**

Create a script to set up the initial admin user:

```javascript
// scripts/create-admin.js
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    const email = process.env.REACT_APP_ADMIN_EMAIL;
    const password = process.env.REACT_APP_ADMIN_PASSWORD;
    const role = process.env.REACT_APP_ADMIN_ROLE || 'super_admin';

    if (!email || !password) {
      console.error('Please set REACT_APP_ADMIN_EMAIL and REACT_APP_ADMIN_PASSWORD in your .env file');
      process.exit(1);
    }

    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create admin user document
    const adminData = {
      uid: user.uid,
      email: user.email,
      displayName: 'Admin User',
      role,
      permissions: ['*'],
      isAdmin: true,
      isActive: true,
      createdAt: serverTimestamp(),
      createdBy: 'system',
      lastLogin: null
    };

    await setDoc(doc(db, 'admin_users', user.uid), adminData);

    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Role: ${role}`);
    console.log('You can now log in to the admin panel.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();
```

## **Step 9: Test Configuration**

1. Start your development server: `npm start`
2. Check the browser console for any Firebase errors
3. Try accessing the admin panel at `/admin`
4. Test the login functionality

## **Step 10: Environment Variables Checklist**

Make sure you have all these variables in your `.env` file:

- [ ] `REACT_APP_FIREBASE_API_KEY`
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN`
- [ ] `REACT_APP_FIREBASE_PROJECT_ID`
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET`
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `REACT_APP_FIREBASE_APP_ID`
- [ ] `REACT_APP_ADMIN_EMAIL`
- [ ] `REACT_APP_ADMIN_PASSWORD`
- [ ] `REACT_APP_ADMIN_ROLE`

## **Security Notes**

- Never commit your `.env` file to version control
- Use strong passwords for admin accounts
- Regularly rotate API keys
- Monitor Firebase usage and costs
- Set up proper security rules
- Enable audit logging

## **Troubleshooting**

### **Common Issues:**

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check that your API key is correct
   - Ensure the key is not restricted to specific domains

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console
   - For development, add `localhost` to authorized domains

3. **"Firebase: Error (permission-denied)"**
   - Check your Firestore security rules
   - Ensure the user is authenticated
   - Verify user permissions

4. **Environment variables not loading**
   - Restart your development server after adding `.env` file
   - Ensure all variables start with `REACT_APP_`
   - Check for typos in variable names

### **Development vs Production:**

- **Development**: Use Firebase emulators for testing
- **Production**: Use actual Firebase services
- **Staging**: Use separate Firebase project for testing

This setup will provide a secure and scalable foundation for your admin panel with proper authentication, database access, and file storage capabilities. 