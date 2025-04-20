/**
 * Utility for retrying failed operations
 */

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.initialDelay - Initial delay in milliseconds
 * @param {number} options.maxDelay - Maximum delay in milliseconds
 * @param {Function} options.shouldRetry - Function to determine if retry should occur
 * @returns {Promise<any>} - Promise that resolves with the function result
 */
export const retry = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    shouldRetry = (error) => true
  } = options;
  
  let retries = 0;
  let delay = initialDelay;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      if (retries > maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      // Calculate exponential backoff with jitter
      const jitter = Math.random() * 0.3 + 0.85; // Random value between 0.85 and 1.15
      delay = Math.min(delay * 2 * jitter, maxDelay);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Create a retryable version of a function
 * @param {Function} fn - The function to make retryable
 * @param {Object} options - Retry options
 * @returns {Function} - The retryable function
 */
export const retryable = (fn, options = {}) => {
  return (...args) => retry(() => fn(...args), options);
};