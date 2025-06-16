# n8n Instagram Private API Integration

[![npm version](https://img.shields.io/npm/v/n8n-nodes-instagram-private-api-wrapped.svg)](https://www.npmjs.com/package/n8n-nodes-instagram-private-api-wrapped)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A comprehensive n8n node package that provides seamless Instagram integration using the `instagram-private-api` library. Automate your Instagram workflows with powerful operations like posting images, managing followers, and interacting with content.

## ⚠️ Important Legal Notice

**This library uses the unofficial Instagram Private API which may violate Instagram's Terms of Service. Use at your own risk.**

- Your Instagram account may be suspended or banned
- Instagram actively works to block unofficial API access
- We recommend using Instagram's official APIs when possible:
  - [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
  - [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)

## Features

### Supported Operations

- 📸 **Post Image** - Upload images with captions
- 👥 **Get Followers** - Retrieve follower lists
- 👤 **Get Following** - Retrieve following lists
- ❤️ **Like Post** - Like Instagram posts
- 💬 **Comment Post** - Comment on Instagram posts
- 🔍 **Get User Info** - Retrieve user profile information
- 🏷️ **Get Posts by Hashtag** - Search posts by hashtags

### Key Features

- ✅ Full TypeScript support with comprehensive types
- 🔄 Automatic retry logic with exponential backoff
- 🛡️ Input validation and sanitization
- ⚡ Session caching for improved performance
- 🎯 Rate limiting protection
- 📊 Comprehensive error handling
- 🧪 90%+ test coverage

## Installation

### Option 1: Via npm (Recommended)

```bash
npm install n8n-nodes-instagram-private-api-wrapped
```

### Option 2: Via yarn

```bash
yarn add n8n-nodes-instagram-private-api-wrapped
```

### Option 3: Manual Installation

```bash
# In your n8n custom nodes directory
npm install n8n-nodes-instagram-private-api-wrapped
```

## Setup in n8n

### 1. Install the Package

If you're running n8n locally, install the package in your n8n installation:

```bash
cd ~/.n8n
npm install n8n-nodes-instagram-private-api-wrapped
```

### 2. Restart n8n

Restart your n8n instance to load the new nodes:

```bash
n8n start
```

### 3. Configure Credentials

1. Go to n8n's **Credentials** section
2. Click **Create New Credential**
3. Select **Instagram API**
4. Enter your Instagram username and password
5. Test and save the credentials

## Usage Examples

### Basic Image Posting Workflow

```json
{
  "nodes": [
    {
      "parameters": {
        "operation": "postImage",
        "imageBuffer": "={{$binary.data}}",
        "caption": "Check out this amazing photo! #n8n #automation"
      },
      "type": "n8n-nodes-instagram-private-api-wrapped",
      "typeVersion": 1,
      "position": [
        460,
        240
      ],
      "id": "12345678-1234-1234-1234-123456789012",
      "name": "Instagram Post",
      "credentials": {
        "instagramApi": "my-instagram-account"
      }
    }
  ]
}
```

### Follower Analysis Workflow

```json
{
  "nodes": [
    {
      "parameters": {
        "operation": "getFollowers",
        "userId": "123456789",
        "limit": 50
      },
      "type": "n8n-nodes-instagram-private-api-wrapped",
      "typeVersion": 1,
      "position": [
        460,
        240
      ],
      "id": "87654321-4321-4321-4321-210987654321",
      "name": "Get Instagram Followers"
    }
  ]
}
```

### Hashtag Content Curation

```json
{
  "nodes": [
    {
      "parameters": {
        "operation": "getPostsByHashtag",
        "hashtag": "photography",
        "limit": 20
      },
      "type": "n8n-nodes-instagram-private-api-wrapped",
      "typeVersion": 1,
      "position": [
        460,
        240
      ],
      "id": "11111111-2222-3333-4444-555555555555",
      "name": "Search Instagram Posts"
    }
  ]
}
```

## API Reference

### Operations

#### Post Image

Upload an image to Instagram with an optional caption.

**Parameters:**
- `imageBuffer` (required): Image data as Buffer or base64 string
- `caption` (optional): Text caption for the post

**Returns:**
```typescript
{
  media_id: string;
  code: string;
  caption: string;
  like_count: number;
  comment_count: number;
}
```

#### Get Followers

Retrieve the list of followers for a user.

**Parameters:**
- `userId` (optional): Target user ID (defaults to authenticated user)

**Returns:**
```typescript
{
  followers: Array<{
    pk: string;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    is_verified: boolean;
  }>;
  count: number;
}
```

#### Get User Info

Get detailed information about a specific user.

**Parameters:**
- `username` (required): Instagram username to lookup

**Returns:**
```typescript
{
  pk: string;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
  follower_count: number;
  following_count: number;
  media_count: number;
  biography: string;
  is_verified: boolean;
}
```

#### Like Post

Like an Instagram post.

**Parameters:**
- `mediaId` (required): The ID of the media to like

#### Comment Post

Add a comment to an Instagram post.

**Parameters:**
- `mediaId` (required): The ID of the media to comment on
- `comment` (required): The comment text

#### Get Posts by Hashtag

Search for posts using a specific hashtag.

**Parameters:**
- `hashtag` (required): Hashtag to search (without #)
- `limit` (optional): Number of posts to return (1-50, default: 10)

## Error Handling

The library includes comprehensive error handling:

```javascript
// All operations return a consistent response format
{
  success: boolean;
  data?: any;        // Present when success is true
  error?: string;    // Present when success is false
}
```

### Common Error Types

- **Authentication Errors**: Invalid credentials or expired session
- **Rate Limiting**: Too many requests in a short period
- **Validation Errors**: Invalid input parameters
- **Network Errors**: Connection issues with Instagram
- **Account Restrictions**: Account suspended or limited

## Rate Limiting

To avoid Instagram's rate limits, the library implements:

- Random delays between requests (1-3 seconds)
- Exponential backoff on failures
- Session caching to reduce login requests
- Longer delays after posting operations (5-10 seconds)

## Development

### Building the Project

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Watch mode for development
npm run dev
```

### Testing

The project includes comprehensive tests with 90%+ coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Maintain 90%+ test coverage
- Follow TypeScript best practices
- Add JSDoc comments for public APIs
- Update documentation for new features
- Ensure all tests pass before submitting PR

## Troubleshooting

### Common Issues

#### "Login failed" Error
- Verify your Instagram credentials are correct
- Check if your account has two-factor authentication enabled
- Ensure your account isn't restricted or suspended

#### "Rate limit exceeded" Error
- Reduce the frequency of your requests
- Implement additional delays between operations
- Consider using Instagram's official APIs for high-volume use cases

#### "Invalid image format" Error
- Ensure images are in JPEG or PNG format
- Check that the image buffer is not corrupted
- Verify the image meets Instagram's size requirements

#### Node not appearing in n8n
- Restart your n8n instance after installation
- Check that the package is installed in the correct directory
- Verify the package.json n8n configuration is correct

### Debug Mode

To enable debug logging, set the DEBUG environment variable:

```bash
DEBUG=n8n-nodes-instagram-private-api-wrapped n8n start
```

## Alternatives

For production use, consider these official alternatives:

### Instagram Basic Display API
- **Pros**: Official, stable, compliant with ToS
- **Cons**: Limited functionality, requires app approval
- **Use case**: Read-only access to user media

### Instagram Graph API
- **Pros**: Full business features, official support
- **Cons**: Requires business account, complex setup
- **Use case**: Business automation, content management

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This software is provided "as is" without warranty of any kind. The authors are not responsible for any damages or account restrictions that may result from using this library. Use of Instagram's private API may violate their Terms of Service.

## Support

- 📖 [Documentation](https://github.com/tiagohintz/n8n-nodes-instagram-private-api-wrapped)
- 🐛 [Issue Tracker](https://github.com/tiagohintz/n8n-nodes-instagram-private-api-wrapped/issues)
- 💬 [Discussions](https://github.com/tiagohintz/n8n-nodes-instagram-private-api-wrapped/discussions)

---

**Made with ❤️ for the n8n community**