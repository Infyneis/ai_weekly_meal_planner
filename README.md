<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/utensils.svg" alt="AI Weekly Meal Planner" width="100" height="100" />
</p>

<h1 align="center">🍽️ AI Weekly Meal Planner</h1>
<h3 align="center">Plan your meals with ease using real recipes from the web <code>#11/365 - Year Coding Challenge</code></h3>

<p align="center">
  <em>Beautiful weekly calendar, recipe book, nutritional insights, and a cozy warm theme</em>
</p>

<p align="center">
  <a href="https://github.com/Infyneis">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/samy-djemili/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## ✨ Overview

A modern **meal planning application** that fetches real recipes from TheMealDB API. Plan your weekly meals with a beautiful calendar view, save recipes to your personal cookbook, and track nutritional information. Features a cozy, warm-themed UI with Shadcn components.

<p align="center">
  <img src="https://img.shields.io/badge/🚀_Year_Coding_Challenge-Project_%2311-E07A5F?style=for-the-badge" alt="Year Coding Challenge" />
  <img src="https://img.shields.io/badge/📅_Completed-December_23,_2024-F2CC8F?style=for-the-badge" alt="Completed" />
  <img src="https://img.shields.io/badge/🎨_Theme-Cozy_Warm-D4A373?style=for-the-badge" alt="Theme" />
</p>

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 📅 **Weekly Calendar** | View and plan breakfast, lunch, and dinner for the entire week |
| 🔄 **Smart Recipe Fetching** | Pulls real recipes from TheMealDB API - no AI hallucinations! |
| ✅ **Keep or Retry** | Like a meal suggestion? Keep it! Want something else? Retry! |
| 📖 **Recipe Book** | Save your favorite recipes to a personal cookbook |
| 🌐 **Online Search** | Search thousands of recipes by name, cuisine, or category |
| 📥 **Import Recipes** | Import recipes from URLs or paste text (AI-powered transcription) |
| 📊 **Nutrition Charts** | Visual breakdown of calories, protein, carbs, fat, and fiber |
| 🖼️ **Real Images** | Every recipe comes with a beautiful photo |
| 🎨 **Cozy Theme** | Warm terracotta, sage green, and cream color palette |
| 🌙 **Dark Mode** | Full dark mode support |
| 🐳 **Docker Ready** | PostgreSQL runs in Docker for easy setup |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
      <br>Next.js 15
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React 19
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind 4
    </td>
    <td align="center" width="96">
      <img src="https://ui.shadcn.com/apple-touch-icon.png" width="48" height="48" alt="shadcn" />
      <br>shadcn/ui
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=postgres" width="48" height="48" alt="PostgreSQL" />
      <br>PostgreSQL
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=prisma" width="48" height="48" alt="Prisma" />
      <br>Prisma 6
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=docker" width="48" height="48" alt="Docker" />
      <br>Docker
    </td>
    <td align="center" width="96">
      <img src="https://ollama.com/public/ollama.png" width="48" height="48" alt="Ollama" />
      <br>Ollama
    </td>
    <td align="center" width="96">
      <img src="https://recharts.org/favicon.ico" width="48" height="48" alt="Recharts" />
      <br>Recharts
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ 📅 Calendar  │  │ 📖 Recipe    │  │ 🔍 Online Search      │  │
│  │ (Week View)  │  │ Book         │  │ (TheMealDB)           │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                       API Routes (App Router)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ 🍽️ Meals     │  │ 📋 Recipes   │  │ 🌐 TheMealDB          │  │
│  │ CRUD API     │  │ CRUD API     │  │ Integration           │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                                         │
    ┌────┴────┐                               ┌────┴────┐
    │ Postgres│                               │ MealDB  │
    │ (Docker)│                               │ API     │
    └─────────┘                               └─────────┘
```

---

## 📂 Project Structure

```
ai_weekly_meal_planner/
├── 🚀 start.sh                      # One-click setup & launch
├── 🐳 docker-compose.yml            # PostgreSQL container
├── 📦 package.json                  # Dependencies & scripts
├── prisma/
│   └── 📝 schema.prisma             # Database schema
├── src/
│   ├── app/
│   │   ├── 🏠 layout.tsx            # Root layout with navigation
│   │   ├── 📅 page.tsx              # Meal planner (calendar)
│   │   ├── 📖 recipes/page.tsx      # Recipe book
│   │   └── api/
│   │       ├── 🍽️ meals/            # Meal plan CRUD
│   │       ├── 📋 recipes/          # Recipe CRUD + search + import
│   │       └── 🤖 ai/               # AI endpoints (transcribe)
│   ├── components/
│   │   ├── 🎨 ui/                   # shadcn/ui components
│   │   ├── 📅 meal-planner/         # Calendar, meal cards
│   │   ├── 📖 recipe-book/          # Recipe cards, detail, import
│   │   └── 🧭 shared/               # Navigation, theme toggle
│   └── lib/
│       ├── 🗄️ db.ts                 # Prisma client
│       ├── 🌐 mealdb.ts             # TheMealDB API client
│       ├── 🦙 ollama.ts             # Ollama AI client
│       └── 🔧 utils.ts              # Helper functions
└── 📖 README.md
```

---

## 🚀 Quick Start

### Prerequisites

- 🍺 **Homebrew** - [Install](https://brew.sh) (script will install if missing)
- 🟢 **Node.js 20+** - [Download](https://nodejs.org) (script will install if missing)
- 🐳 **Docker Desktop** - [Download](https://docker.com/products/docker-desktop)
- 🦙 **Ollama** (optional) - [Download](https://ollama.ai) for recipe transcription

### One-Command Launch 🎯

```bash
./start.sh
```

This script automatically:

1. ✅ Checks for Homebrew, pnpm, Node.js, Docker
2. 🐳 Starts PostgreSQL in Docker
3. 📦 Installs dependencies
4. 🗄️ Sets up the database schema
5. 🦙 Optionally starts Ollama for AI features
6. 🚀 Launches the app at **<http://localhost:3000>**

---

## 🔄 How It Works

### Meal Planning Flow

```
📅 Open Weekly Calendar
    │
    ▼
