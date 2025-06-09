#! /bin/bash

apt update && apt install netcat-openbsd

# Wait until port 5432 is open
until nc -z postgres 5432; do
  echo "Waiting for PostgreSQL at postgres:5432..."
  sleep 5
done

echo "PostgreSQL is ready to go!..."

python api/manage.py makemigrations
python api/manage.py migrate

python api/manage.py runserver 0.0.0.0:8000