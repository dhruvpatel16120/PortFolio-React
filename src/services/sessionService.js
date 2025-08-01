import { auth } from '../firebase/config';
import { useSettings } from '../context/SettingsContext';

class SessionService {
  constructor() {
    this.sessionTimeoutId = null;
    this.activityListeners = [];
  }

  // Initialize session management
  initSessionManagement(settings) {
    if (!settings) return;

    const sessionTimeoutMs = settings.sessionTimeout * 60 * 1000; // Convert minutes to milliseconds
    
    // Clear existing timeout
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
    }

    // Set new session timeout
    this.sessionTimeoutId = setTimeout(() => {
      this.handleSessionTimeout();
    }, sessionTimeoutMs);

    // Add activity listeners to reset timeout
    this.addActivityListeners();
  }

  // Add activity listeners to reset session timeout
  addActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimeout = () => {
      if (this.sessionTimeoutId) {
        clearTimeout(this.sessionTimeoutId);
        this.sessionTimeoutId = setTimeout(() => {
          this.handleSessionTimeout();
        }, this.getSessionTimeoutMs());
      }
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
      this.activityListeners.push({ event, handler: resetTimeout });
    });
  }

  // Remove activity listeners
  removeActivityListeners() {
    this.activityListeners.forEach(({ event, handler }) => {
      document.removeEventListener(event, handler, true);
    });
    this.activityListeners = [];
  }

  // Handle session timeout
  async handleSessionTimeout() {
    try {
      const user = auth.currentUser;
      if (user) {
        // Log session timeout
        console.log('Session timeout - user will be logged out');
        
        // Clear session data
        localStorage.clear();
        sessionStorage.clear();
        
        // Sign out from Firebase
        await auth.signOut();
        
        // Redirect to login page
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Error handling session timeout:', error);
    }
  }

  // Get session timeout in milliseconds
  getSessionTimeoutMs() {
    // Default to 30 minutes if settings not available
    return 30 * 60 * 1000;
  }

  // Extend session
  extendSession() {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = setTimeout(() => {
        this.handleSessionTimeout();
      }, this.getSessionTimeoutMs());
    }
  }

  // Clear session
  clearSession() {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = null;
    }
    this.removeActivityListeners();
  }

  // Check if session is active
  isSessionActive() {
    return auth.currentUser !== null;
  }

  // Get session info
  getSessionInfo() {
    const user = auth.currentUser;
    if (!user) return null;

    return {
      email: user.email,
      uid: user.uid,
      lastSignInTime: user.metadata.lastSignInTime,
      creationTime: user.metadata.creationTime
    };
  }
}

// Create singleton instance
const sessionService = new SessionService();
export default sessionService; 