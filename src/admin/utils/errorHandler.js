// Advanced Error Handling System
import { toast } from 'react-toastify';

// Custom error classes for different types of errors
export class AdminError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'AdminError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

export class ValidationError extends Error {
  constructor(message, field, value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.timestamp = new Date();
  }
}

export class NetworkError extends Error {
  constructor(message, statusCode = null, url = null) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    this.url = url;
    this.timestamp = new Date();
  }
}

export class PermissionError extends Error {
  constructor(message, requiredPermission = null) {
    super(message);
    this.name = 'PermissionError';
    this.requiredPermission = requiredPermission;
    this.timestamp = new Date();
  }
}

export class AuthError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

// Error codes and their user-friendly messages
export const ERROR_MESSAGES = {
  // Authentication errors
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/operation-not-allowed': 'This operation is not allowed.',
  'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
  'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
  'auth/invalid-verification-code': 'Invalid verification code.',
  'auth/invalid-verification-id': 'Invalid verification ID.',
  'auth/missing-verification-code': 'Verification code is required.',
  'auth/missing-verification-id': 'Verification ID is required.',
  'auth/quota-exceeded': 'Service quota exceeded. Please try again later.',
  'auth/retry-limit-exceeded': 'Too many retry attempts. Please try again later.',
  'auth/timeout': 'Request timed out. Please try again.',
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  'auth/internal-error': 'Internal server error. Please try again later.',
  'auth/invalid-api-key': 'Invalid API key. Please contact administrator.',
  'auth/app-not-authorized': 'App not authorized. Please contact administrator.',
  'auth/key-has-been-rotated': 'API key has been rotated. Please contact administrator.',
  'auth/domain-not-whitelisted': 'Domain not whitelisted. Please contact administrator.',
  'auth/operation-not-supported-in-this-environment': 'Operation not supported in this environment.',
  'auth/unauthorized-domain': 'Unauthorized domain. Please contact administrator.',
  'auth/requires-recent-login': 'This operation requires recent authentication. Please log in again.',
  'auth/popup-closed-by-user': 'Login popup was closed. Please try again.',
  'auth/popup-blocked': 'Login popup was blocked. Please allow popups and try again.',
  'auth/cancelled-popup-request': 'Login request was cancelled.',
  'auth/popup-network-error': 'Network error during login. Please try again.',
  'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
  'auth/credential-already-in-use': 'This credential is already associated with another account.',
  'auth/email-change-needs-verification': 'Email change requires verification.',
  'auth/requires-recent-login': 'This operation requires recent authentication. Please log in again.',
  
  // Admin-specific errors
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
  
  // Network errors
  'network/offline': 'You appear to be offline. Please check your internet connection.',
  'network/timeout': 'Request timed out. Please try again.',
  'network/server-error': 'Server error occurred. Please try again later.',
  'network/not-found': 'The requested resource was not found.',
  'network/unauthorized': 'You are not authorized to perform this action.',
  'network/forbidden': 'Access denied. You do not have permission to perform this action.',
  'network/bad-request': 'Invalid request. Please check your input.',
  'network/conflict': 'Resource conflict. Please try again.',
  'network/unprocessable-entity': 'Request cannot be processed.',
  'network/internal-server-error': 'Internal server error. Please try again later.',
  'network/service-unavailable': 'Service temporarily unavailable. Please try again later.',
  'network/gateway-timeout': 'Gateway timeout. Please try again later.',
  
  // Validation errors
  'validation/required': 'This field is required.',
  'validation/email': 'Please enter a valid email address.',
  'validation/min-length': 'This field must be at least {min} characters long.',
  'validation/max-length': 'This field must be no more than {max} characters long.',
  'validation/pattern': 'This field does not match the required format.',
  'validation/unique': 'This value already exists.',
  'validation/file-size': 'File size exceeds the maximum limit.',
  'validation/file-type': 'This file type is not supported.',
  'validation/password-strength': 'Password does not meet security requirements.',
  'validation/email-format': 'Please enter a valid email address.',
  'validation/phone-format': 'Please enter a valid phone number.',
  'validation/url-format': 'Please enter a valid URL.',
  'validation/numeric': 'This field must contain only numbers.',
  'validation/alphanumeric': 'This field must contain only letters and numbers.',
  'validation/date-format': 'Please enter a valid date.',
  'validation/time-format': 'Please enter a valid time.',
  'validation/currency-format': 'Please enter a valid currency amount.',
  
  // Permission errors
  'permission/read': 'You do not have permission to view this content.',
  'permission/write': 'You do not have permission to modify this content.',
  'permission/delete': 'You do not have permission to delete this content.',
  'permission/admin': 'Admin privileges are required for this action.',
  'permission/super-admin': 'Super admin privileges are required for this action.',
  'permission/manage-users': 'User management permissions are required.',
  'permission/manage-content': 'Content management permissions are required.',
  'permission/manage-settings': 'Settings management permissions are required.',
  'permission/view-logs': 'Log viewing permissions are required.',
  'permission/export-data': 'Data export permissions are required.',
  
  // Content errors
  'content/not-found': 'The requested content was not found.',
  'content/invalid': 'The content format is invalid.',
  'content/duplicate': 'This content already exists.',
  'content/processing': 'Content is being processed. Please try again later.',
  'content/too-large': 'Content size exceeds the maximum limit.',
  'content/unsupported-format': 'This content format is not supported.',
  'content/corrupted': 'Content appears to be corrupted.',
  'content/expired': 'Content has expired and is no longer available.',
  'content/restricted': 'This content is restricted and not available.',
  
  // System errors
  'system/maintenance': 'System is under maintenance. Please try again later.',
  'system/overloaded': 'System is currently overloaded. Please try again later.',
  'system/configuration': 'System configuration error. Please contact support.',
  'system/database-connection': 'Database connection error. Please try again later.',
  'system/cache-error': 'Cache error occurred. Please try again.',
  'system/file-system-error': 'File system error occurred. Please try again.',
  'system/memory-error': 'System memory error. Please try again later.',
  'system/cpu-error': 'System processing error. Please try again later.',
  'system/disk-error': 'Storage error occurred. Please try again later.',
  'system/network-error': 'Network configuration error. Please contact administrator.',
  
  // Firebase specific errors
  'firebase/app-not-initialized': 'Firebase app not initialized. Please contact administrator.',
  'firebase/invalid-config': 'Invalid Firebase configuration. Please contact administrator.',
  'firebase/network-error': 'Firebase network error. Please check your connection.',
  'firebase/authentication-error': 'Firebase authentication error. Please try again.',
  'firebase/database-error': 'Firebase database error. Please try again.',
  'firebase/storage-error': 'Firebase storage error. Please try again.',
  'firebase/function-error': 'Firebase function error. Please try again.',
  'firebase/hosting-error': 'Firebase hosting error. Please try again.',
  'firebase/analytics-error': 'Firebase analytics error. Please try again.',
  'firebase/messaging-error': 'Firebase messaging error. Please try again.',
  'firebase/performance-error': 'Firebase performance error. Please try again.',
  'firebase/crashlytics-error': 'Firebase crashlytics error. Please try again.',
  
  // Default error
  'unknown': 'An unexpected error occurred. Please try again.'
};

