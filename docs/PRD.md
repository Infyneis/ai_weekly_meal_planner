# Product Requirements Document: AI Weekly Meal Planner

**Version:** 1.1
**Last Updated:** 2025-12-23
**Product Owner:** User
**Document Status:** Draft - Pending Stakeholder Review
**Major Update:** AI Architecture changed to Ollama (local) instead of cloud services

---

## Executive Summary

An AI-powered weekly meal planning application that helps users organize their meals, discover recipes, and understand nutritional content. The app combines intelligent meal suggestions with a personal recipe collection system, presenting everything in a beautiful, user-friendly interface.

**Key Architectural Decision:** This application uses **Ollama** running locally for all AI operations, ensuring complete privacy, zero API costs, and offline functionality. This makes the app entirely self-contained with no external AI service dependencies.

---

## Table of Contents

1. [Goals & Objectives](#goals--objectives)
2. [User Personas](#user-personas)
3. [User Stories & Use Cases](#user-stories--use-cases)
4. [Functional Requirements](#functional-requirements)
5. [Data Models & Entities](#data-models--entities)
6. [UI/UX Requirements](#uiux-requirements)
7. [Technical Requirements](#technical-requirements)
8. [API & Integration Requirements](#api--integration-requirements)
9. [Clarifying Questions & Decisions Needed](#clarifying-questions--decisions-needed)
10. [MVP Scope Definition](#mvp-scope-definition)
11. [Success Metrics](#success-metrics)
12. [Appendix](#appendix)

---

## Goals & Objectives

### Primary Goals
1. **Simplify Meal Planning**: Reduce the cognitive load of weekly meal planning through AI assistance
2. **Centralize Recipe Management**: Provide a single source of truth for all saved recipes
3. **Promote Nutritional Awareness**: Make nutrition information accessible and understandable
4. **Enhance User Experience**: Create a delightful, aesthetically pleasing interface that users enjoy using

### Success Criteria
- Users can generate a complete weekly meal plan in under 5 minutes
- Users successfully save and retrieve recipes from external sources
- Users understand nutritional content of their planned meals
- High user engagement with the calendar view (primary interaction point)

---

## User Personas

### Primary Persona: "Organized Olivia"
- **Age:** 28-45
- **Occupation:** Working professional or parent
- **Goals:**
  - Save time on meal planning
  - Eat healthier with nutritional awareness
  - Reduce food waste through better planning
  - Discover new recipes easily
- **Pain Points:**
  - Meal planning is time-consuming
  - Recipes scattered across multiple platforms
  - Difficulty tracking nutritional information
  - Decision fatigue when choosing meals

### Secondary Persona: "Fitness-Focused Frank"
- **Age:** 25-40
- **Occupation:** Health-conscious professional
- **Goals:**
  - Track macronutrients accurately
  - Plan meals aligned with fitness goals
  - Meal prep efficiently
- **Pain Points:**
  - Manual macro tracking is tedious
  - Finding recipes that match macro targets
  - Consistent meal variety while hitting targets

---

## User Stories & Use Cases

### Epic 1: AI Meal Planning

#### US-1.1: Weekly Meal Generation
**As a** user
**I want to** generate AI-suggested meals for the week
**So that** I don't have to manually plan each meal

**Acceptance Criteria:**
- AI suggests meals for all 7 days of the week
- Each day includes breakfast, lunch, and dinner suggestions
- Suggestions are diverse (no repeated meals within the week)
- User can trigger meal generation with a single action
- Loading state is shown during AI generation

**Priority:** P0 (MVP Critical)

---

#### US-1.2: View Weekly Calendar
**As a** user
**I want to** view my weekly meal plan in a calendar format
**So that** I can see my meals at a glance

**Acceptance Criteria:**
- Calendar displays 7 days (configurable: Sun-Sat or Mon-Sun)
- Each day shows 3 meal slots: breakfast, lunch, dinner
- Meal cards display: name, thumbnail image, prep time, key macros
- Clear visual distinction between validated and suggested meals
- Responsive design for mobile and desktop

**Priority:** P0 (MVP Critical)

---

#### US-1.3: Validate/Keep Meal Suggestions
**As a** user
**I want to** validate/keep AI-suggested meals
**So that** I can confirm which meals I want to prepare

**Acceptance Criteria:**
- Each suggested meal has a "Keep" or "Validate" action
- Visual indicator shows validated vs. suggested state
- Validated meals are locked from auto-regeneration
- User can "unvalidate" a meal if they change their mind
- Batch validation option (e.g., "Keep all suggestions")

**Priority:** P0 (MVP Critical)

---

#### US-1.4: Retry Meal Suggestion
**As a** user
**I want to** retry a meal suggestion
**So that** I can get a different option if I don't like the current one

**Acceptance Criteria:**
- Each meal card has a "Retry" action
- Clicking retry generates a new AI suggestion for that specific meal slot
- Previous suggestion is replaced (not saved unless explicitly added to recipe book)
- Loading state shown during regeneration
- User can retry unlimited times
- AI avoids suggesting meals already in the week's plan

**Priority:** P0 (MVP Critical)

---

### Epic 2: Recipe Book Management

#### US-2.1: Save External Recipes
**As a** user
**I want to** save recipes from Instagram and other sources
**So that** I can build my personal recipe collection

**Acceptance Criteria:**
- User can input a URL (Instagram, blog, website)
- AI extracts recipe information from the URL
- User can manually paste recipe text for AI transcription
- Option to upload recipe images for OCR extraction
- User receives feedback on successful save

**Priority:** P0 (MVP Critical)

---

#### US-2.2: AI Recipe Transcription
**As a** user
**I want** external recipes automatically transcribed into a standardized format
**So that** all my recipes have consistent structure

**Acceptance Criteria:**
- AI extracts: title, description, ingredients, instructions, prep/cook time
- AI estimates nutritional information if not provided
- AI generates or preserves recipe image
- User can review and edit transcription before saving
- Standardized recipe card template used for all recipes

**Priority:** P0 (MVP Critical)

---

#### US-2.3: Browse Recipe Book
**As a** user
**I want to** browse my saved recipes
**So that** I can find and use recipes I've collected

**Acceptance Criteria:**
- Grid/list view of all saved recipes
- Each recipe shows: thumbnail, title, prep time, key tags
- Pagination or infinite scroll for large collections
- Visual indicators for recently added recipes
- Option to filter by source (AI-generated, Instagram, manual, etc.)

**Priority:** P0 (MVP Critical)

---

#### US-2.4: Search Recipes
**As a** user
**I want to** search my recipe collection
**So that** I can quickly find specific recipes

**Acceptance Criteria:**
- Search by recipe name
- Search by ingredient
- Search by tags/categories
- Real-time search results
- Display search result count
- Clear search button

**Priority:** P1 (High Priority)

---

#### US-2.5: Save AI-Suggested Meals to Recipe Book
**As a** user
**I want to** save AI-suggested meals to my recipe book
**So that** I can reuse meals I liked

**Acceptance Criteria:**
- "Save to Recipe Book" action available on all AI-suggested meals
- Recipe is added to personal collection with full details
- Visual confirmation of save
- Saved recipes appear in recipe book immediately
- No duplicate entries (detect existing recipes)

**Priority:** P1 (High Priority)

---

### Epic 3: Nutritional Insights

#### US-3.1: View Meal Nutrition
**As a** user
**I want to** see nutritional information for each meal
**So that** I can make informed dietary choices

**Acceptance Criteria:**
- Display macronutrients: carbohydrates, protein, fat
- Display calories
- Display fiber (if available)
- Option to view micronutrients (vitamins, minerals)
- Nutrition data shown per serving
- Clear indication if nutrition data is estimated vs. verified

**Priority:** P0 (MVP Critical)

---

#### US-3.2: View Prep Time
**As a** user
**I want to** see preparation time for each meal
**So that** I can plan my cooking schedule

**Acceptance Criteria:**
- Display total time (prep + cook)
- Separate prep time and cook time if available
- Time shown in minutes/hours format
- Visual time indicator (e.g., icon, color coding)

**Priority:** P0 (MVP Critical)

---

#### US-3.3: View Ingredients List
**As a** user
**I want to** see the ingredients for each meal
**So that** I know what to purchase

**Acceptance Criteria:**
- Complete ingredients list with quantities
- Ingredients grouped by category (optional: produce, proteins, pantry)
- Option to check off ingredients
- Export ingredients to shopping list (future enhancement)

**Priority:** P0 (MVP Critical)

---

#### US-3.4: Daily/Weekly Nutrition Summary
**As a** user
**I want to** see aggregated nutrition for a day or week
**So that** I can track my overall dietary intake

**Acceptance Criteria:**
- Toggle between daily and weekly view
- Aggregate macros displayed with visual charts (using Recharts)
- Comparison against recommended daily values (if user sets goals)
- Breakdown by meal type (breakfast, lunch, dinner)

**Priority:** P2 (Nice to Have)

---

### Epic 4: User Experience

#### US-4.1: Beautiful Recipe Presentation
**As a** user
**I want** recipes displayed in an attractive format
**So that** I enjoy using the app

**Acceptance Criteria:**
- High-quality recipe images (AI-generated or sourced)
- Clean, readable typography
- Consistent card design using Shadcn UI components
- Smooth animations and transitions
- Print-friendly recipe view

**Priority:** P1 (High Priority)

---

#### US-4.2: Comfy and Cozy Theme
**As a** user
**I want** a warm, inviting visual design
**So that** the app feels pleasant to use

**Acceptance Criteria:**
- Warm color palette (earth tones, soft pastels)
- Rounded corners and soft shadows
- Comfortable typography (readable font sizes, proper spacing)
- Consistent spacing and padding
- Dark mode option with cozy ambiance

**Priority:** P1 (High Priority)

---

## Functional Requirements

### FR-1: AI Meal Suggestion Engine

#### FR-1.1: Meal Generation Algorithm
- **Description:** AI generates contextually appropriate meals based on meal type and user preferences
- **Inputs:**
  - Meal type (breakfast, lunch, dinner)
  - Day of week
  - User dietary preferences (if set)
  - Previously generated meals in the week (to avoid duplicates)
- **Outputs:**
  - Meal name
  - Recipe details (ingredients, instructions)
  - Nutritional information
  - Prep/cook time
  - Recipe image (generated or sourced)
- **Business Rules:**
  - No duplicate meals within the same week
  - Breakfast suggestions appropriate for morning (e.g., pancakes, not steak)
  - Lunch suggestions balanced (not too heavy)
  - Dinner suggestions can be more elaborate
  - Respect dietary restrictions if configured

#### FR-1.2: Retry Mechanism
- **Description:** Regenerate a single meal suggestion without affecting other meals
- **Inputs:**
  - Meal slot identifier (day + meal type)
  - Current week's other meals (to avoid duplicates)
- **Outputs:** New meal suggestion for that slot
- **Business Rules:**
  - Must not suggest the previously rejected meal again (within same session)
  - Must not duplicate other meals in the current week

#### FR-1.3: Validation State Management
- **Description:** Track which meals are validated/locked
- **States:**
  - `suggested`: AI-generated, not yet validated
  - `validated`: User approved the meal
  - `custom`: User manually added meal
- **Business Rules:**
  - Validated meals persist across sessions
  - Only suggested meals can be retried
  - Validated meals require explicit unvalidation to change

---

### FR-2: Recipe Book System

#### FR-2.1: Recipe Import from URL
- **Description:** Extract recipe data from external URLs
- **Supported Sources (Initial):**
  - Instagram posts
  - Common recipe blogs (with schema.org markup)
  - YouTube (description parsing)
  - Generic web pages (best-effort extraction)
- **Extraction Process:**
  1. Fetch URL content
  2. Parse HTML/JSON for recipe data
  3. Use AI to structure unformatted content
  4. Extract or generate recipe image
  5. Estimate nutrition if not provided
- **Error Handling:**
  - Graceful fallback for unsupported sources
  - Manual entry option if auto-extraction fails

#### FR-2.2: Recipe Data Model
- **Required Fields:**
  - Title (string, max 200 chars)
  - Description (text, max 1000 chars)
  - Ingredients (array of objects: name, quantity, unit)
  - Instructions (ordered list of steps)
  - Prep time (integer, minutes)
  - Cook time (integer, minutes)
  - Servings (integer)
  - Nutrition (object: calories, protein, carbs, fat, fiber)
- **Optional Fields:**
  - Source URL (string)
  - Source type (enum: AI, Instagram, Blog, Manual)
  - Tags/Categories (array of strings)
  - Cuisine type (string)
  - Difficulty level (enum: Easy, Medium, Hard)
  - Images (array of URLs)
  - Notes (text)
  - Date added (timestamp)
  - Last modified (timestamp)

#### FR-2.3: Recipe Search & Filter
- **Search Capabilities:**
  - Full-text search on title, description, ingredients
  - Fuzzy matching for typos
  - Search result ranking by relevance
- **Filter Options:**
  - By source type
  - By prep time range
  - By cuisine type
  - By dietary tags (vegetarian, vegan, gluten-free, etc.)
  - By macros range (protein > X grams)

#### FR-2.4: Recipe CRUD Operations
- **Create:** Import from URL, manual entry, save from AI suggestions
- **Read:** View individual recipe with full details
- **Update:** Edit any recipe field, re-extract from URL
- **Delete:** Soft delete with confirmation, permanent delete option

---

### FR-3: Nutritional Information System

#### FR-3.1: Nutrition Data Sources
- **Priority Order:**
  1. Explicit nutrition data from recipe source
  2. AI estimation based on ingredients
  3. USDA FoodData Central API lookup
  4. Default estimation model
- **Data Points:**
  - Calories (kcal)
  - Protein (g)
  - Carbohydrates (g)
  - Fat (g)
  - Fiber (g)
  - Sugar (g) - optional
  - Sodium (mg) - optional

#### FR-3.2: Nutrition Calculation
- **Per-Serving Calculation:**
  - Total nutrition divided by number of servings
  - Adjustable serving size
- **Aggregation:**
  - Daily total: sum of all meals in a day
  - Weekly total: sum of all meals in the week
  - Averages and trends

#### FR-3.3: Nutrition Visualization
- **Chart Types (using Recharts):**
  - Pie chart: Macro distribution (protein/carbs/fat)
  - Bar chart: Daily macro totals
  - Line chart: Weekly trends
  - Radial/progress chart: Percentage of daily goals

---

### FR-4: Calendar & Planning Interface

#### FR-4.1: Calendar View
- **Display Options:**
  - Week view (default): 7-day grid
  - Day view: Single day with expanded meal details
  - List view: Chronological meal list
- **Week Navigation:**
  - Previous/Next week buttons
  - Jump to current week
  - Date picker for specific weeks

#### FR-4.2: Meal Card Component
- **Compact View (on calendar):**
  - Meal image (thumbnail)
  - Meal name
  - Prep time icon + value
  - Macro summary (P/C/F)
  - Status indicator (suggested/validated)
  - Quick actions (retry, validate, save)
- **Expanded View (modal/detail page):**
  - Large meal image
  - Full description
  - Complete ingredients list
  - Step-by-step instructions
  - Detailed nutrition panel
  - Additional actions (edit, delete, share)

#### FR-4.3: Drag & Drop (Future Enhancement)
- Reorder meals within the week
- Swap breakfast with lunch, etc.
- Move meal to different day

---

## Data Models & Entities

### Entity Relationship Diagram

```
User (Future - Auth)
  |
  |-- has many --> MealPlans
  |-- has many --> Recipes

MealPlan
  |-- has many --> PlannedMeals

PlannedMeal
  |-- belongs to --> Recipe
  |-- has one --> MealSlot (day, meal_type)

Recipe
  |-- has many --> Ingredients
  |-- has one --> NutritionInfo
  |-- has many --> RecipeImages
```

---

### Database Schema

#### Table: `recipes`
```typescript
{
  id: string (UUID, PK)
  title: string (required, max 200)
  description: text (max 1000)
  servings: integer (required, default 1)
  prep_time_minutes: integer (required)
  cook_time_minutes: integer (required)
  total_time_minutes: integer (computed)
  difficulty: enum ['easy', 'medium', 'hard'] (nullable)
  cuisine_type: string (nullable)
  source_url: string (nullable)
  source_type: enum ['ai', 'instagram', 'blog', 'manual', 'youtube'] (required)
  image_url: string (nullable)
  instructions: jsonb (array of strings)
  tags: jsonb (array of strings)
  notes: text (nullable)
  created_at: timestamp (default now)
  updated_at: timestamp (default now)
  deleted_at: timestamp (nullable, soft delete)
}
```

#### Table: `ingredients`
```typescript
{
  id: string (UUID, PK)
  recipe_id: string (FK -> recipes.id)
  name: string (required)
  quantity: decimal (nullable)
  unit: string (nullable)
  order_index: integer (for sorting)
  created_at: timestamp
}
```

#### Table: `nutrition_info`
```typescript
{
  id: string (UUID, PK)
  recipe_id: string (FK -> recipes.id, unique)
  calories: decimal (required)
  protein_g: decimal (required)
  carbohydrates_g: decimal (required)
  fat_g: decimal (required)
  fiber_g: decimal (nullable)
  sugar_g: decimal (nullable)
  sodium_mg: decimal (nullable)
  is_estimated: boolean (default true)
  created_at: timestamp
  updated_at: timestamp
}
```

#### Table: `meal_plans`
```typescript
{
  id: string (UUID, PK)
  week_start_date: date (required, unique per user)
  user_id: string (FK, nullable for MVP)
  created_at: timestamp
  updated_at: timestamp
}
```

#### Table: `planned_meals`
```typescript
{
  id: string (UUID, PK)
  meal_plan_id: string (FK -> meal_plans.id)
  recipe_id: string (FK -> recipes.id)
  day_of_week: integer (0-6, 0=Sunday)
  meal_type: enum ['breakfast', 'lunch', 'dinner'] (required)
  status: enum ['suggested', 'validated', 'custom'] (required)
  date: date (required, computed from meal_plan.week_start_date + day_of_week)
  created_at: timestamp
  updated_at: timestamp

  UNIQUE(meal_plan_id, day_of_week, meal_type)
}
```

---

## UI/UX Requirements

### Design System

#### Color Palette (Comfy & Cozy Theme)
```
Primary Colors:
  - Warm Terracotta: #E07A5F
  - Soft Sage: #81B29A
  - Cream: #F4F1DE

Secondary Colors:
  - Dusty Blue: #3D5A80
  - Warm Sand: #F2CC8F

Neutral Colors:
  - Off-White: #FEFEFE
  - Warm Gray: #E8E8E8
  - Charcoal: #2D2D2D

Status Colors:
  - Success: #81B29A (sage green)
  - Warning: #F2CC8F (warm sand)
  - Error: #C1666B (muted red)
  - Info: #3D5A80 (dusty blue)
```

#### Typography
```
Font Families:
  - Headings: 'Inter' or 'Outfit' (rounded, friendly)
  - Body: 'Inter' or 'Open Sans' (readable)
  - Monospace: 'JetBrains Mono' (for nutrition numbers)

Font Scales:
  - h1: 2.5rem (40px) - Page titles
  - h2: 2rem (32px) - Section headers
  - h3: 1.5rem (24px) - Card titles
  - body: 1rem (16px) - Default text
  - small: 0.875rem (14px) - Meta information
  - tiny: 0.75rem (12px) - Labels
```

#### Spacing System (Tailwind Scale)
- Base unit: 4px (0.25rem)
- Standard spacing: 4, 8, 12, 16, 24, 32, 48, 64px
- Component padding: 16-24px
- Section margins: 32-48px

#### Component Styling Guidelines
- **Border Radius:** Medium to large (8-12px) for cozy feel
- **Shadows:** Soft, subtle shadows (Tailwind: shadow-sm, shadow-md)
- **Transitions:** Smooth, 200-300ms duration
- **Hover States:** Subtle scale (1.02x) or brightness changes
- **Focus States:** Prominent outline for accessibility

---

### Page Layouts

#### 1. Weekly Meal Planner (Home Page)
```
Layout Structure:
┌─────────────────────────────────────────────────┐
│ Header                                          │
│ [Logo] Weekly Meal Planner    [Settings Icon]  │
├─────────────────────────────────────────────────┤
│ Week Navigation                                 │
│ [← Prev]  Week of Jan 1-7, 2025  [Next →]     │
│                          [Generate Week] [✓]   │
├─────────────────────────────────────────────────┤
│ Calendar Grid (7 days × 3 meals)               │
│                                                 │
│ Sun    Mon    Tue    Wed    Thu    Fri    Sat │
│ ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐│
│ │ B │  │ B │  │ B │  │ B │  │ B │  │ B │  │ B ││
│ ├───┤  ├───┤  ├───┤  ├───┤  ├───┤  ├───┤  ├───┤│
│ │ L │  │ L │  │ L │  │ L │  │ L │  │ L │  │ L ││
│ ├───┤  ├───┤  ├───┤  ├───┤  ├───┤  ├───┤  ├───┤│
│ │ D │  │ D │  │ D │  │ D │  │ D │  │ D │  │ D ││
│ └───┘  └───┘  └───┘  └───┘  └───┘  └───┘  └───┘│
├─────────────────────────────────────────────────┤
│ Weekly Nutrition Summary (Collapsible)          │
│ [Chart: Macro Distribution]                     │
└─────────────────────────────────────────────────┘

Each Meal Card:
┌─────────────────────┐
│ [Recipe Image]      │
│                     │
│ Recipe Name         │
│ ⏱ 30 min           │
│ P: 25g C: 40g F:15g│
│                     │
│ [🔄 Retry] [✓ Keep]│
└─────────────────────┘
```

#### 2. Recipe Book Page
```
Layout Structure:
┌─────────────────────────────────────────────────┐
│ Header                                          │
│ My Recipe Book                    [+ Add Recipe]│
├─────────────────────────────────────────────────┤
│ Search & Filters                                │
│ [🔍 Search recipes...]                         │
│ [Filter: All] [Sort: Recent]                   │
├─────────────────────────────────────────────────┤
│ Recipe Grid (3-4 columns)                      │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│ │ Img  │  │ Img  │  │ Img  │  │ Img  │       │
│ │ Title│  │ Title│  │ Title│  │ Title│       │
│ │ Meta │  │ Meta │  │ Meta │  │ Meta │       │
│ └──────┘  └──────┘  └──────┘  └──────┘       │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│ │ ...  │  │ ...  │  │ ...  │  │ ...  │       │
│ └──────┘  └──────┘  └──────┘  └──────┘       │
└─────────────────────────────────────────────────┘
```

#### 3. Recipe Detail Page/Modal
```
Layout Structure (Modal/Page):
┌─────────────────────────────────────────────────┐
│ [← Back]                        [Edit] [Delete] │
├─────────────────────────────────────────────────┤
│                                                 │
│        [Large Recipe Image]                     │
│                                                 │
├─────────────────────────────────────────────────┤
│ Recipe Title                                    │
│ Description text...                             │
│                                                 │
│ ⏱ Prep: 15m  Cook: 30m  | 🍽 Serves: 4        │
├─────────────────────────────────────────────────┤
│ Tabs: [Ingredients] [Instructions] [Nutrition] │
├─────────────────────────────────────────────────┤
│ Tab Content:                                    │
│                                                 │
│ Ingredients Tab:                                │
│ □ 2 cups flour                                  │
│ □ 1 tsp salt                                    │
│ □ ...                                           │
│                                                 │
│ Instructions Tab:                               │
│ 1. Step one...                                  │
│ 2. Step two...                                  │
│                                                 │
│ Nutrition Tab:                                  │
│ [Macro Pie Chart]                              │
│ Calories: 450 kcal                             │
│ Protein: 25g | Carbs: 40g | Fat: 15g           │
└─────────────────────────────────────────────────┘
```

#### 4. Add Recipe Modal/Page
```
Layout Structure:
┌─────────────────────────────────────────────────┐
│ Add New Recipe                          [✕ Close]│
├─────────────────────────────────────────────────┤
│ Import Options:                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ [🔗 Import from URL]                        ││
│ │ [📋 Paste Recipe Text]                      ││
│ │ [✍️ Manual Entry]                           ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ If URL Import Selected:                         │
│ ┌─────────────────────────────────────────────┐│
│ │ Paste URL: [_____________________] [Import] ││
│ │                                             ││
│ │ Supported: Instagram, Recipe Blogs, YouTube ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ [Loading/Preview State]                         │
│                                                 │
│ Extracted Recipe Preview:                       │
│ [Editable Form Fields]                          │
│ Title: [_______________]                        │
│ Description: [__________]                       │
│ Ingredients: [__________]                       │
│ ...                                             │
│                                                 │
│                     [Cancel] [Save Recipe]      │
└─────────────────────────────────────────────────┘
```

---

### Responsive Design Requirements

#### Breakpoints (Tailwind Defaults)
- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (md/lg)
- **Desktop:** > 1024px (xl)

#### Mobile Optimizations
- **Calendar View:**
  - Single day view (swipe between days)
  - Vertical meal cards
  - Bottom navigation bar
- **Recipe Grid:**
  - Single column on mobile
  - 2 columns on tablet
  - 3-4 columns on desktop
- **Meal Detail Modal:**
  - Full-screen on mobile
  - Centered modal on desktop

#### Touch Interactions
- Minimum touch target: 44×44px
- Swipe gestures for navigation
- Pull-to-refresh for meal regeneration

---

### Accessibility Requirements

#### WCAG 2.1 Level AA Compliance
- **Color Contrast:**
  - Text: 4.5:1 minimum
  - Large text: 3:1 minimum
  - UI components: 3:1 minimum
- **Keyboard Navigation:**
  - All interactive elements accessible via keyboard
  - Logical tab order
  - Skip links for navigation
- **Screen Reader Support:**
  - Semantic HTML
  - ARIA labels for custom components
  - Alt text for all images
- **Focus Management:**
  - Visible focus indicators
  - Focus trapped in modals
  - Focus returned after modal close

---

## Technical Requirements

### Tech Stack

#### Frontend Framework
- **Next.js 16** (App Router)
  - React Server Components where applicable
  - Server Actions for mutations
  - Optimized image loading (next/image)
  - Route-based code splitting

#### UI Libraries
- **Shadcn UI:** Core component library
  - Button, Card, Dialog, Dropdown, Input, Select, Tabs, etc.
  - Form components with react-hook-form integration
- **Tailwind CSS:** Utility-first styling
  - Custom theme configuration (colors, spacing)
  - Responsive design utilities
- **Recharts:** Data visualization
  - Pie charts for macro distribution
  - Bar charts for daily totals
  - Line charts for trends

#### State Management
- **React Context:** Global UI state (theme, modals)
- **Server State:**
  - Option 1: TanStack Query (React Query) - for data fetching/caching
  - Option 2: SWR - Next.js-optimized alternative
  - Option 3: Native Next.js caching (Server Components + Server Actions)

#### Form Management
- **React Hook Form:** Form validation and state
- **Zod:** Schema validation

---

### Database & Backend

#### Database Options
**Option 1: PostgreSQL (Recommended)**
- Relational data model fits naturally
- JSON/JSONB support for flexible fields
- Hosted options: Supabase, Neon, Vercel Postgres

**Option 2: MongoDB**
- Flexible schema for recipe variations
- Easier for rapid prototyping
- Hosted: MongoDB Atlas

**Recommendation:** PostgreSQL via Supabase
- Built-in auth (future)
- Real-time subscriptions (future)
- Row-level security
- File storage for images

#### ORM/Database Client
- **Prisma:** Type-safe ORM with great DX
- **Drizzle:** Lightweight, SQL-like alternative
- **Supabase Client:** If using Supabase

**Recommendation:** Prisma for MVP

#### API Layer
- **Next.js API Routes:** RESTful endpoints
- **Server Actions:** Form submissions and mutations
- **tRPC (Optional):** End-to-end type safety (overkill for MVP)

---

### AI Integration

#### AI Provider: Ollama (Local)

**ARCHITECTURAL DECISION:** This application uses **Ollama** running locally on the user's machine for all AI operations.

**Why Ollama:**
- **Zero API Costs:** No ongoing expenses for AI operations
- **Complete Privacy:** All recipe data and AI processing stays on the user's machine
- **Offline Functionality:** No internet required for meal planning once models are downloaded
- **No Rate Limits:** Users can generate unlimited meal plans without quotas
- **Data Sovereignty:** User maintains full control over their data
- **Open Source Models:** Access to latest open-source LLMs (Llama 3, Mistral, etc.)

**Trade-offs Compared to Cloud AI:**
- **Hardware Requirements:** Requires capable local hardware (see below)
- **Initial Setup:** User must install Ollama and download models
- **Variable Performance:** Speed depends on user's hardware
- **Model Size Constraints:** Larger models may not run on all machines
- **Quality Variance:** Open-source models may produce less consistent results than GPT-4

---

#### Hardware Requirements

**Minimum Requirements (for basic functionality):**
- **CPU:** Modern multi-core processor (4+ cores recommended)
- **RAM:** 8GB minimum, 16GB recommended
- **Storage:** 10GB free space for models
- **OS:** macOS, Linux, or Windows (WSL2)

**Recommended Requirements (for optimal performance):**
- **CPU:** 8+ core processor or
- **GPU:** NVIDIA GPU with 8GB+ VRAM (for accelerated inference)
- **RAM:** 16GB+
- **Storage:** 20GB+ SSD for models
- **OS:** macOS (Apple Silicon preferred), Linux, or Windows 11 with WSL2

**Performance Expectations:**
- **Small models (7B):** 2-5 seconds per meal on recommended hardware
- **Medium models (13B):** 5-10 seconds per meal on recommended hardware
- **Large models (70B):** Requires high-end GPU, not recommended for MVP

---

#### Recommended Ollama Models

**Primary Model (MVP): Llama 3.2 (3B)**
- **Size:** ~2GB
- **Performance:** Fast, runs on most hardware
- **Quality:** Good for structured recipe generation
- **Use Cases:** Meal generation, recipe transcription
- **Command:** `ollama pull llama3.2:3b`

**Alternative: Mistral (7B)**
- **Size:** ~4.1GB
- **Performance:** Moderate speed, better quality than 3B models
- **Quality:** Excellent instruction-following, good JSON output
- **Use Cases:** All recipe tasks, nutrition estimation
- **Command:** `ollama pull mistral:7b`

**High-Quality Option: Llama 3.1 (8B)**
- **Size:** ~4.7GB
- **Performance:** Good balance of speed and quality
- **Quality:** Strong reasoning, accurate nutrition estimation
- **Use Cases:** All tasks, especially nutrition analysis
- **Command:** `ollama pull llama3.1:8b`

**Power User Option: Qwen2.5 (14B)**
- **Size:** ~9GB
- **Performance:** Slower, requires better hardware
- **Quality:** Excellent structured outputs, multilingual
- **Use Cases:** Complex recipe extraction, detailed nutrition
- **Command:** `ollama pull qwen2.5:14b`

**MVP Recommendation:** Start with **Llama 3.2 (3B)** for fastest performance, allow users to switch to larger models if they have capable hardware.

---

#### Ollama API Integration

**Ollama REST API:**
Ollama provides a local REST API (default: `http://localhost:11434`) that mimics OpenAI's API structure.

**Example API Call:**
```typescript
async function generateMealWithOllama(mealType: string, dayOfWeek: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2:3b',
      prompt: `Generate a ${mealType} recipe for ${dayOfWeek}...`,
      format: 'json', // Request JSON output
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    })
  });

  const data = await response.json();
  return JSON.parse(data.response);
}
```

**Streaming Support:**
Ollama supports streaming responses for real-time UI updates:
```typescript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({ model: 'llama3.2:3b', prompt: '...', stream: true })
});

const reader = response.body.getReader();
// Process stream chunks for progressive UI updates
```

---

#### Ollama Setup Requirements

**User Installation Steps:**

1. **Install Ollama:**
   - macOS: `brew install ollama` or download from ollama.ai
   - Linux: `curl -fsSL https://ollama.ai/install.sh | sh`
   - Windows: Download from ollama.ai (requires WSL2)

2. **Start Ollama Service:**
   ```bash
   ollama serve
   ```
   (Runs on `http://localhost:11434` by default)

3. **Download Recommended Model:**
   ```bash
   ollama pull llama3.2:3b
   ```
   (One-time download, ~2GB)

4. **Verify Installation:**
   ```bash
   ollama list  # Shows installed models
   ollama run llama3.2:3b "Generate a breakfast recipe"
   ```

**Application Integration:**
- The Next.js app will detect if Ollama is running on localhost:11434
- If not detected, show setup instructions to the user
- Provide clear error messages if Ollama is not installed or models are missing

#### AI Prompt Strategies

**Meal Generation Prompt Template:**
```
Generate a {meal_type} recipe for {day_of_week}.

Requirements:
- Appropriate for {meal_type} (e.g., breakfast should be morning-appropriate)
- Do not suggest any of these meals: {existing_meals_in_week}
- Prep + cook time: 15-45 minutes
- Balanced nutrition
- Common ingredients

Return JSON:
{
  "title": "Recipe name",
  "description": "Brief description",
  "servings": 2,
  "prep_time_minutes": 15,
  "cook_time_minutes": 20,
  "ingredients": [{"name": "...", "quantity": "...", "unit": "..."}],
  "instructions": ["Step 1", "Step 2", ...],
  "nutrition": {
    "calories": 450,
    "protein_g": 25,
    "carbohydrates_g": 40,
    "fat_g": 15,
    "fiber_g": 5
  },
  "cuisine_type": "Italian",
  "difficulty": "easy"
}
```

**Recipe Extraction Prompt Template:**
```
Extract recipe information from the following content.

Content: {scraped_content}

Parse and structure this into a standardized recipe format.
If nutrition information is not provided, estimate it based on ingredients.
If cooking time is not provided, estimate based on the recipe complexity.

Return JSON matching this schema: {...}
```

#### Caching & Performance Optimization

**Local AI Considerations:**
- **Caching Strategy:** Aggressively cache AI-generated recipes to minimize local compute
- **Response Caching:** Store generated meals by (meal_type, excluded_recipes) hash
- **No Rate Limiting Needed:** Local AI has no quotas (but respect user's hardware)
- **Background Generation:** Consider pre-generating next week's suggestions during idle time
- **Error Handling:** Graceful degradation if Ollama service is down
  - Show cached suggestions
  - Allow manual meal entry
  - Display clear "Ollama not running" message with restart instructions

**Performance Tips:**
- Use smaller models (3B-7B) for faster responses
- Implement request queuing to avoid overwhelming local hardware
- Show progress indicators for longer-running generations
- Consider running multiple models in parallel on capable hardware

---

### External Integrations

#### Instagram Recipe Import

**Challenges:**
- Instagram doesn't have a public recipe API
- Content is often embedded in images or video captions

**Approaches:**

**Option 1: Instagram Oembed API (Limited)**
- Can fetch post metadata, but not detailed recipe info
- Requires manual extraction from caption

**Option 2: Web Scraping (Fragile)**
- Parse Instagram post HTML
- Extract caption text
- Use AI to structure caption into recipe

**Option 3: Manual Paste (Most Reliable for MVP)**
- User copies Instagram caption
- Pastes into app
- AI structures the text
- User manually saves image URL or uploads screenshot

**Recommendation for MVP:** Option 3 (Manual Paste)
- Most reliable
- No API dependencies
- User has control over what's saved

#### Recipe Blog Import

**Structured Data Sources:**
- Recipe blogs often use **schema.org Recipe** markup
- Can parse JSON-LD structured data

**Implementation:**
```typescript
// Pseudo-code
async function extractRecipeFromURL(url: string) {
  const html = await fetch(url).then(r => r.text());

  // Try structured data first
  const jsonLd = extractJSONLD(html);
  if (jsonLd && jsonLd['@type'] === 'Recipe') {
    return parseStructuredRecipe(jsonLd);
  }

  // Fallback to AI extraction
  const pageContent = stripHTML(html);
  return aiExtractRecipe(pageContent);
}
```

#### Nutrition Data APIs

**Option 1: USDA FoodData Central API (Free)**
- Comprehensive nutrition database
- Free, no rate limits
- Requires ingredient matching

**Option 2: Edamam Nutrition API (Freemium)**
- Recipe analysis endpoint
- Natural language ingredient parsing
- Free tier: 10,000 calls/month

**Option 3: Spoonacular API (Paid)**
- Recipe analysis and search
- Nutrition estimation
- Expensive for MVP

**Recommendation for MVP:**
- **Primary:** AI estimation (via Ollama local models)
- **Enhancement:** USDA API for ingredient lookup and validation (post-MVP)

---

### Image Handling

#### Image Sources
1. **AI-Generated Images:**
   - DALL-E 3 (OpenAI)
   - Stable Diffusion (via Replicate)
   - Midjourney (via API, if available)
2. **Scraped Images:** From recipe URLs
3. **User Uploads:** Manual image upload
4. **Placeholder Images:** Default food images

#### Image Storage
- **Supabase Storage:** If using Supabase
- **Vercel Blob Storage:** Native Next.js integration
- **Cloudinary:** Feature-rich, has free tier

**Recommendation:** Vercel Blob Storage for simplicity

#### Image Optimization
- Use next/image for automatic optimization
- Generate multiple sizes (thumbnail, card, full)
- Lazy loading for off-screen images
- WebP format with fallbacks

---

### Performance Requirements

#### Load Time Targets
- **Initial Page Load:** < 2 seconds (LCP)
- **Time to Interactive:** < 3 seconds (TTI)
- **AI Meal Generation (Ollama):**
  - Single meal: 2-10 seconds (depending on model and hardware)
  - Full week (21 meals): 1-5 minutes (can be parallelized)
  - Target: < 2 minutes on recommended hardware with 3B model
- **Recipe Import:** < 5 seconds (excluding AI processing)

#### Optimization Strategies
- Server-side rendering for initial content
- Incremental static regeneration for recipe pages
- Image optimization (next/image)
- Code splitting by route
- Lazy load non-critical components
- **Cache AI responses aggressively (critical for local AI)**
- **Parallel meal generation:** Generate multiple meals simultaneously (if hardware supports)
- **Progressive UI updates:** Use streaming responses to show partial results
- **Background processing:** Pre-generate suggestions during idle time

#### Scalability Considerations
- Database indexing on frequently queried fields
- CDN for static assets
- Connection pooling for database
- **No external API rate limiting needed (Ollama is local)**
- **Hardware-aware generation:** Adjust parallelism based on available CPU/GPU resources
- **Model selection UI:** Let users choose smaller/faster models if performance is slow

---

### Security Requirements

#### Data Privacy
- **Complete Local Privacy:** All AI processing happens on user's machine (major privacy benefit)
- User data isolation (when auth is added)
- **No API keys needed:** Ollama runs locally without external authentication
- No sensitive data transmitted to external services
- Recipe data stored locally in user's database

#### Input Validation
- Sanitize all user inputs (XSS prevention)
- Validate URLs before fetching
- Rate limiting on AI endpoints
- CSRF protection on forms

#### API Security
- API routes protected with middleware
- Validate request bodies with Zod
- Implement request timeouts
- Log and monitor suspicious activity

---

### Development & Deployment

#### Version Control
- Git repository (GitHub/GitLab)
- Branch strategy: main, develop, feature branches
- Conventional commits
- PR reviews for major features

#### CI/CD Pipeline
- Automated testing (if implemented)
- Linting and type checking (ESLint, TypeScript)
- Build verification
- Automated deployment to Vercel (or similar)

#### Deployment Platform
- **Vercel (Recommended):** Native Next.js support, edge functions, easy setup
- **Alternatives:** Netlify, Railway, Fly.io

#### Environment Variables
```
# Database
DATABASE_URL=

# AI
OPENAI_API_KEY=

# Image Storage
BLOB_READ_WRITE_TOKEN=

# Optional
EDAMAM_APP_ID=
EDAMAM_APP_KEY=
```

---

## API & Integration Requirements

### Required APIs (MVP)

#### 1. Ollama Local API
- **Purpose:** AI meal generation, recipe extraction, nutrition estimation
- **Endpoint:** `http://localhost:11434/api/generate` (local)
- **Cost:** **FREE** (runs locally, no API costs)
- **Models Used:**
  - Primary: `llama3.2:3b` (fast, lightweight)
  - Alternative: `mistral:7b` or `llama3.1:8b` (better quality)
- **Rate Limits:** None (local hardware is the only constraint)
- **Performance:**
  - Single meal: 2-10 seconds (hardware-dependent)
  - Full week: 1-5 minutes (can parallelize)
- **Setup Required:**
  - User must install Ollama
  - Download chosen model (~2-9GB one-time download)
  - Run `ollama serve` to start local API server

#### 2. Image Generation API (Optional for MVP)
- **Purpose:** Generate recipe images if not available from source
- **Options:**
  - **Local Stable Diffusion** (via Ollama or ComfyUI): Free, slower
  - **Cloud Services** (DALL-E, Replicate): Paid, faster
- **Recommendation:** Use placeholder images for MVP, consider local SD generation in v2

#### 3. URL Scraping/Metadata
- **Purpose:** Fetch content from recipe URLs
- **Approach:**
  - Simple fetch + parsing for blogs
  - Instagram: Manual paste (no API)
- **Libraries:**
  - node-fetch or native fetch
  - cheerio for HTML parsing
  - metascraper for metadata extraction

---

### Optional APIs (Post-MVP)

#### 1. USDA FoodData Central
- **Purpose:** Enhanced nutrition data
- **Free, unlimited**
- **Implementation complexity:** Medium (requires ingredient matching)

#### 2. Edamam Nutrition API
- **Purpose:** Automated nutrition analysis
- **Free tier:** 10,000 calls/month
- **Fallback to AI if limit reached**

#### 3. Spoonacular
- **Purpose:** Recipe search, ingredient substitutions
- **Cost:** $0.002/request (expensive at scale)
- **Use case:** "Suggest similar recipes" feature

---

## Clarifying Questions & Decisions Needed

### Critical Questions Requiring User Input

#### 1. User Authentication & Multi-User Support
**Question:** Will this app support multiple users with accounts, or is it a single-user application (for MVP)?

**Impact:**
- **Single-user:** Simpler MVP, local storage or unauthenticated DB access
- **Multi-user:** Requires authentication (email/password, OAuth), user data isolation

**Recommendation:** Single-user for MVP, add auth in v2

**Decision Needed:** [ ] Single-user [ ] Multi-user from start

---

#### 2. Week Start Day Preference
**Question:** Should the week start on Sunday or Monday? Should this be user-configurable?

**Impact:**
- Affects calendar layout and date calculations
- User preference setting adds complexity

**Recommendation:** Fixed Monday start for MVP, add preference later

**Decision Needed:** [ ] Monday [ ] Sunday [ ] User-configurable

---

#### 3. AI Meal Generation Trigger
**Question:** When should AI generate meals for a new week?

**Options:**
a) Automatically when user navigates to a new week
b) Only when user clicks "Generate Week" button
c) Hybrid: Auto-generate current week, manual for future weeks

**Impact:**
- No API costs with Ollama (all local), but affects user's hardware utilization
- User control vs. convenience tradeoff
- Auto-generation may slow down other operations during generation

**Recommendation:** Option B (manual button) for MVP to give users control over when to use local compute

**Decision Needed:** [ ] Auto [ ] Manual [ ] Hybrid

---

#### 4. Meal Customization Beyond Retry
**Question:** Can users manually edit AI-suggested meals (change ingredients, adjust nutrition)?

**Options:**
a) Meals are read-only (can only retry or keep)
b) Users can edit any field of suggested meals
c) Users can add notes but not edit core recipe

**Impact:**
- Editing adds UI complexity
- Nutrition recalculation if ingredients change
- "Source of truth" for nutrition data

**Recommendation:** Option A for MVP (read-only), add editing in v2

**Decision Needed:** [ ] Read-only [ ] Fully editable [ ] Notes only

---

#### 5. Instagram Import Method
**Question:** Given Instagram API limitations, how should users import Instagram recipes?

**Options:**
a) Paste Instagram post URL → AI extracts caption text
b) Paste caption text directly
c) Upload screenshot → OCR + AI extraction
d) All of the above

**Impact:**
- Option A: May not work reliably due to Instagram's bot protection
- Option B: Most reliable but requires manual copy-paste
- Option C: Requires OCR service (Google Vision, Tesseract)

**Recommendation:** Start with Option B (manual paste), add C later if needed

**Decision Needed:** [ ] URL paste [ ] Text paste [ ] Screenshot upload [ ] All

---

#### 6. Nutrition Data Source Priority
**Question:** Should we always use AI estimation, or integrate external nutrition APIs?

**Options:**
a) AI estimation only (fast, potentially less accurate)
b) External API (USDA/Edamam) with AI fallback
c) External API only (slower, more accurate)

