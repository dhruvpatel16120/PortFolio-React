#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupFirebase() {
  console.log('🔥 Firebase Environment Variables Setup');
  console.log('=====================================\n');

  try {
    // Check if .env file already exists
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Setup cancelled.');
        rl.close();
        return;
      }
    }

    console.log('📝 Please provide your Firebase configuration values:');
    console.log('(You can find these in Firebase Console > Project Settings > General > Your apps)\n');

    const firebaseConfig = {
      apiKey: await question('Firebase API Key: '),
      authDomain: await question('Firebase Auth Domain: '),
      projectId: await question('Firebase Project ID: '),
      storageBucket: await question('Firebase Storage Bucket: '),
      messagingSenderId: await question('Firebase Messaging Sender ID: '),
      appId: await question('Firebase App ID: ')
    };

    console.log('\n👤 Admin User Configuration:');
    const adminEmail = await question('Admin Email: ');
    const adminPassword = await question('Admin Password (min 8 chars, include uppercase, lowercase, number, special char): ');
    const adminRole = await question('Admin Role (super_admin/admin/editor/viewer) [super_admin]: ') || 'super_admin';

    // Validate inputs
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      console.error('❌ Required Firebase configuration values are missing.');
      rl.close();
      return;
    }

    if (!adminEmail || !adminPassword) {
      console.error('❌ Admin email and password are required.');
      rl.close();
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      console.error('❌ Invalid email format.');
      rl.close();
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(adminPassword);
    if (!passwordValidation.isValid) {
      console.error('❌ Password does not meet security requirements:');
      passwordValidation.errors.forEach(error => {
        console.error(`   - ${error}`);
      });
      rl.close();
      return;
    }

         // Create .env content
     const envContent = `# Firebase Configuration (Free Services Only)
REACT_APP_FIREBASE_API_KEY=${firebaseConfig.apiKey}
REACT_APP_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
REACT_APP_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
REACT_APP_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
REACT_APP_FIREBASE_APP_ID=${firebaseConfig.appId}

# Admin Panel Configuration
REACT_APP_ADMIN_EMAIL=${adminEmail}
REACT_APP_ADMIN_PASSWORD=${adminPassword}
REACT_APP_ADMIN_ROLE=${adminRole}

# Development Configuration
REACT_APP_USE_FIREBASE_EMULATORS=false
REACT_APP_EMULATOR_HOST=localhost
REACT_APP_EMULATOR_PORT=8080

# Security Configuration
REACT_APP_MAX_LOGIN_ATTEMPTS=5
REACT_APP_LOCKOUT_DURATION=900000
REACT_APP_SESSION_TIMEOUT=3600000

# External File Upload Services (Free Alternatives)
# For file uploads, consider using external services like:
# - Cloudinary (free tier: 25GB storage, 25GB bandwidth/month)
# - ImgBB (free API for images)
# - Or store file URLs in Firestore
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Notification Configuration
REACT_APP_ENABLE_PUSH_NOTIFICATIONS=true
REACT_APP_ENABLE_EMAIL_NOTIFICATIONS=true

# Note: All environment variables for React apps must start with REACT_APP_
# Never commit your actual .env file to version control
# This configuration uses only Firebase free services (Auth & Firestore)
`;

    // Write .env file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ .env file created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Email:', adminEmail);
    console.log('🔑 Admin Role:', adminRole);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n🚀 Next steps:');
    console.log('   1. Run: npm run create-admin');
    console.log('   2. Start your app: npm start');
    console.log('   3. Navigate to /admin in your browser');
    console.log('   4. Log in with the admin credentials');

    console.log('\n⚠️  Important:');
    console.log('   - Never commit your .env file to version control');
    console.log('   - Keep your Firebase credentials secure');
    console.log('   - Change the admin password after first login');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    rl.close();
  }
}

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

// Run the setup
if (require.main === module) {
  setupFirebase();
}

module.exports = { setupFirebase }; 