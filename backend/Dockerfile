FROM node:20.12.2 AS builder

RUN apt-get update && apt-get install -y \
    ghostscript \
    chromium \
    libnss3 \
    libatk-bridge2.0-0 \
    libgbm1 \
    libasound2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libpango-1.0-0 \
    libcups2 \
    libatk1.0-0 \
    libgtk-3-0 \
    libatspi2.0-0 \
    libxinerama1 \
    libpangoft2-1.0-0 \
    fonts-liberation \
    gconf-service \
    libappindicator1 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*


RUN mkdir -p /usr/share/app

WORKDIR /usr/share/app
COPY package.json /usr/share/app/
RUN npm install


FROM node:20.12.2-slim
WORKDIR /usr/share/app
COPY --from=builder /usr/share/app /usr/share/app

RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk-bridge2.0-0 \
    libgbm1 \
    libasound2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libpango-1.0-0 \
    libcups2 \
    libatk1.0-0 \
    libgtk-3-0 \
    libatspi2.0-0 \
    libxinerama1 \
    libpangoft2-1.0-0 \
    fonts-liberation \
    gconf-service \
    libappindicator1 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

ARG REDIS_PORT
ARG REDIS_HOST
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG DB_HOST
ARG DB_PORT

ENV REDIS_PORT=$REDIS_PORT
ENV REDIS_HOST=$REDIS_HOST
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_DATABASE=$DB_DATABASE
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY . /usr/share/app/
EXPOSE 3000

CMD ["npm","start"]
