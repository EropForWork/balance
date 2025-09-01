# Google Authentication Setup Guide

## Quick Setup Checklist

### ✅ Google Cloud Console
- [ ] Create/select Google Cloud project
- [ ] Enable Google Identity Services API
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 Client ID
- [ ] Add authorized JavaScript origins:
  - `http://localhost:5173`
  - `http://localhost:5174`
  - `http://localhost:5175`
  - Your production domain

### ✅ Local Environment
- [ ] Copy `.env.example` to `.env`
- [ ] Replace `VITE_GOOGLE_CLIENT_ID` with your actual Client ID
- [ ] Update `VITE_GOOGLE_REDIRECT_URI` if needed
- [ ] Restart development server (`npm run dev`)

### ✅ Testing
- [ ] Google Sign-In button appears on login page
- [ ] No console errors about client_id
- [ ] Can click Google button (opens Google auth popup)
- [ ] User profile shows in header after successful login

## Production Deployment

### Environment Variables
For production deployment, set these environment variables:

```bash
VITE_GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://yourdomain.com
```

### Domain Authorization
Add your production domain to Google Cloud Console:
- Go to Credentials → OAuth 2.0 Client IDs → Your Client
- Add production domain to "Authorized JavaScript origins"

## Troubleshooting

### Common Issues

1. **"Parameter client_id is not set correctly"**
   - Verify Client ID in `.env` file
   - Restart development server
   - Check for typos in environment variable name

2. **"Provided button width is invalid"**
   - This is handled automatically in our implementation
   - No action needed

3. **"Origin not allowed"**
   - Add your current localhost port to authorized origins
   - Check if domain matches exactly (including http/https)

4. **Google button not showing**
   - Check if `GoogleAuthService.isConfigured()` returns true
   - Verify environment variable is loaded correctly

### Debug Commands

```bash
# Check if environment variables are loaded
echo $VITE_GOOGLE_CLIENT_ID

# Verify Google services in browser console
window.google
GoogleAuthService.isConfigured()
GoogleAuthService.getClientId()
```

## Security Notes

- Never commit `.env` file to version control
- Use different Client IDs for development and production
- Regularly rotate credentials if compromised
- Monitor usage in Google Cloud Console

## Features Enabled

After successful setup, users can:
- ✅ Sign in with Google account
- ✅ See profile picture and name in header
- ✅ Access email information
- ✅ Seamless logout process
- ✅ Fallback to demo login if needed