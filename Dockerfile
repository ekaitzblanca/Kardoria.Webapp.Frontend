FROM node:24.14.0 AS build-step

WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . ./
RUN npm run build --configuration=production

FROM nginx:1.18-alpine AS runtime
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /app/dist/family-management-front/browser/ /usr/share/nginx/html/
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
