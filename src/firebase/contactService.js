import { 
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  onSnapshot
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
      status: 'new',
      read: false,
      replied: false
    };

    const docRef = await addDoc(collection(db, 'contact_submissions'), submissionData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Contact form submission error:', error);
    return { success: false, error: error.message };
  }
};

// Get all contact submissions (admin only)
export const getContactSubmissions = async (filters = {}) => {
  try {
    let q = query(collection(db, 'contact_submissions'), orderBy('timestamp', 'desc'));
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.deviceType && filters.deviceType !== 'all') {
      q = query(q, where('deviceInfo.type', '==', filters.deviceType));
    }
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    const submissions = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({ 
        id: doc.id, 
        ...data,
        timestamp: data.timestamp?.toDate?.() || data.timestamp || new Date()
      });
    });
    return { success: true, data: submissions };
  } catch (error) {
    console.error('Get contact submissions error:', error);
    return { success: false, error: error.message };
  }
};

// Get single contact submission
export const getContactSubmission = async (submissionId) => {
  try {
    if (!submissionId) {
      return { success: false, error: 'Submission ID is required' };
    }

    const docRef = doc(db, 'contact_submissions', submissionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        success: true, 
        data: { 
          id: docSnap.id, 
          ...data,
          timestamp: data.timestamp?.toDate?.() || data.timestamp || new Date()
        } 
      };
    } else {
      return { success: false, error: 'Submission not found' };
    }
  } catch (error) {
    console.error('Get contact submission error:', error);
    return { success: false, error: error.message };
  }
};

// Update contact submission status
export const updateContactStatus = async (submissionId, status) => {
  try {
    const docRef = doc(db, 'contact_submissions', submissionId);
    await updateDoc(docRef, { 
      status,
      lastUpdated: serverTimestamp(),
      read: status === 'read' || status === 'replied' ? true : false,
      replied: status === 'replied' ? true : false
    });
    return { success: true };
  } catch (error) {
    console.error('Update contact status error:', error);
    return { success: false, error: error.message };
  }
};

