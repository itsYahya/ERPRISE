#! /bin/bash

chmod +x wait-for-it.sh

./wait-for-it.sh postgres:5432 -- python api/manage.py makemigrations
python api/manage.py migrate

python api/manage.py runserver 0.0.0.0:8000