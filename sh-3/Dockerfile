FROM node:8.12.0-stretch
WORKDIR /app
COPY package.json /app
RUN yarn global add ts-node typescript tsc nodemon
RUN yarn install
COPY . /app
EXPOSE 3000