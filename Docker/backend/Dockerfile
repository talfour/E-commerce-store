FROM python:3.11-alpine

ENV PYTHONUNBUFFERED=1
RUN apk update && apk add python3-dev gcc libc-dev

WORKDIR /app

RUN pip install --upgrade pip
ADD ./Docker/backend/requirements.txt /app/
RUN pip install -r requirements.txt

ADD ./backend /app/backend
ADD ./Docker/backend /app/docker

RUN chmod +x /app/docker/server-entrypoint.sh
RUN chmod +x /app/docker/worker-entrypoint.sh