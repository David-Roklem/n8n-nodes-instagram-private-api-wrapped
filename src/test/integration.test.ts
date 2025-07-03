import { InstagramClient } from '../lib/client';
import { IInstagramCredentials } from '../lib/types';

describe('InstagramClient Integration', () => {
  let client: InstagramClient;
  const mockCredentials: IInstagramCredentials = {
    sessionData: '{"cookies":[],"sessionId":"test_session"}',
    proxyUrl: 'http://test-proxy.com:8080'
  };

  beforeEach(() => {
    client = new InstagramClient(mockCredentials);
  });

  describe('instantiation', () => {
    it('should create client instance with credentials', () => {
      expect(client).toBeInstanceOf(InstagramClient);
    });

    it('should create client instance without credentials', () => {
      const emptyClient = new InstagramClient();
      expect(emptyClient).toBeInstanceOf(InstagramClient);
    });
  });

  describe('authentication required methods', () => {
    it('should throw error when not authenticated', async () => {
      const unauthenticatedClient = new InstagramClient();
      await expect(unauthenticatedClient.getUserInfo('testuser')).rejects.toThrow('Client is not authenticated');
    });
  });

  // Mock tests that don't require actual Instagram connection
  describe('method existence', () => {
    it('should have all required methods', () => {
      expect(typeof client.authenticate).toBe('function');
      expect(typeof client.getUserInfo).toBe('function');
      expect(typeof client.searchUsers).toBe('function');
      expect(typeof client.getTimelineFeed).toBe('function');
      expect(typeof client.getMediaInfo).toBe('function');
      expect(typeof client.likeMedia).toBe('function');
      expect(typeof client.unlikeMedia).toBe('function');
      expect(typeof client.getFollowers).toBe('function');
      expect(typeof client.getFollowing).toBe('function');
      expect(typeof client.getUserMedia).toBe('function');
    });
  });
});
