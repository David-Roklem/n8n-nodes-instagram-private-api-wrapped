import { IgApiClient } from 'instagram-private-api';
import { MediaItem, UserInfo, CommentInfo } from './types';

/**
 * Instagram API Client for n8n integration
 */
export class InstagramClient {
  private client: IgApiClient;
  private isLoggedIn: boolean = false;

  constructor() {
    this.client = new IgApiClient();
  }

  /**
   * Login to Instagram
   */
  async login(username: string, password: string): Promise<void> {
    try {
      this.client.state.generateDevice(username);
      await this.client.account.login(username, password);
      this.isLoggedIn = true;
    } catch (error) {
      throw new Error(`Instagram login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private ensureLoggedIn(): void {
    if (!this.isLoggedIn) {
      throw new Error('Not logged in to Instagram');
    }
  }

  /**
   * Get followers of a user
   */
  async getFollowers(userId: string, maxFollowers: number = 100): Promise<UserInfo[]> {
    this.ensureLoggedIn();

    try {
      const feed = this.client.feed.accountFollowers(userId);
      const followers = await feed.items();
      
      return followers.slice(0, maxFollowers).map(follower => ({
        id: follower.pk.toString(),
        username: follower.username,
        full_name: follower.full_name || '',
        profile_pic_url: follower.profile_pic_url || '',
        is_verified: follower.is_verified || false,
        follower_count: (follower as any).follower_count || 0,
        following_count: (follower as any).following_count || 0,
        media_count: (follower as any).media_count || 0,
        biography: (follower as any).biography || '',
      }));
    } catch (error) {
      throw new Error(`Failed to get followers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get following list of a user
   */
  async getFollowing(userId: string, maxFollowing: number = 100): Promise<UserInfo[]> {
    this.ensureLoggedIn();

    try {
      const feed = this.client.feed.accountFollowing(userId);
      const following = await feed.items();
      
      return following.slice(0, maxFollowing).map(user => ({
        id: user.pk.toString(),
        username: user.username,
        full_name: user.full_name || '',
        profile_pic_url: user.profile_pic_url || '',
        is_verified: user.is_verified || false,
        follower_count: (user as any).follower_count || 0,
        following_count: (user as any).following_count || 0,
        media_count: (user as any).media_count || 0,
        biography: (user as any).biography || '',
      }));
    } catch (error) {
      throw new Error(`Failed to get following: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Post an image with caption
   */
  async postImage(imageBuffer: Buffer, caption: string = ''): Promise<any> {
    this.ensureLoggedIn();

    try {
      const result = await this.client.publish.photo({
        file: imageBuffer,
        caption: caption,
      });

      return {
        media_id: result.media.pk,
        code: result.media.code,
        caption: caption,
        like_count: 0,
        comment_count: 0,
        taken_at: Math.floor(Date.now() / 1000)
      };
    } catch (error) {
      throw new Error(`Failed to post image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Like a post
   */
  async likePost(mediaId: string): Promise<any> {
    this.ensureLoggedIn();

    try {
      const result = await this.client.media.like({
        mediaId: mediaId,
        moduleInfo: {
          module_name: 'feed_timeline',
        },
        d: 1,
      } as any);

      return {
        success: true,
        media_id: mediaId,
        result: result
      };
    } catch (error) {
      throw new Error(`Failed to like post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Comment on a post
   */
  async commentOnPost(mediaId: string, text: string): Promise<CommentInfo> {
    this.ensureLoggedIn();

    try {
      const result = await this.client.media.comment({
        mediaId: mediaId,
        text: text,
      });

      return {
        comment_id: (result as any).comment?.pk?.toString() || '',
        text: text,
        created_at: Math.floor(Date.now() / 1000),
        user: {
          id: (result as any).comment?.user?.pk?.toString() || '',
          username: (result as any).comment?.user?.username || '',
        }
      };
    } catch (error) {
      throw new Error(`Failed to comment on post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user information
   */
  async getUserInfo(username: string): Promise<UserInfo> {
    this.ensureLoggedIn();

    try {
      const user = await this.client.user.searchExact(username);
      
      return {
        id: user.pk.toString(),
        username: user.username,
        full_name: user.full_name || '',
        profile_pic_url: user.profile_pic_url || '',
        is_verified: user.is_verified || false,
        follower_count: user.follower_count || 0,
        following_count: user.follower_count || 0, // Use follower_count as fallback
        media_count: (user as any).media_count || 0,
        biography: (user as any).biography || '',
      };
    } catch (error) {
      throw new Error(`Failed to get user info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get posts by hashtag
   */
  async getPostsByHashtag(hashtag: string, limit: number = 10): Promise<MediaItem[]> {
    this.ensureLoggedIn();

    try {
      const feed = this.client.feed.tags(hashtag);
      const posts = await feed.items();
      const limitedPosts = posts.slice(0, limit);

      return limitedPosts.map(post => ({
        id: post.pk.toString(),
        code: post.code || '',
        taken_at: post.taken_at || Math.floor(Date.now() / 1000),
        media_type: post.media_type || 1,
        image_versions2: post.image_versions2,
        caption: post.caption ? { text: post.caption.text || '' } : undefined,
        like_count: post.like_count || 0,
        comment_count: post.comment_count || 0,
        user: {
          id: post.user?.pk?.toString() || '',
          username: post.user?.username || '',
          full_name: post.user?.full_name || '',
        }
      }));
    } catch (error) {
      throw new Error(`Failed to get posts by hashtag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}