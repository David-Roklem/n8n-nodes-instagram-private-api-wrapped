#!/usr/bin/env node

/**
 * Instagram Session Extractor for n8n
 * 
 * This script helps extract session data from Instagram for use with n8n-nodes-instagram-private-api
 * 
 * Usage:
 *   1. npm install instagram-private-api
 *   2. node extract-session.js
 *   3. Follow prompts to enter credentials
 *   4. Copy the session data to your n8n credentials
 */

const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function extractSession() {
  console.log('🔐 Instagram Session Extractor for n8n');
  console.log('=====================================\n');
  
  console.log('⚠️  IMPORTANT WARNINGS:');
  console.log('- This script should be run OUTSIDE of n8n');
  console.log('- Use a dedicated Instagram account for automation');
  console.log('- Ensure you have completed any verification in Instagram app first');
  console.log('- Session data is sensitive - keep it secure');
  console.log('');
  
  try {
    const username = await askQuestion('📧 Enter Instagram username/email: ');
    const password = await askQuestion('🔑 Enter Instagram password: ');
    
    console.log('\n🚀 Starting session extraction...');
    console.log('⚠️  This may take 30-60 seconds...\n');
    
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
    console.log('\n📋 Copy this session data to your n8n credentials "sessionData" field:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(sessionData));
    console.log('='.repeat(80));
    
    console.log('\n✅ Next steps for n8n:');
    console.log('1. Go to your n8n Instagram API credentials');
    console.log('2. Fill in username and password (as backup)');
    console.log('3. Paste the session data above into the "sessionData" field');
    console.log('4. Save the credentials');
    console.log('5. Test your workflow');
    
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
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
    
  } finally {
    rl.close();
  }
}

// Check if instagram-private-api is installed
try {
  require('instagram-private-api');
} catch (e) {
  console.log('❌ Error: instagram-private-api not found');
  console.log('\n📦 Please install it first:');
  console.log('npm install instagram-private-api');
  console.log('\nThen run this script again.');
  process.exit(1);
}

// Run the extractor
console.log('🚀 Starting Instagram Session Extractor...\n');
extractSession().catch(console.error);
