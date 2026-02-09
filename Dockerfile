# Build stage
FROM node:20.18.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY eslint.config.js ./

# Install dependencies
RUN npm install

# Copy source code and assets
COPY index.html ./
COPY src ./src
COPY public ./public

RUN npm run build

FROM nginx:alpine AS deploy

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]