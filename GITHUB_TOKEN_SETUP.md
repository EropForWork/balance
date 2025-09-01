# GitHub Token Setup Guide - Account-Specific Storage

## 🔧 Problem Fixed

**Issue**: GitHub Gist token was stored globally and not linked to specific user accounts. This caused:
- Token not being account-specific when switching between demo and Google accounts
- Data security issues with different users sharing same GitHub Gist storage
- Token loss when logging out and back in

**Solution**: Implemented account-specific GitHub token storage in the authentication system.

## 🚀 How to Set Up GitHub Token Properly

### Step 1: Create GitHub Personal Access Token

1. **Go to GitHub Settings**:
   - Visit https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"

2. **Configure Token**:
   - **Note**: "Balance App - Personal Finance"
   - **Expiration**: Choose based on your preference (30 days, 60 days, etc.)
   - **Scopes**: Check **only** `gist` (required for creating and managing Gists)

3. **Generate and Copy**:
   - Click "Generate token"
   - **Important**: Copy the token immediately (starts with `ghp_`)
   - Save it securely - you won't see it again!

### Step 2: Configure Token in Balance App

1. **Login to your account** (Demo or Google)
2. **Go to Settings** (⚙️ icon in header)
3. **User Account Section**: 
   - You'll see your account info and GitHub configuration status
4. **GitHub Gist Synchronization Section**:
   - Paste your token in "GitHub Personal Access Token" field
   - Leave "GitHub Gist ID" empty (will be auto-created)
   - Configure auto-sync if desired
5. **Save Settings**

### Step 3: Test Synchronization

1. **Upload to Cloud**:
   - Click "Загрузить в облако" (Upload to Cloud)
   - First sync will create a new private Gist
   - Gist ID will be automatically saved to your account

2. **Verify on GitHub**:
   - Go to https://gist.github.com/
   - You should see a new private Gist named "Personal Finance App Data - Balance"

## ✅ New Features

### Account-Specific Storage
- **Demo Account**: Each demo login gets its own GitHub settings
- **Google Account**: Your Google account has separate GitHub token storage
- **Account Switching**: Tokens remain linked to specific accounts

### User Interface Improvements
- **Account Info**: See which account you're using in Settings
- **Configuration Status**: Visual indicator if GitHub is configured
- **Account-Specific Messages**: Notifications show which account was updated

### Enhanced Security
- **Token Isolation**: Each account has its own token
- **Secure Storage**: Tokens are encrypted in browser storage
- **No Token Sharing**: Different accounts use different Gist storage

## 🔄 Migration from Old Setup

If you previously had a GitHub token configured:

1. **Login to each account** (demo and Google separately)
2. **Re-enter your GitHub token** in Settings for each account
3. **Previous Gist ID**: 
   - If you want to use existing Gist: enter Gist ID manually
   - For new separate storage: leave Gist ID empty

## 📋 Quick Setup Checklist

- [ ] Create GitHub Personal Access Token with `gist` scope
- [ ] Login to Balance app (demo or Google account)
- [ ] Go to Settings page
- [ ] Enter GitHub token in "GitHub Personal Access Token" field
- [ ] Save settings
- [ ] Test by clicking "Upload to Cloud"
- [ ] Verify Gist created on GitHub
- [ ] Test "Download from Cloud" functionality

## 🚨 Important Notes

1. **Token Security**: Never share your GitHub token
2. **Account Separation**: Each account needs its own token for security
3. **Token Expiration**: Regenerate token when it expires
4. **Gist Privacy**: All Gists are created as private by default
5. **Data Backup**: Always keep local backups of important financial data

## 🛠️ Troubleshooting

### "GitHub токен не настроен для данного аккаунта"
- Make sure you entered the token for the current account
- Check that token has `gist` scope enabled
- Verify token hasn't expired

### "Пользователь не авторизован"
- Make sure you're logged in to an account
- Try logging out and back in

### Token Not Saving
- Ensure you clicked "Save Settings" button
- Check browser console for any errors
- Try refreshing the page and re-entering token

## 🎯 Benefits of New System

1. **Better Security**: Each account has isolated GitHub storage
2. **No Data Mixing**: Demo and Google accounts have separate data
3. **Token Persistence**: Tokens stay linked to accounts across logins
4. **Clear UI**: Always know which account you're configuring
5. **Future-Proof**: Ready for multiple account types and team features

Your GitHub token is now properly linked to your user account and will persist across logins!