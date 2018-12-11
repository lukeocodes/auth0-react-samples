FROM node:10-alpine as build

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --silent

COPY . .

RUN npm run build

FROM nginx:1.15.7-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]