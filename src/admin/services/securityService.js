import { auth, db } from '../../firebase/config';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { 
  signOut, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';

class SecurityService {
  constructor() {
    this.maxLoginAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.activityLogs = [];
  }

  // Authentication & Session Management
  async validateAdminAccess(email) {
    try {
      const adminDoc = await getDoc(doc(db, 'admin_users', email));
      if (!adminDoc.exists()) {
        throw new Error('Access denied. Admin privileges required.');
      }

      const adminData = adminDoc.data();
      if (!adminData.isActive) {
        throw new Error('Account is deactivated. Contact administrator.');
      }

      return adminData;
    } catch (error) {
      throw error;
    }
  }

  async updateLoginStats(email, success = true) {
    try {
      const updateData = {
        lastLogin: new Date(),
        isOnline: success,
        lastLoginIP: await this.getClientIP(),
        userAgent: navigator.userAgent
      };

      if (success) {
        updateData.loginCount = increment(1);
        updateData.failedAttempts = 0;
      } else {
        updateData.failedAttempts = increment(1);
      }

      await updateDoc(doc(db, 'admin_users', email), updateData);
    } catch (error) {
      console.error('Failed to update login stats:', error);
    }
  }

  // Activity Logging
  async logActivity(action, email, description, metadata = {}) {
    try {
      const logEntry = {
        action,
        email,
        description,
        timestamp: serverTimestamp(),
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        sessionId: this.getSessionId(),
        ...metadata
      };

      await addDoc(collection(db, 'admin_activity_logs'), logEntry);
      
      // Keep local copy for immediate access
      this.activityLogs.push({
        ...logEntry,
        timestamp: new Date()
      });

      // Limit local logs to last 100 entries
      if (this.activityLogs.length > 100) {
        this.activityLogs = this.activityLogs.slice(-100);
      }
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  async getRecentActivity(email, limit = 50) {
    try {
      const q = query(
        collection(db, 'admin_activity_logs'),
        where('email', '==', email),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Failed to get recent activity:', error);
      return [];
    }
  }

  // Security Monitoring
  async checkSuspiciousActivity(email) {
    try {
      // Check for multiple failed login attempts
      const recentLogs = await this.getRecentActivity(email, 10);
      const failedLogins = recentLogs.filter(log => 
        log.action === 'LOGIN_FAILED' && 
        new Date(log.timestamp.toDate()) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
      );

      if (failedLogins.length >= 3) {
        await this.logActivity('SUSPICIOUS_ACTIVITY', email, 'Multiple failed login attempts detected');
        return {
          suspicious: true,
          reason: 'Multiple failed login attempts',
          action: 'monitor'
        };
      }

      // Check for unusual login times (basic implementation)
      const now = new Date();
      const hour = now.getHours();
      if (hour < 6 || hour > 23) {
        await this.logActivity('UNUSUAL_LOGIN_TIME', email, `Login at unusual hour: ${hour}:00`);
        return {
          suspicious: true,
          reason: 'Unusual login time',
          action: 'log'
        };
      }

      return { suspicious: false };
    } catch (error) {
      console.error('Failed to check suspicious activity:', error);
      return { suspicious: false };
    }
  }

  // Password Security
  validatePasswordStrength(password) {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    const isStrong = score >= 4;

    return {
      isStrong,
      score,
      checks,
      feedback: this.getPasswordFeedback(checks)
    };
  }

  getPasswordFeedback(checks) {
    const feedback = [];
    if (!checks.length) feedback.push('Password must be at least 8 characters long');
    if (!checks.uppercase) feedback.push('Include at least one uppercase letter');
    if (!checks.lowercase) feedback.push('Include at least one lowercase letter');
    if (!checks.numbers) feedback.push('Include at least one number');
    if (!checks.special) feedback.push('Include at least one special character');
    return feedback;
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      // Validate password strength
      const strength = this.validatePasswordStrength(newPassword);
      if (!strength.isStrong) {
        throw new Error('Password does not meet security requirements');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Change password
      await updatePassword(user, newPassword);

      // Log password change
      await this.logActivity('PASSWORD_CHANGED', user.email, 'Password changed successfully');

      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  // Session Management
  getSessionId() {
    let sessionId = sessionStorage.getItem('adminSessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('adminSessionId', sessionId);
    }
    return sessionId;
  }

  startSessionTimeout(callback) {
    const timeoutId = setTimeout(() => {
      this.logActivity('SESSION_TIMEOUT', auth.currentUser?.email, 'Session expired due to inactivity');
      callback();
    }, this.sessionTimeout);

    // Reset timeout on user activity
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      this.startSessionTimeout(callback);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }

  // Logout & Cleanup
  async logout() {
    try {
      const user = auth.currentUser;
      if (user) {
        // Update user status
        await updateDoc(doc(db, 'admin_users', user.email), {
          isOnline: false,
          lastLogout: new Date()
        });

        // Log logout
        await this.logActivity('LOGOUT', user.email, 'User logged out');
      }

      // Clear session data
      sessionStorage.removeItem('adminSessionId');
      localStorage.removeItem('rememberedAdmin');
      localStorage.removeItem('adminLockout');

      // Sign out from Firebase
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Utility Functions
  async getClientIP() {
    // In production, you would get the actual IP from your server
    // For now, return a placeholder
    return 'web_client';
  }

  generateSecureToken() {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 15);
  }

  // Rate Limiting
  checkRateLimit(action, email) {
    const key = `rate_limit_${action}_${email}`;
    const now = Date.now();
    const window = 60 * 1000; // 1 minute window

    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    const recentAttempts = attempts.filter(time => now - time < window);

    if (recentAttempts.length >= 10) { // Max 10 attempts per minute
      return { allowed: false, remainingTime: window - (now - recentAttempts[0]) };
    }

    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));

    return { allowed: true };
  }

  // Security Headers & CSP
  getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://firebase.googleapis.com https://identitytoolkit.googleapis.com;"
    };
  }

  // Input Sanitization
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Audit Trail
  async createAuditTrail(action, details) {
    try {
      await addDoc(collection(db, 'audit_trail'), {
        action,
        details,
        timestamp: serverTimestamp(),
        user: auth.currentUser?.email,
        sessionId: this.getSessionId(),
        ipAddress: await this.getClientIP()
      });
    } catch (error) {
      console.error('Failed to create audit trail:', error);
    }
  }
}

const securityService = new SecurityService();
export default securityService; 