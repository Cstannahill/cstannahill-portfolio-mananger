FROM node:20-alpine

WORKDIR /app

# Install dependencies required for bcrypt
RUN apk add --no-cache make gcc g++ python3 linux-headers

# Only copy package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# No need to copy files or build here since we're using volume mounting for development
# COPY . .
# RUN npm run build

EXPOSE 3000

# Use development mode with watch
CMD ["npm", "run", "dev"]