// Authentication Error Handler
import { toast } from 'react-toastify';

// Authentication-specific error codes and messages
export const AUTH_ERROR_MESSAGES = {
  // Firebase Authentication Errors
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  'auth/internal-error': 'Internal server error. Please try again later.',
  'auth/timeout': 'Request timed out. Please try again.',
  'auth/operation-not-allowed': 'This operation is not allowed.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
  'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
  'auth/credential-already-in-use': 'This credential is already associated with another account.',
  'auth/email-change-needs-verification': 'Email change requires verification.',
  'auth/requires-recent-login': 'This operation requires recent authentication. Please log in again.',
  'auth/popup-closed-by-user': 'Login popup was closed. Please try again.',
  'auth/popup-blocked': 'Login popup was blocked. Please allow popups and try again.',
  'auth/cancelled-popup-request': 'Login request was cancelled.',
  'auth/popup-network-error': 'Network error during login. Please try again.',
  'auth/quota-exceeded': 'Service quota exceeded. Please try again later.',
  'auth/retry-limit-exceeded': 'Too many retry attempts. Please try again later.',
  'auth/invalid-api-key': 'Invalid API key. Please contact administrator.',
  'auth/app-not-authorized': 'App not authorized. Please contact administrator.',
  'auth/key-has-been-rotated': 'API key has been rotated. Please contact administrator.',
  'auth/domain-not-whitelisted': 'Domain not whitelisted. Please contact administrator.',
  'auth/operation-not-supported-in-this-environment': 'Operation not supported in this environment.',
  'auth/unauthorized-domain': 'Unauthorized domain. Please contact administrator.',
  'auth/invalid-verification-code': 'Invalid verification code.',
  'auth/invalid-verification-id': 'Invalid verification ID.',
  'auth/missing-verification-code': 'Verification code is required.',
  'auth/missing-verification-id': 'Verification ID is required.',

  // Admin-specific Authentication Errors
  'ADMIN_ACCESS_DENIED': 'Access denied. Admin privileges required.',
  'ADMIN_ACCOUNT_DEACTIVATED': 'Account is deactivated. Contact administrator.',
  'ADMIN_ACCOUNT_LOCKED': 'Account is temporarily locked. Please try again later.',
  'ADMIN_INVALID_CREDENTIALS': 'Invalid admin credentials.',
  'ADMIN_NOT_FOUND': 'Admin account not found.',
  'ADMIN_PERMISSION_DENIED': 'Insufficient permissions for this action.',
  'ADMIN_SESSION_EXPIRED': 'Session expired. Please log in again.',
  'ADMIN_ACCOUNT_DISABLED': 'Account has been disabled by administrator.',
  'ADMIN_IP_NOT_ALLOWED': 'Access denied from this IP address.',
  'ADMIN_MAINTENANCE_MODE': 'Admin panel is under maintenance. Please try again later.',
  'ADMIN_RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait before trying again.',
  'ADMIN_INVALID_TOKEN': 'Invalid or expired session token.',
  'ADMIN_MISSING_PERMISSIONS': 'Required permissions are missing.',
  'ADMIN_ACCOUNT_PENDING': 'Account is pending approval.',
  'ADMIN_ACCOUNT_SUSPENDED': 'Account has been suspended.',
  'ADMIN_LOGIN_FAILED': 'Login failed. Please check your credentials.',
  'ADMIN_FIREBASE_ERROR': 'Authentication service error. Please try again.',
  'ADMIN_DATABASE_ERROR': 'Database connection error. Please try again.',
  'ADMIN_CONFIGURATION_ERROR': 'System configuration error. Please contact administrator.',

  // Network and System Errors
  'NETWORK_OFFLINE': 'You appear to be offline. Please check your internet connection.',
  'NETWORK_TIMEOUT': 'Request timed out. Please try again.',
  'NETWORK_SERVER_ERROR': 'Server error occurred. Please try again later.',
  'NETWORK_NOT_FOUND': 'The requested resource was not found.',
  'NETWORK_UNAUTHORIZED': 'You are not authorized to perform this action.',
  'NETWORK_FORBIDDEN': 'Access denied. You do not have permission to perform this action.',
  'SYSTEM_MAINTENANCE': 'System is under maintenance. Please try again later.',
  'SYSTEM_OVERLOADED': 'System is currently overloaded. Please try again later.',
  'SYSTEM_CONFIGURATION': 'System configuration error. Please contact support.',

  // Default error
  'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again.'
};

