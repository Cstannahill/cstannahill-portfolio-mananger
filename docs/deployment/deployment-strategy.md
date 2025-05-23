# Deployment Strategy

This document outlines the deployment strategy for the Portfolio Manager Dashboard application, focusing on self-hostable, cost-effective solutions that align with the technical requirements.

## Deployment Goals

1. **Self-Hosted** - Enable deployment on personal infrastructure without reliance on premium SaaS offerings
2. **Minimal Cost** - Keep infrastructure requirements and associated costs to a minimum
3. **Reliability** - Ensure consistent availability and performance
4. **Simplicity** - Make deployment and maintenance straightforward
5. **Scalability** - Start small but allow for growth if needed
6. **Security** - Maintain secure deployments with proper authentication and data protection

## Deployment Options

### Option 1: Docker Compose (Recommended)

A containerized deployment using Docker Compose, suitable for VPS or home server environments.

#### Architecture

```
+-----------------------------------------------------------------------+
|                                                                       |
|  Docker Host                                                          |
|                                                                       |
|  +-------------------------+   +-------------------------+            |
|  |                         |   |                         |            |
|  |  Portfolio Manager      |   |  MongoDB                |            |
|  |  Container              |   |  Container              |            |
|  |                         |   |                         |            |
|  +-------------------------+   +-------------------------+            |
|                |                             |                        |
|                +-----------------------------+                        |
|                              |                                       |
|                              v                                       |
|  +-------------------------+   +-------------------------+            |
|  |                         |   |                         |            |
|  |  Nginx Container        |   |  Portfolio Site         |            |
|  |  (Reverse Proxy)        |   |  Container (Next.js)    |            |
|  |                         |   |                         |            |
|  +-------------------------+   +-------------------------+            |
|                                                                       |
+-----------------------------------------------------------------------+
```

#### Docker Compose Configuration

```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:6.0
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    restart: unless-stopped
    networks:
      - app_network

  portfolio-manager:
    build: ./portfolio-manager
    depends_on:
      - mongodb
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongodb:27017/portfolio?authSource=admin
      - PORT=3000
      - JWT_SECRET=${JWT_SECRET}
      - CONTENT_DIR=/content
    volumes:
      - ./content:/content
    restart: unless-stopped
    networks:
      - app_network

  portfolio-site:
    build: ./portfolio-site
    depends_on:
      - portfolio-manager
    environment:
      - NODE_ENV=production
      - PORTFOLIO_MANAGER_URL=http://portfolio-manager:3000
      - PORT=3001
    volumes:
      - ./content:/content
    restart: unless-stopped
    networks:
      - app_network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/data:/var/www/html
    depends_on:
      - portfolio-manager
      - portfolio-site
    restart: unless-stopped
    networks:
      - app_network

volumes:
  mongodb_data:

networks:
  app_network:
    driver: bridge
```

#### Nginx Configuration

```nginx
# portfolio-manager.conf
server {
    listen 80;
    server_name manage.yourportfolio.com;

    location / {
        proxy_pass http://portfolio-manager:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# portfolio-site.conf
server {
    listen 80;
    server_name yourportfolio.com www.yourportfolio.com;

    location / {
        proxy_pass http://portfolio-site:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /dashboard/ {
        proxy_pass http://portfolio-manager:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Dockerfiles

**Portfolio Manager Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "start"]
```

### Option 2: Direct VPS Deployment

A traditional deployment directly on a VPS without containerization.

#### Architecture

```
+-----------------------------------------------------------------------+
|                                                                       |
|  VPS Host                                                             |
|                                                                       |
|  +-------------------------+   +-------------------------+            |
|  |                         |   |                         |            |
|  |  Portfolio Manager      |   |  MongoDB                |            |
|  |  (Node.js Process)      |   |  (Native Installation)  |            |
|  |                         |   |                         |            |
|  +-------------------------+   +-------------------------+            |
|                |                             |                        |
|                +-----------------------------+                        |
|                              |                                       |
|                              v                                       |
|  +-------------------------+   +-------------------------+            |
|  |                         |   |                         |            |
|  |  Nginx                  |   |  Portfolio Site         |            |
|  |  (Reverse Proxy)        |   |  (Node.js Process)      |            |
|  |                         |   |                         |            |
|  +-------------------------+   +-------------------------+            |
|                                                                       |
+-----------------------------------------------------------------------+
```

#### Setup Steps

1. **Server Preparation**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod

# Install Nginx
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

2. **Application Deployment**

```bash
# Clone repositories
git clone https://github.com/your-username/portfolio-manager.git /var/www/portfolio-manager
git clone https://github.com/your-username/portfolio-site.git /var/www/portfolio-site

# Set up Portfolio Manager
cd /var/www/portfolio-manager
npm install
npm run build
cp .env.example .env
# Edit .env with proper configuration

# Set up Portfolio Site
cd /var/www/portfolio-site
npm install
npm run build
cp .env.example .env
# Edit .env with proper configuration

# Set up process manager
sudo npm install -g pm2
pm2 start /var/www/portfolio-manager/ecosystem.config.js
pm2 start /var/www/portfolio-site/ecosystem.config.js
pm2 startup
pm2 save
```

