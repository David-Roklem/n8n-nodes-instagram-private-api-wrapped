#!/bin/bash

# Instagram Session Extractor for n8n
# This script helps extract session data from Instagram for use with n8n-nodes-instagram-private-api
# Version: 0.0.10

echo "🔐 Instagram Session Extractor for n8n v0.0.10"
echo "=============================================="
echo ""
echo "⚠️  IMPORTANT WARNINGS:"
echo "- This script should be run OUTSIDE of n8n"
echo "- Use a dedicated Instagram account for automation"
echo "- Ensure you have completed any verification in Instagram app first"
echo "- Session data is sensitive - keep it secure"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org and try again"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install npm and try again"
    exit 1
fi

# Create temp directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo "📦 Installing instagram-private-api..."
npm install instagram-private-api --silent

if [ $? -ne 0 ]; then
    echo "❌ Failed to install instagram-private-api"
    echo "Please check your internet connection and npm configuration"
    exit 1
fi

# Get credentials
echo ""
echo "📧 Please enter your Instagram credentials:"
read -p "Username or email: " USERNAME
read -s -p "Password: " PASSWORD
echo ""

# Create extraction script
cat > extract.js << 'EOF'
const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');

async function extractSession() {
  const username = process.argv[2];
  const password = process.argv[3];
  
  console.log('\n🚀 Starting session extraction...');
  console.log('⚠️  This may take 30-60 seconds...\n');
  
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    
    // Simulate human behavior
    console.log('🤖 Simulating human behavior...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📱 Simulating pre-login flow...');
    await ig.simulate.preLoginFlow();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Attempt login
    console.log('🔐 Attempting login...');
    await ig.account.login(username, password);
    
    console.log('✅ Login successful!');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('📱 Simulating post-login flow...');
    await ig.simulate.postLoginFlow();
    
    console.log('💾 Extracting session data...');
    
    // Get session data
    const sessionData = await ig.state.serialize();
    
    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `instagram-session-${username}-${timestamp}.json`;
    fs.writeFileSync(filename, JSON.stringify(sessionData, null, 2));
    
    console.log(`\n🎉 SUCCESS! Session extracted and saved to: ${filename}`);
    console.log('\n📋 SESSION DATA FOR N8N CREDENTIALS:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(sessionData));
    console.log('='.repeat(80));
    
    console.log('\n✅ NEXT STEPS:');
    console.log('1. Copy the session data above (the JSON between the lines)');
    console.log('2. Go to your n8n Instagram API credentials');
    console.log('3. Paste the session data into the "Session Data" field');
    console.log('4. Add proxy URL if needed');
    console.log('5. Save the credentials and test your workflow');
    
    console.log('\n⚠️  SECURITY NOTES:');
    console.log('- Keep this session data secure (treat like a password)');
    console.log('- Session data expires after ~90 days of inactivity');
    console.log('- Re-run this script if authentication fails in the future');
    console.log('- Delete the session file from disk after copying to n8n');
    
    console.log(`\n🗑️  To delete the session file:`);
    console.log(`rm "${filename}"`);
    
  } catch (error) {
    console.log('\n❌ Session extraction failed!');
    console.log('Error:', error.message);
    
    if (error.message.includes('challenge_required')) {
      console.log('\n🔧 SOLUTION FOR challenge_required:');
      console.log('1. 📱 Open Instagram mobile app');
      console.log('2. 🔐 Login manually with your credentials');
      console.log('3. ✅ Complete any verification challenges (SMS, email, etc.)');
      console.log('4. ⏰ Wait 30 minutes');
      console.log('5. 🔄 Run this script again');
    }
    
    if (error.message.includes('checkpoint_required')) {
      console.log('\n🔧 SOLUTION FOR checkpoint_required:');
      console.log('1. 📱 Instagram requires account verification');
      console.log('2. 🔍 Check Instagram app for security prompts');
      console.log('3. ✅ Complete the full verification process');
      console.log('4. ⏰ Wait 24-48 hours before retrying');
      console.log('5. 🏠 Consider using a different IP address/location');
    }
    
    if (error.message.includes('400') || error.message.includes('Bad Request')) {
      console.log('\n🔧 SOLUTION FOR 400 Bad Request:');
      console.log('1. 🛑 Instagram detected automation attempts');
      console.log('2. ⏰ Wait 2-4 hours before retrying');
      console.log('3. 🌐 Use a different IP address/VPN if possible');
      console.log('4. 📱 Login manually via Instagram app first');
      console.log('5. 👤 Ensure account has normal human activity');
      console.log('6. 🔄 Try again from a residential IP (not datacenter)');
    }
    
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      console.log('\n🔧 SOLUTION FOR rate limiting:');
      console.log('1. ⏰ Wait at least 2-4 hours');
      console.log('2. 🌐 Change your IP address');
      console.log('3. 📱 Login via Instagram app manually first');
      console.log('4. 🔄 Retry with longer delays');
    }
    
    console.log('\n💡 GENERAL TIPS:');
    console.log('- Use a dedicated Instagram account for automation');
    console.log('- Ensure account has posts, followers, and normal activity');
    console.log('- Run this script from a residential IP (home internet)');
    console.log('- Avoid running from cloud servers (AWS, Google Cloud, etc.)');
    console.log('- Complete Instagram app verification before automation');
    
    process.exit(1);
  }
}

extractSession().catch(console.error);
EOF

echo ""
echo "🚀 Extracting session data..."
node extract.js "$USERNAME" "$PASSWORD"

# Cleanup
cd - > /dev/null
rm -rf "$TEMP_DIR"

echo ""
echo "🎯 Session extraction completed!"
echo "Remember to keep your session data secure and delete any saved files after copying to n8n."
