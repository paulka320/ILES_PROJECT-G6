# Deploy ILES to Render

This project is a **Django REST API** (`ILES_G6_PROJECT`) plus a **React frontend** (`iles_g6_frontend`). On Render you deploy them as **three resources**:

1. **PostgreSQL** database
2. **Web Service** — Django backend (Gunicorn)
3. **Static Site** — React frontend

---

## Before you deploy

1. Push this repo to **GitHub** or **GitLab** (Render deploys from Git).
2. Confirm these files exist (already added for Render):
   - `render.yaml` — optional Blueprint for one-click setup
   - `ILES_G6_PROJECT/build.sh` — installs deps, runs migrations, collects static files
   - `ILES_G6_PROJECT/requirements.txt` — Python dependencies
   - `iles_g6_frontend/public/_redirects` — SPA routing for React Router

---

## Option A — Deploy with Blueprint (recommended)

### Step 1: Create a Render account

Go to [https://render.com](https://render.com) and sign up. Connect your Git provider.

### Step 2: Apply the Blueprint

1. In Render Dashboard, click **New +** → **Blueprint**.
2. Connect the repository that contains `ILES_PROJECT-G6`.
3. Render detects `render.yaml` and shows 3 resources:
   - `iles-db` (PostgreSQL)
   - `iles-backend` (Python Web Service)
   - `iles-frontend` (Static Site)
4. Click **Apply**.

### Step 3: Wait for the backend URL

After the first deploy, open the **iles-backend** service and copy its URL, e.g.:

```
https://iles-backend.onrender.com
```

### Step 4: Configure environment variables

**Backend (`iles-backend`)** → **Environment**:

| Key | Value |
|-----|-------|
| `CORS_ALLOWED_ORIGINS` | `https://iles-frontend.onrender.com` |
| `CSRF_TRUSTED_ORIGINS` | `https://iles-frontend.onrender.com` |

Replace with your actual frontend URL after it is created. `SECRET_KEY`, `DEBUG`, and `DATABASE_URL` are set by the Blueprint.

**Frontend (`iles-frontend`)** → **Environment**:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://iles-backend.onrender.com/api` |

Use your real backend URL. **Redeploy the frontend** after setting this (env vars are baked in at build time).

### Step 5: Create an admin user

In the **iles-backend** service, open **Shell** and run:

```bash
python manage.py createsuperuser
```

### Step 6: Verify

- Backend: `https://iles-backend.onrender.com/` → `{"message":"Welcome to the ILES API"}`
- Admin: `https://iles-backend.onrender.com/admin/`
- Frontend: `https://iles-frontend.onrender.com/`

---

## Option B — Manual setup (dashboard)

### Step 1: Create PostgreSQL

1. **New +** → **PostgreSQL**
2. Name: `iles-db`
3. Plan: Free (or paid)
4. Create database and copy the **Internal Database URL** (or use the connection string Render shows).

### Step 2: Create the backend Web Service

1. **New +** → **Web Service**
2. Connect your repo
3. Settings:

| Setting | Value |
|---------|-------|
| **Name** | `iles-backend` |
| **Root Directory** | `ILES_G6_PROJECT` |
| **Runtime** | Python 3 |
| **Build Command** | `./build.sh` |
| **Start Command** | `gunicorn ILES_G6_PROJECT.wsgi:application --bind 0.0.0.0:$PORT` |

4. **Environment variables**:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.9` |
| `SECRET_KEY` | Generate a long random string |
| `DEBUG` | `False` |
| `DATABASE_URL` | Paste from the Postgres instance |

5. Create Web Service. Note the URL when deploy finishes.

### Step 3: Create the frontend Static Site

1. **New +** → **Static Site**
2. Same repo
3. Settings:

| Setting | Value |
|---------|-------|
| **Name** | `iles-frontend` |
| **Root Directory** | `iles_g6_frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

4. Add environment variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://YOUR-BACKEND-URL.onrender.com/api` |

5. Under **Redirects/Rewrites**, add:

| Source | Destination |
|--------|-------------|
| `/*` | `/index.html` |

6. Deploy.

### Step 4: Finish backend CORS

On **iles-backend**, add (use your frontend URL):

```
CORS_ALLOWED_ORIGINS=https://iles-frontend.onrender.com
CSRF_TRUSTED_ORIGINS=https://iles-frontend.onrender.com
```

Redeploy backend if needed.

### Step 5: Create superuser

Backend service → **Shell**:

```bash
python manage.py createsuperuser
```

---

## Local development (unchanged)

```bash
# Backend
cd ILES_G6_PROJECT
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (separate terminal)
cd iles_g6_frontend
npm install
npm start
```

Copy `.env.example` to `.env` (backend) and `iles_g6_frontend/.env.example` to `iles_g6_frontend/.env.local` (frontend).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `DisallowedHost` | Add your `*.onrender.com` host to `ALLOWED_HOSTS`, or rely on auto `RENDER_EXTERNAL_HOSTNAME` |
| CORS errors in browser | Set `CORS_ALLOWED_ORIGINS` to the exact frontend URL (https, no trailing slash) |
| Frontend calls wrong API | Set `REACT_APP_API_URL` and **redeploy** the static site |
| 404 on React routes | Ensure `/* → /index.html` rewrite exists on the static site |
| Database connection fails | Confirm `DATABASE_URL` is linked to the Postgres instance |
| Free tier sleeps | First request after idle may take ~30s on free web services |

---

## Architecture on Render

```
[Browser]
    │
    ├─► Static Site (React)     iles-frontend.onrender.com
    │
    └─► Web Service (Django)    iles-backend.onrender.com/api/...
              │
              └─► PostgreSQL    iles-db (internal)
```
