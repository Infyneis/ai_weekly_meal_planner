# Implementation Checklist - AI Weekly Meal Planner

**Purpose:** Step-by-step guide for building the MVP
**Timeline:** 6 weeks
**Status:** Ready to Start

---

## Pre-Development Setup

### Repository Initialization
- [ ] Create GitHub repository
- [ ] Clone repository locally
- [ ] Copy all documentation to repo
- [ ] Create .gitignore for Next.js/Node.js
- [ ] Initial commit with documentation

### Development Environment
- [ ] Install Docker Desktop
- [ ] Install Node.js 20+
- [ ] Install pnpm (or npm/yarn)
- [ ] Verify Docker is running
- [ ] Verify Docker Compose is available

---

## Phase 1: Foundation (Week 1-2)

### Week 1: Next.js & Infrastructure Setup

#### Day 1: Project Initialization
- [ ] Create Next.js 16 app: `npx create-next-app@latest`
  - Use App Router: Yes
  - Use TypeScript: Yes
  - Use Tailwind: Yes
  - Use src/ directory: Yes
- [ ] Install dependencies:
  ```bash
  pnpm add @prisma/client
  pnpm add -D prisma
  pnpm add react-hook-form zod @hookform/resolvers
  pnpm add recharts
  pnpm add date-fns
  ```
- [ ] Initialize Prisma: `pnpm prisma init`
- [ ] Create directory structure (see README.md)
- [ ] Test dev server: `pnpm dev`

#### Day 2: Shadcn UI Setup
- [ ] Initialize Shadcn: `pnpm dlx shadcn-ui@latest init`
- [ ] Configure Tailwind theme (cozy colors)
- [ ] Install core components:
  ```bash
  pnpm dlx shadcn-ui@latest add button
  pnpm dlx shadcn-ui@latest add card
  pnpm dlx shadcn-ui@latest add dialog
  pnpm dlx shadcn-ui@latest add input
  pnpm dlx shadcn-ui@latest add form
  pnpm dlx shadcn-ui@latest add select
  pnpm dlx shadcn-ui@latest add tabs
  pnpm dlx shadcn-ui@latest add dropdown-menu
  ```
- [ ] Test components in a sample page

#### Day 3: Database Schema
- [ ] Create Prisma schema (see PRD.md Section 5)
  - [ ] Recipe model
  - [ ] Ingredient model
  - [ ] NutritionInfo model
  - [ ] MealPlan model
  - [ ] PlannedMeal model
- [ ] Configure database URL in .env
- [ ] Create initial migration: `pnpm prisma migrate dev --name init`
- [ ] Test Prisma Studio: `pnpm prisma studio`

#### Day 4-5: Docker Setup
- [ ] Create Dockerfile (see DOCKER_DEVOPS_SPECIFICATION.md)
- [ ] Create Dockerfile.dev
- [ ] Create docker-compose.yml
- [ ] Create docker-compose.dev.yml
- [ ] Create .env.example
- [ ] Write start.sh script (use specification)
- [ ] Make start.sh executable: `chmod +x start.sh`
- [ ] Test Docker setup: `./start.sh`
- [ ] Verify all containers start successfully
- [ ] Verify Next.js accessible at localhost:3000
- [ ] Verify PostgreSQL accessible
- [ ] Verify Ollama accessible at localhost:11434

### Week 2: Basic UI Components

#### Day 6-7: Layout & Navigation
- [ ] Create root layout (app/layout.tsx)
- [ ] Add theme provider (next-themes)
- [ ] Create header component
- [ ] Create navigation component
- [ ] Add dark mode toggle
- [ ] Style with cozy theme colors
- [ ] Test responsive design (mobile, tablet, desktop)

#### Day 8-9: Meal Card Component
- [ ] Create MealCard component
- [ ] Props: recipe, status (suggested/validated), actions
- [ ] Compact view (for calendar)
- [ ] Show: image, title, prep time, macros
- [ ] Action buttons: Retry, Validate, View Details
- [ ] Loading state
- [ ] Empty state
- [ ] Test with mock data

