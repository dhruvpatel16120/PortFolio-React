import { auth, db } from '../../firebase/config';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import securityService from './securityService';

class AdminAuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
  }

  // Login with email and password
  async login(email, password) {
    try {
      // Check rate limiting
      const rateLimit = securityService.checkRateLimit('login', email);
      if (!rateLimit.allowed) {
        throw new Error(`Too many login attempts. Please wait ${Math.ceil(rateLimit.remainingTime / 1000)} seconds.`);
      }

      // Attempt Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update login stats (this will create the document if it doesn't exist)
      await securityService.updateLoginStats(email, true);

      // Log successful login
      await securityService.logActivity('LOGIN_SUCCESS', email, 'Admin login successful');

      // Check for suspicious activity
      const suspiciousCheck = await securityService.checkSuspiciousActivity(email);
      if (suspiciousCheck.suspicious) {
        console.warn('Suspicious activity detected:', suspiciousCheck.reason);
      }

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      
      // Log failed login attempt
      await securityService.logActivity('LOGIN_FAILED', email, 'Admin login failed: ' + error.message);
      
      // Update failed attempts count
      await securityService.updateLoginStats(email, false);
      
      throw error;
    }
  }

  // Logout
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
        await securityService.logActivity('LOGOUT', user.email, 'Admin logout');
      }

      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!auth.currentUser;
  }

  // Check if user is admin
  async isAdmin(email) {
    try {
      const adminDoc = await getDoc(doc(db, 'admin_users', email));
      return adminDoc.exists() && adminDoc.data().isActive;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin
        const isAdminUser = await this.isAdmin(user.email);
        if (!isAdminUser) {
          // User is not admin, sign them out
          await this.logout();
          callback(null);
          return;
        }
      }
      callback(user);
    });

    this.authStateListeners.push(unsubscribe);
    return unsubscribe;
  }

  // Clean up listeners
  cleanup() {
    this.authStateListeners.forEach(unsubscribe => unsubscribe());
    this.authStateListeners = [];
  }

  // Get user profile
  async getUserProfile(email) {
    try {
      const adminDoc = await getDoc(doc(db, 'admin_users', email));
      if (adminDoc.exists()) {
        return adminDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(email, updates) {
    try {
      await updateDoc(doc(db, 'admin_users', email), {
        ...updates,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

const adminAuthService = new AdminAuthService();
export default adminAuthService; 