// Error handler class
export class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  // Handle different types of errors
  handleError(error, context = {}) {
    // Log the error
    this.logError(error, context);

    // Get user-friendly message
    const message = this.getUserFriendlyMessage(error);

    // Show appropriate notification
    this.showErrorNotification(message, error);

    // Return error object for further handling
    return {
      error,
      message,
      context,
      timestamp: new Date()
    };
  }

  // Get user-friendly error message
  getUserFriendlyMessage(error) {
    // Handle custom error classes
    if (error instanceof ValidationError) {
      return `${error.message} (Field: ${error.field})`;
    }

    if (error instanceof PermissionError) {
      return error.message || 'You do not have permission to perform this action.';
    }

    if (error instanceof NetworkError) {
      return this.getNetworkErrorMessage(error);
    }

    if (error instanceof AdminError) {
      return error.message || 'An admin error occurred.';
    }

    if (error instanceof AuthError) {
      return error.message || 'Authentication error occurred.';
    }

    // Handle Firebase errors
    if (error.code && ERROR_MESSAGES[error.code]) {
      return ERROR_MESSAGES[error.code];
    }

    // Handle HTTP status codes
    if (error.statusCode) {
      return this.getHttpErrorMessage(error.statusCode);
    }

    // Handle string errors
    if (typeof error === 'string') {
      return error;
    }

    // Default message
    return error.message || ERROR_MESSAGES.unknown;
  }

  // Get network error message
  getNetworkErrorMessage(error) {
    if (error.statusCode) {
      return this.getHttpErrorMessage(error.statusCode);
    }

    if (error.message.includes('timeout')) {
      return ERROR_MESSAGES['network/timeout'];
    }

    if (error.message.includes('offline') || !navigator.onLine) {
      return ERROR_MESSAGES['network/offline'];
    }

    if (error.message.includes('network')) {
      return ERROR_MESSAGES['network/server-error'];
    }

    return error.message || ERROR_MESSAGES['network/server-error'];
  }

  // Get HTTP error message
  getHttpErrorMessage(statusCode) {
    const messages = {
      400: 'Bad request. Please check your input and try again.',
      401: 'Authentication required. Please log in again.',
      403: 'Access denied. You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      408: 'Request timed out. Please try again.',
      409: 'Resource conflict. Please try again.',
      422: 'Request cannot be processed. Please check your input.',
      429: 'Too many requests. Please wait a moment and try again.',
      500: 'Server error occurred. Please try again later.',
      502: 'Bad gateway. Please try again later.',
      503: 'Service temporarily unavailable. Please try again later.',
      504: 'Gateway timeout. Please try again later.',
      507: 'Insufficient storage. Please try again later.',
      511: 'Network authentication required. Please try again later.'
    };

    return messages[statusCode] || ERROR_MESSAGES['network/server-error'];
  }

  // Show error notification
  showErrorNotification(message, error) {
    // Determine notification type based on error
    let type = 'error';
    
    if (error instanceof ValidationError) {
      type = 'warning';
    } else if (error instanceof PermissionError) {
      type = 'warning';
    } else if (error.code && error.code.includes('auth/')) {
      type = 'error';
    } else if (error instanceof NetworkError) {
      type = 'error';
    } else if (error instanceof AuthError) {
      type = 'error';
    } else if (error instanceof AdminError) {
      type = 'error';
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

  // Log error for debugging
  logError(error, context = {}) {
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
      url: window.location.href
    };

    this.errorLog.push(errorLog);

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Admin Error:', errorLog);
    }

    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendErrorToReportingService(errorLog);
    }
  }

  // Send error to reporting service (placeholder)
  async sendErrorToReportingService(errorLog) {
    try {
      // Implement your error reporting service here
      // Example: Sentry, LogRocket, etc.
      console.log('Sending error to reporting service:', errorLog);
    } catch (error) {
      console.error('Failed to send error to reporting service:', error);
    }
  }

  // Get error log
  getErrorLog() {
    return this.errorLog;
  }

  // Clear error log
  clearErrorLog() {
    this.errorLog = [];
  }

  // Validate form data
  validateFormData(data, rules) {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];
      
      // Required validation
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors[field] = rule.requiredMessage || `${field} is required.`;
        continue;
      }

      // Skip other validations if field is empty and not required
      if (!value && !rule.required) continue;

      // Type validation
      if (rule.type && typeof value !== rule.type) {
        errors[field] = `${field} must be of type ${rule.type}.`;
        continue;
      }

      // Email validation
      if (rule.email && !this.isValidEmail(value)) {
        errors[field] = 'Please enter a valid email address.';
        continue;
      }

      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters long.`;
        continue;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${field} must be no more than ${rule.maxLength} characters long.`;
        continue;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.patternMessage || `${field} does not match the required format.`;
        continue;
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value, data);
        if (customError) {
          errors[field] = customError;
          continue;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Form validation failed', 'form', errors);
    }

    return true;
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Retry mechanism for failed operations
  async retryOperation(operation, maxRetries = 3, delay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (this.shouldNotRetry(error)) {
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

  // Check if error should not be retried
  shouldNotRetry(error) {
    const nonRetryableErrors = [
      'auth/user-not-found',
      'auth/wrong-password',
      'auth/email-already-in-use',
      'auth/invalid-email',
      'auth/user-disabled',
      'auth/account-exists-with-different-credential',
      'auth/invalid-credential',
      'ADMIN_ACCESS_DENIED',
      'ADMIN_ACCOUNT_DEACTIVATED',
      'ADMIN_ACCOUNT_LOCKED',
      'ADMIN_INVALID_CREDENTIALS',
      'ADMIN_NOT_FOUND',
      'ADMIN_PERMISSION_DENIED',
      'ADMIN_ACCOUNT_DISABLED',
      'ADMIN_IP_NOT_ALLOWED',
      'ADMIN_MAINTENANCE_MODE',
      'ADMIN_ACCOUNT_PENDING',
      'ADMIN_ACCOUNT_SUSPENDED',
      'validation/required',
      'permission/read',
      'permission/write',
      'permission/delete'
    ];

    return nonRetryableErrors.includes(error.code);
  }

  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Handle Firebase authentication errors specifically
  handleFirebaseAuthError(error) {
    const errorCode = error.code;
    let message = ERROR_MESSAGES.unknown;

    // Handle specific Firebase auth errors
    switch (errorCode) {
      case 'auth/user-not-found':
        message = ERROR_MESSAGES['auth/user-not-found'];
        break;
      case 'auth/wrong-password':
        message = ERROR_MESSAGES['auth/wrong-password'];
        break;
      case 'auth/invalid-email':
        message = ERROR_MESSAGES['auth/invalid-email'];
        break;
      case 'auth/too-many-requests':
        message = ERROR_MESSAGES['auth/too-many-requests'];
        break;
      case 'auth/user-disabled':
        message = ERROR_MESSAGES['auth/user-disabled'];
        break;
      case 'auth/invalid-credential':
        message = ERROR_MESSAGES['auth/invalid-credential'];
        break;
      case 'auth/network-request-failed':
        message = ERROR_MESSAGES['auth/network-request-failed'];
        break;
      case 'auth/internal-error':
        message = ERROR_MESSAGES['auth/internal-error'];
        break;
      case 'auth/timeout':
        message = ERROR_MESSAGES['auth/timeout'];
        break;
      default:
        message = error.message || ERROR_MESSAGES.unknown;
    }

    return new AuthError(message, errorCode, { originalError: error });
  }

  // Handle admin-specific errors
  handleAdminError(error) {
    const errorCode = error.code;
    let message = ERROR_MESSAGES.unknown;

    // Handle specific admin errors
    switch (errorCode) {
      case 'ADMIN_ACCESS_DENIED':
        message = ERROR_MESSAGES['ADMIN_ACCESS_DENIED'];
        break;
      case 'ADMIN_ACCOUNT_DEACTIVATED':
        message = ERROR_MESSAGES['ADMIN_ACCOUNT_DEACTIVATED'];
        break;
      case 'ADMIN_ACCOUNT_LOCKED':
        message = ERROR_MESSAGES['ADMIN_ACCOUNT_LOCKED'];
        break;
      case 'ADMIN_INVALID_CREDENTIALS':
        message = ERROR_MESSAGES['ADMIN_INVALID_CREDENTIALS'];
        break;
      case 'ADMIN_NOT_FOUND':
        message = ERROR_MESSAGES['ADMIN_NOT_FOUND'];
        break;
      case 'ADMIN_PERMISSION_DENIED':
        message = ERROR_MESSAGES['ADMIN_PERMISSION_DENIED'];
        break;
      case 'ADMIN_SESSION_EXPIRED':
        message = ERROR_MESSAGES['ADMIN_SESSION_EXPIRED'];
        break;
      case 'ADMIN_ACCOUNT_DISABLED':
        message = ERROR_MESSAGES['ADMIN_ACCOUNT_DISABLED'];
        break;
      case 'ADMIN_IP_NOT_ALLOWED':
        message = ERROR_MESSAGES['ADMIN_IP_NOT_ALLOWED'];
        break;
      case 'ADMIN_MAINTENANCE_MODE':
        message = ERROR_MESSAGES['ADMIN_MAINTENANCE_MODE'];
        break;
      case 'ADMIN_RATE_LIMIT_EXCEEDED':
        message = ERROR_MESSAGES['ADMIN_RATE_LIMIT_EXCEEDED'];
        break;
      case 'ADMIN_INVALID_TOKEN':
        message = ERROR_MESSAGES['ADMIN_INVALID_TOKEN'];
        break;
      case 'ADMIN_MISSING_PERMISSIONS':
        message = ERROR_MESSAGES['ADMIN_MISSING_PERMISSIONS'];
        break;
      case 'ADMIN_ACCOUNT_PENDING':
        message = ERROR_MESSAGES['ADMIN_ACCOUNT_PENDING'];
        break;
      case 'ADMIN_ACCOUNT_SUSPENDED':
        message = ERROR_MESSAGES['ADMIN_ACCOUNT_SUSPENDED'];
        break;
      case 'ADMIN_LOGIN_FAILED':
        message = ERROR_MESSAGES['ADMIN_LOGIN_FAILED'];
        break;
      case 'ADMIN_FIREBASE_ERROR':
        message = ERROR_MESSAGES['ADMIN_FIREBASE_ERROR'];
        break;
      case 'ADMIN_DATABASE_ERROR':
        message = ERROR_MESSAGES['ADMIN_DATABASE_ERROR'];
        break;
      case 'ADMIN_CONFIGURATION_ERROR':
        message = ERROR_MESSAGES['ADMIN_CONFIGURATION_ERROR'];
        break;
      default:
        message = error.message || ERROR_MESSAGES.unknown;
    }

    return new AdminError(message, errorCode, { originalError: error });
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler(); 