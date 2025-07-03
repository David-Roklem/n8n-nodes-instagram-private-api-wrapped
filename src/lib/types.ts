export interface IInstagramCredentials {
  sessionData: string;
  proxyUrl?: string;
}

// Interfaces for n8n node compatibility
export interface IInstagramUserInfo {
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

export interface IInstagramUser {
	pk: string;
	username: string;
	full_name: string;
	profile_pic_url: string;
	is_verified: boolean;
	follower_count: number;
	following_count: number;
	media_count: number;
	biography: string;
	is_private: boolean;
}

export interface IInstagramTimelineFeed {
	items: IInstagramMediaItem[];
	more_available: boolean;
	next_max_id?: string;
}

export interface IInstagramUserFeed {
	items: IInstagramMediaItem[];
	more_available: boolean;
	next_max_id?: string;
}

export interface IInstagramMediaInfo {
	id: string;
	code: string;
	taken_at: number;
	media_type: number;
	like_count: number;
	comment_count: number;
	user: {
		pk: string;
		username: string;
		full_name: string;
	};
	image_versions2?: {
		candidates: Array<{
			url: string;
			width: number;
			height: number;
		}>;
	};
	video_versions?: Array<{
		url: string;
		width: number;
		height: number;
	}>;
}

export interface IInstagramComment {
	pk: string;
	text: string;
	created_at: number;
	user: {
		pk: string;
		username: string;
		full_name: string;
		profile_pic_url: string;
	};
}

export interface IInstagramDirectThread {
	thread_id: string;
	thread_title: string;
	users: Array<{
		pk: string;
		username: string;
		full_name: string;
		profile_pic_url: string;
	}>;
}

export interface IInstagramDirectMessage {
	id: string;
	text: string;
	timestamp: number;
	user_id: string;
}

export interface IInstagramMediaItem {
	id: string;
	code: string;
	taken_at: number;
	media_type: number; // 1 for photo, 8 for video
	caption?: {
		text: string;
	} | null;
	like_count: number;
	comment_count: number;
	user: {
		id: string;
		username: string;
		full_name: string;
	};
}

export interface InstagramPost {
	id: string;
	shortcode: string;
	caption?: string;
	media_type: number;
	image_versions2?: {
		candidates: Array<{
			url: string;
			width: number;
			height: number;
		}>;
	};
	video_versions?: Array<{
		url: string;
		width: number;
		height: number;
	}>;
	like_count: number;
	comment_count: number;
	taken_at: number;
	user: {
		pk: string;
		username: string;
		full_name: string;
		profile_pic_url: string;
	};
}

export interface InstagramUser {
	pk: string;
	username: string;
	full_name: string;
	biography?: string;
	profile_pic_url: string;
	follower_count: number;
	following_count: number;
	media_count: number;
	is_private: boolean;
	is_verified: boolean;
}

export interface InstagramStory {
	id: string;
	media_type: number;
	image_versions2?: {
		candidates: Array<{
			url: string;
			width: number;
			height: number;
		}>;
	};
	video_versions?: Array<{
		url: string;
		width: number;
		height: number;
	}>;
	taken_at: number;
	expiring_at: number;
	user: {
		pk: string;
		username: string;
		profile_pic_url: string;
	};
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
  media_type: number; // 1 for photo, 8 for video
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

export interface PostImageOptions {
  caption?: string;
  location?: {
    name: string;
    lat?: number;
    lng?: number;
  };
}

export interface FollowUserResult {
  success: boolean;
  user_id: string;
}

export interface UnfollowUserResult {
  success: boolean;
  user_id: string;
}

export interface LikePostResult {
  success: boolean;
  media_id: string;
}

export interface HashtagInfo {
  name: string;
  media_count: number;
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