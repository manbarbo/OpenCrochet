---
name: docker-setup
description: Create Docker containers and Docker Compose for development and production. Use when containerizing services or setting up local development.
---

# Docker Setup Skill

Use this skill when containerizing the OpenCrochet application or setting up local development environments.

## Trigger
- Initial Docker setup
- Containerization of services
- Modifying Docker configurations
- Adding new services to Docker Compose
- Production deployment preparation

## Actions

### 1. Create Frontend Dockerfile
Create `apps/web/Dockerfile`:
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Run as non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /usr/share/nginx/html
USER nextjs
```

### 2. Create Backend Dockerfile
Create `apps/api/Dockerfile`:
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --production

# Copy built code
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads && chown -R node:node uploads

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Run as non-root
USER node

# Start application
CMD ["node", "dist/server.js"]
```

### 3. Create Development Dockerfile
Create `apps/web/Dockerfile.dev`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Expose port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev"]
```

Create `apps/api/Dockerfile.dev`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Start development server with hot reload
CMD ["pnpm", "dev"]
```

### 4. Create Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3001/api
    depends_on:
      - api
    networks:
      - opencrochet-network

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    volumes:
      - ./apps/api:/app
      - /app/node_modules
      - ./apps/api/uploads:/app/uploads
    environment:
      - NODE_ENV=development
      - PORT=3001
      - LOG_LEVEL=debug
    networks:
      - opencrochet-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - web
      - api
    networks:
      - opencrochet-network

networks:
  opencrochet-network:
    driver: bridge

volumes:
  uploads:
```

### 5. Create Production Docker Compose
Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "80:80"
    restart: unless-stopped
    networks:
      - opencrochet-network

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - LOG_LEVEL=info
    restart: unless-stopped
    networks:
      - opencrochet-network

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api
    restart: unless-stopped
    networks:
      - opencrochet-network

networks:
  opencrochet-network:
    driver: bridge
```

### 6. Create Nginx Configuration
Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;

    # Frontend
    location / {
        proxy_pass http://web:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api {
        proxy_pass http://api:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 7. Create .dockerignore
Create `.dockerignore`:
```
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
README.md
.env
.env.local
.env.development
.env.test
.env.production
dist
build
coverage
.nyc_output
*.log
```

## Requirements
- MUST use multi-stage builds
- MUST run as non-root user
- MUST include health checks
- MUST optimize for production (small image sizes)
- MUST support hot-reload for development
- MUST use pnpm exclusively (never npm or yarn)
- MUST never commit secrets in Dockerfiles

## Commands
```bash
# Build development environment
docker-compose up -d

# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build api
```

## Security Checklist
- [ ] Non-root user in containers
- [ ] No secrets in Dockerfiles
- [ ] Health checks configured
- [ ] Minimal base images (alpine)
- [ ] No unnecessary packages
- [ ] Resource limits defined
- [ ] Read-only filesystems where possible

## Performance Optimization
- Use multi-stage builds to minimize final image size
- Use .dockerignore to exclude unnecessary files
- Use layer caching effectively
- Minimize number of layers
- Use specific image tags (not latest)

## Troubleshooting
```bash
# Check container logs
docker logs <container_name>

# Execute command in container
docker exec -it <container_name> sh

# Check resource usage
docker stats

# Rebuild without cache
docker-compose build --no-cache
```