**Impact:**
- AI is faster but may have 10-20% error margin
- External APIs add latency and complexity
- User trust in nutrition data

**Recommendation:** Option A for MVP (AI only), add API validation in v2

**Decision Needed:** [ ] AI only [ ] API + AI fallback [ ] API only

---

#### 7. Recipe Image Handling
**Question:** If a recipe source has no image, should we generate one with AI or use a placeholder?

**Options:**
a) Generate with DALL-E/SD ($0.002-$0.04 per image)
b) Use generic food category placeholders (free)
c) Leave blank and ask user to upload

**Impact:**
- AI generation adds cost and latency
- Placeholders are less visually appealing
- User uploads add friction

**Recommendation:** Option B (placeholders) for MVP, add generation as premium feature

**Decision Needed:** [ ] AI generation [ ] Placeholders [ ] User upload required

---

#### 8. Shopping List Feature
**Question:** Should we include a shopping list generator in MVP?

**Description:** Aggregate ingredients from the week's meals into a shopping list

**Impact:**
- Adds significant value for users
- Moderate complexity (ingredient deduplication, quantity aggregation)
- Requires unit conversion (2 cups + 1 pint = ?)

**Recommendation:** Include basic version (simple ingredient list without smart aggregation)

**Decision Needed:** [ ] Include in MVP [ ] Post-MVP feature

