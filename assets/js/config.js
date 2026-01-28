/**
 * Configuration for Bangladesh Auth
 * Contains all translations and app settings
 */

// API Configuration
const API_BASE_URL = 'https://api.banglade.sh';
// For development: const API_BASE_URL = 'http://localhost:8080';

// Allowed redirect domains (whitelist for SSO)
const ALLOWED_REDIRECT_DOMAINS = [
    'posts.banglade.sh',
    'files.banglade.sh',
    'comments.banglade.sh',
    'media.banglade.sh',
    'localhost:3000',
    'localhost:3001',
    'localhost:8080',
];

// Language translations
const translations = {
    en: {
        // Common
        'app.name': 'Bangladesh Digital Auth',
        'common.language': 'Language',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',

        // Login page
        'login.welcome': 'Welcome Back',
        'login.subtitle': 'Sign in to continue to your account',
        'login.email': 'Email Address',
        'login.emailPlaceholder': 'you@example.com',
        'login.password': 'Password',
        'login.passwordPlaceholder': 'Enter your password',
        'login.remember': 'Remember me',
        'login.forgot': 'Forgot password?',
        'login.button': 'Sign In',
        'login.noAccount': "Don't have an account?",
        'login.register': 'Create one',

        // Register page
        'register.title': 'Create Your Account',
        'register.subtitle': 'Join the Bangladesh digital ecosystem',
        'register.firstName': 'First Name',
        'register.firstNamePlaceholder': 'John',
        'register.lastName': 'Last Name',
        'register.lastNamePlaceholder': 'Doe',
        'register.email': 'Email Address',
        'register.emailPlaceholder': 'you@example.com',
        'register.phone': 'Phone Number (Optional)',
        'register.phonePlaceholder': '+880 1XXX-XXXXXX',
        'register.password': 'Password',
        'register.passwordPlaceholder': 'Create a strong password',
        'register.confirmPassword': 'Confirm Password',
        'register.confirmPasswordPlaceholder': 'Re-enter your password',
        'register.terms': 'I agree to the',
        'register.termsLink': 'Terms of Service',
        'register.and': 'and',
        'register.privacyLink': 'Privacy Policy',
        'register.button': 'Create Account',
        'register.hasAccount': 'Already have an account?',
        'register.signin': 'Sign in',
        'register.strengthWeak': 'Weak',
        'register.strengthMedium': 'Medium',
        'register.strengthStrong': 'Strong',

        // Forgot password
        'forgot.title': 'Forgot Password?',
        'forgot.subtitle': "Enter your email and we'll send you a reset link",
        'forgot.email': 'Email Address',
        'forgot.emailPlaceholder': 'you@example.com',
        'forgot.button': 'Send Reset Link',
        'forgot.back': 'Back to Sign In',

        // Reset password
        'reset.title': 'Reset Password',
        'reset.subtitle': 'Create a new password for your account',
        'reset.newPassword': 'New Password',
        'reset.newPasswordPlaceholder': 'Enter new password',
        'reset.confirmPassword': 'Confirm New Password',
        'reset.confirmPasswordPlaceholder': 'Re-enter new password',
        'reset.button': 'Reset Password',
        'reset.back': 'Back to Sign In',

        // Dashboard
        'dashboard.welcome': 'Welcome',
        'dashboard.profile': 'Profile',
        'dashboard.settings': 'Settings',
        'dashboard.logout': 'Logout',
        'dashboard.edit': 'Edit Profile',
        'dashboard.activity': 'Recent Activity',
        'dashboard.email': 'Email',
        'dashboard.phone': 'Phone',
        'dashboard.joined': 'Joined',
        'dashboard.language': 'Language',
        'dashboard.changePassword': 'Change Password',
        'dashboard.sessions': 'Active Sessions',

        // Change Password
        'changePassword.title': 'Change Password',
        'changePassword.subtitle': 'Update your account password',
        'changePassword.currentPassword': 'Current Password',
        'changePassword.currentPasswordPlaceholder': 'Enter current password',
        'changePassword.newPassword': 'New Password',
        'changePassword.newPasswordPlaceholder': 'Enter new password',
        'changePassword.confirmPassword': 'Confirm New Password',
        'changePassword.confirmPasswordPlaceholder': 'Re-enter new password',
        'changePassword.button': 'Change Password',
        'changePassword.back': 'Back to Dashboard',

        // Edit Profile
        'editProfile.title': 'Edit Profile',
        'editProfile.subtitle': 'Update your personal information',
        'editProfile.firstName': 'First Name',
        'editProfile.firstNamePlaceholder': 'John',
        'editProfile.lastName': 'Last Name',
        'editProfile.lastNamePlaceholder': 'Doe',
        'editProfile.email': 'Email Address',
        'editProfile.emailPlaceholder': 'you@example.com',
        'editProfile.emailReadonly': 'Email cannot be changed',
        'editProfile.phone': 'Phone Number',
        'editProfile.phonePlaceholder': '+880 1XXX-XXXXXX',
        'editProfile.button': 'Save Changes',
        'editProfile.back': 'Back to Dashboard',

        // Email Verification
        'emailVerify.title': 'Verify Your Email',
        'emailVerify.subtitle': 'Check your inbox for the verification link',
        'emailVerify.message': "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.",
        'emailVerify.didntReceive': "Didn't receive the email?",
        'emailVerify.resend': 'Resend Verification Email',
        'emailVerify.backDashboard': 'Back to Dashboard',
        'emailVerify.backLogin': 'Back to Login',

        // Validation messages
        'validation.emailRequired': 'Email is required',
        'validation.emailInvalid': 'Please enter a valid email address',
        'validation.passwordRequired': 'Password is required',
        'validation.passwordMin': 'Password must be at least 8 characters',
        'validation.passwordUppercase': 'Password must contain at least one uppercase letter',
        'validation.passwordLowercase': 'Password must contain at least one lowercase letter',
        'validation.passwordNumber': 'Password must contain at least one number',
        'validation.passwordMismatch': 'Passwords do not match',
        'validation.termsRequired': 'You must accept the terms and conditions',

        // Success messages
        'msg.loginSuccess': 'Login successful! Redirecting...',
        'msg.registerSuccess': 'Account created successfully!',
        'msg.resetLinkSent': 'Password reset link sent to your email',
        'msg.passwordReset': 'Password reset successfully',
        'msg.profileUpdated': 'Profile updated successfully',
        'msg.passwordChanged': 'Password changed successfully',
        'msg.verificationSent': 'Verification email sent successfully',
        'msg.emailVerified': 'Email verified successfully',
        'msg.verificationResent': 'Verification email sent again',

        // Error messages
        'error.invalidCredentials': 'Invalid email or password',
        'error.emailExists': 'This email is already registered',
        'error.networkError': 'Connection failed. Please check your internet',
        'error.serverError': 'Something went wrong. Please try again',
        'error.invalidToken': 'Invalid or expired reset token',
        'error.passwordIncorrect': 'Current password is incorrect',
        'error.verificationInvalid': 'Invalid or expired verification token',
        'error.sessionExpired': 'Your session has expired. Please sign in again',
    },

    bn: {
        // Common
        'app.name': 'বাংলাদেশ ডিজিটাল অথ',
        'common.language': 'ভাষা',
        'common.loading': 'লোড হচ্ছে...',
        'common.error': 'ত্রুটি',
        'common.success': 'সফল',

        // Login page
        'login.welcome': 'স্বাগতম',
        'login.subtitle': 'আপনার অ্যাকাউন্টে সাইন ইন করুন',
        'login.email': 'ইমেইল ঠিকানা',
        'login.emailPlaceholder': 'you@example.com',
        'login.password': 'পাসওয়ার্ড',
        'login.passwordPlaceholder': 'আপনার পাসওয়ার্ড লিখুন',
        'login.remember': 'আমাকে মনে রাখুন',
        'login.forgot': 'পাসওয়ার্ড ভুলে গেছেন?',
        'login.button': 'সাইন ইন',
        'login.noAccount': 'অ্যাকাউন্ট নেই?',
        'login.register': 'নিবন্ধন করুন',

        // Register page
        'register.title': 'নতুন অ্যাকাউন্ট তৈরি করুন',
        'register.subtitle': 'বাংলাদেশ ডিজিটাল ইকোসিস্টেমে যোগ দিন',
        'register.firstName': 'প্রথম নাম',
        'register.firstNamePlaceholder': 'নাম',
        'register.lastName': 'শেষ নাম',
        'register.lastNamePlaceholder': 'পদবি',
        'register.email': 'ইমেইল ঠিকানা',
        'register.emailPlaceholder': 'you@example.com',
        'register.phone': 'ফোন নম্বর (ঐচ্ছিক)',
        'register.phonePlaceholder': '+৮৮০ ১XXX-XXXXXX',
        'register.password': 'পাসওয়ার্ড',
        'register.passwordPlaceholder': 'একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন',
        'register.confirmPassword': 'পাসওয়ার্ড নিশ্চিত করুন',
        'register.confirmPasswordPlaceholder': 'পাসওয়ার্ড পুনরায় লিখুন',
        'register.terms': 'আমি সম্মত',
        'register.termsLink': 'শর্তাবলী',
        'register.and': 'এবং',
        'register.privacyLink': 'গোপনীয়তা নীতি',
        'register.button': 'অ্যাকাউন্ট তৈরি করুন',
        'register.hasAccount': 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
        'register.signin': 'সাইন ইন',
        'register.strengthWeak': 'দুর্বল',
        'register.strengthMedium': 'মাঝারি',
        'register.strengthStrong': 'শক্তিশালী',

        // Forgot password
        'forgot.title': 'পাসওয়ার্ড ভুলে গেছেন?',
        'forgot.subtitle': 'আপনার ইমেইল লিখুন এবং আমরা আপনাকে রিসেট লিঙ্ক পাঠাব',
        'forgot.email': 'ইমেইল ঠিকানা',
        'forgot.emailPlaceholder': 'you@example.com',
        'forgot.button': 'রিসেট লিঙ্ক পাঠান',
        'forgot.back': 'সাইন ইন এ ফিরে যান',

        // Reset password
        'reset.title': 'পাসওয়ার্ড রিসেট করুন',
        'reset.subtitle': 'আপন অ্যাকাউন্টের জন্য একটি নতুন পাসওয়ার্ড তৈরি করুন',
        'reset.newPassword': 'নতুন পাসওয়ার্ড',
        'reset.newPasswordPlaceholder': 'নতুন পাসওয়ার্ড লিখুন',
        'reset.confirmPassword': 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
        'reset.confirmPasswordPlaceholder': 'নতুন পাসওয়ার্ড পুনরায় লিখুন',
        'reset.button': 'পাসওয়ার্ড রিসেট করুন',
        'reset.back': 'সাইন ইন এ ফিরে যান',

        // Dashboard
        'dashboard.welcome': 'স্বাগতম',
        'dashboard.profile': 'প্রোফাইল',
        'dashboard.settings': 'সেটিংস',
        'dashboard.logout': 'লগআউট',
        'dashboard.edit': 'প্রোফাইল সম্পাদনা',
        'dashboard.activity': 'সাম্প্রতিক কার্যকলাপ',
        'dashboard.email': 'ইমেইল',
        'dashboard.phone': 'ফোন',
        'dashboard.joined': 'যোগদানের তারিখ',
        'dashboard.language': 'ভাষা',
        'dashboard.changePassword': 'পাসওয়ার্ড পরিবর্তন',
        'dashboard.sessions': 'সক্রিয় সেশন',

        // Change Password
        'changePassword.title': 'পাসওয়ার্ড পরিবর্তন',
        'changePassword.subtitle': 'আপনার অ্যাকাউন্ট পাসওয়ার্ড আপডেট করুন',
        'changePassword.currentPassword': 'বর্তমান পাসওয়ার্ড',
        'changePassword.currentPasswordPlaceholder': 'বর্তমান পাসওয়ার্ড লিখুন',
        'changePassword.newPassword': 'নতুন পাসওয়ার্ড',
        'changePassword.newPasswordPlaceholder': 'নতুন পাসওয়ার্ড লিখুন',
        'changePassword.confirmPassword': 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
        'changePassword.confirmPasswordPlaceholder': 'নতুন পাসওয়ার্ড পুনরায় লিখুন',
        'changePassword.button': 'পাসওয়ার্ড পরিবর্তন করুন',
        'changePassword.back': 'ড্যাশবোর্ডে ফিরে যান',

        // Edit Profile
        'editProfile.title': 'প্রোফাইল সম্পাদনা',
        'editProfile.subtitle': 'আপনার ব্যক্তিগত তথ্য আপডেট করুন',
        'editProfile.firstName': 'প্রথম নাম',
        'editProfile.firstNamePlaceholder': 'নাম',
        'editProfile.lastName': 'শেষ নাম',
        'editProfile.lastNamePlaceholder': 'পদবি',
        'editProfile.email': 'ইমেইল ঠিকানা',
        'editProfile.emailPlaceholder': 'you@example.com',
        'editProfile.emailReadonly': 'ইমেইল পরিবর্তন করা যাবে না',
        'editProfile.phone': 'ফোন নম্বর',
        'editProfile.phonePlaceholder': '+৮৮০ ১XXX-XXXXXX',
        'editProfile.button': 'পরিবর্তন সংরক্ষণ করুন',
        'editProfile.back': 'ড্যাশবোর্ডে ফিরে যান',

        // Email Verification
        'emailVerify.title': 'আপনার ইমেইল যাচাই করুন',
        'emailVerify.subtitle': 'যাচাইকরণ লিঙ্কের জন্য আপনার ইনবক্স চেক করুন',
        'emailVerify.message': 'আমরা আপনার ইমেইল ঠিকানায় একটি যাচাইকরণ লিঙ্ক পাঠিয়েছি। আপনার অ্যাকাউন্ট যাচাই করতে অনুগ্রহ করে আপনার ইনবক্স চেক করুন এবং লিঙ্কে ক্লিক করুন।',
        'emailVerify.didntReceive': 'ইমেইল পাননি?',
        'emailVerify.resend': 'যাচাইকরণ ইমেইল পুনরায় পাঠান',
        'emailVerify.backDashboard': 'ড্যাশবোর্ডে ফিরে যান',
        'emailVerify.backLogin': 'লগইনে ফিরে যান',

        // Validation messages
        'validation.emailRequired': 'ইমেইল আবশ্যক',
        'validation.emailInvalid': 'অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন',
        'validation.passwordRequired': 'পাসওয়ার্ড আবশ্যক',
        'validation.passwordMin': 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে',
        'validation.passwordUppercase': 'পাসওয়ার্ডে কমপক্ষে একটি বড় অক্ষর থাকতে হবে',
        'validation.passwordLowercase': 'পাসওয়ার্ডে কমপক্ষে একটি ছোট অক্ষর থাকতে হবে',
        'validation.passwordNumber': 'পাসওয়ার্ডে কমপক্ষে একটি সংখ্যা থাকতে হবে',
        'validation.passwordMismatch': 'পাসওয়ার্ড মিলছে না',
        'validation.termsRequired': 'আপনাকে শর্তাবলীতে সম্মতি দিতে হবে',

        // Success messages
        'msg.loginSuccess': 'সফলভাবে লগইন হয়েছে! পুনর্নির্দেশিত হচ্ছে...',
        'msg.registerSuccess': 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!',
        'msg.resetLinkSent': 'পাসওয়ার্ড রিসেট লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে',
        'msg.passwordReset': 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে',
        'msg.profileUpdated': 'প্রোফাইল সফলভাবে আপডেট হয়েছে',
        'msg.passwordChanged': 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে',
        'msg.verificationSent': 'যাচাইকরণ ইমেইল সফলভাবে পাঠানো হয়েছে',
        'msg.emailVerified': 'ইমেইল সফলভাবে যাচাই হয়েছে',
        'msg.verificationResent': 'যাচাইকরণ ইমেইল আবার পাঠানো হয়েছে',

        // Error messages
        'error.invalidCredentials': 'অবৈধ ইমেইল বা পাসওয়ার্ড',
        'error.emailExists': 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত',
        'error.networkError': 'সংযোগ ব্যর্থ। আপনার ইন্টারনেট চেক করুন',
        'error.serverError': 'কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন',
        'error.invalidToken': 'অবৈধ বা মেয়াদোত্তীর্ণ রিসেট টোকেন',
        'error.passwordIncorrect': 'বর্তমান পাসওয়ার্ড সঠিক নয়',
        'error.verificationInvalid': 'অবৈধ বা মেয়াদোত্তীর্ণ যাচাইকরণ টোকেন',
        'error.sessionExpired': 'আপনার সেশনের মেয়াদ শেষ। আবার সাইন ইন করুন',
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL, ALLOWED_REDIRECT_DOMAINS, translations };
}
