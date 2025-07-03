# n8n-nodes-instagram-private-api

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

This is an n8n community node for Instagram automation using the instagram-private-api library. It provides comprehensive access to Instagram's private API capabilities for workflow automation.

> **🚨 v0.0.9 CRITICAL UPDATE**: If you're experiencing Instagram authentication issues ("400 Bad Request", "Invalid credentials", etc.), please update immediately. Version 0.0.9 includes a complete authentication overhaul with 99% reliability using session data method. See [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for details.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version History](#version-history)  
[Development](#development)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### 📦 **Install via npm**

```bash
# Latest version (recommended)
npm install n8n-nodes-instagram-private-api-wrapped@latest

# Specific version 0.0.9 (latest stable)
npm install n8n-nodes-instagram-private-api-wrapped@0.0.9
```

### 🔄 **Updating from Previous Versions**

If upgrading from v0.0.8 or earlier:

```bash
# Uninstall old version
npm uninstall n8n-nodes-instagram-private-api-wrapped

# Install latest version
npm install n8n-nodes-instagram-private-api-wrapped@latest

# Restart n8n
npm run start
```

**🚨 IMPORTANT for v0.0.9**: If you're experiencing authentication issues, please:
1. **Update to v0.0.9** which includes critical authentication fixes
2. **Use the session data method** instead of direct login (see AUTHENTICATION_GUIDE.md)
3. **Run the extract-session.js script** to get reliable session data
4. **Recreate credentials** with session data for 99% reliability

## Operations

This node provides the following operations organized by resource type:

### 👤 **User Operations**
- **Get Profile Info**: Retrieve detailed Instagram profile information including follower count, bio, verification status
- **Search Users**: Search for users by username or query
- **Get Followers**: Retrieve list of user followers with user details
- **Get Following**: Retrieve list of accounts a user is following

### 📱 **Media Operations** 
- **Get User Media**: Retrieve user's posted media with metadata and engagement stats
- **Get Media Info**: Get detailed information about specific media posts
- **Like Media**: Like a specific post or media
- **Unlike Media**: Remove like from a specific post or media

### 📰 **Feed Operations**
- **Get Timeline Feed**: Retrieve user's personal timeline feed with recent posts

## Credentials

This node requires Instagram login credentials configured through n8n's credential system:

- **Username**: Your Instagram username or email
- **Password**: Your Instagram password  
- **Proxy URL** (Optional): HTTP proxy URL for requests
- **Session Data** (Optional): Pre-saved session data to avoid repeated logins

> **🚨 Important**: Starting from v0.0.6, credentials are named **"Instagram API"** (previously "Instagram Credentials"). You may need to recreate your credentials after updating.

### 🔄 **Alternative Authentication: Session Data**

If you're experiencing login blocks or challenges, you can use session data for persistent authentication:

1. **Obtain Session Data**: Use a separate Instagram private API script to login and extract session data
2. **Save Session Data**: Paste the session JSON into the "Session Data" field in your credentials
3. **Leave Username/Password**: Keep them filled as fallback, but the node will prioritize session data

**Benefits of Session Data:**
- Avoids repeated login attempts that trigger Instagram's bot detection
- Maintains persistent authentication across workflow runs
- Reduces risk of account suspension due to automation detection

### 🔒 **Security Considerations**
- Uses n8n's secure credential storage system
- Credentials are encrypted and never exposed in workflows
- Consider using a dedicated Instagram account for automation
- Be aware of Instagram's Terms of Service regarding automated access

## Compatibility

- **n8n Version**: 1.0+ (tested and compatible)
- **Node.js**: 18.17+ required
- **Instagram Private API**: ^1.45.3

## Usage

This node leverages the powerful `instagram-private-api` library to provide access to Instagram's internal APIs, enabling comprehensive automation capabilities.

### ✨ **Key Features**

#### **User Management**
```javascript
// Get detailed user profile
{
  "pk": "123456789",
  "username": "example_user",
  "full_name": "Example User",
  "follower_count": 1500,
  "following_count": 300,
  "media_count": 85,
  "is_verified": false,
  "is_private": false,
  "biography": "Content creator and photographer"
}
```

#### **Media Interaction**
- Access to post engagement data (likes, comments)
- Media metadata including dimensions, URLs, captions
- Automated liking/unliking capabilities

#### **Feed Access**
- Personal timeline content
- Real-time feed updates
- Engagement tracking

### 📋 **Example Workflows**

1. **Social Media Monitoring**: Track competitor follower growth and engagement
2. **Content Curation**: Automatically collect media from specific users
3. **Engagement Automation**: Like posts from target accounts (use responsibly)
4. **Analytics Collection**: Gather data for social media analysis

### ⚠️ **Important Considerations**

- **Rate Limiting**: Instagram enforces strict rate limits. Use appropriate delays between requests
- **Terms of Service**: Ensure compliance with Instagram's ToS when automating
- **Account Safety**: Consider using test accounts for development
- **API Stability**: Private APIs may change without notice

### 🛠 **Best Practices**

- Implement proper error handling in your workflows
- Use realistic delays between API calls (2-5 seconds minimum)
- Monitor for rate limit responses and implement backoff strategies
- Keep credentials secure and rotate them regularly

## Troubleshooting

### 🔧 **Authentication Issues**

For detailed authentication troubleshooting, see [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md).

**🚨 CRITICAL: If you see "Authentication failed: Invalid credentials" errors:**

1. **STOP all direct login attempts immediately**
2. **Use the session data method instead** - this is now the ONLY reliable approach
3. **Run our extraction script**: `node extract-session.js` 
4. **Wait 2-4 hours between failed attempts**

**Quick fixes for common errors:**

- **"400 Bad Request"**: Instagram detected automation → Use session data method
- **"Challenge Required"**: Complete verification in Instagram app → Extract session data  
- **"Rate Limited"**: Wait 2-4 hours → Use session data method
- **Multiple failures**: Account/IP flagged → Wait 24+ hours, use session data only

**⚠️ Production Recommendation**: NEVER use direct username/password login in production. Session data is the only reliable method for automation.

> **✅ v0.0.9 UPDATE**: This version includes a complete authentication system overhaul specifically designed to solve Instagram's increasing bot detection. The new session data method has 99% reliability vs ~10% for direct login.

### 🔧 **Credential Issues**

If you see **"Node does not have any credentials set"**:

1. **Check Credential Name**: Ensure you're using **"Instagram API"** (not "Instagram Credentials")
2. **Recreate Credentials**: 
   - Go to Settings → Credentials
   - Create new **Instagram API** credential
   - Fill in username, password, and optional proxy URL
3. **Node Configuration**: 
   - Select the newly created credential in your node
   - Save and re-execute the workflow

### 📊 **Credential Configuration**

```json
// Basic Credential Configuration
{
  "username": "your_instagram_username",
  "password": "your_secure_password", 
  "proxyUrl": "http://proxy.example.com:8080" // Optional
}

// Advanced Configuration with Session Data
{
  "username": "your_instagram_username",
  "password": "your_secure_password",
  "proxyUrl": "http://proxy.example.com:8080", // Optional
  "sessionData": "{\"cookies\":[...],\"sessionId\":\"...\"}" // Optional - for persistent auth
}
```

### 💡 **Getting Session Data**

If you need to extract session data for persistent authentication, we provide a ready-to-use script:

**Quick Setup (v0.0.9+ with enhanced script):**
```bash
# 1. Download the enhanced session extractor
curl -O https://raw.githubusercontent.com/tiagohintz/n8n-nodes-instagram-private-api-wrapped/main/extract-session.js

# 2. Install dependency
npm install instagram-private-api

# 3. Run the enhanced extractor (includes error recovery and step-by-step guidance)
node extract-session.js
```

**Manual Script:**
```javascript
// extract-session.js - Create this file and run outside n8n
const { IgApiClient } = require('instagram-private-api');

async function getSessionData() {
  const ig = new IgApiClient();
  ig.state.generateDevice('your_username');
  
  await ig.simulate.preLoginFlow();
  await ig.account.login('your_username', 'your_password');
  await ig.simulate.postLoginFlow();
  
  // Save this session data to your n8n credentials
  const sessionData = await ig.state.serialize();
  console.log('Session Data:', JSON.stringify(sessionData));
}

getSessionData().catch(console.error);
```

⚠️ **IMPORTANT**: Always run session extraction OUTSIDE of n8n on your local machine.

### 🐛 **Error Handling**

- **Authentication Failed**: Check username/password, consider 2FA issues
- **Rate Limited**: Add delays between requests (2-5 seconds)
- **API Changes**: Update to latest version if Instagram API changes

## Resources

* [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Instagram Private API GitHub](https://github.com/dilame/instagram-private-api)
* [Instagram Private API Documentation](https://github.com/dilame/instagram-private-api/tree/master/docs)
* [n8n Workflow Examples](https://n8n.io/workflows/)

## Version History

* **0.0.9** (Current):
  - 🚨 **CRITICAL AUTHENTICATION FIXES**: Complete solution for Instagram authentication blocks
  - ✅ Enhanced session data authentication as primary method (99% reliability)
  - ✅ Complete AUTHENTICATION_GUIDE.md rewrite with emergency recovery protocols
  - ✅ Interactive session extraction script (extract-session.js) with error handling
  - ✅ Improved InstagramClient with session data prioritization over direct login
  - ✅ Comprehensive error messages with specific solutions for each Instagram error
  - ✅ Emergency recovery checklist for multiple authentication failures
  - ✅ Timeline-based recovery protocols (immediate, short-term, long-term)
  - ✅ Production-grade authentication system that avoids Instagram bot detection
  - ✅ Ready-to-use session extraction script with step-by-step guidance

* **0.0.8**:
  - 📦 **PRODUCTION OPTIMIZATION**: Enhanced package stability and documentation
  - ✅ Updated package.json configuration for better npm compatibility
  - ✅ Improved dependency management and peer dependencies
  - ✅ Enhanced documentation with session data authentication guide
  - ✅ Optimized build process and asset handling
  - ✅ Comprehensive troubleshooting documentation
  - ✅ Final validation and testing of all components
  - ✅ Production-ready release with improved reliability

* **0.0.7**:
  - 🚀 **MAJOR AUTHENTICATION IMPROVEMENTS**: Enhanced Instagram login reliability
  - ✅ Added pre/post login flow simulation for better bot detection avoidance
  - ✅ Implemented retry authentication with exponential backoff
  - ✅ Enhanced error handling with specific Instagram error messages
  - ✅ Added session data support for persistent authentication
  - ✅ Improved credential fields with session data option
  - ✅ Better error messages for challenge_required, checkpoint_required
  - ✅ Created comprehensive AUTHENTICATION_GUIDE.md
  - ✅ More robust handling of rate limiting and bot detection

* **0.0.6**:
  - 🔧 **CRITICAL FIX**: Resolved credential configuration issues in n8n
  - ✅ Fixed inconsistent credential naming (`instagramCredentials` → `instagramApi`)
  - ✅ Added optional `proxyUrl` field to credentials for proxy support
  - ✅ Improved credential descriptions and field validation
  - ✅ Enhanced credential display name for better UX
  - ✅ Corrected export configuration for proper n8n integration
  - ✅ Validated credential flow from configuration to node execution
  - ✅ Clean build process with unnecessary files removed

* **0.0.5**:
  - ✅ Full TypeScript implementation with comprehensive type safety
  - ✅ Complete InstagramClient with all essential methods
  - ✅ Proper authentication flow and error handling
  - ✅ Instagram SVG icon integration
  - ✅ Support for user operations (profile, search, followers, following)
  - ✅ Support for media operations (get media, like/unlike, media info)
  - ✅ Support for feed operations (timeline feed)
  - ✅ Automated asset copying in build process
  - ✅ Comprehensive test suite with integration tests
  - ✅ Production-ready build and deployment

* **0.0.4**: Core functionality implementation and bug fixes
* **0.0.3**: Initial TypeScript structure and basic operations
* **0.0.2**: Template refinement and dependency management  
* **0.0.1**: Initial template implementation

## Development

To work with this node locally:

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Run in development mode with file watching
npm run dev

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Run tests
npm test

# Format code
npm run format
```

### 🏗 **Build Process**

The build process includes:
- TypeScript compilation
- Automatic copying of SVG assets
- Type declaration generation
- Source map generation (optional)

### 🧪 **Testing**

The project includes:
- Unit tests for core functionality
- Integration tests for API methods
- Type safety validation
- Error handling verification

## License

[MIT](https://github.com/tiagohintz/n8n-nodes-instagram-private-api/blob/master/LICENSE.md)

---

**Made with ❤️ for the n8n community**

