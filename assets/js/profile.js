/**
 * Profile Management Logic
 * Handles change password, edit profile, and email verification
 */

document.addEventListener('DOMContentLoaded', () => {
    const changePasswordForm = document.getElementById('change-password-form');
    const editProfileForm = document.getElementById('edit-profile-form');
    const resendBtn = document.getElementById('resend-btn');

    if (changePasswordForm) {
        initializeChangePasswordPage();
    }

    if (editProfileForm) {
        initializeEditProfilePage();
    }

    if (resendBtn) {
        initializeEmailVerificationPage();
    }
});

// ============================================
// CHANGE PASSWORD
// ============================================

function initializeChangePasswordPage() {
    // Check if logged in
    if (!TokenManager.isLoggedIn()) {
        window.location.href = '/index.html';
        return;
    }

    const form = document.getElementById('change-password-form');
    const currentPwdInput = document.getElementById('current-password');
    const newPwdInput = document.getElementById('new-password');
    const confirmPwdInput = document.getElementById('confirm-password');

    // Password toggles
    setupPasswordToggles(['toggle-current-password', 'toggle-new-password', 'toggle-confirm-password']);

    // Password strength indicator
    newPwdInput.addEventListener('input', () => {
        const password = newPwdInput.value;
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

    confirmPwdInput.addEventListener('blur', () => {
        const newPwd = newPwdInput.value;
        const confirmPwd = confirmPwdInput.value;

        if (confirmPwd && newPwd !== confirmPwd) {
            FormValidator.showError('confirm-password', i18n.t('validation.passwordMismatch'));
        } else {
            FormValidator.clearError('confirm-password');
        }
    });

    form.addEventListener('submit', handleChangePassword);
}

async function handleChangePassword(e) {
    e.preventDefault();

    FormValidator.clearAllErrors('change-password-form');
    UIHelper.hideMessage('error-message');
    UIHelper.hideMessage('success-message');

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    let hasError = false;

    if (!currentPassword) {
        FormValidator.showError('current-password', i18n.t('validation.passwordRequired'));
        hasError = true;
    }

    if (!newPassword) {
        FormValidator.showError('new-password', i18n.t('validation.passwordRequired'));
        hasError = true;
    } else {
        const pwdErrors = FormValidator.validatePassword(newPassword);
        if (pwdErrors.length > 0) {
            FormValidator.showError('new-password', pwdErrors[0]);
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
        UIHelper.shakeForm('change-password-form');
        return;
    }

    UIHelper.showLoading('change-password-btn');

    try {
        await TokenManager.withFreshToken((accessToken) =>
            apiClient.changePassword(accessToken, {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            })
        );

        UIHelper.showMessage('success-message', i18n.t('msg.passwordChanged'), false);

        setTimeout(async () => {
            await TokenManager.logout();
            window.location.href = '/index.html';
        }, 1500);

    } catch (error) {
        console.error('Change password error:', error);
        UIHelper.showMessage('error-message', error.message, true);
        UIHelper.shakeForm('change-password-form');
    } finally {
        UIHelper.hideLoading('change-password-btn');
    }
}

// ============================================
// EDIT PROFILE
// ============================================

function initializeEditProfilePage() {
    // Check if logged in
    if (!TokenManager.isLoggedIn()) {
        window.location.href = '/index.html';
        return;
    }

    const form = document.getElementById('edit-profile-form');

    // Load current user data
    loadUserDataIntoForm();

    form.addEventListener('submit', handleEditProfile);
}

async function loadUserDataIntoForm() {
    const user = TokenManager.getUser();

    if (user) {
        document.getElementById('first-name').value = user.first_name || '';
        document.getElementById('last-name').value = user.last_name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
    }

    // Also fetch fresh data
    try {
        const freshUser = await TokenManager.withFreshToken((accessToken) =>
            apiClient.getCurrentUser(accessToken)
        );

        TokenManager.saveTokens(
            TokenManager.getAccessToken(),
            TokenManager.getRefreshToken(),
            freshUser
        );

        document.getElementById('first-name').value = freshUser.first_name || '';
        document.getElementById('last-name').value = freshUser.last_name || '';
        document.getElementById('email').value = freshUser.email || '';
        document.getElementById('phone').value = freshUser.phone || '';
    } catch (error) {
        console.error('Error loading user data:', error);
        if (error.status === 401) {
            await TokenManager.logout();
            window.location.href = '/index.html';
            return;
        }
    }
}

async function handleEditProfile(e) {
    e.preventDefault();

    FormValidator.clearAllErrors('edit-profile-form');
    UIHelper.hideMessage('error-message');
    UIHelper.hideMessage('success-message');

    const updates = {
        first_name: document.getElementById('first-name').value.trim(),
        last_name: document.getElementById('last-name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
    };

    UIHelper.showLoading('save-profile-btn');

    try {
        const updatedUser = await TokenManager.withFreshToken((accessToken) =>
            apiClient.updateProfile(accessToken, updates)
        );

        // Update local storage
        TokenManager.saveTokens(
            TokenManager.getAccessToken(),
            TokenManager.getRefreshToken(),
            updatedUser
        );

        UIHelper.showMessage('success-message', i18n.t('msg.profileUpdated'), false);

        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 2000);

    } catch (error) {
        console.error('Update profile error:', error);
        if (error.status === 401) {
            await TokenManager.logout();
            window.location.href = '/index.html';
            return;
        }
        UIHelper.showMessage('error-message', error.message, true);
        UIHelper.shakeForm('edit-profile-form');
    } finally {
        UIHelper.hideLoading('save-profile-btn');
    }
}

// ============================================
// EMAIL VERIFICATION
// ============================================

function initializeEmailVerificationPage() {
    // Display user email
    const user = TokenManager.getUser();
    const emailDisplay = document.getElementById('user-email-display');
    if (emailDisplay && user) {
        emailDisplay.textContent = user.email;
    }

    const resendBtn = document.getElementById('resend-btn');
    if (resendBtn) {
        resendBtn.addEventListener('click', handleResendVerification);
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
        verifyEmailToken(token);
    }
}

async function handleResendVerification(e) {
    e.preventDefault();

    UIHelper.hideMessage('error-message');
    UIHelper.hideMessage('success-message');
    UIHelper.showLoading('resend-btn');

    try {
        await TokenManager.withFreshToken((accessToken) =>
            apiClient.resendVerification(accessToken)
        );

        UIHelper.showMessage('success-message', i18n.t('msg.verificationResent'), false);

    } catch (error) {
        console.error('Resend verification error:', error);
        UIHelper.showMessage('error-message', error.message, true);
    } finally {
        UIHelper.hideLoading('resend-btn');
    }
}

async function verifyEmailToken(token) {
    UIHelper.hideMessage('error-message');
    UIHelper.hideMessage('success-message');

    try {
        await apiClient.verifyEmail(token);
        UIHelper.showMessage('success-message', i18n.t('msg.emailVerified'), false);
    } catch (error) {
        console.error('Email verification error:', error);
        UIHelper.showMessage('error-message', error.message || i18n.t('error.verificationInvalid'), true);
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function setupPasswordToggles(toggleIds) {
    toggleIds.forEach((id, index) => {
        const toggle = document.getElementById(id);
        if (!toggle) return;

        const inputId = id.replace('toggle-', '');
        const input = document.getElementById(inputId);

        if (input) {
            toggle.addEventListener('click', () => {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
            });
        }
    });
}
