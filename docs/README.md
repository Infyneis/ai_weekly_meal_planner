# AI Weekly Meal Planner - Project Documentation

> A privacy-first, AI-powered weekly meal planning application using local Ollama models

**Status:** Specification Complete - Ready for Development
**Version:** 1.0
**Last Updated:** 2025-12-23

---

## Quick Links

- [Product Requirements Document (PRD)](./PRD.md) - Comprehensive product specification
- [Ollama Architecture](./OLLAMA_ARCHITECTURE.md) - Local AI integration details
- [Docker & DevOps Specification](./DOCKER_DEVOPS_SPECIFICATION.md) - Infrastructure and deployment
- [Decisions & Recommendations](./DECISIONS_AND_RECOMMENDATIONS.md) - Key decisions and rationale

---

## Project Overview

The AI Weekly Meal Planner is a Next.js application that helps users plan their weekly meals using AI-powered suggestions. Unlike traditional meal planning apps, this application runs AI entirely locally using Ollama, ensuring complete privacy and zero ongoing costs.

### Key Features

1. **AI Meal Suggestions** - Generate breakfast, lunch, and dinner for 7 days
2. **Recipe Book** - Import and manage recipes from external sources
3. **Nutritional Insights** - View macros, prep time, and ingredients
4. **Beautiful UI** - Comfy and cozy design with dark mode
5. **Complete Privacy** - All AI processing happens on your machine
6. **Zero API Costs** - No cloud AI fees, unlimited usage

---

## Tech Stack

```
Frontend:
  - Next.js 16 (App Router)
  - Shadcn UI + Tailwind CSS
  - Recharts (data visualization)
  - React Hook Form + Zod

Backend:
  - Next.js API Routes + Server Actions
  - PostgreSQL (via Docker)
  - Prisma ORM

AI:
  - Ollama (Local)
  - Recommended: Llama 3.2 (3B) or Mistral (7B)

Infrastructure:
  - Docker + Docker Compose
  - Beautiful start.sh script for one-command setup
```

---

## Documentation Structure

### 1. PRD.md (Product Requirements Document)
**Purpose:** Complete product specification
**Contents:**
- User personas and stories
- Functional requirements
- Data models and database schema
- UI/UX specifications
- Technical architecture
- API integrations
- Success metrics
- MVP scope definition

**When to read:** Before starting development, to understand the full product vision

---

### 2. OLLAMA_ARCHITECTURE.md
**Purpose:** Detailed explanation of local AI architecture
**Contents:**
- Why Ollama vs cloud AI
- Hardware requirements
- Recommended models
- API integration examples
- Performance expectations
- Setup instructions
- Cost analysis

**When to read:** To understand the AI integration strategy and setup process

---

### 3. DOCKER_DEVOPS_SPECIFICATION.md
**Purpose:** Infrastructure and deployment guide
**Contents:**
- Docker architecture
- Container specifications
- docker-compose.yml configurations
- start.sh script specification
- Environment configuration
- Data persistence strategy
- Development workflow
- Production deployment

**When to read:** When setting up the development environment or deploying

---

### 4. DECISIONS_AND_RECOMMENDATIONS.md
**Purpose:** Key product decisions and recommendations
**Contents:**
- Critical decisions made (user auth, features, etc.)
- Technical recommendations
- Open questions requiring input
- Risk assessment
- Implementation roadmap (6-week timeline)
- Success criteria

**When to read:** To understand why certain decisions were made and what to build first

---

## Getting Started

### Prerequisites

**Required:**
- Node.js 20+
- Docker Desktop
- Git
- 10GB free disk space

**Recommended Hardware:**
- 16GB RAM
- Modern CPU (8+ cores) or Apple Silicon
- 20GB free disk space

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd ai-meal-planner

# Run the beautiful setup script
chmod +x start.sh
./start.sh

# Application will be available at:
# http://localhost:3000
```

The `start.sh` script will:
- Check for Docker installation
- Create .env file from template
- Start all services (Next.js, PostgreSQL, Ollama)
- Download required Ollama models
- Run database migrations
- Perform health checks

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  User's Browser                 │
│              http://localhost:3000              │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              Next.js Container                  │
│  ┌──────────────────────────────────────────┐  │
│  │  App Router (React Server Components)    │  │
│  │  - Pages: Home, Recipe Book, Settings   │  │
│  │  - API Routes: /api/recipes, /api/meals │  │
│  │  - Server Actions: Mutations             │  │
│  └──────────────────────────────────────────┘  │
└──────────┬──────────────────────┬───────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐    ┌──────────────────┐
│   PostgreSQL     │    │     Ollama       │
│   Container      │    │   Container      │
│                  │    │                  │
│ - Recipes DB     │    │ - AI Models      │
│ - Meal Plans     │    │ - API Server     │
│ - User Data      │    │ - Model Cache    │
└──────────────────┘    └──────────────────┘
```

---

## Development Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Next.js setup with Tailwind + Shadcn
- Database schema and Prisma
- Docker environment
- Basic UI layouts

### Phase 2: AI Integration (Week 3)
- Ollama client service
- Meal generation prompts
- Recipe extraction
- Nutrition estimation

### Phase 3: Meal Planning (Week 4)
- Calendar component
- Generate/retry/validate workflow
- Meal detail views
- State management

### Phase 4: Recipe Book (Week 5)
- Recipe import and management
- Search and filtering
- Shopping list generator
- Image handling

### Phase 5: Polish & Launch (Week 6)
- Dark mode
- Responsive design
- Documentation
- User testing
- Deployment

**Total Timeline:** 6 weeks to production-ready MVP

---

## Key Design Decisions