#### Day 10: Calendar Grid Component
- [ ] Create WeeklyCalendar component
- [ ] 7-day grid layout (Mon-Sun)
- [ ] 3 meal slots per day (breakfast, lunch, dinner)
- [ ] Render MealCard in each slot
- [ ] Week navigation (prev/next)
- [ ] Current week indicator
- [ ] Responsive: stack vertically on mobile
- [ ] Test with mock meals

**Phase 1 Deliverable:** Working Docker environment, database, basic UI components

---

## Phase 2: AI Integration (Week 3)

#### Day 11-12: Ollama Client Service
- [ ] Create lib/ollama.ts
- [ ] Implement connection check function
- [ ] Implement generateCompletion function
- [ ] Add retry logic
- [ ] Add timeout handling
- [ ] Add response validation
- [ ] Test connection to Ollama container
- [ ] Test with simple prompts

#### Day 13: Meal Generation Prompts
- [ ] Create prompt templates (lib/prompts/)
- [ ] Breakfast generation prompt
- [ ] Lunch generation prompt
- [ ] Dinner generation prompt
- [ ] Add dietary preference support
- [ ] Add exclusion list (avoid duplicates)
- [ ] Request JSON output format
- [ ] Test prompts manually with Ollama CLI

#### Day 14: Recipe Extraction
- [ ] Create recipe extraction prompt
- [ ] Parse text input
- [ ] Structure into recipe format
- [ ] Extract ingredients with quantities
- [ ] Extract instructions
- [ ] Estimate nutrition if not provided
- [ ] Test with sample recipe text

#### Day 15: Nutrition Estimation
- [ ] Create nutrition estimation prompt
- [ ] Calculate macros from ingredients
- [ ] Calculate calories
- [ ] Add "estimated" flag
- [ ] Test with various recipes
- [ ] Validate output format

**Phase 2 Deliverable:** Working AI integration with meal generation and recipe extraction

---

## Phase 3: Meal Planning (Week 4)

#### Day 16-17: Generate Week API
- [ ] Create API route: /api/meal-plans/generate
- [ ] Accept week_start_date param
- [ ] Generate 21 meals (7 days × 3 meals)
- [ ] Avoid duplicate meals in week
- [ ] Respect dietary preferences
- [ ] Save to database
- [ ] Return meal plan with all meals
- [ ] Add loading/progress indicators
- [ ] Test with Ollama

#### Day 18: Retry Meal API
- [ ] Create API route: /api/planned-meals/[id]/retry
- [ ] Accept exclusion list
- [ ] Generate new meal for same slot
- [ ] Update database
- [ ] Return new meal
- [ ] Test retry functionality

#### Day 19: Validate Meal API
- [ ] Create API route: /api/planned-meals/[id]/validate
- [ ] Update status to "validated"
- [ ] Create recipe snapshot (JSONB)
- [ ] Save to database
- [ ] Return updated meal
- [ ] Test validation

#### Day 20-21: Meal Planning UI
- [ ] Connect calendar to API
- [ ] Add "Generate Week" button
- [ ] Show loading state during generation
- [ ] Display generated meals
- [ ] Implement Retry button action
- [ ] Implement Validate button action
- [ ] Create meal detail modal
- [ ] Show full recipe in modal
- [ ] Add "Save to Recipe Book" button
- [ ] Test full workflow

**Phase 3 Deliverable:** Complete meal planning functionality

---

## Phase 4: Recipe Book (Week 5)

#### Day 22-23: Recipe CRUD APIs
- [ ] Create API route: POST /api/recipes (create)
- [ ] Create API route: GET /api/recipes (list)
- [ ] Create API route: GET /api/recipes/[id] (read)
- [ ] Create API route: PATCH /api/recipes/[id] (update)
- [ ] Create API route: DELETE /api/recipes/[id] (delete/soft)
- [ ] Add search query param
- [ ] Add filter query params
- [ ] Test all endpoints