3. **Nginx Configuration**

Similar to the Docker deployment configuration, but adjusting proxy paths to the local applications.

### Option 3: Hybrid Deployment

A deployment approach that combines self-hosting for the Portfolio Manager with managed hosting for the portfolio website.

#### Architecture

```
+------------------------+        +------------------------+
|                        |        |                        |
| Self-Hosted VPS        |        | Managed Platform       |
|                        |        | (Vercel, Netlify)      |
| +------------------+   |        |                        |
| | Portfolio Manager |   |        | +------------------+  |
| |                  |<--+--------+>| Portfolio Website |  |
| +------------------+   |  API   | | (Next.js)         |  |
|          |             |        | +------------------+  |
|          v             |        |                        |
| +------------------+   |        |                        |
| | MongoDB           |  |        |                        |
| |                  |   |        |                        |
| +------------------+   |        |                        |
|                        |        |                        |
+------------------------+        +------------------------+
```

## MongoDB Deployment Options

### Self-Hosted MongoDB

For full control and flexibility:

1. **Direct Installation**

   - Install MongoDB directly on the host
   - Configure for minimal resource usage
   - Implement proper backup procedures

2. **Containerized MongoDB**
   - Use the official MongoDB Docker image
   - Configure persistent volumes for data
   - Set appropriate memory limits

### MongoDB Atlas Free Tier

For development or minimal production usage:

- 512MB storage limit
- Shared RAM
- Limited connections
- Automatic backups
- Basic monitoring

Configuration steps:

1. Set up a MongoDB Atlas account
2. Create a free tier cluster (M0)
3. Configure network access for your application
4. Create database user credentials
5. Update application configuration with connection string

## Backup Strategy

### Database Backups

1. **Scheduled Backups**

```bash
#!/bin/bash
# MongoDB backup script

# Configuration
BACKUP_DIR="/backups/mongodb"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
MONGO_DATABASE="portfolio"

# Create backup
mongodump --db $MONGO_DATABASE --out $BACKUP_DIR/mongo_$TIMESTAMP

# Compress backup
tar -zcvf $BACKUP_DIR/mongo_$TIMESTAMP.tar.gz $BACKUP_DIR/mongo_$TIMESTAMP

# Remove uncompressed backup
rm -rf $BACKUP_DIR/mongo_$TIMESTAMP

# Keep only the last 7 backups
ls -tp $BACKUP_DIR/*.tar.gz | grep -v '/$' | tail -n +8 | xargs -I {} rm -- {}
```

2. **Automated Offsite Storage**

```bash
#!/bin/bash
# Offsite backup transfer script

# Configuration
BACKUP_DIR="/backups/mongodb"
REMOTE_USER="backup"
REMOTE_HOST="offsite-storage.example.com"
REMOTE_DIR="/backups/portfolio-manager"

# Find latest backup
LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.tar.gz | head -n1)

# Transfer to remote location
scp $LATEST_BACKUP $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

# Log the transfer
echo "$(date): Transferred $(basename $LATEST_BACKUP) to offsite storage" >> $BACKUP_DIR/transfer.log
```

### Content Backups

1. **Git-Based Backup**

   - Commit content changes to Git
   - Push to remote repository
   - Maintain version history

2. **File System Backups**
   - Regular snapshots of the content directory
   - Synchronize with cloud storage

## Security Considerations

### Basic Security Measures

1. **Firewall Configuration**

```bash
# Allow SSH
sudo ufw allow 22

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Restrict MongoDB access
sudo ufw deny 27017

# Enable firewall
sudo ufw enable
```

2. **HTTPS Setup with Let's Encrypt**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourportfolio.com -d www.yourportfolio.com -d manage.yourportfolio.com

# Set up auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

3. **Application Security**
   - Use environment variables for secrets
   - Implement proper JWT authentication
   - Apply rate limiting for API endpoints

## Scaling Strategy

Starting small but with room to grow:

### Initial Deployment

- Single VPS with moderate resources
- MongoDB with minimal configuration
- Basic nginx setup

### Intermediate Scaling

- Increase VPS resources as needed
- Optimize MongoDB with proper indexing
- Implement caching strategies

### Advanced Scaling

- Move to multi-server deployment
- Separate database server
- Load balancing for application servers
- CDN integration for static assets

## Monitoring and Maintenance

### Basic Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Set up log monitoring
sudo nano /etc/logrotate.d/portfolio-manager
```

```
/var/log/portfolio-manager/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
}
```

### Application Monitoring

1. **Process Monitoring with PM2**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "portfolio-manager",
      script: "npm",
      args: "start",
      cwd: "/var/www/portfolio-manager",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "/var/log/portfolio-manager/error.log",
      out_file: "/var/log/portfolio-manager/out.log",
      merge_logs: true,
    },
  ],
};
```

