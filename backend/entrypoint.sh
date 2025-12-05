#!/bin/sh
set -e

# Apply migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start Django
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000