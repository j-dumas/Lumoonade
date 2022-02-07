FROM node:16
WORKDIR /usr/src/backend
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 443
EXPOSE 80
CMD npm run build && npm run start