2. **Health Check Endpoint**

```javascript
// In the Portfolio Manager application
app.get("/health", (req, res) => {
  // Check database connection
  const isDbConnected = mongoose.connection.readyState === 1;

  // Check file system access
  let isFileSystemAccessible = false;
  try {
    fs.accessSync(
      process.env.CONTENT_DIR,
      fs.constants.R_OK | fs.constants.W_OK
    );
    isFileSystemAccessible = true;
  } catch (err) {}

  if (isDbConnected && isFileSystemAccessible) {
    return res.status(200).json({ status: "healthy" });
  }

  return res.status(500).json({
    status: "unhealthy",
    details: {
      database: isDbConnected ? "connected" : "disconnected",
      fileSystem: isFileSystemAccessible ? "accessible" : "inaccessible",
    },
  });
});
```

## Deployment Automation

### Basic Deployment Script

```bash
#!/bin/bash
# Simple deployment script for Portfolio Manager

# Configuration
APP_DIR="/var/www/portfolio-manager"
LOG_FILE="/var/log/portfolio-manager/deploy.log"

# Log function
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Update code
log "Pulling latest changes"
cd $APP_DIR
git pull

# Install dependencies
log "Installing dependencies"
npm ci

# Build application
log "Building application"
npm run build

# Restart service
log "Restarting service"
pm2 restart portfolio-manager

log "Deployment completed"
```

### Docker Deployment Script

```bash
#!/bin/bash
# Deployment script for Docker setup

# Configuration
COMPOSE_DIR="/opt/portfolio-manager"
LOG_FILE="/var/log/portfolio-manager/deploy.log"

# Log function
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Update code repositories
log "Pulling latest changes"
cd $COMPOSE_DIR/portfolio-manager
git pull
cd $COMPOSE_DIR/portfolio-site
git pull

# Update and rebuild containers
log "Updating containers"
cd $COMPOSE_DIR
docker-compose pull
docker-compose build --no-cache portfolio-manager portfolio-site

# Restart services
log "Restarting services"
docker-compose up -d

log "Deployment completed"
```

## Environment Setup

### Production Environment Variables

Portfolio Manager `.env` file:

```
# Server
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://username:password@localhost:27017/portfolio

# Authentication
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d

# Content
CONTENT_DIR=/var/www/content

# GitHub Integration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Multi-Environment Setup

Create environment-specific configuration files:

```
.env.development
.env.staging
.env.production
```

Load the appropriate environment using a startup script:

```bash
#!/bin/bash
ENV=$1
if [[ -z "$ENV" ]]; then
  ENV="development"
fi

echo "Loading $ENV environment..."
cp .env.$ENV .env
npm start
```

## Cost Optimization

### Resource Requirements

Minimum viable deployment:

- VPS: 1 vCPU, 1GB RAM (~$5/month)
- Storage: 20GB SSD (~$2/month)
- Bandwidth: 1TB/month (included with most VPS plans)

Optimized deployment:

- Use MongoDB Atlas free tier for development
- Static content served through CDN
- Resource-efficient Node.js configuration

### Host Recommendations

Budget-friendly VPS options:

1. **DigitalOcean**: Basic Droplet ($5/month)
2. **Linode**: Nanode ($5/month)
3. **Vultr**: Cloud Compute ($5/month)
4. **Hetzner**: CX11 (€3/month)

## Deployment Checklist

### Pre-Deployment

- [ ] Run security audit on dependencies
- [ ] Test with production build locally
- [ ] Verify MongoDB connection and indexes
- [ ] Check environment variables
- [ ] Prepare SSL certificates

### Deployment

- [ ] Back up existing data (if applicable)
- [ ] Deploy application code
- [ ] Configure web server
- [ ] Set up monitoring
- [ ] Implement backup schedule

### Post-Deployment

- [ ] Verify application functionality
- [ ] Check logs for errors
- [ ] Test backup and restore process
- [ ] Monitor resource usage
- [ ] Set up alerts for critical issues

## Troubleshooting Common Issues

### Database Connection Issues

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
tail -n 100 /var/log/mongodb/mongod.log

# Test connection
mongo --eval "db.adminCommand('ping')"
```

### Application Startup Issues

```bash
# Check Node.js logs
pm2 logs portfolio-manager

# Verify environment variables
cat /var/www/portfolio-manager/.env

# Test application manually
cd /var/www/portfolio-manager
NODE_ENV=production node server.js
```

### Nginx Configuration Issues

```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx logs
tail -n 100 /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

This deployment strategy provides a comprehensive guide for deploying the Portfolio Manager Dashboard in a self-hosted environment. The strategy balances cost-effectiveness, simplicity, and reliability while ensuring that the application can scale as needed.
