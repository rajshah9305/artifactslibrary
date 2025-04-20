/**
 * Database connection helper
 */
import { Pool } from 'pg';

class Database {
  constructor(config) {
    this.config = config;
    this.pool = null;
    this.isConnected = false;
  }
  
  async connect() {
    if (this.pool) {
      return this.pool;
    }
    
    try {
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.name,
        user: this.config.user,
        password: this.config.password,
        min: this.config.pool?.min || 2,
        max: this.config.pool?.max || 10,
        idleTimeoutMillis: 30000
      });
      
      // Test the connection
      const client = await this.pool.connect();
      client.release();
      
      this.isConnected = true;
      console.log('Database connection established successfully');
      
      // Handle pool errors
      this.pool.on('error', (err) => {
        console.error('Unexpected database error:', err);
        this.isConnected = false;
      });
      
      return this.pool;
    } catch (error) {
      console.error('Failed to connect to database:', error);
      this.isConnected = false;
      throw error;
    }
  }
  
  async query(text, params = []) {
    if (!this.pool) {
      await this.connect();
    }
    
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
  
  async transaction(callback) {
    if (!this.pool) {
      await this.connect();
    }
    
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      console.log('Database connection closed');
    }
  }
}

export default Database;