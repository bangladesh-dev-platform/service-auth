/**
 * Utility functions for Bangladesh Auth
 */

/**
 * Token Manager
 */
const TOKEN_EXPIRY_GRACE_SECONDS = 30;

class TokenManager {
    static saveTokens(accessToken, refreshToken, user) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
    }

    static getAccessToken() {
        return localStorage.getItem('access_token');
    }

    static getRefreshToken() {
        return localStorage.getItem('refresh_token');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static clearTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }

    static async refreshSession() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error(i18n.t('error.sessionExpired'));
        }

        const data = await apiClient.refreshToken(refreshToken);
        this.saveTokens(data.access_token, data.refresh_token, data.user);
        return data;
    }

    static async logout() {
        const refreshToken = this.getRefreshToken();
        try {
            if (refreshToken) {
                await apiClient.logout(refreshToken);
            }
        } catch (error) {
            console.warn('Logout request failed:', error);
        } finally {
            this.clearTokens();
        }
    }

    static async withFreshToken(callback) {
        const execute = async () => await Promise.resolve(callback(this.getAccessToken()));

        try {
            return await execute();
        } catch (error) {
            if (error.status === 401 && this.getRefreshToken()) {
                try {
                    await this.refreshSession();
                } catch (refreshError) {
                    await this.logout();
                    throw refreshError;
                }
                return await execute();
            }
            throw error;
        }
    }

    static isLoggedIn() {
        const token = this.getAccessToken();
        return Boolean(token && !this.isTokenExpired(token));
    }

    static decodeTokenPayload(token) {
        try {
            const parts = token.split('.');
            if (parts.length < 2) {
                return null;
            }
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)) % 4, '=');
            const json = atob(padded);
            return JSON.parse(json);
        } catch (error) {
            console.warn('Unable to decode token payload', error);
            return null;
        }
    }

    static isTokenExpired(token) {
        const payload = this.decodeTokenPayload(token);
        if (!payload || !payload.exp) {
            return false;
        }

        const now = Math.floor(Date.now() / 1000);
        return payload.exp <= now + TOKEN_EXPIRY_GRACE_SECONDS;
    }

    static async ensureValidSession() {
        const token = this.getAccessToken();
        if (!token) {
            this.clearTokens();
            return false;
        }

        if (!this.isTokenExpired(token)) {
            return true;
        }

        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            this.clearTokens();
            return false;
        }

        try {
            await this.refreshSession();
            return true;
        } catch (error) {
            console.warn('Failed to refresh session', error);
            await this.logout();
            return false;
        }
    }
}

/**
 * Redirect Handler
 */
class RedirectHandler {
    static getRedirectUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('redirect_url') || params.get('redirect');
    }

    static isValidRedirectUrl(url) {
        if (!url) return false;

        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname + (urlObj.port ? ':' + urlObj.port : '');

            return ALLOWED_REDIRECT_DOMAINS.some(domain =>
                hostname === domain || hostname.endsWith('.' + domain)
            );
        } catch (e) {
            return false;
        }
    }

    static performRedirect(accessToken, refreshToken) {
        const redirectUrl = this.getRedirectUrl();

        if (redirectUrl && this.isValidRedirectUrl(redirectUrl)) {
            const url = new URL(redirectUrl, window.location.origin);
            url.searchParams.set('token', accessToken);
            if (refreshToken) {
                url.searchParams.set('refresh_token', refreshToken);
            } else {
                url.searchParams.delete('refresh_token');
            }
            window.location.href = url.toString();
        } else {
            // No valid redirect URL, go to dashboard
            window.location.href = '/dashboard.html';
        }
    }
}

/**
 * Form Validator
 */
class FormValidator {
    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validatePassword(password) {
        const errors = [];

        if (password.length < 8) {
            errors.push(i18n.t('validation.passwordMin'));
        }
        if (!/[A-Z]/.test(password)) {
            errors.push(i18n.t('validation.passwordUppercase'));
        }
        if (!/[a-z]/.test(password)) {
            errors.push(i18n.t('validation.passwordLowercase'));
        }
        if (!/[0-9]/.test(password)) {
            errors.push(i18n.t('validation.passwordNumber'));
        }

        return errors;
    }

    static getPasswordStrength(password) {
        let strength = 0;

        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return 'weak';
        if (strength <= 4) return 'medium';
        return 'strong';
    }

    static showError(fieldId, message) {
        const errorEl = document.getElementById(`${fieldId}-error`);
        const inputEl = document.getElementById(fieldId);

        if (errorEl) errorEl.textContent = message;
        if (inputEl) inputEl.classList.add('error');
    }

    static clearError(fieldId) {
        const errorEl = document.getElementById(`${fieldId}-error`);
        const inputEl = document.getElementById(fieldId);

        if (errorEl) errorEl.textContent = '';
        if (inputEl) inputEl.classList.remove('error');
    }

    static clearAllErrors(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        form.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
    }
}

/**
 * UI Helper
 */
class UIHelper {
    static showLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        button.disabled = true;
        const text = button.querySelector('.btn-text');
        const spinner = button.querySelector('.btn-spinner');

        if (text) text.style.display = 'none';
        if (spinner) spinner.style.display = 'flex';
    }

    static hideLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        button.disabled = false;
        const text = button.querySelector('.btn-text');
        const spinner = button.querySelector('.btn-spinner');

        if (text) text.style.display = 'inline';
        if (spinner) spinner.style.display = 'none';
    }

    static showMessage(elementId, message, isError = true) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.textContent = message;
        element.style.display = 'block';

        if (!isError) {
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    static hideMessage(elementId) {
        const element = document.getElementById(elementId);
        if (element) element.style.display = 'none';
    }

    static shakeForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
    }
}

/**
 * Format date for display
 */
function formatDate(dateInput) {
    let date;

    if (!dateInput) {
        return '-';
    }

    if (dateInput instanceof Date) {
        date = dateInput;
    } else if (typeof dateInput === 'string') {
        let normalized = dateInput.trim();
        if (!normalized.includes('T')) {
            normalized = normalized.replace(' ', 'T');
        }
        if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(normalized)) {
            normalized += 'Z';
        }
        date = new Date(normalized);
    } else {
        date = new Date(dateInput);
    }

    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Less than 1 hour
    if (diff < 60000) {
        return i18n.currentLanguage === 'bn' ? 'এইমাত্র' : 'just now';
    }

    if (diff < 3600000) {
        const minutes = Math.max(1, Math.floor(diff / 60000));
        return `${minutes} ${i18n.currentLanguage === 'bn' ? 'মিনিট আগে' : 'minutes ago'}`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} ${i18n.currentLanguage === 'bn' ? 'ঘন্টা আগে' : 'hours ago'}`;
    }

    // Less than 7 days
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} ${i18n.currentLanguage === 'bn' ? 'দিন আগে' : 'days ago'}`;
    }

    // Format as date
    return date.toLocaleDateString(i18n.currentLanguage === 'bn' ? 'bn-BD' : 'en-US');
}
