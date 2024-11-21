ARG NODE_VERSION=21.7.1
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY . .

WORKDIR /app/techbay

RUN npm install
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/techbay/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
