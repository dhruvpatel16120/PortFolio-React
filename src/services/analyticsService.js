import { db } from '../firebase/config';
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc } from 'firebase/firestore';

class AnalyticsService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = [];
    this.userInteractions = [];
    this.performanceMetrics = {};
    this.isTracking = false;
  }

  // Generate unique session ID
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize analytics tracking
  init(userAgent = navigator.userAgent) {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.userAgent = userAgent;
    this.screenResolution = `${window.screen.width}x${window.screen.height}`;
    this.language = navigator.language;
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Track session start
    this.trackSessionStart();
    
    // Set up performance monitoring
    this.setupPerformanceMonitoring();
    
    // Set up user interaction tracking
    this.setupInteractionTracking();
    
    // Track page visibility changes
    this.setupVisibilityTracking();
  }

  // Track session start
  async trackSessionStart() {
    try {
      const sessionData = {
        sessionId: this.sessionId,
        startTime: new Date(),
        userAgent: this.userAgent,
        screenResolution: this.screenResolution,
        language: this.language,
        timezone: this.timezone,
        referrer: document.referrer || 'direct',
        url: window.location.href,
        timestamp: Date.now()
      };

      await addDoc(collection(db, 'analytics_sessions'), sessionData);
    } catch (error) {
      console.error('Error tracking session start:', error);
    }
  }

  // Track page view
  async trackPageView(pageName, pageUrl = window.location.href) {
    try {
      const pageView = {
        sessionId: this.sessionId,
        pageName,
        pageUrl,
        timestamp: Date.now(),
        timeOnPage: 0,
        scrollDepth: 0,
        interactions: 0
      };

      this.pageViews.push(pageView);
      
      await addDoc(collection(db, 'analytics_pageviews'), pageView);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // Track user interaction
  async trackInteraction(type, element, value = null) {
    try {
      const interaction = {
        sessionId: this.sessionId,
        type,
        element: element || 'unknown',
        value,
        timestamp: Date.now(),
        pageUrl: window.location.href
      };

      this.userInteractions.push(interaction);
      
      await addDoc(collection(db, 'analytics_interactions'), interaction);
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  // Track performance metrics
  async trackPerformance(metrics) {
    try {
      const performanceData = {
        sessionId: this.sessionId,
        ...metrics,
        timestamp: Date.now(),
        pageUrl: window.location.href
      };

      await addDoc(collection(db, 'analytics_performance'), performanceData);
    } catch (error) {
      console.error('Error tracking performance:', error);
    }
  }

  // Setup performance monitoring
  setupPerformanceMonitoring() {
    if ('performance' in window) {
      // Track page load performance
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        const metrics = {
          pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          totalPageLoad: navigation.loadEventEnd - navigation.fetchStart
        };

        this.trackPerformance(metrics);
      });

      // Track resource loading performance
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.trackPerformance({
              resourceName: entry.name,
              resourceLoadTime: entry.duration,
              resourceSize: entry.transferSize || 0
            });
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Setup interaction tracking
  setupInteractionTracking() {
    // Track clicks
    document.addEventListener('click', (e) => {
      const element = e.target.tagName.toLowerCase();
      const className = e.target.className;
      const id = e.target.id;
      
      this.trackInteraction('click', `${element}${className ? '.' + className : ''}${id ? '#' + id : ''}`);
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    document.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        this.trackInteraction('scroll_depth', 'page', maxScrollDepth);
      }
    });

    // Track form interactions
    document.addEventListener('submit', (e) => {
      this.trackInteraction('form_submit', e.target.tagName.toLowerCase());
    });

    // Track input focus
    document.addEventListener('focus', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        this.trackInteraction('input_focus', e.target.type || 'text');
      }
    }, true);
  }

  // Setup visibility tracking
  setupVisibilityTracking() {
    let pageStartTime = Date.now();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page became hidden
        const timeOnPage = Date.now() - pageStartTime;
        this.trackInteraction('page_hidden', 'visibility', timeOnPage);
      } else {
        // Page became visible
        pageStartTime = Date.now();
        this.trackInteraction('page_visible', 'visibility');
      }
    });

    // Track time on page when user leaves
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - pageStartTime;
      this.trackInteraction('page_exit', 'navigation', timeOnPage);
    });
  }

  // End session and save analytics
  async endSession() {
    try {
      const sessionDuration = Date.now() - this.startTime;
      
      const sessionSummary = {
        sessionId: this.sessionId,
        endTime: new Date(),
        duration: sessionDuration,
        totalPageViews: this.pageViews.length,
        totalInteractions: this.userInteractions.length,
        pagesVisited: [...new Set(this.pageViews.map(pv => pv.pageName))],
        timestamp: Date.now()
      };

      await addDoc(collection(db, 'analytics_session_summaries'), sessionSummary);
      
      // Update session document
      const sessionsRef = collection(db, 'analytics_sessions');
      const q = query(sessionsRef, where('sessionId', '==', this.sessionId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const sessionDoc = querySnapshot.docs[0];
        await updateDoc(sessionDoc.ref, {
          endTime: new Date(),
          duration: sessionDuration,
          totalPageViews: this.pageViews.length,
          totalInteractions: this.userInteractions.length
        });
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  // Get analytics data for admin dashboard
  async getAnalyticsData(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get sessions
      const sessionsQuery = query(
        collection(db, 'analytics_sessions'),
        where('startTime', '>=', startDate),
        orderBy('startTime', 'desc')
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessions = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get page views
      const pageViewsQuery = query(
        collection(db, 'analytics_pageviews'),
        where('timestamp', '>=', startDate.getTime()),
        orderBy('timestamp', 'desc')
      );
      const pageViewsSnapshot = await getDocs(pageViewsQuery);
      const pageViews = pageViewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get interactions
      const interactionsQuery = query(
        collection(db, 'analytics_interactions'),
        where('timestamp', '>=', startDate.getTime()),
        orderBy('timestamp', 'desc')
      );
      const interactionsSnapshot = await getDocs(interactionsQuery);
      const interactions = interactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get performance data
      const performanceQuery = query(
        collection(db, 'analytics_performance'),
        where('timestamp', '>=', startDate.getTime()),
        orderBy('timestamp', 'desc')
      );
      const performanceSnapshot = await getDocs(performanceQuery);
      const performance = performanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return {
        sessions,
        pageViews,
        interactions,
        performance,
        summary: this.generateSummary(sessions, pageViews, interactions, performance)
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return null;
    }
  }

  // Generate analytics summary
  generateSummary(sessions, pageViews, interactions, performance) {
    const totalSessions = sessions.length;
    const totalPageViews = pageViews.length;
    const totalInteractions = interactions.length;
    
    const avgSessionDuration = totalSessions > 0 
      ? sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / totalSessions 
      : 0;

    const pageViewsPerSession = totalSessions > 0 ? totalPageViews / totalSessions : 0;
    
    const interactionsPerSession = totalSessions > 0 ? totalInteractions / totalSessions : 0;

    // Most visited pages
    const pageCounts = {};
    pageViews.forEach(pv => {
      pageCounts[pv.pageName] = (pageCounts[pv.pageName] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));

    // Most common interactions
    const interactionCounts = {};
    interactions.forEach(interaction => {
      interactionCounts[interaction.type] = (interactionCounts[interaction.type] || 0) + 1;
    });
    const topInteractions = Object.entries(interactionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    // Average performance metrics
    const avgPageLoadTime = performance.length > 0
      ? performance.reduce((sum, p) => sum + (p.pageLoadTime || 0), 0) / performance.length
      : 0;

    return {
      totalSessions,
      totalPageViews,
      totalInteractions,
      avgSessionDuration,
      pageViewsPerSession,
      interactionsPerSession,
      topPages,
      topInteractions,
      avgPageLoadTime
    };
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService; 