FROM node:lts-bookworm-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN mkdir -p /app/node_modules/.vite && \
    chown -R node:node /app

EXPOSE 3000

USER node

CMD ["npm", "run", "dev"]