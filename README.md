# n8n-nodes-instagram-private-api

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

This is an n8n community node for Instagram integration using the instagram-private-api library.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node provides the following operations:

**Profile**
- Get Profile Info: Retrieve Instagram profile information

**Media** 
- Get Media: Retrieve user media posts

**Followers**
- Get Followers: Retrieve list of followers

**Following**
- Get Following: Retrieve list of accounts being followed

**Posts**
- Create Post: Upload and publish posts to Instagram
- Get User Feed: Retrieve user's timeline feed

## Credentials

This node requires Instagram login credentials:

- **Username**: Your Instagram username
- **Password**: Your Instagram password

**Important Security Note**: This node uses the instagram-private-api library which requires your actual Instagram credentials. Make sure to:
- Use n8n's credential system to store sensitive information securely
- Consider the risks of using your personal account
- Be aware of Instagram's terms of service

## Compatibility

This community node was developed and tested with n8n version 1.0+.

## Usage

This node uses the `instagram-private-api` library to interact with Instagram's private API endpoints. This allows for more comprehensive access to Instagram features compared to the official APIs, but comes with additional considerations:

### Features Available:
- Access to private account information
- Retrieve followers and following lists
- Upload photos and stories
- Access to direct messages
- Timeline and user feed access

### Important Considerations:
- **Terms of Service**: Using private APIs may violate Instagram's Terms of Service
- **Rate Limiting**: Instagram has strict rate limits - use delays between requests
- **Account Safety**: Consider using a dedicated account for automation
- **Stability**: Private APIs can change without notice

### Example Usage:

1. **Get Profile Info**: Retrieve detailed profile information including follower count, bio, etc.
2. **Get Media**: Fetch user's posted media with metadata
3. **Get Followers**: Access follower list with user details
4. **Create Posts**: Upload and publish photos with captions

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [instagram-private-api GitHub](https://github.com/dilame/instagram-private-api)
* [Instagram Private API Documentation](https://github.com/dilame/instagram-private-api/tree/master/docs)

## Version history

* **0.1.0**: Template implementation following n8n guidelines

## Development

To work with this template:

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Run linting
npm run lint

# Run tests
npm test

# Format code
npm run format
```

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)