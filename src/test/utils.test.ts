import { Utils } from '../lib/utils';

describe('Utils', () => {
  describe('delay', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await Utils.delay(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(90); // Allow for small timing variations
    });

    it('should handle zero delay', async () => {
      const start = Date.now();
      await Utils.delay(0);
      const end = Date.now();
      expect(end - start).toBeLessThan(50);
    });
  });

  describe('sanitizeText', () => {
    it('should remove harmful characters', () => {
      const input = 'Hello <script>alert("xss")</script> World!';
      const result = Utils.sanitizeText(input);
      expect(result).toBe('Hello alert("xss") World!');
    });

    it('should handle empty strings', () => {
      expect(Utils.sanitizeText('')).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(Utils.sanitizeText(null as any)).toBe('');
      expect(Utils.sanitizeText(undefined as any)).toBe('');
    });

    it('should preserve safe text', () => {
      const input = 'This is safe text with émojis 🎉';
      const result = Utils.sanitizeText(input);
      expect(result).toBe(input);
    });
  });

  describe('formatHashtag', () => {
    it('should add # prefix if missing', () => {
      expect(Utils.formatHashtag('nature')).toBe('#nature');
      expect(Utils.formatHashtag('travel')).toBe('#travel');
    });

    it('should preserve # prefix if present', () => {
      expect(Utils.formatHashtag('#nature')).toBe('#nature');
      expect(Utils.formatHashtag('#travel')).toBe('#travel');
    });

    it('should handle empty strings', () => {
      expect(Utils.formatHashtag('')).toBe('#');
    });

    it('should trim whitespace', () => {
      expect(Utils.formatHashtag('  nature  ')).toBe('#nature');
      expect(Utils.formatHashtag('  #travel  ')).toBe('#travel');
    });
  });

  describe('extractMediaId', () => {
    it('should extract media ID from Instagram URL', () => {
      const url = 'https://www.instagram.com/p/ABC123/';
      const result = Utils.extractMediaId(url);
      expect(result).toBe('ABC123');
    });

    it('should extract media ID from different URL formats', () => {
      expect(Utils.extractMediaId('https://instagram.com/p/XYZ789/')).toBe('XYZ789');
      expect(Utils.extractMediaId('http://www.instagram.com/p/DEF456')).toBe('DEF456');
    });

    it('should return original string if not a URL', () => {
      expect(Utils.extractMediaId('ABC123')).toBe('ABC123');
      expect(Utils.extractMediaId('random-text')).toBe('random-text');
    });

    it('should handle empty strings', () => {
      expect(Utils.extractMediaId('')).toBe('');
    });
  });

  describe('generateRetryDelay', () => {
    it('should calculate exponential backoff', () => {
      expect(Utils.generateRetryDelay(0, 1000, 10000)).toBe(1000);
      expect(Utils.generateRetryDelay(1, 1000, 10000)).toBe(2000);
      expect(Utils.generateRetryDelay(2, 1000, 10000)).toBe(4000);
      expect(Utils.generateRetryDelay(3, 1000, 10000)).toBe(8000);
    });

    it('should respect maximum delay', () => {
      expect(Utils.generateRetryDelay(10, 1000, 5000)).toBe(5000);
    });

    it('should handle edge cases', () => {
      expect(Utils.generateRetryDelay(0, 0, 1000)).toBe(0);
      expect(Utils.generateRetryDelay(1, 0, 1000)).toBe(0);
    });
  });

  describe('validateHashtag', () => {
    it('should validate correct hashtags', () => {
      expect(Utils.validateHashtag('nature')).toBe('nature');
      expect(Utils.validateHashtag('travel_photography')).toBe('travel_photography');
      expect(Utils.validateHashtag('fitness2024')).toBe('fitness2024');
    });

    it('should throw error for invalid hashtags', () => {
      expect(() => Utils.validateHashtag('nature-travel')).toThrow('Invalid hashtag format');
      expect(() => Utils.validateHashtag('nature travel')).toThrow('Invalid hashtag format');
      expect(() => Utils.validateHashtag('nature!')).toThrow('Invalid hashtag format');
    });

    it('should handle hashtags with # prefix', () => {
      expect(Utils.validateHashtag('#nature')).toBe('nature');
      expect(Utils.validateHashtag('#travel_photography')).toBe('travel_photography');
    });

    it('should handle empty hashtags', () => {
      expect(() => Utils.validateHashtag('')).toThrow('Invalid hashtag format');
      expect(() => Utils.validateHashtag('   ')).toThrow('Invalid hashtag format');
    });
  });

  describe('isSessionValid', () => {
    it('should validate correct sessions', () => {
      const validSession = {
        cookies: [{ name: 'sessionid', value: 'abc123' }],
        deviceId: 'device123',
        uuid: 'uuid123'
      };
      expect(Utils.isSessionValid(validSession)).toBe(true);
    });

    it('should reject invalid sessions', () => {
      expect(Utils.isSessionValid(null)).toBe(false);
      expect(Utils.isSessionValid({})).toBe(false);
      expect(Utils.isSessionValid({ cookies: [] })).toBe(false);
      expect(Utils.isSessionValid({ cookies: [{ name: 'other', value: 'test' }] })).toBe(false);
    });

    it('should handle undefined input', () => {
      expect(Utils.isSessionValid(undefined)).toBe(false);
    });
  });
});