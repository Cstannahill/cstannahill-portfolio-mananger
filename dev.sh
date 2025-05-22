#!/bin/bash
# Ensure Docker is running first
docker info > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Error: Docker is not running. Please start Docker Desktop first."
  exit 1
fi

# Build and start services
echo "Starting MongoDB and portfolio-manager services..."
docker-compose up -d