---

#### 9. Dietary Preferences & Restrictions
**Question:** Should users be able to set dietary preferences (vegetarian, vegan, gluten-free, etc.)?

**Impact:**
- AI meal generation would filter by preferences
- Adds user settings page/form
- Improves relevance of suggestions

**Recommendation:** Include basic preferences in MVP (one-time setup)

**Decision Needed:** [ ] Include in MVP [ ] Post-MVP

---

#### 10. Dark Mode
**Question:** Is dark mode essential for MVP, or can it wait?

**Impact:**
- Adds testing complexity (all UI in two themes)
- Requires additional color palette definition
- Popular feature request

**Recommendation:** Include dark mode in MVP (Tailwind + Shadcn make it easy)

**Decision Needed:** [ ] Include dark mode [ ] Light mode only for MVP

---

### Assumptions to Validate

1. **Assumption:** Users primarily plan one week at a time (not multiple weeks ahead)
   - **Validation needed:** Confirm single active week is sufficient for MVP

2. **Assumption:** Meal suggestions should be diverse (no repeats within a week)
   - **Validation needed:** Some users may want recurring meals (e.g., same breakfast daily)

3. **Assumption:** Nutrition accuracy within 15-20% is acceptable for AI estimation
   - **Validation needed:** Confirm users are okay with "estimated" label

