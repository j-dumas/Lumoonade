FROM node:16
WORKDIR /usr/src/backend
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 443
ENV NODE_OPTIONS=--max_old_space_size=3000
CMD npm run build && npm run start
