FROM node:20-alpine
WORKDIR hieulth/backend-kkts
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm i -g @nestjs/cli@11.0.16
COPY . .
RUN npm run build
CMD ["node", "dist/main.js"]