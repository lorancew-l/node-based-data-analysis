FROM node:18-alpine as build

WORKDIR /app
COPY . /app/

RUN yarn install --frozen-lockfile
RUN yarn build

FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=build app/dist /usr/share/nginx/html 

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]