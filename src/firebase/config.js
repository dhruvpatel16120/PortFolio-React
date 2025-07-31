// Firebase configuration and initialization (Free Services Only)
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Validate required environment variables
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    console.error('Please check your .env file and ensure all Firebase configuration variables are set.');
  }
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Free tier only)
export const auth = getAuth(app);
export const db = getFirestore(app);

// Note: Storage service removed to stay within free tier limits
// For file uploads, consider using external services like:
// - Cloudinary (free tier available)
// - ImgBB (free API)
// - Or store file URLs in Firestore

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATORS === 'true') {
  const host = process.env.REACT_APP_EMULATOR_HOST || 'localhost';
  
  try {
    connectAuthEmulator(auth, `http://${host}:9099`);
    connectFirestoreEmulator(db, host, 8080);
    console.log('🔧 Connected to Firebase emulators (Auth & Firestore)');
  } catch (error) {
    console.warn('⚠️ Failed to connect to Firebase emulators:', error.message);
  }
}

export default app; 