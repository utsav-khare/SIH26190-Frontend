import { MOCK_USER, APP_CONFIG } from '../utils/constants';

export const authService = {
  async login(email, password) {
    // Simulated auth check with fallback to demo credentials
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (
      email.toLowerCase() === APP_CONFIG.demoCredentials.email.toLowerCase() &&
      password === APP_CONFIG.demoCredentials.password
    ) {
      const user = { ...MOCK_USER, email };
      const token = 'mock-jwt-token-sih26190-vault-session';
      localStorage.setItem('vault_token', token);
      localStorage.setItem('vault_user', JSON.stringify(user));
      return { success: true, user, token };
    }

    throw new Error('Invalid clearance credentials. Access denied.');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('vault_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('vault_token');
  },

  logout() {
    localStorage.removeItem('vault_token');
    localStorage.removeItem('vault_user');
  }
};

