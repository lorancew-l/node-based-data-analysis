FROM node:18-alpine as build
WORKDIR /app
COPY . /app/

RUN yarn install
RUN yarn prisma generate
RUN yarn build

FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/dist /app/
COPY --from=build /app/src/prisma /app/src/prisma
COPY package.json /app/package.json

RUN yarn install
CMD ["node", "main.js"]

EXPOSE 3000