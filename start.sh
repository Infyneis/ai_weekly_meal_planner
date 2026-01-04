#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🍽️  AI WEEKLY MEAL PLANNER - START SCRIPT                               ║
# ║                                                                           ║
# ║   This script sets up and launches the AI Meal Planner application.       ║
# ║   It automatically installs all dependencies and starts the services.     ║
# ║                                                                           ║
# ║   Features:                                                               ║
# ║   • 🍺 Installs Homebrew if missing                                       ║
# ║   • 📦 Installs pnpm package manager                                      ║
# ║   • 🐳 Sets up Docker & PostgreSQL database                               ║
# ║   • 🦙 Configures Ollama for local AI                                     ║
# ║   • 🗄️  Runs database migrations with Prisma                              ║
# ║   • 🚀 Launches the Next.js development server                            ║
# ║                                                                           ║
# ║   Usage: ./start.sh                                                       ║
# ║                                                                           ║
# ║   Author: Samy DJEMILI                                                    ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e # 🛑 Exit immediately if any command fails

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🎨 COLORS & FORMATTING                                                    │
# │ Define ANSI escape codes for colorful terminal output                     │
# └───────────────────────────────────────────────────────────────────────────┘
RED='\033[0;31m'       # ❌ Errors
GREEN='\033[0;32m'     # ✅ Success messages
YELLOW='\033[1;33m'    # ⚠️  Warnings & installations
BLUE='\033[0;34m'      # 📘 Info messages
ORANGE='\033[0;33m'    # 🧡 Cozy accent color (matches app theme)
PEACH='\033[38;5;216m' # 🍑 Warm peachy color
BROWN='\033[38;5;130m' # 🤎 Earthy brown
CREAM='\033[38;5;223m' # 🍦 Cream color
CYAN='\033[0;36m'      # 🔵 Highlights
BOLD='\033[1m'         # 💪 Bold text
NC='\033[0m'           # 🔄 Reset (No Color)

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 📂 DIRECTORY SETUP                                                        │
# │ Navigate to the script's directory for consistent execution               │
# └───────────────────────────────────────────────────────────────────────────┘
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🎬 WELCOME BANNER                                                         │
# │ Display a beautiful ASCII art header with cozy vibes                      │
# └───────────────────────────────────────────────────────────────────────────┘
echo ""
echo -e "${ORANGE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${ORANGE}║${NC}                                                               ${ORANGE}║${NC}"
echo -e "${ORANGE}║${NC}   🍽️   ${BOLD}${CREAM}AI WEEKLY MEAL PLANNER${NC}                               ${ORANGE}║${NC}"
echo -e "${ORANGE}║${NC}                                                               ${ORANGE}║${NC}"
echo -e "${ORANGE}║${NC}   ${PEACH}Plan your meals, save recipes, eat well${NC}                   ${ORANGE}║${NC}"
echo -e "${ORANGE}║${NC}                                                               ${ORANGE}║${NC}"
echo -e "${ORANGE}║${NC}   🥗 Breakfast  •  🍲 Lunch  •  🍝 Dinner                      ${ORANGE}║${NC}"
echo -e "${ORANGE}║${NC}                                                               ${ORANGE}║${NC}"
echo -e "${ORANGE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🔧 UTILITY FUNCTIONS                                                      │
# │ Helper functions for common operations                                    │
# └───────────────────────────────────────────────────────────────────────────┘

# 🔍 Check if a command exists in PATH
command_exists() {
  command -v "$1" &>/dev/null
}

# ✅ Print a success message with checkmark
print_success() {
  echo -e "${GREEN}   ✅ $1${NC}"
}

# ⚠️  Print a warning/info message
print_warning() {
  echo -e "${YELLOW}   ⚠️  $1${NC}"
}

# 📘 Print an info message
print_info() {
  echo -e "${BLUE}   📘 $1${NC}"
}

# ❌ Print an error message
print_error() {
  echo -e "${RED}   ❌ $1${NC}"
}

