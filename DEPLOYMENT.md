Deployment Checklist — BigBite

Overview
- This document lists required environment variables and steps to deploy frontend and backend on separate hosts (different domains) while keeping session/cookie and socket behavior working.

Environment variables (backend)
- NODE_ENV=production
- PORT=5000
- MONGODB_URI=<your mongodb connection string>
- SESSION_SECRET=<strong random string>
- FRONTEND_URL=https://bigbitefrontend-sigma.vercel.app (or comma-separated list if multiple)
- TRUST_PROXY=true (if behind a reverse proxy/load balancer)
- COOKIE_SAMESITE=none (recommended for cross-site cookies)
- COOKIE_DOMAIN=.yourdomain.com (optional; use for subdomain cookie sharing)
- SESSIONS_COLLECTION=sessions (optional)
- SESSION_MAX_AGE=86400000 (ms)
- GOOGLE_CLIENT_ID=<your google client id>
- GOOGLE_CLIENT_SECRET=<your google client secret>
- GOOGLE_CALLBACK_URL=https://bigbite-backend-i4u4.onrender.com/api/auth/google/callback
- JWT_SECRET=<strong random string>
- JWT_EXPIRE=30d

Environment variables (frontend)
- VITE_API_URL=https://bigbite-backend-i4u4.onrender.com/api
- VITE_SERVER_URL=https://bigbite-backend-i4u4.onrender.com
- VITE_CLOUDINARY_CLOUD_NAME=dunoufbqz
- VITE_CLOUDINARY_UPLOAD_PRESET=bigbite_profiles
- VITE_GEMINI_API_KEY=<your gemini api key>
- VITE_GEMINI_API_KEY_2=<your second gemini api key>

Backend production notes
- Install dependencies and ensure `connect-mongo` is installed (session store).
  ```bash
  cd backend
  npm install
  ```
- Ensure `TRUST_PROXY=true` if you're running behind nginx/Cloudflare/Heroku so secure cookies are respected.
- The backend now uses a Mongo-backed session store. Sessions are stored in the `sessions` collection.
- Cookies are set with `Secure` when `NODE_ENV=production` and `SameSite` will default to `none` in production. For cross-domain cookies ensure you serve everything over HTTPS.
- Since frontend and backend are on different domains, JWT tokens are stored in localStorage and sent via Authorization header for authentication.
- If frontend and backend are on different top-level domains and you want cookie-based sessions, set `COOKIE_SAMESITE=none`, `TRUST_PROXY=true`, and provide `COOKIE_DOMAIN` only if both apps share a parent domain (e.g., `.example.com`). Otherwise, prefer JWT-based auth.

Frontend production notes
- Build and serve the frontend via static host (Netlify, Vercel, S3+CloudFront, or your own server):
  ```bash
  cd frontend
  npm install
  npm run build
  ```
- Ensure `VITE_API_URL` and `VITE_SERVER_URL` are set for the production build.
- The frontend sends cookies and socket requests with credentials enabled.
- Cart operations use JWT tokens from localStorage for cross-domain authentication.
- Order placement uses the api.js service to avoid double `/api` in URLs.

Socket.IO notes
- Socket connections are configured to send credentials. The backend CORS accepts the configured `FRONTEND_URL` origins.
- If you host Socket.IO on a different subdomain or domain, ensure its origin is included in `FRONTEND_URL` on the backend side.

Google OAuth notes
- Google OAuth redirects back to the frontend with the JWT token in the URL hash.
- The frontend automatically extracts and stores the token in localStorage for authentication.

If you want, I can:
- Add a simple `procfile`/systemd/nginx example for deployment.
- Update README with exact commands for a target provider (Heroku, DigitalOcean, Vercel).

Security reminder
- Never commit `.env` files to source control. Use your host's environment management.
- Rotate `SESSION_SECRET` and keep it long and random.