4. **Assumption:** Users will manually paste Instagram content (no automated scraping)
   - **Validation needed:** Confirm this workflow is acceptable

5. **Assumption:** Three meals per day (breakfast, lunch, dinner) is standard
   - **Validation needed:** No need for snacks or additional meal slots in MVP

---

## MVP Scope Definition

### MVP Features (Must Have - P0)

#### Core Meal Planning
- [ ] Weekly calendar view (7 days, 3 meals per day)
- [ ] AI-generated meal suggestions for entire week
- [ ] Retry individual meal suggestions
- [ ] Validate/keep meal suggestions
- [ ] View meal details (ingredients, instructions, nutrition)

#### Recipe Book
- [ ] Import recipes from URL (manual paste for Instagram)
- [ ] AI recipe transcription and structuring
- [ ] Browse recipe collection (grid view)
- [ ] View individual recipe details
- [ ] Save AI-suggested meals to recipe book

#### Nutritional Insights
- [ ] Display macros per meal (calories, protein, carbs, fat)
- [ ] Display prep/cook time
- [ ] Display ingredients list

#### UI/UX
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Comfy/cozy theme (light mode)
- [ ] Basic navigation (home, recipe book)
- [ ] Loading states for AI operations
- [ ] Error handling and user feedback

#### Technical Foundation
- [ ] Next.js 16 app structure
- [ ] Database setup (PostgreSQL via Supabase/similar)
- [ ] OpenAI integration
- [ ] Image storage setup
- [ ] Basic data models (recipes, meal plans, planned meals)

