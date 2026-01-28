/**
 * Dashboard Logic
 * Handles user dashboard display and interactions
 */

let dashboardResendBound = false;

document.addEventListener('DOMContentLoaded', () => {
    if (!TokenManager.isLoggedIn()) {
        window.location.href = '/index.html';
        return;
    }

    initializeDashboard();
});

async function initializeDashboard() {
    const user = TokenManager.getUser();

    // Display user info
    if (user) {
        displayUserInfo(user);
        updateVerificationStatus(user);
    }

    // Fetch fresh user data
    try {
        const freshUser = await TokenManager.withFreshToken((accessToken) =>
            apiClient.getCurrentUser(accessToken)
        );

        TokenManager.saveTokens(
            TokenManager.getAccessToken(),
            TokenManager.getRefreshToken(),
            freshUser
        );
        displayUserInfo(freshUser);
        updateVerificationStatus(freshUser);
    } catch (error) {
        console.error('Error fetching user:', error);
        // Token might be invalid, redirect to login
        await TokenManager.logout();
        UIHelper.showMessage('error-message', i18n.t('error.sessionExpired'), true);
        setTimeout(() => window.location.href = '/index.html', 1500);
        return;
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Setup edit profile button
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            window.location.href = '/edit-profile.html';
        });
    }
}

function displayUserInfo(user) {
    // Welcome message
    const welcomeEl = document.getElementById('welcome-text');
    if (welcomeEl) {
        const name = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email;
        welcomeEl.textContent = `${i18n.t('dashboard.welcome')}, ${name}!`;
    }

    // Profile card
    document.getElementById('user-email').textContent = user.email || '-';
    document.getElementById('user-phone').textContent = user.phone || '-';
    document.getElementById('user-joined').textContent = formatDate(user.created_at);

    // Activity log (mock data for now)
    displayRecentActivity();
}

function displayRecentActivity() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;

    // Mock activity data
    const activities = [
        {
            action: i18n.currentLanguage === 'bn' ? 'Chrome থেকে লগইন হয়েছে' : 'Logged in from Chrome',
            time: new Date(Date.now() - 2 * 3600000) // 2 hours ago
        },
        {
            action: i18n.currentLanguage === 'bn' ? 'প্রোফাইল আপডেট করা হয়েছে' : 'Updated profile',
            time: new Date(Date.now() - 86400000) // 1 day ago
        }
    ];

    activityList.innerHTML = activities.map(activity => `
    <div class="activity-item">
      <div class="activity-icon">•</div>
      <div class="activity-content">
        <div class="activity-action">${activity.action}</div>
        <div class="activity-time">${formatDate(activity.time)}</div>
      </div>
    </div>
  `).join('');
}

function updateVerificationStatus(user) {
    const statusText = document.getElementById('verification-status-text');
    const hint = document.getElementById('verification-hint');
    const resendBtn = document.getElementById('resend-verification-btn');

    if (!statusText || !hint || !resendBtn) {
        return;
    }

    UIHelper.hideMessage('status-message');

    if (user.email_verified) {
        statusText.textContent = i18n.t('dashboard.statusVerified');
        hint.textContent = i18n.t('dashboard.statusVerifiedDesc');
        resendBtn.style.display = 'none';
        resendBtn.disabled = false;
    } else {
        statusText.textContent = i18n.t('dashboard.statusUnverified');
        hint.textContent = i18n.t('dashboard.statusUnverifiedDesc');
        resendBtn.style.display = 'inline-flex';
        resendBtn.disabled = false;

        if (!dashboardResendBound) {
            resendBtn.addEventListener('click', handleDashboardResendVerification);
            dashboardResendBound = true;
        }
    }
}

async function handleDashboardResendVerification(e) {
    e.preventDefault();

    UIHelper.hideMessage('status-message');
    UIHelper.showLoading('resend-verification-btn');

    try {
        await TokenManager.withFreshToken((accessToken) =>
            apiClient.resendVerification(accessToken)
        );

        UIHelper.showMessage('status-message', i18n.t('msg.verificationResent'), false);
    } catch (error) {
        console.error('Resend verification error:', error);
        if (error.status === 401) {
            await TokenManager.logout();
            window.location.href = '/index.html';
            return;
        }
        UIHelper.showMessage('status-message', error.message || i18n.t('error.serverError'), true);
    } finally {
        UIHelper.hideLoading('resend-verification-btn');
    }
}

async function handleLogout(e) {
    e.preventDefault();

    if (confirm(i18n.currentLanguage === 'bn' ? 'আপনি কি লগআউট করতে চান?' : 'Are you sure you want to logout?')) {
        await TokenManager.logout();
        window.location.href = '/index.html';
    }
}
