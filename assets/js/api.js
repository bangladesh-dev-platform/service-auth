/**
 * API Client for Bangladesh Auth
 * Handles all communication with api.banglade.sh
 */

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL; // From config.js
  }

  /**
   * Login user
   */
  async login(email, password) {
    const response = await fetch(`${this.baseURL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error.message || i18n.t('error.invalidCredentials'));
    }

    return data.data;
  }

  /**
   * Register new user
   */
  async register(userData) {
    const response = await fetch(`${this.baseURL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!data.success) {
      if (data.error.details) {
        const firstError = Object.values(data.error.details)[0];
        throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
      }
      throw new Error(data.error.message || i18n.t('error.serverError'));
    }

    return data.data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(token) {
    const response = await fetch(`${this.baseURL}/api/v1/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error.message || i18n.t('error.serverError'));
    }

    return data.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(token, updates) {
    const response = await fetch(`${this.baseURL}/api/v1/users/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error.message || i18n.t('error.serverError'));
    }

    return data.data;
  }

  /**
   * Request password reset
   * TODO: Implement this endpoint in backend
   */
  async forgotPassword(email) {
    // Placeholder for when backend endpoint is ready
    console.warn('Forgot password endpoint not yet implemented in backend');

    // Simulate API call for demonstration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: i18n.t('msg.resetLinkSent') });
      }, 1000);
    });

    /* When backend is ready:
    const response = await fetch(`${this.baseURL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error.message || i18n.t('error.serverError'));
    }

    return data.data;
    */
  }

  /**
   * Reset password with token
   * TODO: Implement this endpoint in backend
   */
  async resetPassword(token, newPassword) {
    // Placeholder for when backend endpoint is ready
    console.warn('Reset password endpoint not yet implemented in backend');

    // Simulate API call for demonstration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: i18n.t('msg.passwordReset') });
      }, 1000);
    });

    /* When backend is ready:
    const response = await fetch(`${this.baseURL}/api/v1/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: newPassword })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error.message || i18n.t('error.invalidToken'));
    }

    return data.data;
    */
  }
}

// Export singleton instance
const apiClient = new ApiClient();