---

### Post-MVP Features (Nice to Have - P1/P2)

#### Phase 2 (High Priority - P1)
- [ ] Search recipes by name, ingredient, tags
- [ ] Filter recipes by source, prep time, dietary tags
- [ ] Edit saved recipes
- [ ] Weekly nutrition summary with charts (Recharts)
- [ ] Dark mode
- [ ] User dietary preferences (vegetarian, vegan, etc.)
- [ ] Basic shopping list (ingredient aggregation)
- [ ] Recipe sharing (export as PDF or link)

#### Phase 3 (Medium Priority - P2)
- [ ] User authentication (accounts)
- [ ] Multi-week planning (plan future weeks)
- [ ] Calendar drag-and-drop (reorder meals)
- [ ] Nutrition goal setting (daily macro targets)
- [ ] Progress charts (weekly nutrition trends)
- [ ] Recipe tags and categorization
- [ ] Ingredient substitution suggestions
- [ ] Meal prep mode (batch cooking view)

#### Phase 4 (Low Priority - P3)
- [ ] AI-generated recipe images (DALL-E)
- [ ] OCR for screenshot-based recipe import
- [ ] Advanced shopping list (smart unit conversion, store sorting)
- [ ] Integration with grocery delivery services
- [ ] Social features (share meal plans, follow users)
- [ ] Recipe ratings and reviews
- [ ] Meal history and favorites
- [ ] Voice input for recipe search
- [ ] Mobile app (React Native/Expo)

