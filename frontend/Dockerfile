FROM node:20.12.2 AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install 

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . /app/
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
