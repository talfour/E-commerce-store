#!/bin/sh

until cd /app/backend
do
    echo "Waiting for server volume..."
done

# run worker
celery -A app worker --loglevel=info --concurrency 1 -E