┌──────────────────┐
│  🔘 Empty Slot   │  Click "Generate" on any meal slot
└──────────────────┘
    │
    ▼ Fetches from TheMealDB API
┌──────────────────┐
│  🍽️ Meal Card    │  Shows recipe with image, time, nutrition
└──────────────────┘
    │
    ├──── ✅ Keep ──── Save this meal to your plan
    │
    └──── 🔄 Retry ──── Get a different suggestion
```

### Recipe Book Flow

```
📖 Recipe Book
    │
    ├──── 🌐 Search Online ──── Find recipes from TheMealDB
    │         │
    │         └──── 📥 Import ──── Add to your cookbook
    │
    ├──── 📝 Import Recipe ──── Paste URL or text
    │         │
    │         └──── 🤖 AI Transcription ──── Extracts structured data
    │
    └──── 🗑️ Delete ──── Remove from cookbook
```

---

## 🗄️ Database Schema

### 📋 Recipe Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Recipe name |
| description | TEXT | Short description |
| imageUrl | TEXT | Photo URL |
| prepTime | INT | Preparation minutes |
| cookTime | INT | Cooking minutes |
| servings | INT | Number of servings |
| cuisine | TEXT | e.g., Italian, Mexican |
| difficulty | TEXT | easy, medium, hard |
| instructions | TEXT[] | Step-by-step guide |
| dietaryTags | TEXT[] | e.g., vegetarian, gluten-free |
| source | TEXT | ai-generated, mealdb, manual |
| inRecipeBook | BOOL | Saved to cookbook? |

### 🍽️ PlannedMeal Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| date | DATE | Planned date |
| mealType | ENUM | BREAKFAST, LUNCH, DINNER |
| status | ENUM | SUGGESTED, VALIDATED |
| recipeId | UUID | FK to Recipe |
| mealPlanId | UUID | FK to MealPlan |

---

## 🎨 Design System

### Color Palette (Cozy Theme)

| Color | Light | Dark | Usage |
|-------|-------|------|-------|
| 🧡 Primary | Terracotta | Warm Orange | Buttons, accents |
| 🌿 Secondary | Soft Sage | Muted Sage | Secondary elements |
| 🍞 Background | Warm Cream | Dark Brown | Page background |
| 🍑 Accent | Peachy Pink | Deep Peach | Highlights |

### Meal Type Gradients

| Meal | Gradient |
|------|----------|
| 🌅 Breakfast | Cream → Peach |
| ☀️ Lunch | Sage → Green |
| 🌙 Dinner | Orange → Coral |

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `./start.sh` | Setup everything and launch |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm prisma:push` | Push schema to database |
| `pnpm prisma:studio` | Open Prisma Studio GUI |
| `docker compose up -d` | Start PostgreSQL |
| `docker compose down` | Stop PostgreSQL |

---

## 🌐 TheMealDB Integration

This app uses [TheMealDB](https://www.themealdb.com/) - a free, open recipe API:

- **No API key required** for basic usage
- **Thousands of recipes** with images
- **Filter by cuisine**: Italian, Mexican, Chinese, etc.
- **Filter by category**: Beef, Chicken, Seafood, Vegetarian, etc.
- **Meal type mapping**:
  - Breakfast → Breakfast category
  - Lunch → Side, Starter, Vegetarian, Pasta
  - Dinner → Beef, Chicken, Pork, Seafood, Lamb

---

## 🐛 Troubleshooting

### Docker not running

```bash
# Start Docker Desktop, then:
docker compose up -d
```

### Database connection error

```bash
# Check if PostgreSQL is running
docker compose ps

# Reset database
docker compose down -v
docker compose up -d
pnpm prisma:push
```

### Ollama not responding (for recipe transcription)

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve
```

---

## 📄 License

This project is open source and available for personal/educational use.

---

## 🙏 Acknowledgments

- 🌐 [TheMealDB](https://www.themealdb.com) - Free recipe API
- ⚛️ [Next.js](https://nextjs.org) - React framework
- 🎨 [shadcn/ui](https://ui.shadcn.com) - Beautiful components
- 🎨 [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- 📊 [Recharts](https://recharts.org) - Chart library
- 🗄️ [Prisma](https://prisma.io) - TypeScript ORM
- 🦙 [Ollama](https://ollama.ai) - Local LLM runtime
- 💡 [Lucide](https://lucide.dev) - Beautiful icons

---

<p align="center">
  Made with 🧡 by <strong>Samy DJEMILI</strong>
</p>

<p align="center">
  <a href="#top">⬆️ Back to top</a>
</p>
