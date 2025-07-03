import { IgApiClient } from 'instagram-private-api';
import { 
  IInstagramCredentials, 
  IInstagramMediaItem, 
  IInstagramUser, 
  IInstagramTimelineFeed,
  IInstagramUserFeed,
  IInstagramMediaInfo,
  IInstagramComment,
  IInstagramDirectThread,
  IInstagramDirectMessage
} from './types';

export class InstagramClient {
  private client: IgApiClient;
  private isAuthenticated: boolean = false;

  constructor(credentials?: IInstagramCredentials) {
    this.client = new IgApiClient();
    if (credentials) {
      this.client.state.generateDevice(credentials.username);
      if (credentials.proxyUrl) {
        this.client.state.proxyUrl = credentials.proxyUrl;
      }
    }
  }

  async authenticate(credentials: IInstagramCredentials): Promise<void> {
    try {
      // Generate device and set up state
      this.client.state.generateDevice(credentials.username);
      
      // Configure proxy if provided
      if (credentials.proxyUrl) {
        this.client.state.proxyUrl = credentials.proxyUrl;
      }
      
      // Add more realistic delays and behavior
      console.log('Starting Instagram authentication...');
      
      // Pre-login flow simulation with delays
      console.log('Simulating pre-login flow...');
      await this.client.simulate.preLoginFlow();
      
      // Add delay before login attempt (simulate human reading time)
      await this.delay(2000 + Math.random() * 3000); // 2-5 seconds
      
      // Attempt login with more human-like behavior
      console.log('Attempting login...');
      const loginResult = await this.client.account.login(credentials.username, credentials.password);
      
      // Add delay after successful login
      await this.delay(1000 + Math.random() * 2000); // 1-3 seconds
      
      // Post-login flow simulation
      console.log('Simulating post-login flow...');
      await this.client.simulate.postLoginFlow();
      
      console.log('Authentication successful');
      this.isAuthenticated = true;
      
    } catch (error) {
      this.isAuthenticated = false;
      
      console.log('Authentication failed:', error);
      
      // Enhanced error handling
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        // Check for specific Instagram errors
        if (errorMessage.includes('challenge_required')) {
          throw new Error(`Authentication failed: Instagram requires verification. Please log in through the mobile app first and complete any security challenges, then try again.`);
        } else if (errorMessage.includes('checkpoint_required')) {
          throw new Error(`Authentication failed: Instagram checkpoint required. Please verify your account through the official mobile app and complete any required steps.`);
        } else if (errorMessage.includes('429') || errorMessage.includes('too many requests')) {
          throw new Error(`Authentication failed: Rate limited by Instagram. Please wait at least 30 minutes before trying again. Consider using the app manually first.`);
        } else if (errorMessage.includes('400') || errorMessage.includes('bad request')) {
          throw new Error(`Authentication failed: Invalid credentials or Instagram detected automated access. Please: 1) Verify your username/password, 2) Log in through the official app first, 3) Wait 30+ minutes between attempts.`);
        } else if (errorMessage.includes('login_required')) {
          throw new Error(`Authentication failed: Login session expired. Please try authenticating again.`);
        }
        throw new Error(`Authentication failed: ${error.message}`);
      }
      
      throw new Error(`Authentication failed: Unknown error occurred`);
    }
  }

  // Helper method for realistic delays
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async authenticateWithRetry(credentials: IInstagramCredentials, maxRetries: number = 3): Promise<void> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Authentication attempt ${attempt}/${maxRetries}`);
        
        // Wait between attempts (except first)
        if (attempt > 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        await this.authenticate(credentials);
        console.log('Authentication successful');
        return; // Success, exit retry loop
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.log(`Authentication attempt ${attempt} failed: ${lastError.message}`);
        
        // Don't retry on certain errors
        if (lastError.message.includes('challenge_required') || 
            lastError.message.includes('checkpoint_required')) {
          throw lastError; // These errors won't be fixed by retrying
        }
      }
    }
    
    // All attempts failed
    throw new Error(`Authentication failed after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  private ensureAuthenticated(): void {
    if (!this.isAuthenticated) {
      throw new Error('Client is not authenticated. Please call authenticate() first.');
    }
  }

  async getUserInfo(username: string): Promise<IInstagramUser> {
    this.ensureAuthenticated();
    try {
      const user = await this.client.user.searchExact(username);
      const userInfo = await this.client.user.info(user.pk);
      return {
        pk: user.pk.toString(),
        username: user.username,
        full_name: user.full_name,
        profile_pic_url: user.profile_pic_url,
        is_verified: user.is_verified || false,
        follower_count: userInfo.follower_count || 0,
        following_count: userInfo.following_count || 0,
        media_count: userInfo.media_count || 0,
        biography: userInfo.biography || '',
        is_private: userInfo.is_private || false
      };
    } catch (error) {
      throw new Error(`Failed to get user info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchUsers(query: string): Promise<IInstagramUser[]> {
    this.ensureAuthenticated();
    try {
      const response = await this.client.user.search(query);
      return (response as any).users?.map((user: any) => ({
        pk: user.pk.toString(),
        username: user.username,
        full_name: user.full_name,
        profile_pic_url: user.profile_pic_url,
        is_verified: user.is_verified || false,
        follower_count: user.follower_count || 0,
        following_count: user.following_count || 0,
        media_count: user.media_count || 0,
        biography: user.biography || '',
        is_private: user.is_private || false
      })) || [];
    } catch (error) {
      throw new Error(`Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTimelineFeed(maxId?: string): Promise<IInstagramTimelineFeed> {
    this.ensureAuthenticated();
    try {
      const feed = this.client.feed.timeline();
      const response = await feed.request();
      
      return {
        items: response.feed_items.map((item: any) => ({
          id: item.media?.id || item.id,
          code: item.media?.code || item.code,
          taken_at: item.media?.taken_at || item.taken_at,
          media_type: item.media?.media_type || item.media_type,
          image_versions2: item.media?.image_versions2,
          video_versions: item.media?.video_versions,
          caption: item.media?.caption ? { text: item.media.caption.text } : null,
          like_count: item.media?.like_count || 0,
          comment_count: item.media?.comment_count || 0,
          user: {
            id: item.media?.user?.pk?.toString() || item.user?.pk?.toString(),
            username: item.media?.user?.username || item.user?.username,
            full_name: item.media?.user?.full_name || item.user?.full_name
          }
        })),
        more_available: response.more_available || false,
        next_max_id: response.next_max_id
      };
    } catch (error) {
      throw new Error(`Failed to get timeline feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMediaInfo(mediaId: string): Promise<IInstagramMediaInfo> {
    this.ensureAuthenticated();
    try {
      const media = await this.client.media.info(mediaId);
      const item = media.items[0];
      return {
        id: item.id,
        code: item.code,
        taken_at: item.taken_at,
        media_type: item.media_type,
        like_count: item.like_count,
        comment_count: item.comment_count,
        user: {
          pk: item.user.pk.toString(),
          username: item.user.username,
          full_name: item.user.full_name
        },
        image_versions2: item.image_versions2,
        video_versions: (item as any).video_versions || []
      };
    } catch (error) {
      throw new Error(`Failed to get media info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async likeMedia(mediaId: string): Promise<void> {
    this.ensureAuthenticated();
    try {
      await this.client.media.like({
        mediaId,
        d: 1
      } as any);
    } catch (error) {
      throw new Error(`Failed to like media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async unlikeMedia(mediaId: string): Promise<void> {
    this.ensureAuthenticated();
    try {
      await this.client.media.unlike({
        mediaId,
        d: 1
      } as any);
    } catch (error) {
      throw new Error(`Failed to unlike media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFollowers(userId: string, limit?: number): Promise<IInstagramUser[]> {
    this.ensureAuthenticated();
    try {
      const feed = this.client.feed.accountFollowers(userId);
      const response = await feed.request();
      
      const followers = limit ? response.users.slice(0, limit) : response.users;
      return followers.map((user: any) => ({
        pk: user.pk.toString(),
        username: user.username,
        full_name: user.full_name,
        profile_pic_url: user.profile_pic_url,
        is_verified: user.is_verified || false,
        follower_count: 0,
        following_count: 0,
        media_count: 0,
        biography: '',
        is_private: user.is_private || false
      }));
    } catch (error) {
      throw new Error(`Failed to get followers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFollowing(userId: string, limit?: number): Promise<IInstagramUser[]> {
    this.ensureAuthenticated();
    try {
      const feed = this.client.feed.accountFollowing(userId);
      const response = await feed.request();
      
      const following = limit ? response.users.slice(0, limit) : response.users;
      return following.map((user: any) => ({
        pk: user.pk.toString(),
        username: user.username,
        full_name: user.full_name,
        profile_pic_url: user.profile_pic_url,
        is_verified: user.is_verified || false,
        follower_count: 0,
        following_count: 0,
        media_count: 0,
        biography: '',
        is_private: user.is_private || false
      }));
    } catch (error) {
      throw new Error(`Failed to get following: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserMedia(userId: string, limit?: number): Promise<IInstagramMediaItem[]> {
    this.ensureAuthenticated();
    try {
      const feed = this.client.feed.user(userId);
      const response = await feed.request();
      
      const media = limit ? response.items.slice(0, limit) : response.items;
      return media.map((item: any) => ({
        id: item.id,
        code: item.code,
        taken_at: item.taken_at,
        media_type: item.media_type,
        caption: item.caption ? { text: item.caption.text } : null,
        like_count: item.like_count,
        comment_count: item.comment_count,
        user: {
          id: item.user.pk.toString(),
          username: item.user.username,
          full_name: item.user.full_name
        }
      }));
    } catch (error) {
      throw new Error(`Failed to get user media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async saveSession(): Promise<string> {
    try {
      return JSON.stringify(await this.client.state.serialize());
    } catch (error) {
      throw new Error(`Failed to save session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async loadSession(sessionData: string): Promise<void> {
    try {
      await this.client.state.deserialize(sessionData);
      this.isAuthenticated = true;
    } catch (error) {
      this.isAuthenticated = false;
      throw new Error(`Failed to load session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
