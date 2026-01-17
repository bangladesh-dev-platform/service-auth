/**
 * Password Management Logic
 * Handles forgot and reset password flows
 */

document.addEventListener('DOMContentLoaded', () => {
    const forgotForm = document.getElementById('forgot-form');
    const resetForm = document.getElementById('reset-form');

    if (forgotForm) {
        initializeForgotPasswordPage();
    }

    if (resetForm) {
        initializeResetPasswordPage();
    }
});

function initializeForgotPasswordPage() {
    const form = document.getElementById('forgot-form');

    form.addEventListener('submit', handleForgotPassword);

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

async function handleForgotPassword(e) {
    e.preventDefault();

    FormValidator.clearAllErrors('forgot-form');
    UIHelper.hideMessage('error-message');
    UIHelper.hideMessage('success-message');

    const email = document.getElementById('email').value.trim();

    if (!email) {
        FormValidator.showError('email', i18n.t('validation.emailRequired'));
        UIHelper.shakeForm('forgot-form');
        return;
    }

    if (!FormValidator.validateEmail(email)) {
        FormValidator.showError('email', i18n.t('validation.emailInvalid'));
        UIHelper.shakeForm('forgot-form');
        return;
    }

    UIHelper.showLoading('forgot-btn');

    try {
        await apiClient.forgotPassword(email);

        UIHelper.showMessage('success-message', i18n.t('msg.resetLinkSent'), false);

        // Clear form
        document.getElementById('email').value = '';

    } catch (error) {
        console.error('Forgot password error:', error);
        UIHelper.showMessage('error-message', error.message, true);
        UIHelper.shakeForm('forgot-form');
    } finally {
        UIHelper.hideLoading('forgot-btn');
    }
}

function initializeResetPasswordPage() {
    const form = document.getElementById('reset-form');
    const passwordInput = document.getElementById('new-password');
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

    // Password strength indicator
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

    form.addEventListener('submit', handleResetPassword);

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

async function handleResetPassword(e) {
    e.preventDefault();

    FormValidator.clearAllErrors('reset-form');
    UIHelper.hideMessage('error-message');
    UIHelper.hideMessage('success-message');

    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        UIHelper.showMessage('error-message', i18n.t('error.invalidToken'), true);
        return;
    }

    let hasError = false;

    if (!newPassword) {
        FormValidator.showError('new-password', i18n.t('validation.passwordRequired'));
        hasError = true;
    } else {
        const passwordErrors = FormValidator.validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            FormValidator.showError('new-password', passwordErrors[0]);
            hasError = true;
        }
    }

    if (!confirmPassword) {
        FormValidator.showError('confirm-password', i18n.t('validation.passwordRequired'));
        hasError = true;
    } else if (newPassword !== confirmPassword) {
        FormValidator.showError('confirm-password', i18n.t('validation.passwordMismatch'));
        hasError = true;
    }

    if (hasError) {
        UIHelper.shakeForm('reset-form');
        return;
    }

    UIHelper.showLoading('reset-btn');

    try {
        await apiClient.resetPassword(token, newPassword);

        UIHelper.showMessage('success-message', i18n.t('msg.passwordReset'), false);

        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);

    } catch (error) {
        console.error('Reset password error:', error);
        UIHelper.showMessage('error-message', error.message, true);
        UIHelper.shakeForm('reset-form');
    } finally {
        UIHelper.hideLoading('reset-btn');
    }
}
