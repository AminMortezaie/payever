FROM node:20-slim

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Run linting and fix issues
RUN npm run lint

# Build the application
RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start:prod"] 