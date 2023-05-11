FROM node:lts-alpine3.12 as build
WORKDIR /app
COPY ./frontend/package.json .
COPY ./frontend/yarn.lock .
COPY ./frontend .
RUN yarn
# RUN yarn build