---

### MVP Development Phases

#### Phase 1: Foundation (Week 1-2)
- **Goal:** Basic app structure, database, and UI
- **Deliverables:**
  - Next.js app scaffold with Tailwind + Shadcn
  - Database schema and models
  - Basic routing (home, recipe book)
  - Static calendar layout (no data)
  - Recipe card components

#### Phase 2: AI Integration (Week 3)
- **Goal:** AI meal generation and recipe transcription
- **Deliverables:**
  - OpenAI API integration
  - Meal generation endpoint
  - Recipe extraction endpoint
  - Test with sample data

#### Phase 3: Meal Planning (Week 4)
- **Goal:** Full meal planning flow
- **Deliverables:**
  - Generate week functionality
  - Retry meal functionality
  - Validate/keep meal state
  - Meal detail view
  - Save to recipe book

#### Phase 4: Recipe Book (Week 5)
- **Goal:** Recipe management
- **Deliverables:**
  - Add recipe form (URL import, manual)
  - Recipe grid view
  - Recipe detail page
  - Basic image handling

#### Phase 5: Polish & Testing (Week 6)
- **Goal:** Production-ready MVP
- **Deliverables:**
  - Responsive design refinements
  - Error handling
  - Loading states
  - Performance optimization
  - User testing and feedback
  - Deployment to production

