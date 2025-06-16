import { RetryOptions } from './types';

/**
 * Utility functions for Instagram n8n integration
 */
export class Utils {
  /**
   * Execute a function with retry logic and exponential backoff
   */
  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }

        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await this.delay(delay);
      }
    }

    throw new Error('Maximum retries exceeded');
  }

  /**
   * Create a delay promise
   */
  static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate image buffer format
   */
  static validateImageBuffer(buffer: Buffer): boolean {
    if (!buffer || buffer.length === 0) {
      return false;
    }

    // Check for common image formats (JPEG, PNG)
    const jpegSignature = Buffer.from([0xFF, 0xD8, 0xFF]);
    const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47]);

    return (
      buffer.subarray(0, 3).equals(jpegSignature) ||
      buffer.subarray(0, 4).equals(pngSignature)
    );
  }

  /**
   * Sanitize text input to prevent issues with Instagram API
   */
  static sanitizeText(text: string): string {
    if (!text) return '';
    
    // Remove HTML tags and potentially problematic characters
    return text
      .trim()
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .substring(0, 2200); // Instagram caption limit
  }

  /**
   * Generate random delay to avoid rate limiting
   */
  static async randomDelay(min: number = 1000, max: number = 3000): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await this.delay(delay);
  }

  /**
   * Format error message for n8n display
   */
  static formatError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.error) {
      return error.error;
    }

    return 'Unknown error occurred';
  }

  /**
   * Format hashtag with # prefix
   */
  static formatHashtag(hashtag: string): string {
    if (!hashtag) return '#';
    
    const trimmed = hashtag.trim();
    return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  }

  /**
   * Extract media ID from Instagram URL or return original string
   */
  static extractMediaId(input: string): string {
    if (!input) return '';
    
    const mediaId = this.extractMediaIdFromUrl(input);
    return mediaId || input;
  }

  /**
   * Generate retry delay with exponential backoff
   */
  static generateRetryDelay(attempt: number, baseDelay: number, maxDelay: number): number {
    const delay = baseDelay * Math.pow(2, attempt);
    return Math.min(delay, maxDelay);
  }

  /**
   * Check if Instagram session is valid
   */
  static isSessionValid(session: any): boolean {
    if (!session || typeof session !== 'object') {
      return false;
    }
    
    if (!session.cookies || !Array.isArray(session.cookies)) {
      return false;
    }
    
    // Check if session has required cookies
    return session.cookies.some((cookie: any) => 
      cookie && cookie.name === 'sessionid' && cookie.value
    );
  }

  /**
   * Extract media ID from Instagram URL
   */
  static extractMediaIdFromUrl(url: string): string | null {
    const patterns = [
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/tv\/([A-Za-z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Validate username format
   */
  static validateUsername(username: string): boolean {
    if (!username) return false;
    
    // Instagram username rules: 1-30 characters, letters, numbers, periods, underscores
    const usernamePattern = /^[a-zA-Z0-9._]{1,30}$/;
    return usernamePattern.test(username);
  }

  /**
   * Validate hashtag format
   */
  static validateHashtag(hashtag: string): string {
    if (!hashtag || !hashtag.trim()) {
      throw new Error('Invalid hashtag format. Only letters, numbers, and underscores are allowed.');
    }
    
    // Remove # if present and validate
    const cleanHashtag = hashtag.replace(/^#/, '').trim();
    
    if (!cleanHashtag) {
      throw new Error('Invalid hashtag format. Only letters, numbers, and underscores are allowed.');
    }
    
    // Instagram hashtag rules: letters, numbers, underscores
    const hashtagPattern = /^[a-zA-Z0-9_]+$/;
    
    if (hashtagPattern.test(cleanHashtag)) {
      return cleanHashtag;
    }
    
    throw new Error('Invalid hashtag format. Only letters, numbers, and underscores are allowed.');
  }
}