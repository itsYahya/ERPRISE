FROM python:3

WORKDIR /backend

COPY ./conf/ .

COPY ./src/ api

RUN pip install --no-cache-dir -r requirements.txt

RUN  curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh

RUN chmod +x script.sh

CMD [ "./script.sh" ]
