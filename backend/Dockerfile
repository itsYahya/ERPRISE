FROM python:3

WORKDIR /backend

COPY ./conf/ .

COPY ./src/ api

RUN pip install --no-cache-dir -r requirements.txt

RUN chmod +x script.sh

CMD [ "./script.sh" ]
