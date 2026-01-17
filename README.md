# Bangladesh Auth - Web Interface

Centralized authentication portal for Bangladesh digital services.

**Domain:** `auth.banglade.sh`

## Overview

This is the web interface for the Bangladesh authentication system. It provides a centralized login/register portal that all micro-services can redirect to for user authentication.

### How It Works

1. **User visits a micro-service** (e.g., `news.banglade.sh`) without being logged in
2. **Micro-service redirects** to `auth.banglade.sh?redirect_url=https://news.banglade.sh/callback`
3. **User logs in** at the auth portal
4. **After successful login**, user is redirected back to `news.banglade.sh/callback?token=JWT_TOKEN`
5. **Micro-service saves the token** and user is now logged in

## Features

- 🎨 Professional dark theme with glassmorphism design
- 🔐 Secure login and registration
- 🔄 Redirect URL handling for SSO flow
- 🎯 JWT token management
- ✨ Password strength indicator
- 📱 Fully responsive design
- ⚡ Real-time form validation
- 🎭 Smooth animations and micro-interactions

## Quick Start

**For development:**
```bash
# Serve files locally
python3 -m http.server 3000

# Update API endpoint in assets/js/api.js to:
const API_BASE_URL = 'http://localhost:8080';

# Access at http://localhost:3000
```

## File Structure

```
auth.banglade.sh/
├── index.html              # Login page
├── register.html           # Registration page
├── assets/
│   ├── css/
│   │   └── styles.css     # Professional dark theme
│   └── js/
│       ├── api.js         # API client
│       ├── utils.js       # Token, redirect, validation
│       └── auth.js        # Auth logic
└── README.md
```

