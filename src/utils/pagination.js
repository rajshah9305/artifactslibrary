/**
 * Pagination utility for APIs
 */

/**
 * Create pagination parameters from request query
 * @param {Object} query - Request query parameters
 * @param {Object} options - Pagination options
 * @returns {Object} - Pagination parameters
 */
export const getPaginationParams = (query, options = {}) => {
  const {
    defaultPage = 1,
    defaultLimit = 20,
    maxLimit = 100
  } = options;
  
  let page = parseInt(query.page, 10);
  if (isNaN(page) || page < 1) {
    page = defaultPage;
  }
  
  let limit = parseInt(query.limit, 10);
  if (isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  }
  
  // Ensure limit doesn't exceed maximum
  limit = Math.min(limit, maxLimit);
  
  const offset = (page - 1) * limit;
  
  return {
    page,
    limit,
    offset
  };
};

/**
 * Create pagination metadata for response
 * @param {Object} params - Pagination parameters
 * @param {number} totalItems - Total number of items
 * @param {string} baseUrl - Base URL for pagination links
 * @returns {Object} - Pagination metadata
 */
export const createPaginationMeta = (params, totalItems, baseUrl = '') => {
  const { page, limit, offset } = params;
  
  const totalPages = Math.ceil(totalItems / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  // Create pagination links
  const links = {};
  
  if (baseUrl) {
    // Current page
    links.self = `${baseUrl}?page=${page}&limit=${limit}`;
    
    // First page
    links.first = `${baseUrl}?page=1&limit=${limit}`;
    
    // Last page
    links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;
    
    // Next page
    if (hasNext) {
      links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
    }
    
    // Previous page
    if (hasPrev) {
      links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
    }
  }
  
  return {
    currentPage: page,
    itemsPerPage: limit,
    totalItems,
    totalPages,
    hasNext,
    hasPrev,
    links
  };
};

/**
 * Create a paginated response
 * @param {Array} items - The items for the current page
 * @param {Object} meta - Pagination metadata
 * @returns {Object} - Paginated response
 */
export const paginatedResponse = (items, meta) => {
  return {
    data: items,
    pagination: meta
  };
};