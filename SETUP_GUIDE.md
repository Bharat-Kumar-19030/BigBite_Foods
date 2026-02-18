# BigBite Food Delivery - Complete Setup Guide

## ✅ Backend Implementation Complete!

The backend authentication system has been fully implemented with the following features:

### 🎯 Implemented Features:

1. **User Registration & Login**
   - Email/Password authentication
   - JWT token-based authentication
   - Secure password hashing with bcrypt
   - Role-based user accounts (Customer/Rider/Restaurant)
   - Mandatory mobile number validation

2. **Google OAuth Integration**
   - Passport.js with Google Strategy
   - Automatic account linking
   - Seamless social login

3. **Security Features**
   - JWT token authentication
   - HTTP-only cookies
   - Password encryption
   - Protected routes middleware
   - Role-based authorization

4. **User Management**
   - Profile updates
   - User session management
   - Account activation/deactivation
   - Email and phone verification flags

## 📁 Backend Structure

```
backend/
├── config/
│   └── passport.js          # Google OAuth configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   └── User.js              # User schema with validations
├── routes/
│   └── auth.js              # Authentication routes
├── utils/
│   └── auth.js              # JWT helper functions
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js                # Express server setup
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (already created):
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/bigbite
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
FRONTEND_URL=http://localhost:5174
SESSION_SECRET=your-session-secret
```

Start MongoDB:
```bash
mongod
```

Start backend server:
```bash
npm run dev
```

Server will run on: http://localhost:5001

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file (already created):
```env
VITE_API_URL=http://localhost:5001/api
```

Start frontend:
```bash
npm run dev
```

Frontend will run on: http://localhost:5174

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| POST | `/api/auth/logout` | Logout user | Private |
| PUT | `/api/auth/update-profile` | Update profile | Private |
| GET | `/api/auth/google` | Google OAuth login | Public |
| GET | `/api/auth/google/callback` | Google OAuth callback | Public |

### Signup Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "customer"
}
```

### Login Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response Format
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "customer",
    "avatar": "",
    "address": {}
  }
}
```

## 🔐 Google OAuth Setup (Optional)

To enable Google authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set Authorized redirect URI: `http://localhost:5001/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

## 🧪 Testing the API

### Using curl:

**Signup:**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"9876543210\",\"password\":\"password123\",\"role\":\"customer\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

**Get Current User:**
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman or Thunder Client:
1. Import the endpoints
2. Test signup/login
3. Copy the token from response
4. Use token in Authorization header for protected routes

## 📱 Frontend Integration

The frontend has been updated to connect with the backend:

### Files Updated:
- `frontend/src/services/api.js` - API service layer
- `frontend/src/context/AuthContext.jsx` - Authentication context with real API calls
- `frontend/.env` - API URL configuration

### How It Works:
1. User fills login/signup form
2. Form data sent to backend API
3. Backend validates and returns JWT token
4. Token stored in localStorage and cookies
5. Token included in subsequent API requests
6. Protected routes verified with JWT middleware

## 🎨 User Roles

- **customer**: Order food, track deliveries
- **rider**: Accept and deliver orders
- **restaurant**: Manage menu and orders
- **admin**: Platform management (not available for signup)

## 🔧 Next Steps

1. **For Production:**
   - Change all secrets in `.env`
   - Set up MongoDB Atlas
   - Enable HTTPS
   - Configure proper CORS
   - Add rate limiting
   - Implement email verification
   - Add SMS OTP for phone verification

2. **Additional Features to Implement:**
   - Password reset functionality
   - Email verification
   - Phone number verification with OTP
   - Refresh token mechanism
   - Social login (Facebook, Apple)
   - Two-factor authentication

3. **Restaurant Dashboard:**
   - Menu management
   - Order management
   - Analytics

4. **Rider Dashboard:**
   - Order acceptance
   - Navigation integration
   - Earnings tracking

5. **Customer Features:**
   - Order history
   - Favorites
   - Ratings and reviews
   - Real-time tracking

## ⚠️ Important Notes

- MongoDB must be running before starting the backend
- Update `.env` with your actual Google OAuth credentials to enable Google login
- Keep JWT_SECRET secure and never commit to version control
- Frontend and backend must run simultaneously for full functionality

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check MongoDB URI in `.env`

**Port Already in Use:**
- Change PORT in `.env` to different number
- Kill process using the port

**Google OAuth Not Working:**
- Verify Google credentials in `.env`
- Check redirect URI matches in Google Console

**CORS Errors:**
- Verify FRONTEND_URL in backend `.env`
- Check API_URL in frontend `.env`

## 📊 Current Status

✅ Backend server running on port 5001
✅ MongoDB connected
✅ Authentication routes working
✅ JWT token generation
✅ Google OAuth configured
✅ Frontend connected to backend
✅ User roles implemented
✅ Phone validation added
