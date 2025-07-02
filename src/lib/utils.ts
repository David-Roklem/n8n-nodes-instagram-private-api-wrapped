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
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
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
   * Formats error messages consistently
   */
  static formatError(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Unknown error occurred';
  }

  /**
   * Validates username format
   */
  static validateUsername(username: string): boolean {
    if (!username || typeof username !== 'string') {
      return false;
    }
    
    // Instagram username rules: 1-30 characters, letters, numbers, periods, underscores
    const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
    return usernameRegex.test(username);
  }

  /**
   * Validates hashtag format
   */
  static validateHashtag(hashtag: string): string {
    if (!hashtag || typeof hashtag !== 'string') {
      throw new Error('Invalid hashtag provided');
    }
    
    // Remove # if present and validate
    const cleanHashtag = hashtag.replace(/^#/, '').trim();
    
    if (cleanHashtag.length === 0) {
      throw new Error('Hashtag cannot be empty');
    }
    
    // Instagram hashtag rules: letters, numbers, underscores only
    const hashtagRegex = /^[a-zA-Z0-9_]+$/;
    if (!hashtagRegex.test(cleanHashtag)) {
      throw new Error('Hashtag contains invalid characters');
    }
    
    return cleanHashtag;
  }

  /**
   * Validates image buffer
   */
  static validateImageBuffer(buffer: Buffer): boolean {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return false;
    }
    
    // Check minimum size (1KB)
    if (buffer.length < 1024) {
      return false;
    }
    
    // Check maximum size (8MB for Instagram)
    if (buffer.length > 8 * 1024 * 1024) {
      return false;
    }
    
    // Check for common image file signatures
    const jpegSignature = buffer.slice(0, 2);
    const pngSignature = buffer.slice(0, 8);
    
    const isJPEG = jpegSignature[0] === 0xFF && jpegSignature[1] === 0xD8;
    const isPNG = pngSignature.equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));
    
    return isJPEG || isPNG;
  }

  /**
   * Validates and formats media ID
   */
  static validateMediaId(mediaId: string): string {
    if (!mediaId || typeof mediaId !== 'string') {
      throw new Error('Invalid media ID provided');
    }
    
    const cleaned = mediaId.trim();
    if (cleaned.length === 0) {
      throw new Error('Media ID cannot be empty');
    }
    
    return cleaned;
  }

  /**
   * Extracts user ID from Instagram URL
   */
  static extractUserIdFromUrl(url: string): string | null {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    // Pattern for Instagram profile URLs
    const patterns = [
      /instagram\.com\/([a-zA-Z0-9._]+)\/?/,
      /instagram\.com\/p\/([a-zA-Z0-9._-]+)\/?/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }

  /**
   * Formats timestamp to human readable date
   */
  static formatTimestamp(timestamp: number): string {
    try {
      return new Date(timestamp * 1000).toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  /**
   * Validates and limits numeric values
   */
  static validateLimit(limit: number | undefined, defaultValue: number, maxValue: number): number {
    if (limit === undefined || limit === null) {
      return defaultValue;
    }
    
    if (typeof limit !== 'number' || isNaN(limit) || limit < 1) {
      return defaultValue;
    }
    
    return Math.min(limit, maxValue);
  }

  /**
   * Creates a retry mechanism for API calls
   */
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          break;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        await this.randomDelay(delay, delay * 1.5);
      }
    }
    
    throw lastError!;
  }

  /**
   * Checks if error is rate limit related
   */
  static isRateLimitError(error: any): boolean {
    const errorMsg = this.formatError(error).toLowerCase();
    return errorMsg.includes('rate limit') || 
           errorMsg.includes('too many requests') ||
           errorMsg.includes('429');
  }

  /**
   * Generates a unique request ID for tracking
   */
  static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}