export class AuthErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 50;
  }

  // Handle authentication errors
  handleAuthError(error, context = {}) {
    // Log the error
    this.logAuthError(error, context);

    // Get user-friendly message
    const message = this.getAuthErrorMessage(error);

    // Show appropriate notification
    this.showAuthErrorNotification(message, error);

    // Return error object for further handling
    return {
      error,
      message,
      context,
      timestamp: new Date()
    };
  }

  // Get user-friendly authentication error message
  getAuthErrorMessage(error) {
    // Handle Firebase auth errors
    if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
      return AUTH_ERROR_MESSAGES[error.code];
    }

    // Handle Firestore permission errors
    if (error.message && (error.message.includes('Missing or insufficient permissions') || 
                         error.message.includes('permission-denied'))) {
      return 'Database access denied. Please contact administrator.';
    }

    // Handle custom error messages
    if (error.message) {
      // Check if it's a custom admin error
      if (error.message.includes('Access denied')) {
        return AUTH_ERROR_MESSAGES['ADMIN_ACCESS_DENIED'];
      }
      if (error.message.includes('deactivated')) {
        return AUTH_ERROR_MESSAGES['ADMIN_ACCOUNT_DEACTIVATED'];
      }
      if (error.message.includes('locked')) {
        return AUTH_ERROR_MESSAGES['ADMIN_ACCOUNT_LOCKED'];
      }
      if (error.message.includes('No admin account found')) {
        return AUTH_ERROR_MESSAGES['ADMIN_NOT_FOUND'];
      }
      if (error.message.includes('Login failed')) {
        return AUTH_ERROR_MESSAGES['ADMIN_LOGIN_FAILED'];
      }
      
      return error.message;
    }

    // Handle network errors
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return AUTH_ERROR_MESSAGES['NETWORK_SERVER_ERROR'];
    }

    // Handle timeout errors
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return AUTH_ERROR_MESSAGES['NETWORK_TIMEOUT'];
    }

    // Default message
    return AUTH_ERROR_MESSAGES['UNKNOWN_ERROR'];
  }

  // Show authentication error notification
  showAuthErrorNotification(message, error) {
    // Determine notification type based on error
    let type = 'error';
    
    // Use warning for certain types of errors
    if (error.code === 'auth/invalid-email' || 
        error.code === 'auth/weak-password' ||
        error.message.includes('validation')) {
      type = 'warning';
    }

    // Show toast notification
    toast[type](message, {
      position: 'top-right',
      autoClose: type === 'error' ? 5000 : 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  // Log authentication error for debugging
  logAuthError(error, context = {}) {
    const errorLog = {
      timestamp: new Date(),
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      },
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      type: 'AUTH_ERROR'
    };

    this.errorLog.push(errorLog);

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Auth Error:', errorLog);
    }
  }

  // Get authentication error log
  getAuthErrorLog() {
    return this.errorLog;
  }

  // Clear authentication error log
  clearAuthErrorLog() {
    this.errorLog = [];
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    
    return errors;
  }

  // Handle specific Firebase auth errors
  handleFirebaseAuthError(error) {
    const errorCode = error.code;
    let message = AUTH_ERROR_MESSAGES['UNKNOWN_ERROR'];

    // Handle specific Firebase auth errors
    switch (errorCode) {
      case 'auth/user-not-found':
        message = AUTH_ERROR_MESSAGES['auth/user-not-found'];
        break;
      case 'auth/wrong-password':
        message = AUTH_ERROR_MESSAGES['auth/wrong-password'];
        break;
      case 'auth/invalid-email':
        message = AUTH_ERROR_MESSAGES['auth/invalid-email'];
        break;
      case 'auth/too-many-requests':
        message = AUTH_ERROR_MESSAGES['auth/too-many-requests'];
        break;
      case 'auth/user-disabled':
        message = AUTH_ERROR_MESSAGES['auth/user-disabled'];
        break;
      case 'auth/invalid-credential':
        message = AUTH_ERROR_MESSAGES['auth/invalid-credential'];
        break;
      case 'auth/network-request-failed':
        message = AUTH_ERROR_MESSAGES['auth/network-request-failed'];
        break;
      case 'auth/internal-error':
        message = AUTH_ERROR_MESSAGES['auth/internal-error'];
        break;
      case 'auth/timeout':
        message = AUTH_ERROR_MESSAGES['auth/timeout'];
        break;
      default:
        message = error.message || AUTH_ERROR_MESSAGES['UNKNOWN_ERROR'];
    }

    return {
      message,
      code: errorCode,
      originalError: error
    };
  }

  // Handle admin-specific authentication errors
  handleAdminAuthError(error) {
    const errorCode = error.code;
    let message = AUTH_ERROR_MESSAGES['UNKNOWN_ERROR'];

    // Handle specific admin auth errors
    switch (errorCode) {
      case 'ADMIN_ACCESS_DENIED':
        message = AUTH_ERROR_MESSAGES['ADMIN_ACCESS_DENIED'];
        break;
      case 'ADMIN_ACCOUNT_DEACTIVATED':
        message = AUTH_ERROR_MESSAGES['ADMIN_ACCOUNT_DEACTIVATED'];
        break;
      case 'ADMIN_ACCOUNT_LOCKED':
        message = AUTH_ERROR_MESSAGES['ADMIN_ACCOUNT_LOCKED'];
        break;
      case 'ADMIN_INVALID_CREDENTIALS':
        message = AUTH_ERROR_MESSAGES['ADMIN_INVALID_CREDENTIALS'];
        break;
      case 'ADMIN_NOT_FOUND':
        message = AUTH_ERROR_MESSAGES['ADMIN_NOT_FOUND'];
        break;
      case 'ADMIN_PERMISSION_DENIED':
        message = AUTH_ERROR_MESSAGES['ADMIN_PERMISSION_DENIED'];
        break;
      case 'ADMIN_SESSION_EXPIRED':
        message = AUTH_ERROR_MESSAGES['ADMIN_SESSION_EXPIRED'];
        break;
      case 'ADMIN_ACCOUNT_DISABLED':
        message = AUTH_ERROR_MESSAGES['ADMIN_ACCOUNT_DISABLED'];
        break;
      case 'ADMIN_IP_NOT_ALLOWED':
        message = AUTH_ERROR_MESSAGES['ADMIN_IP_NOT_ALLOWED'];
        break;
      case 'ADMIN_MAINTENANCE_MODE':
        message = AUTH_ERROR_MESSAGES['ADMIN_MAINTENANCE_MODE'];
        break;
      case 'ADMIN_RATE_LIMIT_EXCEEDED':
        message = AUTH_ERROR_MESSAGES['ADMIN_RATE_LIMIT_EXCEEDED'];
        break;
      case 'ADMIN_INVALID_TOKEN':
        message = AUTH_ERROR_MESSAGES['ADMIN_INVALID_TOKEN'];
        break;
      case 'ADMIN_MISSING_PERMISSIONS':
        message = AUTH_ERROR_MESSAGES['ADMIN_MISSING_PERMISSIONS'];
        break;
      case 'ADMIN_ACCOUNT_PENDING':
        message = AUTH_ERROR_MESSAGES['ADMIN_ACCOUNT_PENDING'];
        break;
      case 'ADMIN_ACCOUNT_SUSPENDED':
        message = AUTH_ERROR_MESSAGES['ADMIN_ACCOUNT_SUSPENDED'];
        break;
      case 'ADMIN_LOGIN_FAILED':
        message = AUTH_ERROR_MESSAGES['ADMIN_LOGIN_FAILED'];
        break;
      case 'ADMIN_FIREBASE_ERROR':
        message = AUTH_ERROR_MESSAGES['ADMIN_FIREBASE_ERROR'];
        break;
      case 'ADMIN_DATABASE_ERROR':
        message = AUTH_ERROR_MESSAGES['ADMIN_DATABASE_ERROR'];
        break;
      case 'ADMIN_CONFIGURATION_ERROR':
        message = AUTH_ERROR_MESSAGES['ADMIN_CONFIGURATION_ERROR'];
        break;
      default:
        message = error.message || AUTH_ERROR_MESSAGES['UNKNOWN_ERROR'];
    }

    return {
      message,
      code: errorCode,
      originalError: error
    };
  }

  // Handle Firestore permission errors specifically
  handleFirestorePermissionError(error) {
    if (error.message && error.message.includes('Missing or insufficient permissions')) {
      return {
        message: 'Database access denied. Please contact administrator.',
        code: 'FIRESTORE_PERMISSION_DENIED',
        originalError: error
      };
    }
    
    if (error.message && error.message.includes('permission-denied')) {
      return {
        message: 'Access denied. Please contact administrator.',
        code: 'FIRESTORE_PERMISSION_DENIED',
        originalError: error
      };
    }

    return {
      message: error.message || 'Database error occurred.',
      code: 'FIRESTORE_ERROR',
      originalError: error
    };
  }

  // Check if error is retryable
  isRetryableError(error) {
    const retryableErrors = [
      'auth/network-request-failed',
      'auth/internal-error',
      'auth/timeout',
      'NETWORK_OFFLINE',
      'NETWORK_TIMEOUT',
      'NETWORK_SERVER_ERROR',
      'SYSTEM_MAINTENANCE',
      'SYSTEM_OVERLOADED'
    ];

    return retryableErrors.includes(error.code);
  }

  // Retry mechanism for authentication operations
  async retryAuthOperation(operation, maxRetries = 3, delay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (!this.isRetryableError(error)) {
          throw error;
        }

        // Wait before retrying (except on last attempt)
        if (attempt < maxRetries) {
          await this.delay(delay * attempt);
        }
      }
    }

    throw lastError;
  }

  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const authErrorHandler = new AuthErrorHandler(); 