### 1. Local AI (Ollama) instead of Cloud AI
**Why:** Complete privacy, zero ongoing costs, offline functionality
**Trade-off:** Requires user hardware, variable performance

### 2. Single-user for MVP
**Why:** Faster development, simpler architecture
**Future:** Multi-user with authentication in v2

### 3. Docker-first Development
**Why:** Consistency, easy setup, includes Ollama
**Benefit:** One-command startup via start.sh

### 4. Comfy & Cozy Theme
**Why:** Meal planning should be pleasant and inviting
**Colors:** Warm terracotta, soft sage, cream tones

### 5. Manual Meal Generation
**Why:** User control over local compute usage
**Alternative:** Auto-generate in settings (v2)

---

## MVP Features Checklist

### Core Meal Planning
- [x] Weekly calendar view (7 days × 3 meals)
- [x] AI-generated meal suggestions
- [x] Retry individual meals
- [x] Validate/keep meals
- [x] Meal detail view

### Recipe Book
- [x] Import from URL (text paste)
- [x] AI recipe transcription
- [x] Browse recipe collection
- [x] Save AI meals to book
- [x] Basic search

### Nutritional Insights
- [x] Macros per meal (P/C/F)
- [x] Calories and fiber
- [x] Prep/cook time
- [x] Ingredients list

### UI/UX
- [x] Responsive design
- [x] Comfy/cozy theme
- [x] Dark mode
- [x] Loading states
- [x] Error handling

### Infrastructure
- [x] Docker setup
- [x] Beautiful start.sh
- [x] PostgreSQL database
- [x] Ollama integration
- [x] Automatic migrations

---

## Post-MVP Features (v2+)

**High Priority:**
- Advanced search and filtering
- Recipe editing
- Weekly nutrition charts
- Export to PDF
- URL import (web scraping)

**Medium Priority:**
- User authentication
- Multi-week planning
- Drag-and-drop calendar
- Nutrition goals
- Meal prep mode

**Low Priority:**
- AI-generated images
- OCR for screenshots
- Grocery delivery integration
- Social features
- Mobile app

---

## Success Metrics

**MVP is successful if:**
1. Users generate full week (21 meals) in < 5 minutes
2. AI suggestion acceptance rate > 60%
3. Recipe import success rate > 80%
4. Page load time < 2 seconds
5. Users save 5+ recipes to book (avg)
6. 60%+ return for week 2

---

## File Structure (Planned)

```
ai-meal-planner/
├── README.md (this file)
├── PRD.md
├── OLLAMA_ARCHITECTURE.md
├── DOCKER_DEVOPS_SPECIFICATION.md
├── DECISIONS_AND_RECOMMENDATIONS.md
├── .env.example
├── start.sh
├── docker-compose.yml
├── docker-compose.dev.yml
├── Dockerfile
├── Dockerfile.dev
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (home/calendar)
│   │   ├── recipes/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── meals/
│   │       ├── recipes/
│   │       └── ollama/
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── calendar/
│   │   ├── recipes/
│   │   └── shared/
│   ├── lib/
│   │   ├── db.ts (Prisma client)
│   │   ├── ollama.ts (AI client)
│   │   └── utils.ts
│   └── types/
│       └── index.ts
└── public/
    └── placeholders/ (recipe images)
```

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/mealplanner

# Ollama
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_DEFAULT_MODEL=llama3.2:3b

# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Commands Reference

### Development

```bash
# Start all services
./start.sh

# Start in production mode
./start.sh --prod

# View logs
docker compose logs -f nextjs

# Access database
docker compose exec postgres psql -U postgres mealplanner

# Run Prisma Studio
docker compose exec nextjs pnpm prisma studio

# Test Ollama
docker compose exec ollama ollama run llama3.2:3b "Generate a recipe"
```

### Database

```bash
# Create migration
docker compose exec nextjs pnpm prisma migrate dev --name migration_name

# Apply migrations
docker compose exec nextjs pnpm prisma migrate deploy

# Reset database (dev)
docker compose exec nextjs pnpm prisma migrate reset
```

### Ollama

```bash
# List models
docker compose exec ollama ollama list

# Download model
docker compose exec ollama ollama pull mistral:7b

# Remove model
docker compose exec ollama ollama rm llama3.2:3b
```

---

## Contributing

This is currently a solo project. Guidelines for contributions will be added after MVP launch.

---

## FAQ

### Why Ollama instead of OpenAI?
- Complete privacy (no data sent to cloud)
- Zero API costs (no subscription fees)
- Offline functionality
- User controls their data

### What hardware do I need?
**Minimum:** 8GB RAM, 4-core CPU, 10GB disk
**Recommended:** 16GB RAM, 8-core CPU or Apple Silicon, 20GB disk

### Can I use cloud AI instead?
Not in MVP. Post-MVP, we may add optional cloud AI as fallback for users without capable hardware.

### Does it work offline?
Yes! Once Ollama models are downloaded, everything works offline.

### How accurate is the nutrition data?
AI estimates are typically within 10-20% accuracy. Post-MVP, we'll add USDA API validation.

### Can I share recipes with friends?
Not in MVP. Multi-user and sharing features planned for v2.

### Is my data backed up?
Your data is in Docker volumes. We recommend manual backups:
```bash
docker compose exec postgres pg_dump -U postgres mealplanner > backup.sql
```

---

## License

TBD (To be decided before open-source release)

---

## Contact

**Project Owner:** Samy
**Created:** 2025-12-23
**Status:** Specification Complete

---

## Next Steps

1. Review all documentation
2. Set up development environment
3. Run `./start.sh` to verify Docker setup
4. Begin Phase 1 development
5. Build the future of meal planning!

---

**Let's make meal planning delightful!** 🍳✨
