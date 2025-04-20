/**
 * Rate limiting middleware
 */
import Cache from '../utils/cache.js';

class RateLimiter {
  constructor(options = {}) {
    this.options = {
      windowMs: 60 * 1000, // 1 minute
      max: 100, // max requests per windowMs
      message: 'Too many requests, please try again later.',
      statusCode: 429,
      keyGenerator: (req) => req.ip,
      skip: () => false,
      ...options
    };
    
    this.cache = new Cache({
      defaultTTL: this.options.windowMs,
      checkInterval: this.options.windowMs
    });
  }
  
  middleware() {
    return (req, res, next) => {
      if (this.options.skip(req, res)) {
        return next();
      }
      
      const key = this.options.keyGenerator(req);
      
      // Get current count for this key
      let current = this.cache.get(key) || 0;
      
      // If over limit, send error response
      if (current >= this.options.max) {
        return res.status(this.options.statusCode).json({
          status: 'error',
          message: this.options.message
        });
      }
      
      // Increment count
      this.cache.set(key, current + 1);
      
      // Add headers to response
      res.setHeader('X-RateLimit-Limit', this.options.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.options.max - (current + 1)));
      
      next();
    };
  }
}

export default RateLimiter;