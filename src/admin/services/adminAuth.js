import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

// Custom error classes for better error handling
export class AuthError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Admin roles and permissions
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  [ADMIN_ROLES.SUPER_ADMIN]: ['*'], // All permissions
  [ADMIN_ROLES.ADMIN]: ['read', 'write', 'delete', 'manage_users'],
  [ADMIN_ROLES.EDITOR]: ['read', 'write'],
  [ADMIN_ROLES.VIEWER]: ['read']
};

// Rate limiting for login attempts
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export class AdminAuthService {
  constructor() {
    this.currentUser = null;
    this.userRole = null;
    this.permissions = [];
  }

  // Advanced login with rate limiting and security checks
  async login(email, password, rememberMe = false) {
    try {
      // Check rate limiting
      this.checkRateLimit(email);

      // Validate input
      this.validateLoginInput(email, password);

      // Attempt login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get admin user data
      const adminData = await this.getAdminUserData(userCredential.user.uid);
      
      if (!adminData || !adminData.isAdmin) {
        throw new AuthError('Access denied. Admin privileges required.', 'ADMIN_ACCESS_DENIED');
      }

      // Reset login attempts on successful login
      loginAttempts.delete(email);

      // Update last login
      await this.updateLastLogin(userCredential.user.uid);

      // Log successful login
      await this.logActivity('LOGIN_SUCCESS', userCredential.user.uid, { email });

      return {
        success: true,
        user: userCredential.user,
        adminData
      };

    } catch (error) {
      // Increment failed login attempts
      this.incrementLoginAttempts(email);

      // Log failed login
      await this.logActivity('LOGIN_FAILED', null, { email, error: error.message });

      throw new AuthError(
        error.code === 'auth/user-not-found' ? 'Invalid credentials' :
        error.code === 'auth/wrong-password' ? 'Invalid credentials' :
        error.code === 'auth/too-many-requests' ? 'Too many failed attempts. Please try again later.' :
        'Login failed. Please try again.',
        error.code || 'LOGIN_ERROR'
      );
    }
  }

  // Create admin user (super admin only)
  async createAdminUser(email, password, role = ADMIN_ROLES.EDITOR, displayName = '') {
    try {
      this.validateAdminCreation(email, password, role);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Create admin user document
      const adminData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.displayName,
        role,
        permissions: PERMISSIONS[role],
        isAdmin: true,
        isActive: true,
        createdAt: serverTimestamp(),
        createdBy: this.currentUser?.uid || 'system',
        lastLogin: null
      };

      await setDoc(doc(db, 'admin_users', userCredential.user.uid), adminData);

      await this.logActivity('ADMIN_CREATED', this.currentUser?.uid, { 
        targetEmail: email, 
        role 
      });

      return { success: true, user: userCredential.user, adminData };

    } catch (error) {
      throw new AuthError(
        error.code === 'auth/email-already-in-use' ? 'Email already registered' :
        'Failed to create admin user',
        error.code || 'ADMIN_CREATION_ERROR'
      );
    }
  }

  // Logout with session cleanup
  async logout() {
    try {
      if (this.currentUser) {
        await this.logActivity('LOGOUT', this.currentUser.uid);
      }
      
      await signOut(auth);
      this.currentUser = null;
      this.userRole = null;
      this.permissions = [];

      return { success: true };

    } catch (error) {
      throw new AuthError('Logout failed', 'LOGOUT_ERROR');
    }
  }

  // Change password with re-authentication
  async changePassword(currentPassword, newPassword) {
    try {
      if (!this.currentUser) {
        throw new AuthError('User not authenticated', 'NOT_AUTHENTICATED');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        this.currentUser.email, 
        currentPassword
      );
      
      await reauthenticateWithCredential(this.currentUser, credential);

      // Update password
      await updatePassword(this.currentUser, newPassword);

      await this.logActivity('PASSWORD_CHANGED', this.currentUser.uid);

      return { success: true };

    } catch (error) {
      throw new AuthError(
        error.code === 'auth/wrong-password' ? 'Current password is incorrect' :
        'Failed to change password',
        error.code || 'PASSWORD_CHANGE_ERROR'
      );
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      this.validateEmail(email);

      await sendPasswordResetEmail(auth, email);

      await this.logActivity('PASSWORD_RESET_REQUESTED', null, { email });

      return { success: true };

    } catch (error) {
      throw new AuthError('Failed to send reset email', 'PASSWORD_RESET_ERROR');
    }
  }

  // Check if user has permission
  hasPermission(permission) {
    if (!this.permissions) return false;
    return this.permissions.includes('*') || this.permissions.includes(permission);
  }

  // Get admin user data
  async getAdminUserData(uid) {
    try {
      const docRef = doc(db, 'admin_users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting admin user data:', error);
      return null;
    }
  }

  // Update last login
  async updateLastLogin(uid) {
    try {
      const docRef = doc(db, 'admin_users', uid);
      await updateDoc(docRef, {
        lastLogin: serverTimestamp(),
        loginCount: increment(1)
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Log activity for audit trail
  async logActivity(action, userId, details = {}) {
    try {
      await addDoc(collection(db, 'admin_activity_logs'), {
        action,
        userId,
        timestamp: serverTimestamp(),
        details,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Rate limiting methods
  checkRateLimit(email) {
    const attempts = loginAttempts.get(email);
    if (attempts && attempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        throw new AuthError(
          `Account temporarily locked. Try again in ${Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000)} minutes.`,
          'ACCOUNT_LOCKED'
        );
      } else {
        loginAttempts.delete(email);
      }
    }
  }

  incrementLoginAttempts(email) {
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    loginAttempts.set(email, attempts);
  }

  // Validation methods
  validateLoginInput(email, password) {
    if (!email || !email.trim()) {
      throw new ValidationError('Email is required', 'email');
    }
    if (!password || !password.trim()) {
      throw new ValidationError('Password is required', 'password');
    }
    if (!this.isValidEmail(email)) {
      throw new ValidationError('Invalid email format', 'email');
    }
  }

  validateAdminCreation(email, password, role) {
    this.validateLoginInput(email, password);
    
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters', 'password');
    }
    
    if (!Object.values(ADMIN_ROLES).includes(role)) {
      throw new ValidationError('Invalid role', 'role');
    }
  }

  validateEmail(email) {
    if (!email || !this.isValidEmail(email)) {
      throw new ValidationError('Invalid email format', 'email');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get client IP (simplified)
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  // Initialize auth state listener
  initAuthListener(callback) {
    return onAuthStateChanged(auth, async (user) => {
      let adminData = null;
      if (user) {
        adminData = await this.getAdminUserData(user.uid);
        this.currentUser = user;
        this.userRole = adminData?.role;
        this.permissions = adminData?.permissions || [];
      } else {
        this.currentUser = null;
        this.userRole = null;
        this.permissions = [];
      }
      
      callback(user, adminData);
    });
  }
}

// Export singleton instance
export const adminAuthService = new AdminAuthService(); 