// Central API client abstraction for future REST integration

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Step 11 — friendly, user-facing messages for common HTTP failure modes.
// These surface through the useApi/useApiData error state in the UI.
const STATUS_MESSAGES = {
  400: 'Invalid request. Please review the submitted data and try again.',
  401: 'Your session has expired or is invalid. Please sign in again.',
  403: 'Access denied. Your clearance level does not permit this action.',
  404: 'The requested resource was not found in the vault.',
  409: 'The request conflicts with the current state. Refresh and try again.',
  500: 'The vault server encountered an internal error. Please try again later.',
  502: 'The vault server is unreachable. Please try again shortly.',
  503: 'The vault service is temporarily unavailable. Please try again shortly.'
};


/**
 * Builds a URL with query params from a plain object.
 * Keys with undefined / null values are omitted.
 */
function buildUrl(endpoint, params) {
  if (!params) return endpoint;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `${endpoint}?${qs}` : endpoint;
}

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getHeaders() {
    const token = localStorage.getItem('vault_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders();

    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Session expired/invalid — clear token so protected routes redirect to login
          localStorage.removeItem('vault_token');
          localStorage.removeItem('vault_user');
        }
        const errorData = await response.json().catch(() => ({}));
        const friendly = STATUS_MESSAGES[response.status];
        throw new Error(errorData.message || friendly || `Request failed (HTTP ${response.status}).`);
      }

      // Handle empty bodies (e.g. 204 No Content from DELETE)
      if (response.status === 204) return null;

      return await response.json();
    } catch (error) {
      // Network failure — fetch rejects with TypeError before any HTTP status exists
      if (error instanceof TypeError) {
        console.warn(`[API Network Error: ${endpoint}]`, error.message);
        throw new Error('Network error. Unable to reach the vault server. Check your connection and try again.');
      }
      console.warn(`[API Error: ${endpoint}]`, error.message);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    const url = buildUrl(endpoint, options.params);
    return this.request(url, { ...options, method: 'GET' });
  }

  post(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  put(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  patch(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);

