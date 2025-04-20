/**
 * Configurable logger module for applications
 */

class Logger {
  constructor(options = {}) {
    this.options = {
      level: 'info',
      prefix: '',
      enableTimestamp: true,
      ...options
    };
    
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }
  
  _shouldLog(level) {
    return this.levels[level] <= this.levels[this.options.level];
  }
  
  _formatMessage(level, message) {
    const parts = [];
    
    if (this.options.enableTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }
    
    parts.push(`[${level.toUpperCase()}]`);
    
    if (this.options.prefix) {
      parts.push(`[${this.options.prefix}]`);
    }
    
    parts.push(message);
    return parts.join(' ');
  }
  
  error(message, ...args) {
    if (this._shouldLog('error')) {
      console.error(this._formatMessage('error', message), ...args);
    }
  }
  
  warn(message, ...args) {
    if (this._shouldLog('warn')) {
      console.warn(this._formatMessage('warn', message), ...args);
    }
  }
  
  info(message, ...args) {
    if (this._shouldLog('info')) {
      console.info(this._formatMessage('info', message), ...args);
    }
  }
  
  debug(message, ...args) {
    if (this._shouldLog('debug')) {
      console.debug(this._formatMessage('debug', message), ...args);
    }
  }
}

export default Logger;