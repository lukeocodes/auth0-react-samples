FROM node:10-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --silent

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "prod" ]