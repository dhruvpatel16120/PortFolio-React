const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');
require('dotenv').config();

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdIIh3QscNAKaVPKt1qFUmrVopsZG97Uo",
  authDomain: "portfolio-dhruv-patel.firebaseapp.com",
  projectId: "portfolio-dhruv-patel",
  storageBucket: "portfolio-dhruv-patel.firebasestorage.app",
  messagingSenderId: "762157838251",
  appId: "1:762157838251:web:2e65180fe9969edfa96cee"
};
 
// Validate environment variables
function validateEnvironment() {
  const requiredVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID',
    'REACT_APP_ADMIN_EMAIL',
    'REACT_APP_ADMIN_PASSWORD'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env file and ensure all variables are set.');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
}

// Validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

async function createAdminUser() {
  try {
    console.log('🚀 Starting admin user creation...\n');

    // Validate environment
    // validateEnvironment();

    const email = "dhruvpatel16120@gmail.com";
    const password = "Root@123";
    const role = "super_admin";

    // Validate email
    if (!validateEmail(email)) {
      console.error('❌ Invalid email format:', email);
      process.exit(1);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      console.error('❌ Password does not meet security requirements:');
      passwordValidation.errors.forEach(error => {
        console.error(`   - ${error}`);
      });
      process.exit(1);
    }

    console.log('📧 Email:', email);
    console.log('🔑 Role:', role);
    console.log('✅ Password meets security requirements\n');

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('🔥 Connecting to Firebase...');

    // Create user
    console.log('👤 Creating user account...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ User account created successfully');

    // Create admin user document
    console.log('📝 Creating admin user document...');
    const adminData = {
      uid: user.uid,
      email: user.email,
      displayName: 'Admin User',
      role,
      permissions: ['*'],
      isAdmin: true,
      isActive: true,
      createdAt: serverTimestamp(),
      createdBy: 'system',
      lastLogin: null,
      loginCount: 0,
      passwordChangedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'admin_users', user.uid), adminData);

    console.log('✅ Admin user document created successfully');

    // Success message
    console.log('\n🎉 Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Role: ${role}`);
    console.log(`🆔 User ID: ${user.uid}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 You can now log in to the admin panel using these credentials.');
    console.log('⚠️  Please change the password after first login for security.');
    console.log('\n🚀 Next steps:');
    console.log('   1. Start your development server: npm start');
    console.log('   2. Navigate to /admin in your browser');
    console.log('   3. Log in with the credentials above');
    console.log('   4. Change your password in the admin panel');

  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        console.error('   Email is already registered. Please use a different email or reset the password.');
        break;
      case 'auth/invalid-email':
        console.error('   Invalid email format.');
        break;
      case 'auth/weak-password':
        console.error('   Password is too weak. Please use a stronger password.');
        break;
      case 'auth/network-request-failed':
        console.error('   Network error. Please check your internet connection.');
        break;
      case 'auth/too-many-requests':
        console.error('   Too many requests. Please wait a moment and try again.');
        break;
      default:
        console.error(`   ${error.message}`);
    }
    
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check your Firebase configuration in .env file');
    console.error('   2. Ensure Firebase Authentication is enabled');
    console.error('   3. Verify your internet connection');
    console.error('   4. Check Firebase Console for any errors');
    
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser }; 