#! /bin/bash
set -e

echo "Waiting for PostgreSQL..."

# Wait for PostgreSQL
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "database" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready!"

cd /backend

python api/manage.py makemigrations
python api/manage.py migrate

echo "Starting Django server..."
python api/manage.py runserver 0.0.0.0:8000