---

## Success Metrics

### Key Performance Indicators (KPIs)

#### User Engagement
- **Weekly Active Users (WAU):** Number of users who generate or view a meal plan per week
- **Target:** 70%+ of total users active weekly (after onboarding)

- **Meals Generated per User:** Average number of meal suggestions generated
- **Target:** 21+ meals/week (full week plan)

- **Retry Rate:** Percentage of suggested meals that are retried
- **Target:** 10-30% (indicates AI suggestions are good but users have preferences)

- **Validation Rate:** Percentage of suggested meals that are kept/validated
- **Target:** 70%+ (indicates high satisfaction with AI suggestions)

#### Recipe Book Growth
- **Recipes Saved per User:** Average size of personal recipe book
- **Target:** 10+ recipes within first month

- **Recipe Import Success Rate:** Percentage of URL imports that successfully extract recipe data
- **Target:** 80%+ success rate

- **AI-to-Book Conversion:** Percentage of AI-suggested meals saved to recipe book
- **Target:** 20-30% (indicates users want to reuse AI recipes)

#### Technical Performance
- **AI Response Time (Ollama):** Time to generate a single meal suggestion
- **Target:** < 10 seconds on recommended hardware (p95)
- **Note:** Varies by user's hardware and chosen model

- **Page Load Time:** Time to first contentful paint
- **Target:** < 2 seconds

- **AI Cost per User:** $0 (Ollama runs locally, no API costs)
- **Note:** Users pay one-time cost of hardware, no recurring fees

#### User Satisfaction (Post-MVP)
- **Feature Usage Rate:** Percentage of users who use each feature
  - Meal planning: 100% (core feature)
  - Recipe book: 60%+
  - Nutrition view: 50%+

- **Return Rate:** Percentage of users who return in week 2
- **Target:** 60%+

---

### MVP Success Criteria

**Definition of MVP Success:**
The MVP is considered successful if, within 1 month of launch:

1. [ ] Users can consistently generate a full week meal plan (21 meals) within acceptable time (< 5 minutes on recommended hardware)
2. [ ] AI suggestion validation rate is above 60% (users are happy with suggestions)
3. [ ] Recipe import works reliably for at least 2 source types (e.g., URL paste + manual entry)
4. [ ] No critical bugs or blockers reported
5. [ ] Page load performance meets targets (< 2s LCP)
6. [ ] Users save at least 5 recipes to their recipe book on average

