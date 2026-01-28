/**
 * API Client for Bangladesh Auth
 * Handles all communication with api.banglade.sh
 */

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL; // From config.js
  }

  async login(email, password) {
    return this._request('/api/v1/auth/login', {
      method: 'POST',
      body: { email, password },
      fallbackKey: 'error.invalidCredentials'
    });
  }

  async register(userData) {
    return this._request('/api/v1/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  async getCurrentUser(token) {
    return this._request('/api/v1/users/me', {
      method: 'GET',
      token
    });
  }

  async updateProfile(token, updates) {
    return this._request('/api/v1/users/me', {
      method: 'PUT',
      token,
      body: updates
    });
  }

  async forgotPassword(email) {
    return this._request('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: { email }
    });
  }

  async resetPassword(token, newPassword, confirmPassword = null) {
    return this._request('/api/v1/auth/reset-password', {
      method: 'POST',
      body: {
        token,
        password: newPassword,
        confirm_password: confirmPassword ?? newPassword
      },
      fallbackKey: 'error.invalidToken'
    });
  }

  async refreshToken(refreshToken) {
    return this._request('/api/v1/auth/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken },
      fallbackKey: 'error.sessionExpired'
    });
  }

  async logout(refreshToken) {
    return this._request('/api/v1/auth/logout', {
      method: 'POST',
      body: { refresh_token: refreshToken }
    });
  }

  async _request(path, { method = 'GET', token = null, body = null, fallbackKey = 'error.serverError' } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetch(`${this.baseURL}${path}`, options);
    } catch (networkError) {
      const error = new Error(i18n.t('error.networkError'));
      error.cause = networkError;
      throw error;
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch (parseError) {
      payload = null;
    }

    if (!payload || !payload.success) {
      let message = payload?.error?.message || i18n.t(fallbackKey);
      const details = payload?.error?.details;
      if (details) {
        const firstDetail = Array.isArray(details)
          ? details[0]
          : Object.values(details)[0];
        if (Array.isArray(firstDetail) && firstDetail.length > 0) {
          message = firstDetail[0];
        } else if (typeof firstDetail === 'string') {
          message = firstDetail;
        }
      }
      const error = new Error(message);
      error.status = response?.status ?? 500;
      error.code = payload?.error?.code;
      error.details = payload?.error?.details;
      throw error;
    }

    return payload.data;
  }
}

const apiClient = new ApiClient();
