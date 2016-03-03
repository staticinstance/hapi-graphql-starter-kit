FROM node:argon

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install -g babel-cli
RUN npm install

EXPOSE 3000

ARG NODE_ENV=production

CMD NODE_ENV=production babel-node index.js