---

## Appendix

### A. Technical Stack Summary

```yaml
Frontend:
  Framework: Next.js 16 (App Router)
  UI Library: Shadcn UI
  Styling: Tailwind CSS
  Charts: Recharts
  Forms: React Hook Form + Zod
  State: React Context + Server Components

Backend:
  Runtime: Node.js (Next.js)
  API: Next.js API Routes + Server Actions
  Database: PostgreSQL (Supabase)
  ORM: Prisma

External Services:
  AI: Ollama (Local) - Llama 3.2 (3B) or Mistral (7B)
  Image Storage: Vercel Blob Storage
  Deployment: Vercel

Local AI Setup:
  AI Runtime: Ollama (localhost:11434)
  Recommended Models:
    - Primary: llama3.2:3b (~2GB)
    - Alternative: mistral:7b (~4.1GB)
    - High-quality: llama3.1:8b (~4.7GB)
  Installation: brew install ollama / curl script
  No API Keys Required: All processing local

Development:
  Language: TypeScript
  Linting: ESLint
  Formatting: Prettier
  Version Control: Git (GitHub)
```

---

### B. Database Schema Reference

See [Data Models & Entities](#data-models--entities) section for detailed schema.

**Quick Reference:**
- `recipes`: Core recipe data
- `ingredients`: Recipe ingredients (1:many with recipes)
- `nutrition_info`: Nutrition data (1:1 with recipes)
- `meal_plans`: Weekly plan container
- `planned_meals`: Individual meal slots (1:many with meal_plans)

---

### C. User Flow Diagrams

#### Primary User Flow: Generate Weekly Meal Plan

```
[User lands on home page]
    ↓
[Sees empty calendar or current week's plan]
    ↓
[Clicks "Generate Week" button]
    ↓
[AI generates 21 meals (loading state shown)]
    ↓
[Calendar populates with meal suggestions]
    ↓
[User reviews each meal card]
    ↓
  ↙     ↓     ↘
[Keep]  [Retry]  [View Details]
  ↓       ↓           ↓
[Mark   [New      [Modal with
 as     meal      full recipe,
 validated] shown]  ingredients,
                   nutrition]
                      ↓
                [Optional: Save to Recipe Book]
    ↓
[User validates most meals]
    ↓
[Clicks "Shopping List" or "Weekly Summary" (future)]
    ↓
[Proceeds to cook meals during the week]
```

#### Secondary User Flow: Import Recipe

```
[User navigates to Recipe Book]
    ↓
[Clicks "+ Add Recipe"]
    ↓
[Modal shows import options]
    ↓
  ↙           ↓          ↘
[URL Import] [Text Paste] [Manual Entry]
    ↓            ↓              ↓
[Paste URL] [Paste text]  [Fill form]
    ↓            ↓              ↓
[AI extracts recipe data]      ↓
    ↓            ↓              ↓
[Preview extracted recipe] ←───┘
    ↓
[User edits/confirms]
    ↓
[Clicks "Save Recipe"]
    ↓
[Recipe added to book]
    ↓
[Redirected to recipe detail or back to grid]
```

---

### D. Design Mockup References

*(In a real PRD, this would include links to Figma/design files)*

- Home Page (Calendar View): [Link to mockup]
- Recipe Book Grid: [Link to mockup]
- Recipe Detail Page: [Link to mockup]
- Add Recipe Modal: [Link to mockup]
- Mobile Views: [Link to mockup]

---

### E. API Endpoint Specification (Draft)

#### Meal Planning Endpoints

**POST /api/meal-plans/generate**
- Description: Generate AI meal suggestions for a week
- Request Body:
  ```json
  {
    "week_start_date": "2025-01-06",
    "dietary_preferences": ["vegetarian"] // optional
  }
  ```
- Response:
  ```json
  {
    "meal_plan_id": "uuid",
    "meals": [
      {
        "day": 0,
        "meal_type": "breakfast",
        "recipe": { /* full recipe object */ }
      },
      // ... 20 more meals
    ]
  }
  ```

**POST /api/planned-meals/{id}/retry**
- Description: Regenerate a specific meal suggestion
- Request Body:
  ```json
  {
    "exclude_recipes": ["recipe_id_1", "recipe_id_2"]
  }
  ```
- Response: New recipe object

**PATCH /api/planned-meals/{id}/validate**
- Description: Mark a meal as validated
- Request Body:
  ```json
  {
    "status": "validated"
  }
  ```
- Response: Updated planned_meal object

---

#### Recipe Endpoints

**POST /api/recipes/import**
- Description: Import recipe from URL or text
- Request Body:
  ```json
  {
    "source_type": "url" | "text" | "manual",
    "content": "https://example.com/recipe" | "recipe text...",
    "manual_data": { /* if manual */ }
  }
  ```
- Response: Extracted recipe object (preview, not yet saved)

**POST /api/recipes**
- Description: Save a new recipe
- Request Body: Full recipe object
- Response: Saved recipe with ID

**GET /api/recipes**
- Description: List all recipes
- Query Params: `?search=query&source_type=instagram&limit=20&offset=0`
- Response: Array of recipe objects

**GET /api/recipes/{id}**
- Description: Get single recipe details
- Response: Full recipe object

**PATCH /api/recipes/{id}**
- Description: Update recipe
- Request Body: Partial recipe object
- Response: Updated recipe

**DELETE /api/recipes/{id}**
- Description: Delete recipe (soft delete)
- Response: Success confirmation

---

### F. Environment Setup Guide

**Prerequisites:**
- Node.js 18+ (for Next.js 16)
- pnpm/npm/yarn
- PostgreSQL (or Supabase account)
- OpenAI API key

**Installation Steps:**
```bash
# 1. Clone repository
git clone <repo-url>
cd ai-meal-planner

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Set up database
pnpm prisma migrate dev

# 5. Seed database (optional)
pnpm prisma db seed

# 6. Run development server
pnpm dev
```

**Environment Variables:**
```bash
# Database
DATABASE_URL="postgresql://..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Image Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### G. Glossary

- **Meal Plan:** A collection of planned meals for a specific week
- **Planned Meal:** A single meal slot (e.g., Monday breakfast) with an associated recipe
- **Recipe:** A structured set of instructions, ingredients, and metadata for preparing a dish
- **Validation:** User action confirming they want to keep an AI-suggested meal
- **Retry:** User action requesting a different AI suggestion for a specific meal slot
- **Transcription:** AI process of converting unstructured recipe content into standardized format
- **Macro:** Short for macronutrient (protein, carbohydrates, fat)
- **LCP:** Largest Contentful Paint (web performance metric)
- **TTI:** Time to Interactive (web performance metric)

---

### H. Open Questions for Future Consideration

1. Should we support collaborative meal planning (e.g., families planning together)?
2. How do we handle leftover management (plan for using leftovers)?
3. Should we integrate with smart kitchen devices (e.g., Instant Pot, smart ovens)?
4. Can we offer meal prep plans (batch cooking guides)?
5. Should we provide calorie/macro budgets and optimize meal plans to hit them?
6. How do we handle regional/seasonal ingredient availability?
7. Should we support multiple cuisines or dietary styles (keto, paleo, Mediterranean)?
8. Can we integrate with fitness apps to align meal plans with workout schedules?

---

## Document Revision History

| Version | Date       | Author | Changes                          |
|---------|------------|--------|----------------------------------|
| 1.0     | 2025-12-23 | Claude | Initial PRD creation             |

---

## Approval & Sign-off

**Pending Review:**
- [ ] Product Owner
- [ ] Technical Lead
- [ ] Design Lead
- [ ] Stakeholders

**Approval Date:** _________________

---

**Next Steps:**
1. Review this PRD with stakeholders
2. Address clarifying questions (Section 9)
3. Finalize MVP scope
4. Create technical design document
5. Set up development environment
6. Begin Phase 1 development

