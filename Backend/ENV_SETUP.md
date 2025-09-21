# Environment Setup Instructions

## Required Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/legaldocsai

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Environment
NODE_ENV=development
```

## Current Issues to Fix

1. **Fix your .env file** - Remove `/legaldocsai` from the end of `GOOGLE_CLIENT_ID`
2. **Add missing variables** - Add `FRONTEND_URL` and `MONGODB_URI`
3. **Clean up formatting** - Remove extra spaces around `=` signs

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. For the web application:
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

## Security Notes

- Never commit the `.env` file to version control
- Use strong, unique JWT secrets in production
- Ensure your MongoDB instance is secure
- Use HTTPS in production environments

## Database Setup

Make sure MongoDB is running on your system:
- Local MongoDB: `mongodb://localhost:27017/legaldocsai`
- MongoDB Atlas: Use your connection string
