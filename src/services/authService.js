import { MOCK_USER, APP_CONFIG } from '../utils/constants';
import { api } from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Authentication service — handles login, logout, session checks.
 *
 * When VITE_USE_MOCK=true (default), login validates against demo
 * credentials and stores a mock token in localStorage.
 *
 * When VITE_USE_MOCK=false, login/verify calls are sent to the backend
 * via the centralized api client. Endpoints marked PENDING are not yet
 * available from the backend team and will throw until implemented.
 */
export const authService = {
  /**
   * Authenticate a user.
   * Mock: validates against APP_CONFIG.demoCredentials.
   * Real:  POST /api/auth/login  -> { user, token }
   */
  async login(email, password) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Step 13 — multi-role demo accounts so the RBAC permission workflow
      // can be exercised end-to-end (Officer/Attorney/Admin). The password is
      // identical for all demo users; attorney@firm.com keeps the original
      // Officer mapping for backward compatibility.
      const demoAccounts = [
        { email: 'admin@firm.com', name: 'Vault Administrator', role: 'Admin' },
        { email: 'officer@firm.com', name: 'Officer', role: 'Officer' },
        { email: 'attorney@firm.com', name: 'Officer', role: 'Officer' },
        { email: 'advocate@firm.com', name: 'Advocate', role: 'Attorney' }
      ];
      const account = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

      if (account && password === APP_CONFIG.demoCredentials.password) {
        const user = { ...MOCK_USER, ...account };
        const token = 'mock-jwt-token-sih26190-vault-session';
        localStorage.setItem('vault_token', token);
        localStorage.setItem('vault_user', JSON.stringify(user));
        return { success: true, user, token };
      }

      throw new Error('Invalid clearance credentials. Access denied.');
    }

    // Real API call — endpoint ready for backend integration
    const result = await api.post('/auth/login', { email, password });
    localStorage.setItem('vault_token', result.token);
    localStorage.setItem('vault_user', JSON.stringify(result.user));
    return result;
  },

  /**
   * Fetch the currently logged-in user from localStorage.
   * Real equivalent: GET /api/auth/me  [PENDING — backend endpoint not yet available]
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('vault_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check whether a session token exists.
   */
  isAuthenticated() {
    return !!localStorage.getItem('vault_token');
  },

  /**
   * Log out — clears stored token and user.
   * Real equivalent: POST /api/auth/logout  [PENDING — backend endpoint not yet available]
   */
  logout() {
    localStorage.removeItem('vault_token');
    localStorage.removeItem('vault_user');
  }
};

