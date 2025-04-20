/**
 * Simple in-memory cache utility
 */
class Cache {
  constructor(options = {}) {
    this.options = {
      defaultTTL: 3600 * 1000, // 1 hour in milliseconds
      checkInterval: 60 * 1000, // 1 minute in milliseconds
      ...options
    };
    
    this.cache = new Map();
    
    // Start the cleanup interval
    if (this.options.checkInterval > 0) {
      this.interval = setInterval(() => this.cleanup(), this.options.checkInterval);
      // Prevent the interval from keeping the process alive
      if (this.interval.unref) {
        this.interval.unref();
      }
    }
  }
  
  set(key, value, ttl = this.options.defaultTTL) {
    const expiry = ttl > 0 ? Date.now() + ttl : 0;
    this.cache.set(key, {
      value,
      expiry
    });
    return value;
  }
  
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }
    
    // Check if the item has expired
    if (item.expiry > 0 && item.expiry < Date.now()) {
      this.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  has(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    // Check if the item has expired
    if (item.expiry > 0 && item.expiry < Date.now()) {
      this.delete(key);
      return false;
    }
    
    return true;
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  cleanup() {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry > 0 && item.expiry < now) {
        this.cache.delete(key);
      }
    }
  }
  
  size() {
    return this.cache.size;
  }
  
  keys() {
    return Array.from(this.cache.keys());
  }
  
  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.clear();
  }
}

export default Cache;