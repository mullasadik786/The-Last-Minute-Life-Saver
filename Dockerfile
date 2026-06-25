FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --if-present
ENV PORT=3000
EXPOSE 3000
CMD [ "npx", "ts-node", "server.ts" ]
