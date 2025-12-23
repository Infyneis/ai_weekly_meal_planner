# Docker & DevOps Specification

**Version:** 1.0
**Date:** 2025-12-23
**Status:** Draft
**Related Documents:** PRD.md, OLLAMA_ARCHITECTURE.md

---

## Table of Contents

1. [Overview](#overview)
2. [Docker Architecture](#docker-architecture)
3. [Container Specifications](#container-specifications)
4. [Docker Compose Configuration](#docker-compose-configuration)
5. [start.sh Script Specification](#startsh-script-specification)
6. [Environment Configuration](#environment-configuration)
7. [Data Persistence](#data-persistence)
8. [Network Configuration](#network-configuration)
9. [Development Workflow](#development-workflow)
10. [Production Deployment](#production-deployment)

---

## Overview

This document specifies the Docker containerization strategy and DevOps setup for the AI Weekly Meal Planner. The application runs entirely in Docker containers for consistency, portability, and ease of deployment.

### Architecture Goals

- Single-command startup for entire stack
- Automatic dependency installation
- Seamless Ollama integration
- Hot-reload for development
- Production-ready configuration
- Cross-platform compatibility (macOS, Linux, Windows with Docker Desktop)

---

## Docker Architecture

### Container Stack

```
┌─────────────────────────────────────────────────┐
│                   Docker Host                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │   Next.js    │  │  PostgreSQL  │           │
│  │  Container   │  │  Container   │           │
│  │  (port 3000) │  │  (port 5432) │           │
│  └──────┬───────┘  └──────┬───────┘           │
│         │                  │                    │
│         └──────┬───────────┘                    │
│                │                                │
│         ┌──────┴───────┐                       │
│         │   Ollama     │                       │
│         │  Container   │                       │
│         │ (port 11434) │                       │
│         └──────────────┘                       │
│                                                 │
│         Internal Docker Network                 │
│         (meal-planner-network)                  │
└─────────────────────────────────────────────────┘

Volumes:
├── postgres-data (persists database)
├── ollama-models (persists downloaded AI models)
└── next-app (hot-reload in dev mode)
```

### Container Communication

- All containers on shared bridge network: `meal-planner-network`
- Next.js connects to PostgreSQL via: `postgresql://postgres:5432/mealplanner`
- Next.js connects to Ollama via: `http://ollama:11434`
- Host access to Next.js: `http://localhost:3000`
- Host access to Ollama (optional): `http://localhost:11434`

---

## Container Specifications

### 1. Next.js Application Container

**Base Image:** `node:20-alpine`

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables
ARG DATABASE_URL
ARG NEXT_PUBLIC_APP_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Build Next.js app
RUN corepack enable pnpm && pnpm build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Development Dockerfile:**
```dockerfile
FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install

# Copy source code
COPY . .

EXPOSE 3000

# Run in development mode with hot reload
CMD ["pnpm", "dev"]
```

**Build Context:** Repository root
**Exposed Ports:** 3000
**Volumes (dev):**
- `./:/app` (source code)
- `/app/node_modules` (anonymous volume)
- `/app/.next` (build cache)

---

### 2. PostgreSQL Container

**Base Image:** `postgres:16-alpine`

**Configuration:**
- Database: `mealplanner`
- Username: `postgres`
- Password: Configured via environment variable
- Port: 5432

**Volumes:**
- `postgres-data:/var/lib/postgresql/data` (persists database)
- `./init-db.sql:/docker-entrypoint-initdb.d/init.sql` (optional: initial schema)

**Health Check:**
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```

---

### 3. Ollama Container

**Base Image:** `ollama/ollama:latest`

**Configuration:**
- API Port: 11434
- Model Storage: `/root/.ollama/models`

**Volumes:**
- `ollama-models:/root/.ollama` (persists downloaded models)

**GPU Support (Optional):**
```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

**Health Check:**
```yaml
healthcheck:
  test: ["CMD", "ollama", "list"]
  interval: 30s
  timeout: 10s
  retries: 3
```

---

## Docker Compose Configuration

### docker-compose.yml (Production)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: mealplanner-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
      POSTGRES_DB: ${POSTGRES_DB:-mealplanner}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - meal-planner-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  ollama:
    image: ollama/ollama:latest
    container_name: mealplanner-ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama-models:/root/.ollama
    networks:
      - meal-planner-network
    healthcheck:
      test: ["CMD", "ollama", "list"]
      interval: 30s
      timeout: 10s
      retries: 3
    # Uncomment for GPU support
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-changeme}@postgres:5432/${POSTGRES_DB:-mealplanner}
        - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
    container_name: mealplanner-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-changeme}@postgres:5432/${POSTGRES_DB:-mealplanner}
      - OLLAMA_BASE_URL=http://ollama:11434
      - OLLAMA_DEFAULT_MODEL=${OLLAMA_DEFAULT_MODEL:-llama3.2:3b}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
    depends_on:
      postgres:
        condition: service_healthy
      ollama:
        condition: service_healthy
    networks:
      - meal-planner-network

networks:
  meal-planner-network:
    driver: bridge

volumes:
  postgres-data:
    driver: local
  ollama-models:
    driver: local
```

### docker-compose.dev.yml (Development)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: mealplanner-postgres-dev
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-devpassword}
      POSTGRES_DB: ${POSTGRES_DB:-mealplanner_dev}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data-dev:/var/lib/postgresql/data
    networks:
      - meal-planner-network

  ollama:
    image: ollama/ollama:latest
    container_name: mealplanner-ollama-dev
    ports:
      - "11434:11434"
    volumes:
      - ollama-models-dev:/root/.ollama
    networks:
      - meal-planner-network

  nextjs:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: mealplanner-app-dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-devpassword}@postgres:5432/${POSTGRES_DB:-mealplanner_dev}
      - OLLAMA_BASE_URL=http://ollama:11434
      - OLLAMA_DEFAULT_MODEL=${OLLAMA_DEFAULT_MODEL:-llama3.2:3b}
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    volumes:
      # Mount source code for hot-reload
      - ./:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - postgres
      - ollama
    networks:
      - meal-planner-network

networks:
  meal-planner-network:
    driver: bridge

volumes:
  postgres-data-dev:
    driver: local
  ollama-models-dev:
    driver: local
```

---

## start.sh Script Specification

### Features

- Beautiful, emoji-enhanced output
- Auto-detect platform (macOS, Linux, Windows/WSL)
- Check for Docker installation
- Install missing dependencies
- Pull Ollama models if not present
- Run database migrations
- Graceful error handling
- First-time setup wizard
- Health checks for all services

### Script Structure

```bash
#!/bin/bash

#############################################
# AI Weekly Meal Planner - Startup Script
#############################################
#
# This script orchestrates the complete setup
# and startup of the meal planning application.
#
# Features:
#   - Docker environment setup
#   - Dependency verification
#   - Database initialization
#   - Ollama model management
#   - Service health monitoring
#
#############################################

set -e  # Exit on error

# Colors and emojis for beautiful output
readonly COLOR_RESET="\033[0m"
readonly COLOR_BOLD="\033[1m"
readonly COLOR_GREEN="\033[32m"
readonly COLOR_YELLOW="\033[33m"
readonly COLOR_RED="\033[31m"
readonly COLOR_BLUE="\033[34m"
readonly COLOR_CYAN="\033[36m"

# Emojis
readonly EMOJI_ROCKET="🚀"
readonly EMOJI_CHECK="✅"
readonly EMOJI_CROSS="❌"
readonly EMOJI_WRENCH="🔧"
readonly EMOJI_PACKAGE="📦"
readonly EMOJI_BRAIN="🧠"
readonly EMOJI_DATABASE="💾"
readonly EMOJI_SPARKLES="✨"
readonly EMOJI_COOKING="🍳"
readonly EMOJI_WARN="⚠️"
readonly EMOJI_INFO="ℹ️"

# Configuration
readonly APP_NAME="AI Weekly Meal Planner"
readonly REQUIRED_DOCKER_VERSION="20.10"
readonly DEFAULT_OLLAMA_MODEL="llama3.2:3b"
readonly COMPOSE_FILE_DEV="docker-compose.dev.yml"
readonly COMPOSE_FILE_PROD="docker-compose.yml"

#############################################
# Utility Functions
#############################################

print_header() {
    echo -e "\n${COLOR_BOLD}${COLOR_CYAN}═══════════════════════════════════════════════${COLOR_RESET}"
    echo -e "${COLOR_BOLD}${COLOR_CYAN}  ${EMOJI_COOKING} ${APP_NAME} ${EMOJI_COOKING}${COLOR_RESET}"
    echo -e "${COLOR_BOLD}${COLOR_CYAN}═══════════════════════════════════════════════${COLOR_RESET}\n"
}

print_section() {
    echo -e "\n${COLOR_BOLD}${COLOR_BLUE}▶ $1${COLOR_RESET}\n"
}

print_success() {
    echo -e "${COLOR_GREEN}${EMOJI_CHECK} $1${COLOR_RESET}"
}

print_error() {
    echo -e "${COLOR_RED}${EMOJI_CROSS} $1${COLOR_RESET}"
}

print_warning() {
    echo -e "${COLOR_YELLOW}${EMOJI_WARN} $1${COLOR_RESET}"
}

print_info() {
    echo -e "${COLOR_CYAN}${EMOJI_INFO} $1${COLOR_RESET}"
}

#############################################
# System Checks
#############################################

check_docker() {
    print_section "Checking Docker Installation"

    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        print_info "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
        exit 1
    fi

    local docker_version=$(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
    print_success "Docker found: version $docker_version"

    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available"
        print_info "Please update Docker to a version with built-in Compose"
        exit 1
    fi

    print_success "Docker Compose is available"
}

check_env_file() {
    print_section "Checking Environment Configuration"

    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            print_warning ".env file not found, creating from .env.example"
            cp .env.example .env
            print_success ".env file created"
            print_info "Please review and update .env with your configuration"
        else
            print_error "Neither .env nor .env.example found"
            exit 1
        fi
    else
        print_success ".env file exists"
    fi
}

#############################################
# Ollama Model Management
#############################################

check_ollama_model() {
    local model_name=${1:-$DEFAULT_OLLAMA_MODEL}

    print_section "Checking Ollama Model: $model_name"

    # Wait for Ollama service to be ready
    print_info "Waiting for Ollama service to start..."
    local max_attempts=30
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if docker compose exec ollama ollama list &> /dev/null; then
            break
        fi
        sleep 2
        attempt=$((attempt + 1))
    done

    if [ $attempt -eq $max_attempts ]; then
        print_error "Ollama service failed to start"
        exit 1
    fi

    print_success "Ollama service is ready"

    # Check if model exists
    if docker compose exec ollama ollama list | grep -q "$model_name"; then
        print_success "Model $model_name is already downloaded"
    else
        print_warning "Model $model_name not found"
        print_info "Downloading model (this may take several minutes)..."

        docker compose exec ollama ollama pull "$model_name"

        if [ $? -eq 0 ]; then
            print_success "Model $model_name downloaded successfully"
        else
            print_error "Failed to download model $model_name"
            exit 1
        fi
    fi
}

#############################################
# Database Management
#############################################

setup_database() {
    print_section "Setting Up Database"

    # Wait for PostgreSQL to be ready
    print_info "Waiting for PostgreSQL to be ready..."
    local max_attempts=30
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if docker compose exec postgres pg_isready -U postgres &> /dev/null; then
            break
        fi
        sleep 2
        attempt=$((attempt + 1))
    done

    if [ $attempt -eq $max_attempts ]; then
        print_error "PostgreSQL failed to start"
        exit 1
    fi

    print_success "PostgreSQL is ready"

    # Run migrations
    print_info "Running database migrations..."
    docker compose exec nextjs pnpm prisma migrate deploy

    if [ $? -eq 0 ]; then
        print_success "Database migrations completed"
    else
        print_warning "Migration failed or already up-to-date"
    fi
}

#############################################
# Service Management
#############################################

start_services() {
    local mode=${1:-dev}
    local compose_file

    if [ "$mode" = "prod" ]; then
        compose_file=$COMPOSE_FILE_PROD
    else
        compose_file=$COMPOSE_FILE_DEV
    fi

    print_section "Starting Services ($mode mode)"

    print_info "Building and starting containers..."
    docker compose -f "$compose_file" up -d --build

    if [ $? -eq 0 ]; then
        print_success "All services started"
    else
        print_error "Failed to start services"
        exit 1
    fi
}

check_service_health() {
    print_section "Checking Service Health"

    # Check PostgreSQL
    print_info "Checking PostgreSQL..."
    if docker compose exec postgres pg_isready -U postgres &> /dev/null; then
        print_success "PostgreSQL is healthy"
    else
        print_error "PostgreSQL is not responding"
    fi

    # Check Ollama
    print_info "Checking Ollama..."
    if docker compose exec ollama ollama list &> /dev/null; then
        print_success "Ollama is healthy"
    else
        print_error "Ollama is not responding"
    fi

    # Check Next.js
    print_info "Checking Next.js app..."
    if curl -f http://localhost:3000 &> /dev/null; then
        print_success "Next.js app is responding"
    else
        print_warning "Next.js app may still be starting..."
    fi
}

#############################################
# Main Execution
#############################################

main() {
    print_header

    # Parse arguments
    local mode="dev"
    local skip_model_check=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --prod|production)
                mode="prod"
                shift
                ;;
            --skip-model)
                skip_model_check=true
                shift
                ;;
            --model)
                OLLAMA_MODEL="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --prod, production    Start in production mode"
                echo "  --skip-model          Skip Ollama model check/download"
                echo "  --model MODEL_NAME    Specify Ollama model to use"
                echo "  --help                Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                print_info "Use --help for usage information"
                exit 1
                ;;
        esac
    done

    # Run checks
    check_docker
    check_env_file

    # Start services
    start_services "$mode"

    # Setup database
    setup_database

    # Setup Ollama model
    if [ "$skip_model_check" = false ]; then
        check_ollama_model "${OLLAMA_MODEL:-$DEFAULT_OLLAMA_MODEL}"
    fi

    # Final health check
    sleep 5
    check_service_health

    # Print success message
    echo ""
    echo -e "${COLOR_BOLD}${COLOR_GREEN}═══════════════════════════════════════════════${COLOR_RESET}"
    echo -e "${COLOR_BOLD}${COLOR_GREEN}  ${EMOJI_SPARKLES} Application Started Successfully! ${EMOJI_SPARKLES}${COLOR_RESET}"
    echo -e "${COLOR_BOLD}${COLOR_GREEN}═══════════════════════════════════════════════${COLOR_RESET}"
    echo ""
    echo -e "${COLOR_CYAN}${EMOJI_ROCKET} Your meal planner is ready at:${COLOR_RESET}"
    echo -e "${COLOR_BOLD}   http://localhost:3000${COLOR_RESET}"
    echo ""
    echo -e "${COLOR_CYAN}${EMOJI_BRAIN} Ollama API available at:${COLOR_RESET}"
    echo -e "${COLOR_BOLD}   http://localhost:11434${COLOR_RESET}"
    echo ""
    echo -e "${COLOR_CYAN}${EMOJI_DATABASE} Database accessible at:${COLOR_RESET}"
    echo -e "${COLOR_BOLD}   localhost:5432${COLOR_RESET}"
    echo ""
    print_info "To stop services: docker compose down"
    print_info "To view logs: docker compose logs -f"
    echo ""
}

# Run main function
main "$@"
```

### Usage Examples

```bash
# Start in development mode
./start.sh

# Start in production mode
./start.sh --prod

# Skip Ollama model download
./start.sh --skip-model

# Use specific model
./start.sh --model mistral:7b

# Production with custom model
./start.sh --prod --model llama3.1:8b
```

---

## Environment Configuration

### .env.example

```bash
#############################################
# AI Weekly Meal Planner - Environment Config
#############################################

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme_in_production
POSTGRES_DB=mealplanner
DATABASE_URL=postgresql://postgres:changeme_in_production@postgres:5432/mealplanner

# Ollama Configuration
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_DEFAULT_MODEL=llama3.2:3b

# Optional: Image Storage (for production)
# BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Optional: External APIs (post-MVP)
# EDAMAM_APP_ID=your_app_id
# EDAMAM_APP_KEY=your_app_key
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NODE_ENV | Yes | development | Environment mode |
| NEXT_PUBLIC_APP_URL | Yes | http://localhost:3000 | Public app URL |
| POSTGRES_USER | Yes | postgres | Database username |
| POSTGRES_PASSWORD | Yes | - | Database password |
| POSTGRES_DB | Yes | mealplanner | Database name |
| DATABASE_URL | Yes | - | Full database connection string |
| OLLAMA_BASE_URL | Yes | http://ollama:11434 | Ollama API endpoint |
| OLLAMA_DEFAULT_MODEL | No | llama3.2:3b | Default AI model |

---

## Data Persistence

### Volume Management

1. **PostgreSQL Data**
   - Volume: `postgres-data`
   - Path: `/var/lib/postgresql/data`
   - Backup: `docker run --rm -v postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/db-backup.tar.gz /data`

2. **Ollama Models**
   - Volume: `ollama-models`
   - Path: `/root/.ollama`
   - Size: ~2-20GB depending on models
   - Backup: Not necessary (can re-download)

3. **Next.js Build Cache (dev only)**
   - Volume: Anonymous volume
   - Path: `/app/.next`
   - Cleared on rebuild

### Backup Strategy

```bash
# Backup database
docker compose exec postgres pg_dump -U postgres mealplanner > backup.sql

# Restore database
docker compose exec -T postgres psql -U postgres mealplanner < backup.sql

# List Ollama models
docker compose exec ollama ollama list

# Export full database volume
docker run --rm -v mealplanner_postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/db-volume-backup.tar.gz /data
```

---

## Network Configuration

### Internal Network

- Name: `meal-planner-network`
- Driver: `bridge`
- Subnet: Auto-assigned by Docker
- Internal DNS: Enabled (service names resolve)

### Port Mapping

| Service | Internal Port | External Port | Purpose |
|---------|--------------|---------------|---------|
| Next.js | 3000 | 3000 | Web application |
| PostgreSQL | 5432 | 5432 | Database access |
| Ollama | 11434 | 11434 | AI API |

### Firewall Considerations

For production deployment:
- Only expose port 3000 publicly
- Restrict ports 5432 and 11434 to internal network
- Use reverse proxy (nginx/Caddy) for HTTPS

---

## Development Workflow

### Daily Development

```bash
# Start services
./start.sh

# View logs
docker compose logs -f nextjs

# Execute commands in containers
docker compose exec nextjs pnpm prisma studio
docker compose exec ollama ollama run llama3.2:3b

# Restart single service
docker compose restart nextjs

# Stop all services
docker compose down
```

### Database Operations

```bash
# Create migration
docker compose exec nextjs pnpm prisma migrate dev --name add_new_field

# Apply migrations
docker compose exec nextjs pnpm prisma migrate deploy

# Reset database (dev only)
docker compose exec nextjs pnpm prisma migrate reset

# Open Prisma Studio
docker compose exec nextjs pnpm prisma studio
```

### Ollama Operations

```bash
# List installed models
docker compose exec ollama ollama list

# Download new model
docker compose exec ollama ollama pull mistral:7b

# Remove model
docker compose exec ollama ollama rm llama3.2:3b

# Test model
docker compose exec ollama ollama run llama3.2:3b "Generate a breakfast recipe"
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Update .env with production values
- [ ] Change database password
- [ ] Set NODE_ENV=production
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up reverse proxy (nginx/Caddy)
- [ ] Configure backups
- [ ] Set resource limits in docker-compose.yml
- [ ] Enable monitoring/logging
- [ ] Test database migrations
- [ ] Verify Ollama model availability

### Resource Limits (Production)

Add to docker-compose.yml:

```yaml
services:
  nextjs:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  postgres:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G

  ollama:
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G
        reservations:
          cpus: '2'
          memory: 4G
```

### Monitoring & Logging

```bash
# View resource usage
docker stats

# Export logs
docker compose logs > application.log

# Monitor specific service
docker compose logs -f --tail=100 nextjs
```

---

## Troubleshooting

### Common Issues

**Issue: Ollama service fails to start**
```bash
# Check logs
docker compose logs ollama

# Restart service
docker compose restart ollama
```

**Issue: Database connection refused**
```bash
# Check PostgreSQL status
docker compose exec postgres pg_isready

# View database logs
docker compose logs postgres
```

**Issue: Port already in use**
```bash
# Find process using port
lsof -i :3000

# Kill process or change port in docker-compose.yml
```

**Issue: Ollama model not found**
```bash
# Download model manually
docker compose exec ollama ollama pull llama3.2:3b
```

---

## Security Considerations

### Development

- Default passwords are acceptable
- All ports can be exposed
- Debug logging enabled

### Production

- [ ] Change all default passwords
- [ ] Use secrets management (Docker secrets)
- [ ] Restrict database port (5432) to internal network only
- [ ] Restrict Ollama port (11434) to internal network only
- [ ] Use HTTPS with valid certificates
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Set up firewall rules

---

## Performance Tuning

### PostgreSQL

```yaml
# Add to docker-compose.yml
environment:
  POSTGRES_INITDB_ARGS: "-c shared_buffers=256MB -c max_connections=200"
```

### Ollama

```yaml
# Add GPU support
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

### Next.js

```yaml
# Increase Node memory
environment:
  NODE_OPTIONS: "--max-old-space-size=4096"
```

---

## Conclusion

This Docker setup provides:
- One-command startup via `start.sh`
- Complete isolation and reproducibility
- Easy local development with hot-reload
- Production-ready configuration
- Automatic dependency management
- Persistent data storage
- Integrated Ollama AI service

For questions or issues, refer to the main PRD or Ollama Architecture documents.
