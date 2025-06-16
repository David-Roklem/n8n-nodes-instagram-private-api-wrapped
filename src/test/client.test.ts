import { InstagramClient } from '../lib/client';

describe('InstagramClient', () => {
  let client: InstagramClient;

  beforeEach(() => {
    client = new InstagramClient();
  });

  afterEach(async () => {
    // Clean up any resources if needed
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      await expect(client.login('testuser', 'testpass')).resolves.not.toThrow();
    });

    it('should throw error with invalid credentials', async () => {
      const mockClient = new InstagramClient();
      await expect(mockClient.login('invalid', 'invalid')).rejects.toThrow('Instagram login failed');
    });
  });

  describe('postImage', () => {
    beforeEach(async () => {
      await client.login('testuser', 'testpass');
    });

    it('should post image successfully', async () => {
      const imageBuffer = Buffer.from('fake-image-data');
      const caption = 'Test caption';

      const result = await client.postImage(imageBuffer, caption);

      expect(result).toHaveProperty('media_id');
      expect(result).toHaveProperty('caption', caption);
    });

    it('should post image without caption', async () => {
      const imageBuffer = Buffer.from('fake-image-data');

      const result = await client.postImage(imageBuffer);

      expect(result).toHaveProperty('media_id');
      expect(result.caption).toBe('');
    });

    it('should throw error when not logged in', async () => {
      const unauthenticatedClient = new InstagramClient();
      const imageBuffer = Buffer.from('fake-image-data');
      const caption = 'Test caption';

      await expect(unauthenticatedClient.postImage(imageBuffer, caption)).rejects.toThrow('Not logged in');
    });
  });

  describe('getFollowers', () => {
    beforeEach(async () => {
      await client.login('testuser', 'testpass');
    });

    it('should get followers successfully', async () => {
      const userId = '123456789';
      const result = await client.getFollowers(userId);

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('username');
        expect(result[0]).toHaveProperty('id');
      }
    });

    it('should limit followers results', async () => {
      const userId = '123456789';
      const limit = 1;
      const result = await client.getFollowers(userId, limit);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(limit);
    });
  });

  describe('getFollowing', () => {
    beforeEach(async () => {
      await client.login('testuser', 'testpass');
    });

    it('should get following successfully', async () => {
      const userId = '123456789';
      const result = await client.getFollowing(userId);

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('username');
        expect(result[0]).toHaveProperty('id');
      }
    });
  });

  describe('likePost', () => {
    beforeEach(async () => {
      await client.login('testuser', 'testpass');
    });

    it('should like post successfully', async () => {
      const mediaId = '12345678901234567_123456789';
      const result = await client.likePost(mediaId);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('media_id', mediaId);
    });
  });

  describe('commentOnPost', () => {
    beforeEach(async () => {
      await client.login('testuser', 'testpass');
    });

    it('should comment on post successfully', async () => {
      const mediaId = '12345678901234567_123456789';
      const text = 'Great post!';

      const result = await client.commentOnPost(mediaId, text);

      expect(result).toHaveProperty('text', text);
      expect(result).toHaveProperty('comment_id');
    });

    it('should handle empty comment', async () => {
      const mediaId = '12345678901234567_123456789';
      const text = '';

      const result = await client.commentOnPost(mediaId, text);

      expect(result).toHaveProperty('text', text);
    });
  });

  describe('getUserInfo', () => {
    beforeEach(async () => {
      await client.login('testuser', 'testpass');
    });

    it('should get user info successfully', async () => {
      const username = 'testuser';
      const result = await client.getUserInfo(username);

      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('follower_count');
    });

    it('should handle invalid username', async () => {
      const username = 'nonexistentuser12345';
      
      await expect(client.getUserInfo(username)).rejects.toThrow();
    });
  });

  describe('getPostsByHashtag', () => {
    beforeEach(async () => {
      await client.login('testuser', 'testpass');
    });

    it('should get posts by hashtag successfully', async () => {
      const hashtag = 'nature';
      const result = await client.getPostsByHashtag(hashtag);

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('user');
      }
    });

    it('should handle hashtag with # prefix', async () => {
      const hashtag = '#testhashtag';
      const result = await client.getPostsByHashtag(hashtag);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should limit results', async () => {
      const hashtag = 'nature';
      const limit = 5;
      const result = await client.getPostsByHashtag(hashtag, limit);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(limit);
    });
  });
});