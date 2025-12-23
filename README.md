# 🍽️ AI Weekly Meal Planner

An AI-powered weekly meal planning application with a cozy, comfy design. Plan your meals, save recipes from anywhere, and get nutritional insights - all powered by local AI (Ollama).

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)
![Ollama](https://img.shields.io/badge/Ollama-Local%20AI-white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

## ✨ Features

### 📅 Weekly Meal Planning

- View your entire week at a glance with breakfast, lunch, and dinner slots
- AI generates creative meal suggestions for any time slot
- **Keep** meals you like, **retry** for new suggestions
- Navigate between weeks easily

### 📖 Recipe Book

- **Import recipes** from Instagram, websites, or paste text
- AI automatically transcribes and standardizes recipes
- Search and filter your recipe collection
- Beautiful card-based recipe display

### 📊 Nutritional Insights

- Calories, protein, carbs, fat, fiber for every meal
- Visual charts powered by Recharts
- AI-estimated nutrition when not provided

### 🎨 Cozy Design

- Warm, comforting color palette
- Dark mode support
- Responsive design for all devices

## 🚀 Quick Start

### Prerequisites

- macOS with Apple Silicon (M1/M2/M3) recommended
- Docker Desktop
- Node.js 20+

### One-Command Setup

```bash
./start.sh
```

This beautiful script will:

1. 🍺 Check/install Homebrew
2. 📦 Check/install pnpm
3. 🐳 Start PostgreSQL in Docker
4. 🦙 Start Ollama and download llama3.2 model
5. 📦 Install Node.js dependencies
6. 🗄️ Set up database schema
7. 🚀 Launch the development server

Then open [http://localhost:3000](http://localhost:3000) 🎉

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI Components | Shadcn UI |
| Styling | Tailwind CSS 4.0 |
| Charts | Recharts |
| Database | PostgreSQL 16 |
| ORM | Prisma 6 |
| AI | Ollama (llama3.2) |
| Container | Docker Compose |

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── ai/           # AI endpoints (generate, transcribe)
│   │   │   ├── meals/        # Meal plan CRUD
│   │   │   └── recipes/      # Recipe CRUD
│   │   ├── recipes/          # Recipe book page
│   │   └── page.tsx          # Meal planner (home)
│   ├── components/
│   │   ├── meal-planner/     # Calendar, meal cards
│   │   ├── recipe-book/      # Recipe cards, import, nutrition
│   │   ├── shared/           # Navigation, theme
│   │   └── ui/               # Shadcn components
│   └── lib/
│       ├── db.ts             # Prisma client
│       ├── ollama.ts         # AI integration
│       └── utils.ts          # Utilities
├── prisma/
│   └── schema.prisma         # Database schema
├── docker-compose.yml        # PostgreSQL container
├── start.sh                  # Setup & launch script
└── docs/                     # Detailed documentation
```

## 🗄️ Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Recipe    │──┬──│ Ingredient  │     │  NutritionInfo  │
└─────────────┘  │  └─────────────┘     └─────────────────┘
       │         │                              │
       │         └──────────────────────────────┘
       │
┌─────────────┐     ┌─────────────┐
│  MealPlan   │─────│ PlannedMeal │
└─────────────┘     └─────────────┘
```

## 🤖 AI Features

### Meal Generation

The AI considers:

- Meal type (breakfast/lunch/dinner appropriate)
- Existing meals in the week (avoids duplicates)
- Dietary preferences (coming soon)

### Recipe Transcription

Paste any recipe text and AI will extract:

- Title and description
- Ingredients with quantities
- Step-by-step instructions
- Estimated nutrition
- Cooking times

## 📝 Available Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack

# Database
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:push      # Push schema to database
pnpm prisma:studio    # Open Prisma Studio GUI

# Build
pnpm build           # Production build
pnpm start           # Start production server
```

## 🐳 Docker Commands

```bash
# Start PostgreSQL
docker compose up -d

# Stop PostgreSQL
docker compose down

# View logs
docker compose logs -f

# Reset database
docker compose down -v  # Removes volume
docker compose up -d
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://mealplanner:mealplanner_secret@localhost:5432/mealplanner"

# Ollama
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="llama3.2"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🎨 Color Palette

The cozy theme uses warm, kitchen-inspired colors:

| Purpose | Light Mode | Dark Mode |
|---------|------------|-----------|
| Primary | Terracotta Orange | Warm Orange |
| Secondary | Soft Sage | Muted Sage |
| Background | Warm Cream | Dark Brown |
| Accent | Peachy Pink | Deep Peach |

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- `PRD.md` - Full product requirements
- `OLLAMA_ARCHITECTURE.md` - AI integration details
- `DOCKER_DEVOPS_SPECIFICATION.md` - Infrastructure guide

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for beautiful components
- [Ollama](https://ollama.ai/) for local AI
- [Recharts](https://recharts.org/) for charts

---

Made with 🧡 as part of the Year Coding Challenge (#11/365)
