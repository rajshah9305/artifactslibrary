/**
 * JWT Authentication middleware
 */
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler.js';

export const generateToken = (payload, secret, options = {}) => {
  return jwt.sign(payload, secret, {
    expiresIn: '1d',
    ...options
  });
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

export const authenticate = (secret, options = {}) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(new ApiError(401, 'Authentication required'));
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(new ApiError(401, 'Invalid authentication format'));
    }
    
    const token = parts[1];
    
    try {
      const decoded = verifyToken(token, secret);
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }
    
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }
    
    next();
  };
};