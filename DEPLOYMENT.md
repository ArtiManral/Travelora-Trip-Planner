# Travelora - Trip Planner Deployment Guide

## 🚀 Vercel Deployment Instructions

### Backend Deployment (Express on Vercel)

1. **Deploy Backend to Vercel:**
   ```bash
   cd backend
   vercel
   ```

2. **Set Environment Variables in Vercel:**
   - Go to your Vercel project dashboard (backend)
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     - `GROQ_API_KEY` = your_actual_groq_api_key
     - `NODE_ENV` = production
     - `FRONTEND_URL` = `https://your-frontend.vercel.app` (will be your frontend URL)

3. **Note your backend URL:**
   - After deployment, Vercel will provide a URL like: `https://your-backend.vercel.app`
   - Test it by visiting: `https://your-backend.vercel.app/health`

### Frontend Deployment

1. **Update Frontend Environment Variable:**
   - In your Vercel frontend project settings
   - Add environment variable:
     - `VITE_API_URL` = `https://your-backend.vercel.app` (your actual backend URL from step 3 above)

2. **Deploy Frontend to Vercel:**
   ```bash
   cd Frontend
   vercel
   ```

### Local Development

For local development, the app uses the `.env` files:

**Backend** (`backend/.env`):
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

**Frontend** (`Frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### Running Locally

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend (in a new terminal):**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

### Important Notes

- ✅ Environment variables are already configured for local development
- ✅ The API URL is now configurable via `VITE_API_URL`
- ⚠️ Don't commit `.env` files (already in `.gitignore`)
- ⚠️ Remember to set `VITE_API_URL` in Vercel dashboard for production
- ⚠️ Make sure to add your actual GROQ API key in both local and production environments

### Troubleshooting

If you get CORS errors after deployment:
- Ensure backend's CORS is configured to allow your frontend domain
- Check that environment variables are properly set in Vercel dashboard
