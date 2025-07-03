# Instagram Authentication Troubleshooting Guide

## Common Authentication Issues

### Error: "400 Bad Request" on Login

This error typically occurs when Instagram detects automated access or when there are authentication challenges.

### Solutions:

#### 1. **Use Official Instagram App First**
- Log into your Instagram account using the official mobile app
- Complete any security challenges (verification codes, etc.)
- Ensure your account is in good standing

#### 2. **Account Prerequisites**
- Use a dedicated Instagram account for automation (not your personal account)
- Ensure the account doesn't have 2FA enabled initially
- Account should have some activity (posts, followers) to appear legitimate

#### 3. **Credential Configuration**
```json
{
  "username": "your_username_or_email",
  "password": "your_password",
  "proxyUrl": "", // Optional
  "sessionData": "" // Leave empty initially
}
```

#### 4. **Session Management (Advanced)**
If you continue to have login issues, you can save session data:

1. Use a tool like browser developer tools or Postman to log into Instagram
2. Extract the session cookies/data
3. Use the `sessionData` field in credentials to provide saved session
4. This avoids repeated login attempts

### Best Practices:

1. **Wait Between Attempts**: Don't retry immediately after failure
2. **Use Proxy**: If available, use a residential proxy
3. **Simulate Human Behavior**: The library includes simulation flows
4. **Monitor Rate Limits**: Instagram heavily rate limits API calls

### Error Messages and Solutions:

- **"challenge_required"**: Complete verification in official app
- **"checkpoint_required"**: Account needs verification
- **"Please wait"**: Rate limited, wait before retrying
- **"400 Bad Request"**: Invalid credentials or bot detection

### Alternative Solutions:

1. **Official Instagram Basic Display API**: For basic read operations
2. **Instagram Graph API**: For business accounts
3. **Manual Session Export**: Export session from browser and use sessionData field

## Important Notes:

- Instagram's private API is not officially supported
- Terms of Service violations are possible
- Use at your own risk and responsibility
- Consider official APIs for production use
