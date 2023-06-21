# E-commerce Website

## Work in progress.

## Installation

Make sure you have docker and docker-compose installed.

Run following commands:

```bash
git clone https://github.com/talfour/E-commerce-store.git &&
cd E-commerce-store &&
docker-compose build &&
docker-compose up
```

## Test

To test run following command:

```bash
docker-compose run --rm backend sh -c "python manage.py test"
```
