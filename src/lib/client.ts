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

  constructor() {
    this.client = new IgApiClient();
  }

  async authenticate(credentials: IInstagramCredentials): Promise<void> {
    try {
      this.client.state.generateDevice(credentials.username);
      this.client.state.proxyUrl = credentials.proxyUrl;
      
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
      return {
        pk: user.pk.toString(),
        username: user.username,
        full_name: user.full_name,
        profile_pic_url: user.profile_pic_url,
        is_private: user.is_private,
        is_verified: user.is_verified,
        follower_count: user.follower_count,
        following_count: user.following_count,
        media_count: user.media_count,
        biography: user.biography || ''
      };
    } catch (error) {
      throw new Error(`Failed to get user info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserFeed(userId: string, maxId?: string): Promise<IInstagramUserFeed> {
    this.ensureAuthenticated();
    try {
      const feed = this.client.feed.user(userId);
      if (maxId) {
        feed.state.maxId = maxId;
      }
      const response = await feed.request();
      
      return {
        items: response.items.map(item => ({
          id: item.id,
          code: item.code,
          taken_at: item.taken_at,
          media_type: item.media_type,
          image_versions2: item.image_versions2,
          video_versions: item.video_versions,
          caption: item.caption ? {
            text: item.caption.text,
            user: {
              pk: item.caption.user.pk.toString(),
              username: item.caption.user.username,
              full_name: item.caption.user.full_name
            }
          } : null,
          like_count: item.like_count,
          comment_count: item.comment_count,
          user: {
            pk: item.user.pk.toString(),
            username: item.user.username,
            full_name: item.user.full_name,
            profile_pic_url: item.user.profile_pic_url
          }
        })),
        more_available: response.more_available,
        next_max_id: response.next_max_id
      };
    } catch (error) {
      throw new Error(`Failed to get user feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTimelineFeed(maxId?: string): Promise<IInstagramTimelineFeed> {
    this.ensureAuthenticated();
    try {
      const feed = this.client.feed.timeline();
      if (maxId) {
        feed.state.maxId = maxId;
      }
      const response = await feed.request();
      
      return {
        items: response.feed_items.map(item => ({
          id: item.media_or_ad.id,
          code: item.media_or_ad.code,
          taken_at: item.media_or_ad.taken_at,
          media_type: item.media_or_ad.media_type,
          image_versions2: item.media_or_ad.image_versions2,
          video_versions: item.media_or_ad.video_versions,
          caption: item.media_or_ad.caption ? {
            text: item.media_or_ad.caption.text,
            user: {
              pk: item.media_or_ad.caption.user.pk.toString(),
              username: item.media_or_ad.caption.user.username,
              full_name: item.media_or_ad.caption.user.full_name
            }
          } : null,
          like_count: item.media_or_ad.like_count,
          comment_count: item.media_or_ad.comment_count,
          user: {
            pk: item.media_or_ad.user.pk.toString(),
            username: item.media_or_ad.user.username,
            full_name: item.media_or_ad.user.full_name,
            profile_pic_url: item.media_or_ad.user.profile_pic_url
          }
        })),
        more_available: response.more_available,
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
      
      return {
        id: media.items[0].id,
        code: media.items[0].code,
        taken_at: media.items[0].taken_at,
        media_type: media.items[0].media_type,
        image_versions2: media.items[0].image_versions2,
        video_versions: media.items[0].video_versions,
        caption: media.items[0].caption ? {
          text: media.items[0].caption.text,
          user: {
            pk: media.items[0].caption.user.pk.toString(),
            username: media.items[0].caption.user.username,
            full_name: media.items[0].caption.user.full_name
          }
        } : null,
        like_count: media.items[0].like_count,
        comment_count: media.items[0].comment_count,
        user: {
          pk: media.items[0].user.pk.toString(),
          username: media.items[0].user.username,
          full_name: media.items[0].user.full_name,
          profile_pic_url: media.items[0].user.profile_pic_url
        }
      };
    } catch (error) {
      throw new Error(`Failed to get media info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async likeMedia(mediaId: string): Promise<void> {
    this.ensureAuthenticated();
    try {
      await this.client.media.like({ mediaId });
    } catch (error) {
      throw new Error(`Failed to like media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async unlikeMedia(mediaId: string): Promise<void> {
    this.ensureAuthenticated();
    try {
      await this.client.media.unlike({ mediaId });
    } catch (error) {
      throw new Error(`Failed to unlike media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async followUser(userId: string): Promise<void> {
    this.ensureAuthenticated();
    try {
      await this.client.friendship.create(userId);
    } catch (error) {
      throw new Error(`Failed to follow user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async unfollowUser(userId: string): Promise<void> {
    this.ensureAuthenticated();
    try {
      await this.client.friendship.destroy(userId);
    } catch (error) {
      throw new Error(`Failed to unfollow user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async commentOnMedia(mediaId: string, text: string): Promise<IInstagramComment> {
    this.ensureAuthenticated();
    try {
      const response = await this.client.media.comment({ mediaId, text });
      return {
        pk: response.comment.pk.toString(),
        text: response.comment.text,
        created_at: response.comment.created_at,
        user: {
          pk: response.comment.user.pk.toString(),
          username: response.comment.user.username,
          full_name: response.comment.user.full_name,
          profile_pic_url: response.comment.user.profile_pic_url
        }
      };
    } catch (error) {
      throw new Error(`Failed to comment on media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDirectInbox(): Promise<IInstagramDirectThread[]> {
    this.ensureAuthenticated();
    try {
      const inbox = await this.client.feed.directInbox().request();
      return inbox.threads.map(thread => ({
        thread_id: thread.thread_id,
        thread_title: thread.thread_title,
        users: thread.users.map(user => ({
          pk: user.pk.toString(),
          username: user.username,
          full_name: user.full_name,
          profile_pic_url: user.profile_pic_url
        })),
        last_activity_at: thread.last_activity_at,
        muted: thread.muted,
        is_group: thread.is_group,
        pending: thread.pending,
        has_older: thread.has_older,
        has_newer: thread.has_newer
      }));
    } catch (error) {
      throw new Error(`Failed to get direct inbox: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendDirectMessage(threadId: string, text: string): Promise<void> {
    this.ensureAuthenticated();
    try {
      await this.client.directThread.broadcastText(text, threadId);
    } catch (error) {
      throw new Error(`Failed to send direct message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadPhoto(imagePath: string, caption?: string): Promise<IInstagramMediaItem> {
    this.ensureAuthenticated();
    try {
      const response = await this.client.publish.photo({
        file: imagePath,
        caption: caption || ''
      });
      
      return {
        id: response.media.id,
        code: response.media.code,
        taken_at: response.media.taken_at,
        media_type: response.media.media_type,
        image_versions2: response.media.image_versions2,
        caption: caption ? {
          text: caption,
          user: {
            pk: response.media.user.pk.toString(),
            username: response.media.user.username,
            full_name: response.media.user.full_name
          }
        } : null,
        like_count: 0,
        comment_count: 0,
        user: {
          pk: response.media.user.pk.toString(),
          username: response.media.user.username,
          full_name: response.media.user.full_name,
          profile_pic_url: response.media.user.profile_pic_url
        }
      };
    } catch (error) {
      throw new Error(`Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchUsers(query: string): Promise<IInstagramUser[]> {
    this.ensureAuthenticated();
    try {
      const response = await this.client.search.users(query);
      return response.users.map(user => ({
        pk: user.pk.toString(),
        username: user.username,
        full_name: user.full_name,
        profile_pic_url: user.profile_pic_url,
        is_private: user.is_private,
        is_verified: user.is_verified,
        follower_count: user.follower_count,
        following_count: user.following_count,
        media_count: user.media_count,
        biography: user.biography || ''
      }));
    } catch (error) {
      throw new Error(`Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}