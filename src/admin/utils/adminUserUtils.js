import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Utility function to ensure admin user document exists
export const ensureAdminUserExists = async (email) => {
  try {
    const userDoc = await getDoc(doc(db, 'admin_users', email));
    
    if (!userDoc.exists()) {
      // Create new admin user document
      await setDoc(doc(db, 'admin_users', email), {
        email: email,
        isActive: true,
        isOnline: true,
        loginCount: 1,
        failedAttempts: 0,
        lastLogin: new Date(),
        lastLoginIP: 'web_client',
        userAgent: navigator.userAgent,
        createdAt: new Date(),
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'manage_users']
      });
      
      console.log('Admin user document created for:', email);
      return true;
    }
    
    return false; // Document already exists
  } catch (error) {
    console.error('Error ensuring admin user exists:', error);
    throw error;
  }
};

// Utility function to get admin user data
export const getAdminUserData = async (email) => {
  try {
    const userDoc = await getDoc(doc(db, 'admin_users', email));
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('Error getting admin user data:', error);
    return null;
  }
};

// Utility function to update admin user data
export const updateAdminUserData = async (email, updates) => {
  try {
    const userRef = doc(db, 'admin_users', email);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Use updateDoc for existing documents
      const { updateDoc } = await import('firebase/firestore');
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });
    } else {
      // Use setDoc for new documents
      await setDoc(userRef, {
        email: email,
        isActive: true,
        isOnline: true,
        loginCount: 1,
        failedAttempts: 0,
        lastLogin: new Date(),
        lastLoginIP: 'web_client',
        userAgent: navigator.userAgent,
        createdAt: new Date(),
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'manage_users'],
        ...updates
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating admin user data:', error);
    throw error;
  }
}; 