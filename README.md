# srh-frontend

React PWA frontend for the SRH AI Platform capstone project.

## Pages
- **Sign up** — create an account with age group, disability type, and language preference
- **Sign in** — JWT-based authentication
- **Home** — landing page with a working SRH chat box (calls the backend `/api/v1/ask` endpoint)

## Stack
- React 18 + Vite
- React Router 6
- Tailwind CSS

## Local Setup

```bash
git clone https://github.com/YOUR_USERNAME/srh-frontend.git
cd srh-frontend

# Install
npm install

# Configure
cp .env.example .env
# Edit .env if your backend runs somewhere other than http://localhost:8000

# Run
npm run dev
```

Open `http://localhost:5173`.

## Deploy to Vercel (free)

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub
3. **New Project** → select `srh-frontend`
4. **Framework Preset:** Vite (auto-detected)
5. **Environment Variables:** add `VITE_API_BASE_URL` = your Render backend URL (e.g. `https://srh-backend-api.onrender.com/api/v1`)
6. Click **Deploy** — takes ~1 minute

## Related repos
- Backend: [srh-backend-api](https://github.com/YOUR_USERNAME/srh-backend-api)
- ML model: [srh-ml-model](https://github.com/YOUR_USERNAME/srh-ml-model)