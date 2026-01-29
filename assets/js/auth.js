/**
 * Authentication Logic
 * Handles login and registration
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        initializeLoginPage();
    }

    if (registerForm) {
        initializeRegisterPage();
    }

    // Redirect if already logged in
        if (TokenManager.isLoggedIn() && !window.location.pathname.includes('dashboard')) {
        const redirectUrl = RedirectHandler.getRedirectUrl();
        if (redirectUrl && RedirectHandler.isValidRedirectUrl(redirectUrl)) {
            RedirectHandler.performRedirect(TokenManager.getAccessToken(), TokenManager.getRefreshToken());
        } else {
            window.location.href = '/dashboard.html';
        }
    }
});

function initializeLoginPage() {
    const form = document.getElementById('login-form');
    const togglePassword = document.getElementById('toggle-password');

    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }

    form.addEventListener('submit', handleLogin);

    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !FormValidator.validateEmail(email)) {
            FormValidator.showError('email', i18n.t('validation.emailInvalid'));
        } else {
            FormValidator.clearError('email');
        }
    });
}

async function handleLogin(e) {
    e.preventDefault();

    FormValidator.clearAllErrors('login-form');
    UIHelper.hideMessage('error-message');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    let hasError = false;

    if (!email) {
        FormValidator.showError('email', i18n.t('validation.emailRequired'));
        hasError = true;
    } else if (!FormValidator.validateEmail(email)) {
        FormValidator.showError('email', i18n.t('validation.emailInvalid'));
        hasError = true;
    }

    if (!password) {
        FormValidator.showError('password', i18n.t('validation.passwordRequired'));
        hasError = true;
    }

    if (hasError) {
        UIHelper.shakeForm('login-form');
        return;
    }

    UIHelper.showLoading('login-btn');

    try {
        const response = await apiClient.login(email, password);

        TokenManager.saveTokens(
            response.access_token,
            response.refresh_token,
            response.user
        );

        UIHelper.showMessage('success-message', i18n.t('msg.loginSuccess'), false);

        setTimeout(() => {
            RedirectHandler.performRedirect(response.access_token, response.refresh_token);
        }, 1000);

    } catch (error) {
        console.error('Login error:', error);
        UIHelper.showMessage('error-message', error.message, true);
        UIHelper.shakeForm('login-form');
    } finally {
        UIHelper.hideLoading('login-btn');
    }
}

function initializeRegisterPage() {
    const form = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');

    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
        });
    }

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strengthContainer = document.getElementById('password-strength');
        const strengthFill = strengthContainer.querySelector('.strength-fill');
        const strengthText = strengthContainer.querySelector('.strength-text');

        if (password.length > 0) {
            strengthContainer.style.display = 'block';
            const strength = FormValidator.getPasswordStrength(password);
            strengthFill.setAttribute('data-strength', strength);
            strengthText.textContent = i18n.t(`register.strength${strength.charAt(0).toUpperCase() + strength.slice(1)}`);
        } else {
            strengthContainer.style.display = 'none';
        }
    });

    form.addEventListener('submit', handleRegister);

    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !FormValidator.validateEmail(email)) {
            FormValidator.showError('email', i18n.t('validation.emailInvalid'));
        } else {
            FormValidator.clearError('email');
        }
    });

    confirmPasswordInput.addEventListener('blur', () => {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword && password !== confirmPassword) {
            FormValidator.showError('confirm-password', i18n.t('validation.passwordMismatch'));
        } else {
            FormValidator.clearError('confirm-password');
        }
    });
}

async function handleRegister(e) {
    e.preventDefault();

    FormValidator.clearAllErrors('register-form');
    UIHelper.hideMessage('error-message');
    UIHelper.hideMessage('success-message');

    const formData = {
        first_name: document.getElementById('first-name').value.trim(),
        last_name: document.getElementById('last-name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        password: document.getElementById('password').value,
        confirm_password: document.getElementById('confirm-password').value,
    };

    const termsAccepted = document.getElementById('accept-terms').checked;

    let hasError = false;

    if (!formData.email) {
        FormValidator.showError('email', i18n.t('validation.emailRequired'));
        hasError = true;
    } else if (!FormValidator.validateEmail(formData.email)) {
        FormValidator.showError('email', i18n.t('validation.emailInvalid'));
        hasError = true;
    }

    if (!formData.password) {
        FormValidator.showError('password', i18n.t('validation.passwordRequired'));
        hasError = true;
    } else {
        const passwordErrors = FormValidator.validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            FormValidator.showError('password', passwordErrors[0]);
            hasError = true;
        }
    }

    if (!formData.confirm_password) {
        FormValidator.showError('confirm-password', i18n.t('validation.passwordRequired'));
        hasError = true;
    } else if (formData.password !== formData.confirm_password) {
        FormValidator.showError('confirm-password', i18n.t('validation.passwordMismatch'));
        hasError = true;
    }

    if (!termsAccepted) {
        FormValidator.showError('accept-terms', i18n.t('validation.termsRequired'));
        hasError = true;
    }

    if (hasError) {
        UIHelper.shakeForm('register-form');
        return;
    }

    UIHelper.showLoading('register-btn');

    try {
        await apiClient.register({
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name || null,
            last_name: formData.last_name || null,
            phone: formData.phone || null,
        });

        const loginResponse = await apiClient.login(formData.email, formData.password);

        TokenManager.saveTokens(
            loginResponse.access_token,
            loginResponse.refresh_token,
            loginResponse.user
        );

        UIHelper.showMessage('success-message', i18n.t('msg.registerSuccess'), false);

        setTimeout(() => {
            RedirectHandler.performRedirect(loginResponse.access_token, loginResponse.refresh_token);
        }, 1500);

    } catch (error) {
        console.error('Registration error:', error);
        UIHelper.showMessage('error-message', error.message, true);
        UIHelper.shakeForm('register-form');
    } finally {
        UIHelper.hideLoading('register-btn');
    }
}
