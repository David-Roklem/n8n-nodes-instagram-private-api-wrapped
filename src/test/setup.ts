// Test setup file
global.console = {
  ...global.console,
  // Uncomment to ignore console outputs
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock Instagram API client
jest.mock('instagram-private-api', () => ({
  IgApiClient: jest.fn().mockImplementation(() => ({
    state: {
      generateDevice: jest.fn(),
      serialize: jest.fn().mockResolvedValue('mock-session'),
      deserialize: jest.fn().mockResolvedValue(undefined),
    },
    account: {
      login: jest.fn().mockImplementation((username: string, password: string) => {
        if (username === 'invalid' && password === 'invalid') {
          throw new Error('Invalid credentials');
        }
        return Promise.resolve();
      }),
      logout: jest.fn().mockResolvedValue(undefined),
      currentUser: jest.fn().mockResolvedValue({
        pk: '123456789',
        username: 'testuser',
      }),
    },
    publish: {
      photo: jest.fn().mockResolvedValue({
        media: {
          pk: '12345678901234567',
          code: 'ABC123',
        },
      }),
    },
    media: {
      like: jest.fn().mockResolvedValue({
        status: 'ok',
      }),
      comment: jest.fn().mockResolvedValue({
        comment: {
          pk: '98765432109876543',
          user: {
            pk: '123456789',
            username: 'testuser',
          },
        },
      }),
    },
    user: {
      searchExact: jest.fn().mockImplementation((username: string) => {
        if (username === 'nonexistentuser12345') {
          throw new Error('User not found');
        }
        return Promise.resolve({
          pk: '987654321',
          username: 'targetuser',
          full_name: 'Target User',
          profile_pic_url: 'https://example.com/pic.jpg',
          is_verified: false,
          follower_count: 1000,
          biography: 'Test bio',
          media_count: 100,
        });
      }),
    },
    feed: {
      accountFollowers: jest.fn().mockReturnValue({
        items: jest.fn().mockResolvedValue([
          {
            pk: '123456789',
            username: 'follower1',
            full_name: 'Follower User',
            profile_pic_url: 'https://example.com/pic.jpg',
            is_verified: false,
          },
        ]),
      }),
      accountFollowing: jest.fn().mockReturnValue({
        items: jest.fn().mockResolvedValue([
          {
            pk: '987654321',
            username: 'following1',
            full_name: 'Following User',
            profile_pic_url: 'https://example.com/pic.jpg',
            is_verified: false,
          },
        ]),
      }),
      tags: jest.fn().mockReturnValue({
        items: jest.fn().mockResolvedValue([
          {
            pk: '12345678901234567',
            code: 'ABC123',
            taken_at: 1234567890,
            media_type: 1,
            image_versions2: {},
            caption: { text: 'Test caption' },
            like_count: 10,
            comment_count: 5,
            user: {
              pk: '123456789',
              username: 'testuser',
              full_name: 'Test User',
            },
          },
        ]),
      }),
    },
  })),
}));

export {};