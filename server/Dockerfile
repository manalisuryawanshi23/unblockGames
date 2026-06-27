FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client and compile TypeScript to /dist
RUN npm run build

# Create uploads directory at the volume mount path
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Expose internal port
EXPOSE 5000

# Start the compiled Node server
CMD ["npm", "start"]
