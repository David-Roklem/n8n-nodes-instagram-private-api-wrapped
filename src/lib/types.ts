export interface InstagramCredentials {
  username: string;
  password: string;
}

export interface PostImageOptions {
  imageBuffer: Buffer;
  caption?: string;
}

export interface UserInfo {
  id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  media_count: number;
  biography: string;
}

export interface MediaItem {
  id: string;
  code: string;
  taken_at: number;
  media_type: number;
  image_versions2?: any;
  caption?: {
    text: string;
  };
  like_count: number;
  comment_count: number;
  user: {
    id: string;
    username: string;
    full_name: string;
  };
}

export interface CommentInfo {
  comment_id: string;
  text: string;
  created_at: number;
  user: {
    id: string;
    username: string;
  };
}

export interface InstagramNodeProperties {
  operation: string;
  username?: string;
  hashtag?: string;
  mediaId?: string;
  comment?: string;
  imageBuffer?: Buffer;
  caption?: string;
  limit?: number;
}

export interface InstagramApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export type InstagramOperation = 
  | 'postImage'
  | 'getFollowers'
  | 'getFollowing'
  | 'likePost'
  | 'commentPost'
  | 'getUserInfo'
  | 'getPostsByHashtag';

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}