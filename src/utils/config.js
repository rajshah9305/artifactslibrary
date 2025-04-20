/**
 * Environment configuration helper
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

class Config {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.configDir = path.resolve(process.cwd(), 'config');
    this.cache = {};
    
    // Load default config
    this.loadConfigFile('default.json');
    
    // Load environment-specific config
    this.loadConfigFile(`${this.env}.json`);
  }
  
  loadConfigFile(filename) {
    const filePath = path.join(this.configDir, filename);
    
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const config = JSON.parse(fileContent);
        this.merge(config);
      }
    } catch (error) {
      console.warn(`Failed to load config file ${filename}:`, error.message);
    }
  }
  
  merge(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (!this.cache[key] || typeof this.cache[key] !== 'object') {
          this.cache[key] = {};
        }
        
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          this.cache[key][nestedKey] = nestedValue;
        }
      } else {
        this.cache[key] = value;
      }
    }
  }
  
  get(key, defaultValue = null) {
    // First check environment variables (with prefix APP_)
    const envKey = `APP_${key.toUpperCase().replace(/\./g, '_')}`;
    if (process.env[envKey] !== undefined) {
      return process.env[envKey];
    }
    
    // Then check the config files
    const keys = key.split('.');
    let current = this.cache;
    
    for (const k of keys) {
      if (current[k] === undefined) {
        return defaultValue;
      }
      current = current[k];
    }
    
    return current;
  }
  
  getAll() {
    return { ...this.cache };
  }
}

// Create a singleton instance
const config = new Config();
export default config;