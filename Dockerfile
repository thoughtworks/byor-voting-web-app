ARG NODE_VERSION=10-alpine

FROM byoritaly/byor-voting-base:${NODE_VERSION} AS dev

# Install Chromium and Chromium ChromeDriver
RUN apk add --update chromium chromium-chromedriver
ENV CHROME_BIN="/usr/bin/chromium-browser"

# Install AWS CLI
RUN apk add --update make curl openssh python py-pip && \
    pip install awscli --upgrade

FROM node:${NODE_VERSION} AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN BACKEND_SERVICE_URL="__BACKEND__SERVICE__URL__PLACEHOLDER__" RADAR_SERVICE_URL="__RADAR__SERVICE__URL__PLACEHOLDER__" npm run build

FROM nginx:1.16-alpine AS prod

ENV BACKEND_SERVICE_URL_PLACEHOLDER="__BACKEND__SERVICE__URL__PLACEHOLDER__" RADAR_SERVICE_URL_PLACEHOLDER="__RADAR__SERVICE__URL__PLACEHOLDER__" NGINX_BASE_DIR="/usr/share/nginx/html"

COPY --from=build /usr/src/app/dist/ng-build-your-own-radar ${NGINX_BASE_DIR}

COPY ./docker-nginx.conf /etc/nginx/conf.d/default.conf

COPY ./docker-entrypoint.sh /

EXPOSE 80

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
