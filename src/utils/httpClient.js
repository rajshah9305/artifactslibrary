/**
 * HTTP client wrapper with common functionality
 */

class HttpClient {
  constructor(baseUrl = '', defaultOptions = {}) {
    this.baseUrl = baseUrl;
    this.defaultOptions = {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000,
      ...defaultOptions
    };
  }
  
  async request(url, options = {}) {
    const fullUrl = this.baseUrl ? `${this.baseUrl}${url}` : url;
    const mergedOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(fullUrl, mergedOptions);
      
      if (!response.ok) {
        const error = new Error(`HTTP Error: ${response.status}`);
        error.status = response.status;
        error.statusText = response.statusText;
        try {
          error.data = await response.json();
        } catch (e) {
          error.data = await response.text();
        }
        throw error;
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }
  
  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }
  
  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
  
  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

export default HttpClient;