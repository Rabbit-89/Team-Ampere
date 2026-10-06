# mock-api/Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY . .
EXPOSE 4000
CMD ["node", "mock-api/server.js"]