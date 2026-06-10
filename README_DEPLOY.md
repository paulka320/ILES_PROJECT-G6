Deployment quickstart

1. Copy `.env.example` to `.env` and set values.

2. Build and start services with Docker Compose:

```bash
docker compose build
docker compose up -d
```

3. Run migrations and create a superuser (backend container):

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

4. Collect static files:

```bash
docker compose exec backend python manage.py collectstatic --noinput
```

Frontend will be served on `http://localhost:3000` and backend API on `http://localhost:8000`.
