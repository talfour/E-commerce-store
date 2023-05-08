FROM node:lts-alpine3.12 as build
WORKDIR /app
COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./
RUN yarn install
COPY ./frontend .
# RUN yarn build