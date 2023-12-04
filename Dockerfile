FROM node:21.3.0-alpine3.17
WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm install
COPY . .
RUN npm run build

ENV DATABASE_HOST=localhost
ENV DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=postgres
ENV DATABASE_NAME=postgres
ENTRYPOINT ["node", "dist/index.js"]

