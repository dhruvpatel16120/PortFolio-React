#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to colorize text
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Helper function to ask user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Function to read existing .env file
function readEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envPath)) {
    return fs.readFileSync(envPath, 'utf8');
  }
  
  return '';
}

// Function to parse .env file into key-value pairs
function parseEnvFile(content) {
  const lines = content.split('\n');
  const envVars = {};
  
  lines.forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const equalIndex = line.indexOf('=');
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex);
        const value = line.substring(equalIndex + 1);
        envVars[key] = value;
      }
    }
  });
  
  return envVars;
}

// Function to convert env vars back to .env format
function envVarsToString(envVars) {
  return Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

// Function to write .env file
function writeEnvFile(content) {
  const envPath = path.join(process.cwd(), '.env');
  fs.writeFileSync(envPath, content, 'utf8');
}

// Function to validate Cloudinary cloud name
function validateCloudName(cloudName) {
  if (!cloudName) return false;
  // Cloudinary cloud names are typically lowercase with hyphens and numbers
  return /^[a-z0-9-]+$/.test(cloudName);
}

// Function to validate upload preset
function validateUploadPreset(preset) {
  if (!preset) return false;
  // Upload presets are typically lowercase with underscores
  return /^[a-z0-9_]+$/.test(preset);
}

// Main setup function
async function setupCloudinary() {
  console.log(colorize('\n🚀 Cloudinary Setup Script', 'bright'));
  console.log(colorize('========================\n', 'bright'));
  
  console.log(colorize('This script will help you configure Cloudinary for your portfolio website.\n', 'cyan'));
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  const envExists = fs.existsSync(envPath);
  
  if (envExists) {
    console.log(colorize('✅ Found existing .env file', 'green'));
  } else {
    console.log(colorize('📝 Creating new .env file', 'yellow'));
  }
  
  // Read existing .env file
  const existingContent = readEnvFile();
  const envVars = parseEnvFile(existingContent);
  
  // Check if Cloudinary is already configured
  const existingCloudName = envVars['REACT_APP_CLOUDINARY_CLOUD_NAME'];
  const existingUploadPreset = envVars['REACT_APP_CLOUDINARY_UPLOAD_PRESET'];
  
  if (existingCloudName && existingUploadPreset) {
    console.log(colorize('\n⚠️  Cloudinary is already configured:', 'yellow'));
    console.log(colorize(`   Cloud Name: ${existingCloudName}`, 'cyan'));
    console.log(colorize(`   Upload Preset: ${existingUploadPreset}`, 'cyan'));
    
    const update = await askQuestion(colorize('\nDo you want to update the configuration? (y/N): ', 'yellow'));
    
    if (update.toLowerCase() !== 'y' && update.toLowerCase() !== 'yes') {
      console.log(colorize('\n✅ Keeping existing configuration', 'green'));
      rl.close();
      return;
    }
  }
  
  console.log(colorize('\n📋 Please provide your Cloudinary configuration:\n', 'bright'));
  
  // Get Cloud Name
  let cloudName;
  do {
    cloudName = await askQuestion(colorize('1. Enter your Cloudinary Cloud Name: ', 'cyan'));
    
    if (!validateCloudName(cloudName)) {
      console.log(colorize('❌ Invalid cloud name format. Please use only lowercase letters, numbers, and hyphens.', 'red'));
    }
  } while (!validateCloudName(cloudName));
  
  // Get Upload Preset
  let uploadPreset;
  do {
    uploadPreset = await askQuestion(colorize('2. Enter your Upload Preset name: ', 'cyan'));
    
    if (!validateUploadPreset(uploadPreset)) {
      console.log(colorize('❌ Invalid upload preset format. Please use only lowercase letters, numbers, and underscores.', 'red'));
    }
  } while (!validateUploadPreset(uploadPreset));
  
  // Confirm configuration
  console.log(colorize('\n📝 Configuration Summary:', 'bright'));
  console.log(colorize(`   Cloud Name: ${cloudName}`, 'cyan'));
  console.log(colorize(`   Upload Preset: ${uploadPreset}`, 'cyan'));
  
  const confirm = await askQuestion(colorize('\nIs this correct? (Y/n): ', 'yellow'));
  
  if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
    console.log(colorize('\n❌ Setup cancelled', 'red'));
    rl.close();
    return;
  }
  
  // Update environment variables
  envVars['REACT_APP_CLOUDINARY_CLOUD_NAME'] = cloudName;
  envVars['REACT_APP_CLOUDINARY_UPLOAD_PRESET'] = uploadPreset;
  
  // Convert back to .env format
  const newContent = envVarsToString(envVars);
  
  // Write to .env file
  try {
    writeEnvFile(newContent);
    console.log(colorize('\n✅ .env file updated successfully!', 'green'));
  } catch (error) {
    console.log(colorize('\n❌ Error writing .env file:', 'red'), error.message);
    rl.close();
    return;
  }
  
  // Show next steps
  console.log(colorize('\n🎉 Cloudinary configuration complete!', 'bright'));
  console.log(colorize('\n📋 Next steps:', 'cyan'));
  console.log(colorize('   1. Restart your development server (Ctrl+C, then npm start)', 'yellow'));
  console.log(colorize('   2. Go to your admin panel: http://localhost:3000/admin', 'yellow'));
  console.log(colorize('   3. Navigate to Media Management → Media Manager', 'yellow'));
  console.log(colorize('   4. Try uploading a test image', 'yellow'));
  
  console.log(colorize('\n🔗 Useful links:', 'cyan'));
  console.log(colorize('   • Cloudinary Dashboard: https://cloudinary.com/console', 'blue'));
  console.log(colorize('   • Upload Presets: https://cloudinary.com/console/settings/upload', 'blue'));
  console.log(colorize('   • Documentation: https://cloudinary.com/documentation', 'blue'));
  
  console.log(colorize('\n💡 Tips:', 'magenta'));
  console.log(colorize('   • Make sure your upload preset is set to "Unsigned"', 'yellow'));
  console.log(colorize('   • The free tier includes 25GB storage and 25GB bandwidth/month', 'yellow'));
  console.log(colorize('   • Never commit your .env file to version control', 'yellow'));
  
  rl.close();
}

// Error handling
process.on('uncaughtException', (error) => {
  console.log(colorize('\n❌ An error occurred:', 'red'), error.message);
  rl.close();
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.log(colorize('\n❌ An error occurred:', 'red'), error.message);
  rl.close();
  process.exit(1);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(colorize('\n\n👋 Setup cancelled. Goodbye!', 'yellow'));
  rl.close();
  process.exit(0);
});

// Run the setup
setupCloudinary().catch((error) => {
  console.log(colorize('\n❌ Setup failed:', 'red'), error.message);
  rl.close();
  process.exit(1);
}); 