#### Day 24: Add Recipe UI
- [ ] Create "Add Recipe" modal
- [ ] Three tabs: URL Import, Text Paste, Manual Entry
- [ ] Text paste: textarea + submit
- [ ] Call Ollama to extract recipe
- [ ] Show preview of extracted recipe
- [ ] Allow editing before saving
- [ ] Save to database
- [ ] Test import flow

#### Day 25: Recipe Grid View
- [ ] Create recipes/page.tsx
- [ ] Fetch recipes from API
- [ ] Display in grid (3-4 columns)
- [ ] Show recipe cards with image, title, meta
- [ ] Add search bar
- [ ] Add filter dropdowns
- [ ] Pagination or infinite scroll
- [ ] Link to detail page

#### Day 26: Recipe Detail Page
- [ ] Create recipes/[id]/page.tsx
- [ ] Fetch recipe by ID
- [ ] Display large image
- [ ] Show full description
- [ ] Tabs: Ingredients, Instructions, Nutrition
- [ ] Action buttons: Edit, Delete, Share
- [ ] Test navigation

#### Day 27: Shopping List
- [ ] Create shopping list generator
- [ ] Aggregate ingredients from week's meals
- [ ] Display in checklist format
- [ ] Add checkbox to mark purchased
- [ ] Export to text/CSV
- [ ] Test with full week plan

**Phase 4 Deliverable:** Recipe book with import, browsing, and shopping list

---

## Phase 5: Polish & Launch (Week 6)

#### Day 28: Dark Mode
- [ ] Configure Tailwind dark mode
- [ ] Define dark theme colors (see DECISIONS doc)
- [ ] Test all components in dark mode
- [ ] Fix any contrast issues
- [ ] Add theme toggle to header
- [ ] Persist theme preference

#### Day 29: Dietary Preferences
- [ ] Create settings/page.tsx
- [ ] Add dietary restrictions form
- [ ] Checkboxes: Vegetarian, Vegan, etc.
- [ ] Allergies text field
- [ ] Save to database or localStorage
- [ ] Pass preferences to AI prompts
- [ ] Test meal generation respects preferences

#### Day 30: Responsive Design
- [ ] Test all pages on mobile (< 640px)
- [ ] Test on tablet (640-1024px)
- [ ] Fix any layout issues
- [ ] Ensure touch targets are 44×44px
- [ ] Test swipe gestures if implemented
- [ ] Optimize images for mobile

#### Day 31: Error Handling & Feedback
- [ ] Add error boundaries
- [ ] Toast notifications for success/error
- [ ] Fallback UI for failed AI generation
- [ ] Graceful Ollama disconnection handling
- [ ] User-friendly error messages
- [ ] Loading skeletons

#### Day 32: Performance Optimization
- [ ] Optimize images (use next/image)
- [ ] Code splitting check
- [ ] Lazy load off-screen components
- [ ] Cache AI responses
- [ ] Database query optimization
- [ ] Run Lighthouse audit
- [ ] Fix any performance issues

#### Day 33: Documentation
- [ ] Write user guide (how to use app)
- [ ] Ollama setup instructions
- [ ] Troubleshooting guide
- [ ] Screenshots/demo video
- [ ] Update README with actual setup steps
- [ ] Comment complex code sections

#### Day 34-35: Testing & Bug Fixes
- [ ] Manual testing on macOS
- [ ] Test on Linux (if available)
- [ ] Test on Windows with Docker Desktop
- [ ] User acceptance testing (3-5 users)
- [ ] Fix reported bugs
- [ ] UI polish based on feedback
- [ ] Final review of all features

#### Day 36: Deployment Prep
- [ ] Set up production environment
- [ ] Configure production .env
- [ ] Change database password
- [ ] Set NODE_ENV=production
- [ ] Test production Docker build
- [ ] Prepare deployment guide
- [ ] Create backup/restore scripts

**Phase 5 Deliverable:** Production-ready MVP

---

## Launch Day

### Pre-Launch Checklist
- [ ] All MVP features working
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] User guide available
- [ ] Demo video/screenshots ready
- [ ] Backup strategy in place

