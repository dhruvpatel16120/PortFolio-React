import { 
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { getEnhancedLocationData } from './ipService';

// Contact form submissions with enhanced data collection
export const submitContactForm = async (formData) => {
  try {
    // Collect device and browser information
    const deviceInfo = {
      type: getDeviceType(),
      os: getOperatingSystem(),
      browser: getBrowserInfo(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    // Collect location information using IP geolocation
    const { ipAddress, location } = await getEnhancedLocationData();

    // Collect metadata
    const metadata = {
      formDuration: formData.formDuration || 0,
      pageLoadTime: performance.now(),
      referrer: document.referrer || 'Direct',
      timestamp: new Date().toISOString()
    };

    const submissionData = {
      ...formData,
      ipAddress,
      deviceInfo,
      location,
      metadata,
      timestamp: serverTimestamp(),
      status: 'new'
    };

    const docRef = await addDoc(collection(db, 'contact_submissions'), submissionData);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Helper functions for device detection
const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
    if (/ipad/i.test(userAgent)) return 'tablet';
    return 'mobile';
  }
  return 'desktop';
};

const getOperatingSystem = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('Windows') !== -1) return 'Windows';
  if (userAgent.indexOf('Mac') !== -1) return 'macOS';
  if (userAgent.indexOf('Linux') !== -1) return 'Linux';
  if (userAgent.indexOf('Android') !== -1) return 'Android';
  if (userAgent.indexOf('iOS') !== -1) return 'iOS';
  return 'Unknown';
};

const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('Chrome') !== -1) return 'Chrome';
  if (userAgent.indexOf('Firefox') !== -1) return 'Firefox';
  if (userAgent.indexOf('Safari') !== -1) return 'Safari';
  if (userAgent.indexOf('Edge') !== -1) return 'Edge';
  return 'Unknown';
};

// Get all contact submissions (admin only)
export const getContactSubmissions = async () => {
  try {
    const q = query(
      collection(db, 'contact_submissions'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: submissions };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update contact submission status
export const updateContactStatus = async (submissionId, status) => {
  try {
    const docRef = doc(db, 'contact_submissions', submissionId);
    await updateDoc(docRef, { status });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Blog posts (if you want to add a blog section)
export const addBlogPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, 'blog_posts'), {
      ...postData,
      timestamp: serverTimestamp(),
      published: false
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get published blog posts
export const getPublishedBlogPosts = async () => {
  try {
    const q = query(
      collection(db, 'blog_posts'),
      where('published', '==', true),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: posts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get single blog post
export const getBlogPost = async (postId) => {
  try {
    const docRef = doc(db, 'blog_posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Post not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update blog post
export const updateBlogPost = async (postId, updateData) => {
  try {
    const docRef = doc(db, 'blog_posts', postId);
    await updateDoc(docRef, updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete blog post
export const deleteBlogPost = async (postId) => {
  try {
    const docRef = doc(db, 'blog_posts', postId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 