// Delete contact submission
export const deleteContactSubmission = async (submissionId) => {
  try {
    const docRef = doc(db, 'contact_submissions', submissionId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Delete contact submission error:', error);
    return { success: false, error: error.message };
  }
};

// Bulk update contact submissions
export const bulkUpdateContactSubmissions = async (submissionIds, updates) => {
  try {
    const batch = writeBatch(db);
    
    submissionIds.forEach(id => {
      const docRef = doc(db, 'contact_submissions', id);
      batch.update(docRef, { 
        ...updates,
        lastUpdated: serverTimestamp()
      });
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Bulk update error:', error);
    return { success: false, error: error.message };
  }
};

// Send reply to contact submission
export const sendReply = async (submissionId, replyData) => {
  try {
    if (!submissionId) {
      return { success: false, error: 'Submission ID is required' };
    }

    if (!replyData || !replyData.subject || !replyData.content) {
      return { success: false, error: 'Reply data with subject and content is required' };
    }

    const docRef = doc(db, 'contact_submissions', submissionId);
    
    const reply = {
      ...replyData,
      timestamp: serverTimestamp(),
      adminId: 'admin', // You can get this from auth context
      adminName: 'Admin' // You can get this from auth context
    };

    await updateDoc(docRef, {
      status: 'replied',
      replied: true,
      read: true,
      reply,
      lastUpdated: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Send reply error:', error);
    return { success: false, error: error.message };
  }
};

// Get reply templates
export const getReplyTemplates = async () => {
  try {
    const docRef = doc(db, 'contact_content', 'reply_templates');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { success: true, data: data };
    } else {
      // Return default templates
      const defaultTemplates = {
        templates: [
          {
            id: 'general',
            name: 'General Response',
            subject: 'Thank you for contacting us',
            content: 'Dear {name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nAdmin Team'
          },
          {
            id: 'support',
            name: 'Support Response',
            subject: 'We are working on your request',
            content: 'Dear {name},\n\nThank you for contacting our support team. We are currently reviewing your request and will provide you with a detailed response soon.\n\nBest regards,\nSupport Team'
          },
          {
            id: 'urgent',
            name: 'Urgent Response',
            subject: 'We are addressing your urgent request',
            content: 'Dear {name},\n\nWe understand the urgency of your request and are prioritizing it. You can expect a response within the next few hours.\n\nBest regards,\nAdmin Team'
          }
        ]
      };
      return { success: true, data: defaultTemplates };
    }
  } catch (error) {
    console.error('Get reply templates error:', error);
    return { success: false, error: error.message };
  }
};

// Save reply templates
export const saveReplyTemplates = async (templates) => {
  try {
    if (!templates || !templates.templates || !Array.isArray(templates.templates)) {
      return { success: false, error: 'Invalid templates data' };
    }

    const docRef = doc(db, 'contact_content', 'reply_templates');
    await setDoc(docRef, { templates: templates.templates }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Save reply templates error:', error);
    return { success: false, error: error.message };
  }
};

// Get contact analytics
export const getContactAnalytics = async (timeRange = '30d') => {
  try {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const q = query(
      collection(db, 'contact_submissions'),
      where('timestamp', '>=', startDate),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const submissions = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({ 
        id: doc.id, 
        ...data,
        timestamp: data.timestamp?.toDate?.() || data.timestamp || new Date()
      });
    });

    // Calculate analytics
    const analytics = calculateAnalytics(submissions);
    return { success: true, data: analytics };
  } catch (error) {
    console.error('Get contact analytics error:', error);
    return { success: false, error: error.message };
  }
};

// Real-time contact submissions listener
export const subscribeToContactSubmissions = (callback, filters = {}) => {
  try {
    let q = query(collection(db, 'contact_submissions'), orderBy('timestamp', 'desc'));
    
    if (filters.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    return onSnapshot(q, (querySnapshot) => {
      const submissions = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        submissions.push({ 
          id: doc.id, 
          ...data,
          timestamp: data.timestamp?.toDate?.() || data.timestamp || new Date()
        });
      });
      callback({ success: true, data: submissions });
    }, (error) => {
      console.error('Contact submissions listener error:', error);
      callback({ success: false, error: error.message });
    });
  } catch (error) {
    console.error('Subscribe to contact submissions error:', error);
    return null;
  }
};

// Contact content management with enhanced error handling
export const getContactContent = async () => {
  try {
    const docRef = doc(db, 'contact_content', 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { success: true, data };
    } else {
      // Return default content if none exists
      const defaultContent = getDefaultContactContent();
      return { success: true, data: defaultContent };
    }
  } catch (error) {
    console.error('Get contact content error:', error);
    // Return default content on error
    const defaultContent = getDefaultContactContent();
    return { success: true, data: defaultContent };
  }
};

// Save contact content with enhanced error handling
export const saveContactContent = async (content) => {
  try {
    const docRef = doc(db, 'contact_content', 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(docRef, {
        ...content,
        lastUpdated: serverTimestamp()
      });
    } else {
      // Create new document
      await setDoc(docRef, {
        ...content,
        lastUpdated: serverTimestamp()
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Save contact content error:', error);
    return { success: false, error: error.message };
  }
};

// Real-time contact content listener
export const subscribeToContactContent = (callback) => {
  try {
    const docRef = doc(db, 'contact_content', 'main');
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({ success: true, data });
      } else {
        // Return default content if document doesn't exist
        const defaultContent = getDefaultContactContent();
        callback({ success: true, data: defaultContent });
      }
    }, (error) => {
      console.error('Contact content listener error:', error);
      callback({ success: false, error: error.message });
    });
  } catch (error) {
    console.error('Subscribe to contact content error:', error);
    return null;
  }
};

// Helper functions
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

const calculateAnalytics = (submissions) => {
  const total = submissions.length;
  const newCount = submissions.filter(s => s.status === 'new').length;
  const readCount = submissions.filter(s => s.status === 'read').length;
  const repliedCount = submissions.filter(s => s.status === 'replied').length;
  const archivedCount = submissions.filter(s => s.status === 'archived').length;
  
  // Device breakdown
  const deviceCounts = {};
  submissions.forEach(s => {
    const type = s.deviceInfo?.type || 'unknown';
    deviceCounts[type] = (deviceCounts[type] || 0) + 1;
  });
  
  const devices = Object.entries(deviceCounts).map(([type, count]) => ({
    type,
    count,
    percentage: Math.round((count / total) * 100)
  }));

  // Location breakdown
  const locationCounts = {};
  submissions.forEach(s => {
    const country = s.location?.country || 'Unknown';
    locationCounts[country] = (locationCounts[country] || 0) + 1;
  });
  
  const locations = Object.entries(locationCounts)
    .map(([country, count]) => ({
      country,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Status breakdown
  const statusBreakdown = [
    { status: 'new', count: newCount, percentage: total > 0 ? Math.round((newCount / total) * 100) : 0, color: 'blue' },
    { status: 'read', count: readCount, percentage: total > 0 ? Math.round((readCount / total) * 100) : 0, color: 'yellow' },
    { status: 'replied', count: repliedCount, percentage: total > 0 ? Math.round((repliedCount / total) * 100) : 0, color: 'green' },
    { status: 'archived', count: archivedCount, percentage: total > 0 ? Math.round((archivedCount / total) * 100) : 0, color: 'gray' }
  ];

  // Response time analysis (mock data for now - in real implementation, calculate from reply timestamps)
  const responseTimeAnalysis = [
    { range: '0-1 hour', count: Math.round(total * 0.29), percentage: 29 },
    { range: '1-4 hours', count: Math.round(total * 0.43), percentage: 43 },
    { range: '4-24 hours', count: Math.round(total * 0.21), percentage: 21 },
    { range: '24+ hours', count: Math.round(total * 0.07), percentage: 7 }
  ];

  // Traffic sources (from referrer data)
  const referrerCounts = {};
  submissions.forEach(s => {
    const referrer = s.metadata?.referrer || 'Direct';
    let source = 'Direct';
    if (referrer.includes('google')) source = 'Google';
    else if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('instagram')) source = 'Social Media';
    else if (referrer.includes('mail') || referrer.includes('email')) source = 'Email';
    else if (referrer !== 'Direct') source = 'Other';
    
    referrerCounts[source] = (referrerCounts[source] || 0) + 1;
  });

  const topReferrers = Object.entries(referrerCounts)
    .map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate average response time (mock data for now)
  const avgResponseTime = '2.3 hours';
  const conversionRate = total > 0 ? Math.round((repliedCount / total) * 100) + '%' : '0%';

  // Generate trends data (mock data for now - in real implementation, calculate from daily/weekly/monthly data)
  const trends = {
    daily: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 10),
    weekly: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 70),
    monthly: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 300)
  };

  return {
    overview: {
      totalSubmissions: total,
      newSubmissions: newCount,
      readSubmissions: readCount,
      repliedSubmissions: repliedCount,
      avgResponseTime,
      conversionRate
    },
    devices,
    locations,
    statusBreakdown,
    responseTimeAnalysis,
    topReferrers,
    trends
  };
};

const getDefaultContactContent = () => ({
  contactInfo: [
    {
      id: 1,
      type: 'email',
      title: 'Email',
      value: 'dhruvpatel16120@gmail.com',
      link: 'mailto:dhruvpatel16120@gmail.com',
      description: 'Send me an email anytime',
      icon: 'HiMail',
      active: true
    },
    {
      id: 2,
      type: 'instagram',
      title: 'Instagram',
      value: '@dhruv_patel_16120',
      link: 'https://instagram.com/dhruv_patel_16120',
      description: 'Follow me on Instagram',
      icon: 'HiGlobe',
      active: true
    },
    {
      id: 3,
      type: 'location',
      title: 'Location',
      value: 'Gujarat, India',
      description: 'Available for remote work worldwide',
      icon: 'HiLocationMarker',
      active: true
    },
    {
      id: 4,
      type: 'response_time',
      title: 'Response Time',
      value: 'Within 24 hours',
      description: 'I usually respond quickly',
      icon: 'HiClock',
      active: true
    }
  ],
  pageContent: {
    heroTitle: 'Get In Touch',
    heroDescription: 'Ready to start your next project? Let\'s discuss how I can help bring your ideas to life.',
    sectionTitle: 'Let\'s Connect',
    sectionDescription: 'I\'m always excited to hear about new opportunities and interesting projects.',
    formTitle: 'Send a Message',
    formDescription: 'Tell me about your project and I\'ll get back to you as soon as possible.',
    ctaTitle: 'Ready to Start Your Project?',
    ctaDescription: 'Whether you have a specific project in mind or just want to explore possibilities, I\'m here to help you achieve your goals.',
    services: [
      'Full-stack web development',
      'UI/UX design and optimization',
      'SEO and digital marketing',
      'Technical consulting',
      'Project collaboration'
    ],
    responseTimes: [
      { label: 'Initial response', time: 'Within 24 hours' },
      { label: 'Project discussion', time: '1-2 business days' },
      { label: 'Proposal delivery', time: '3-5 business days' }
    ]
  },
  formFields: [
    { id: 'name', label: 'Name', type: 'text', required: true, active: true },
    { id: 'email', label: 'Email', type: 'email', required: true, active: true },
    { id: 'subject', label: 'Subject', type: 'text', required: true, active: true },
    { id: 'message', label: 'Message', type: 'textarea', required: true, active: true }
  ]
}); 