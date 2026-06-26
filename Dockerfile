# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Vite application
# VITE_API_BASE_URL will be passed during build to bake the API endpoint into the static files
ARG VITE_API_BASE_URL=https://unblockedgameszone.com
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Serve Stage
FROM nginx:alpine

# Copy the build output to Nginx's default public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config for Docker
COPY nginx-docker.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (this will be mapped in docker-compose, not directly to the host)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