### Launch Tasks
- [ ] Deploy to production
- [ ] Verify all services running
- [ ] Test end-to-end on production
- [ ] Share with initial users
- [ ] Monitor for errors
- [ ] Gather feedback

---

## Post-Launch (Week 7+)

### Week 7: Monitoring & Fixes
- [ ] Monitor usage metrics
- [ ] Fix any production bugs
- [ ] Respond to user feedback
- [ ] Small UX improvements
- [ ] Performance tuning if needed

### Week 8+: v2 Planning
- [ ] Review user feedback
- [ ] Prioritize v2 features
- [ ] Plan multi-user implementation
- [ ] Plan advanced features
- [ ] Create v2 roadmap

---

## Daily Development Best Practices

### Before Coding
- [ ] Pull latest changes: `git pull`
- [ ] Start Docker: `./start.sh`
- [ ] Check all services healthy
- [ ] Review day's tasks

### During Coding
- [ ] Commit often (atomic commits)
- [ ] Write descriptive commit messages
- [ ] Test changes before committing
- [ ] Use feature branches for big changes
- [ ] Comment complex logic

### After Coding
- [ ] Run tests (if implemented)
- [ ] Check for TypeScript errors
- [ ] Review changes: `git diff`
- [ ] Commit and push
- [ ] Update this checklist

---

## Testing Checklist (Before Each Phase End)

### Functionality
- [ ] All features work as expected
- [ ] Edge cases handled
- [ ] Error states tested
- [ ] Loading states tested

### UI/UX
- [ ] Responsive on all breakpoints
- [ ] Dark mode works correctly
- [ ] Animations smooth
- [ ] Accessibility (keyboard nav, screen reader)

### Performance
- [ ] Page loads < 2 seconds
- [ ] AI generation reasonable time
- [ ] No memory leaks
- [ ] Images optimized

### Data
- [ ] Database operations succeed
- [ ] Migrations run successfully
- [ ] Data persists correctly
- [ ] No data loss scenarios

---

## Common Commands Reference

```bash
# Start development
./start.sh

# View logs
docker compose logs -f nextjs

# Database migrations
docker compose exec nextjs pnpm prisma migrate dev

# Prisma Studio
docker compose exec nextjs pnpm prisma studio

# Test Ollama
docker compose exec ollama ollama run llama3.2:3b "Test prompt"

# Stop all services
docker compose down

# Rebuild containers
docker compose up -d --build

# Clear volumes (reset data)
docker compose down -v
```

---

## Progress Tracking

Update this section daily:

**Current Phase:** Pre-Development
**Current Day:** Day 0
**Completed Tasks:** 0 / ~150
**Blockers:** None
**Next Task:** Repository initialization

---

## Notes & Decisions Log

Use this space to track important decisions made during development:

```
Date       | Decision                        | Rationale
-----------|--------------------------------|---------------------------
2025-12-23 | Use Llama 3.2 (3B) for MVP     | Fastest, good quality
           |                                |
           |                                |
```

---

## Success Criteria Tracking

Monitor these metrics after launch:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Weekly Active Users | N/A | - | - |
| Meal Gen Time (p95) | < 10s | - | - |
| AI Acceptance Rate | > 60% | - | - |
| Recipe Import Success | > 80% | - | - |
| Page Load Time | < 2s | - | - |
| User Satisfaction | > 4/5 | - | - |

---

## Risk Mitigation Tracking

| Risk | Status | Mitigation |
|------|--------|------------|
| Ollama setup friction | Monitoring | Clear docs + Docker bundling |
| AI quality variance | Testing | Prompt engineering + model testing |
| Low-end hardware performance | Planning | 3B model default + warnings |
| Database migrations | Ready | Prisma + backups |
| Recipe import failures | Accepted | Manual paste primary method |

---

**Start Date:** TBD
**Target Completion:** TBD + 6 weeks
**Status:** Ready to begin

Let's build something amazing! 🚀
