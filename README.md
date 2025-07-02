# n8n-nodes-instagram-private-api

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

This is an n8n community node for Instagram automation using the instagram-private-api library. It provides comprehensive access to Instagram's private API capabilities for workflow automation.

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

You can install this node package using:

```bash
npm install n8n-nodes-instagram-private-api-wrapped
```

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

## Resources

* [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Instagram Private API GitHub](https://github.com/dilame/instagram-private-api)
* [Instagram Private API Documentation](https://github.com/dilame/instagram-private-api/tree/master/docs)
* [n8n Workflow Examples](https://n8n.io/workflows/)

## Version History

* **0.0.5** (Current):
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

