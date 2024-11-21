ARG NODE_VERSION=21.7.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY  . .

RUN npm install --omit=dev

EXPOSE 5000

CMD [ "npm", "start" ]