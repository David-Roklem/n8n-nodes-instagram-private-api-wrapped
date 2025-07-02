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
      this.client.state.generateDevice(credentials.username);
      if (credentials.proxyUrl) {
        this.client.state.proxyUrl = credentials.proxyUrl;
      }
      
      await this.client.account.login(credentials.username, credentials.password);
      this.isAuthenticated = true;
    } catch (error) {
      this.isAuthenticated = false;
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
}
