#! /bin/bash

chmod +x wait-for-it.sh

./wait-for-it.sh postgres:5432 -- python api/manage.py makemigrations
./wait-for-it.sh postgres:5432 -- python api/manage.py migrate

./wait-for-it.sh postgres:5432 -- python api/manage.py runserver 0.0.0.0:8000