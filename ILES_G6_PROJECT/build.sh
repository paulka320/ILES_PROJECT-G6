#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

echo "========== MIGRATE =========="
python manage.py migrate

echo "========== SHOW MIGRATIONS =========="
python manage.py showmigrations users

echo "========== COLLECTSTATIC =========="
python manage.py collectstatic --no-input
