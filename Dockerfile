FROM node:8.12.0-stretch
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . /app
CMD node index.js
EXPOSE 3000