# 🔄 Print a step header with cozy styling
print_step() {
  echo ""
  echo -e "${ORANGE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}   $1${NC}"
  echo -e "${ORANGE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   📦 DEPENDENCY CHECKS & INSTALLATION                                     ║
# ║                                                                           ║
# ║   The following section verifies all required tools are installed:        ║
# ║   • Homebrew (macOS package manager)                                      ║
# ║   • pnpm (fast, disk-efficient package manager)                           ║
# ║   • Node.js (JavaScript runtime)                                          ║
# ║   • Docker (containerization platform)                                    ║
# ║   • Ollama (local LLM runner)                                             ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "🔍 Checking Dependencies"

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🍺 HOMEBREW CHECK                                                         │
# │ Homebrew is the package manager for macOS, needed to install other tools  │
# └───────────────────────────────────────────────────────────────────────────┘
if ! command_exists brew; then
  print_warning "Homebrew not found. Installing... 🍺"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  # 🍎 Add Homebrew to PATH for Apple Silicon Macs (M1/M2/M3)
  if [[ -f "/opt/homebrew/bin/brew" ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
else
  print_success "Homebrew is installed 🍺"
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 📦 PNPM CHECK                                                             │
# │ pnpm is a fast, disk space efficient package manager for Node.js          │
# └───────────────────────────────────────────────────────────────────────────┘
if ! command_exists pnpm; then
  print_warning "pnpm not found. Installing via Homebrew... 📦"
  brew install pnpm
else
  print_success "pnpm is installed 📦"
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🟢 NODE.JS CHECK                                                          │
# │ Node.js is required to run the Next.js application                        │
# └───────────────────────────────────────────────────────────────────────────┘
if ! command_exists node; then
  print_warning "Node.js not found. Installing via Homebrew... 🟢"
  brew install node
else
  NODE_VERSION=$(node --version)
  print_success "Node.js is installed ($NODE_VERSION) 🟢"
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🐳 DOCKER CHECK                                                           │
# │ Docker runs our PostgreSQL database in a container                        │
# └───────────────────────────────────────────────────────────────────────────┘
if ! command_exists docker; then
  print_warning "Docker not found. Installing via Homebrew... 🐳"
  brew install --cask docker
  print_info "Please start Docker Desktop manually, then re-run this script"
  exit 1
else
  print_success "Docker is installed 🐳"
fi

# 🐳 Check if Docker daemon is running
if ! docker info &>/dev/null; then
  print_warning "Docker is not running. Starting Docker Desktop... 🐳"
  open -a Docker
  print_info "Waiting for Docker to start (this may take up to 30 seconds)..."

  # ⏳ Wait for Docker daemon to be ready (max 60 seconds)
  COUNTER=0
  while ! docker info &>/dev/null; do
    sleep 2
    COUNTER=$((COUNTER + 2))
    if [ $COUNTER -ge 60 ]; then
      print_error "Docker failed to start. Please start Docker Desktop manually."
      exit 1
    fi
  done
  print_success "Docker is now running! 🐳"
else
  print_success "Docker daemon is running 🐳"
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🦙 OLLAMA CHECK                                                           │
# │ Ollama runs local LLMs - powers our AI meal suggestions                   │
# └───────────────────────────────────────────────────────────────────────────┘
if ! command_exists ollama; then
  print_warning "Ollama not found. Installing via Homebrew... 🦙"
  brew install ollama
else
  print_success "Ollama is installed 🦙"
fi

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🐘 POSTGRESQL DATABASE SETUP                                            ║
# ║                                                                           ║
# ║   Start the PostgreSQL container using Docker Compose                     ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "🐘 Setting Up PostgreSQL Database"

# 🐳 Start PostgreSQL container (or restart if already exists)
if docker ps -a --format '{{.Names}}' | grep -q "meal-planner-db"; then
  if docker ps --format '{{.Names}}' | grep -q "meal-planner-db"; then
    print_success "PostgreSQL container is already running 🐘"
  else
    print_info "Starting existing PostgreSQL container... 🐘"
    docker start meal-planner-db
    sleep 3
    print_success "PostgreSQL container started!"
  fi
else
  print_info "Creating PostgreSQL container... 🐘"
  docker compose up -d
  print_info "Waiting for database to be ready..."
  sleep 5
  print_success "PostgreSQL container created and running!"
fi

# ⏳ Wait for PostgreSQL to be fully ready
print_info "Checking database connection..."
COUNTER=0
while ! docker exec meal-planner-db pg_isready -U mealplanner -d mealplanner &>/dev/null; do
  sleep 1
  COUNTER=$((COUNTER + 1))
  if [ $COUNTER -ge 30 ]; then
    print_error "PostgreSQL failed to become ready. Check Docker logs."
    exit 1
  fi
done
print_success "PostgreSQL is ready and accepting connections! 🐘"

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🦙 OLLAMA SERVER & MODEL SETUP                                          ║
# ║                                                                           ║
# ║   Ensure the Ollama server is running and the llama3.2 model is ready     ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "🦙 Setting Up AI Service"

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🚀 START OLLAMA SERVER                                                    │
# │ Check if Ollama is running, if not start it in the background             │
# └───────────────────────────────────────────────────────────────────────────┘
if ! pgrep -x "ollama" >/dev/null && ! curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
  print_info "Starting Ollama server in background... 🚀"
  ollama serve >/dev/null 2>&1 &
  OLLAMA_PID=$!
  print_success "Ollama server started (PID: $OLLAMA_PID)"

  # ⏳ Wait for server to be ready
  sleep 3
else
  print_success "Ollama server is already running 🟢"
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🧠 DOWNLOAD AI MODEL                                                      │
# │ Pull the llama3.2 model if it's not already downloaded                    │
# │ This model generates meal suggestions and transcribes recipes             │
# └───────────────────────────────────────────────────────────────────────────┘
if ! ollama list 2>/dev/null | grep -q "llama3.2"; then
  echo ""
  print_info "Downloading llama3.2 model... 🧠"
  print_info "This may take a few minutes on first run (about 2GB download)"
  echo ""
  ollama pull llama3.2
  print_success "llama3.2 model is ready!"
else
  print_success "llama3.2 model is available 🧠"
fi

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   📦 NPM DEPENDENCIES                                                     ║
# ║                                                                           ║
# ║   Install all Node.js packages required by the application                ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "📦 Installing Node.js Dependencies"

# 🔄 Run pnpm install to download and link all packages
pnpm install

print_success "All dependencies installed!"

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🗄️  DATABASE MIGRATIONS                                                 ║
# ║                                                                           ║
# ║   Run Prisma migrations to set up database schema                         ║
# ║   Creates tables for recipes, meal plans, ingredients, nutrition          ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "🗄️  Setting Up Database Schema"

# 🔄 Generate Prisma client and run migrations
if pnpm prisma generate 2>/dev/null; then
  print_success "Prisma client generated!"
else
  print_warning "Prisma client generation skipped (will run on first build)"
fi

if pnpm prisma db push 2>/dev/null; then
  print_success "Database schema synchronized!"
else
  print_warning "Database migration skipped (will run on first start)"
fi

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🚀 LAUNCH APPLICATION                                                   ║
# ║                                                                           ║
# ║   Start the Next.js development server with Turbopack                     ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "🚀 Launching AI Weekly Meal Planner"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}                                                               ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   ${BOLD}🎉 All systems ready!${NC}                                       ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                               ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   🍽️  App:      ${CYAN}http://localhost:3000${NC}                          ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   🦙 Ollama:   ${CYAN}http://localhost:11434${NC}                         ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   🐘 Postgres: ${CYAN}localhost:5432${NC}                                 ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                               ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   ${PEACH}✨ Start planning your delicious meals!${NC}                   ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                               ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   Press ${BOLD}Ctrl+C${NC} to stop the server                            ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                               ${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 🚀 Start the Next.js development server with Turbopack for fast HMR
pnpm dev

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 👋 END OF SCRIPT                                                          │
# │ The script will continue running until the user presses Ctrl+C            │
# │ Thank you for using AI Weekly Meal Planner! 🍽️                            │
# └───────────────────────────────────────────────────────────────────────────┘
