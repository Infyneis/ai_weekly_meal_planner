# Product Decisions and Recommendations

**Version:** 1.0
**Date:** 2025-12-23
**Status:** Decision Record
**Related Documents:** PRD.md, OLLAMA_ARCHITECTURE.md, DOCKER_DEVOPS_SPECIFICATION.md

---

## Table of Contents

1. [Executive Recommendations](#executive-recommendations)
2. [Critical Decisions](#critical-decisions)
3. [Technical Recommendations](#technical-recommendations)
4. [Open Questions Requiring User Input](#open-questions-requiring-user-input)
5. [Risk Assessment](#risk-assessment)
6. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Recommendations

### Primary Recommendation: MVP-First Approach

**Recommendation:** Build a lean MVP focused on core meal planning functionality, then iterate based on user feedback.

**Rationale:**
- Reduces time-to-market
- Validates core assumptions before investing in advanced features
- Allows user feedback to guide feature prioritization
- Minimizes risk of building unwanted features

**MVP Timeline:** 6 weeks to production-ready v1.0

---

## Critical Decisions

Based on the PRD's "Clarifying Questions" section, here are recommended decisions:

### 1. User Authentication (Section 9.1)

**DECISION: Single-user for MVP, multi-user in v2**

**Justification:**
- Simplifies MVP development significantly
- Reduces security complexity
- Allows faster launch
- Can migrate to multi-user later without major refactoring

**Implementation:**
- Store all data without user_id foreign keys (or use default user_id)
- Design database schema to easily add user authentication later
- Add unique constraints on week_start_date instead of (user_id, week_start_date)

**Migration Path to Multi-User:**
```sql
-- Future migration (v2)
ALTER TABLE recipes ADD COLUMN user_id UUID;
ALTER TABLE meal_plans ADD COLUMN user_id UUID;
-- Add indexes and constraints
```

---

### 2. Week Start Day (Section 9.2)

**DECISION: Monday start (fixed) for MVP**

**Justification:**
- ISO 8601 standard (Monday is first day of week)
- Common in most regions globally
- Simpler than user preference
- Can add preference toggle in v2 with minimal effort

**Implementation:**
```typescript
const getWeekStartDate = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};
```

---

### 3. AI Meal Generation Trigger (Section 9.3)

**DECISION: Manual "Generate Week" button for MVP**

**Justification:**
- Gives users control over when to use local compute resources
- Avoids surprising users with unexpected AI generation
- No API costs means no urgency to optimize calls
- Clearer user intent
- Better for testing and debugging

**Future Enhancement:** Add "Auto-generate" preference in settings (v2)

**UI/UX:**
```
┌─────────────────────────────────────┐
│  Week of Dec 23-29, 2024           │
│                                     │
│  [🎲 Generate Full Week]           │
│  [✨ Fill Empty Slots]              │
│                                     │
│  Empty slots shown with placeholder │
└─────────────────────────────────────┘
```

---

### 4. Meal Customization (Section 9.4)

**DECISION: Read-only for MVP, editable in v2**

**Justification:**
- Significantly reduces complexity
- Nutrition data remains consistent
- Users can use "retry" for different options
- Editing can be added later without breaking changes

**User Workflow:**
- Don't like a suggestion? Click "Retry"
- Like it but want to modify? Save to recipe book, edit there, then manually assign

**Note for UI:** Show clear messaging: "To customize, save to recipe book and edit there"

---

### 5. Instagram Import Method (Section 9.5)

**DECISION: Text paste (Option B) for MVP**

**Justification:**
- Most reliable approach
- No API dependencies or scraping fragility
- Works for all sources (Instagram, blogs, etc.)
- User has control over what's imported
- Zero integration complexity

**Implementation Steps:**
1. User copies Instagram caption or recipe text
2. Pastes into textarea in "Add Recipe" modal
3. User optionally pastes image URL or uploads screenshot
4. AI (Ollama) structures the pasted text into recipe format
5. User reviews and saves

**Future Enhancements (v2+):**
- URL import with web scraping
- Screenshot OCR (using local Tesseract)
- Browser extension for one-click import

---

### 6. Nutrition Data Source (Section 9.6)

**DECISION: AI estimation only for MVP (Option A)**

**Justification:**
- Faster implementation
- No external API integration needed
- Acceptable accuracy for most users (10-20% variance)
- Ollama models can estimate nutrition reasonably well
- Can add API validation in v2

**Implementation:**
- Always label nutrition as "Estimated by AI"
- Include disclaimer about accuracy
- Provide conservative estimates (round to nearest 5g)

**Post-MVP:** Add USDA FoodData Central for ingredient lookup and validation

---

### 7. Recipe Image Handling (Section 9.7)

**DECISION: Category placeholders for MVP (Option B)**

**Justification:**
- Zero cost
- Fast loading
- Consistent design
- Good user experience
- Can add AI generation as premium feature later

**Implementation:**
- Create 10-15 beautiful placeholder images for categories:
  - Breakfast (pancakes, eggs, toast)
  - Lunch (salad, sandwich, bowl)
  - Dinner (pasta, protein + veggies, curry)
  - General (cooking, ingredients)
- Use consistent illustration style (warm, cozy theme)
- Match recipe to closest category
- Allow user to upload custom image

**Image Sources:**
- Free stock photos (Unsplash, Pexels)
- Or commission custom illustrations (Fiverr, ~$50 for set)

---

### 8. Shopping List Feature (Section 9.8)

**DECISION: Include basic version in MVP**

**Justification:**
- High user value
- Moderate complexity
- Core use case (users need to buy ingredients)
- Can start simple and enhance later

**MVP Implementation:**
- Simple ingredient aggregation (list all ingredients from week)
- No smart deduplication (if 2 recipes need eggs, show "eggs" twice)
- No unit conversion
- Checkbox to mark items as purchased
- Export to text/PDF

**Future Enhancements (v2):**
- Smart quantity aggregation ("2 cups flour" + "1 cup flour" = "3 cups flour")
- Unit conversion (cups to grams)
- Categorization by grocery store section
- Integration with grocery delivery services (Instacart API)

---

### 9. Dietary Preferences (Section 9.9)

**DECISION: Include basic preferences in MVP**

**Justification:**
- Critical for making AI suggestions relevant
- Simple to implement with Ollama (just adjust prompts)
- Prevents suggesting non-vegetarian meals to vegetarians
- One-time setup, huge value

**MVP Preferences:**
- Dietary restrictions:
  - None
  - Vegetarian
  - Vegan
  - Pescatarian
  - Gluten-free
  - Dairy-free
- Allergies: Free text field (e.g., "peanuts, shellfish")

**Implementation:**
- Simple settings page
- Store in database (or localStorage for single-user MVP)
- Pass to AI prompts: "User is vegetarian. Do not suggest meat."

**Future Enhancements:**
- Macro goals (protein target, calorie limit)
- Cuisine preferences (Italian, Asian, Mexican)
- Spice tolerance (mild, medium, spicy)
- Cooking skill level

---

### 10. Dark Mode (Section 9.10)

**DECISION: Include dark mode in MVP**

**Justification:**
- Shadcn UI makes it trivial (built-in support)
- Tailwind dark mode is simple
- Popular feature request
- Minimal development time (~2 hours)
- Enhances "cozy" theme (dark mode for evening planning)

**Implementation:**
```typescript
// Use next-themes
import { ThemeProvider } from 'next-themes'

// Tailwind config
module.exports = {
  darkMode: 'class',
  // ...
}

// Toggle component (Shadcn has this built-in)
<ThemeToggle />
```

**Dark Mode Palette (Cozy Theme):**
```
Dark Mode Colors:
  - Background: #1A1A1A (warm dark gray)
  - Surface: #2D2D2D (charcoal)
  - Text: #F4F1DE (cream)
  - Primary: #E07A5F (warm terracotta)
  - Secondary: #81B29A (soft sage)
  - Accent: #F2CC8F (warm sand)
```

---

## Technical Recommendations

### Database Choice: PostgreSQL via Supabase

**Recommendation:** Use Supabase for database + future features

**Why Supabase:**
1. PostgreSQL (robust, relational data fits naturally)
2. Built-in authentication (for v2 multi-user)
3. Real-time subscriptions (future: live meal plan updates)
4. File storage (recipe images)
5. Generous free tier
6. Easy Docker setup (can self-host)

**Alternatives Considered:**
- MongoDB: Too flexible, schema-less is overkill
- SQLite: Not suitable for multi-user (v2)
- Neon/Vercel Postgres: Good, but fewer features than Supabase

**Decision:** PostgreSQL via Docker for MVP (easy migration to Supabase later)

---

### ORM Choice: Prisma

**Recommendation:** Use Prisma for database access

**Why Prisma:**
1. Type-safe queries (TypeScript integration)
2. Excellent developer experience
3. Migration system built-in
4. Prisma Studio for data exploration
5. Works perfectly with Next.js
6. Active community

**Alternatives Considered:**
- Drizzle: Lighter, but less mature
- Supabase Client: Ties us to Supabase specifically
- Raw SQL: Too low-level, error-prone

---

### State Management: React Server Components + Context

**Recommendation:** Minimize client-side state, leverage Next.js 16 features

**Approach:**
- Server Components for data fetching (default)
- Server Actions for mutations (forms, data updates)
- React Context for UI state only (theme, modals)
- No need for TanStack Query/SWR for MVP

**When to Use State Management:**
- Theme (dark/light): React Context
- Modal state: React Context or URL state
- Form state: React Hook Form
- Data fetching: Server Components
- Mutations: Server Actions

---

### Image Strategy

**MVP:**
1. Placeholder images (hosted in /public)
2. User can paste image URL from external source
3. Store URLs in database
4. Use next/image for optimization

**Post-MVP:**
- Upload to Vercel Blob Storage
- Generate with local Stable Diffusion (if user has GPU)
- Integrate with Unsplash API for free stock photos

---

### Form Handling: React Hook Form + Zod

**Recommendation:** Use react-hook-form with Zod validation

**Why:**
- Minimal re-renders (performance)
- Easy validation with Zod schemas
- Works perfectly with Shadcn UI form components
- Type-safe

**Example:**
```typescript
const recipeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  servings: z.number().int().positive(),
  // ...
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(recipeSchema),
});
```

---

## Open Questions Requiring User Input

### Question 1: Target Users - Hardware Assumptions

**Question:** What is your target user's expected hardware capability?

**Context:** Ollama requires decent hardware. We need to decide:
- Do we assume users have modern laptops (M1+, recent Intel/AMD)?
- Or do we support older hardware (5+ years old)?

**Impact:**
- **Modern hardware:** Recommend 7B+ models, faster experience
- **Older hardware:** Limit to 3B models, manage expectations

**Options:**
A. Target modern hardware (2020+), recommend 7B models
B. Support older hardware, default to 3B models, warn about performance
C. Detect hardware capabilities and auto-recommend model

**Recommendation:** Option B (support older hardware) for wider reach

---

### Question 2: First-Run Experience

**Question:** How should we handle first-time users who don't have Ollama installed?

**Options:**
A. **Hard requirement:** Show setup instructions, block usage until Ollama is installed
B. **Soft fallback:** Allow browsing recipe book, manual meal entry, but no AI features
C. **Cloud fallback:** Offer paid cloud AI option for users without capable hardware

**Recommendation:** Option B for MVP (soft fallback), consider Option C for v2

**MVP Flow:**
```
First Visit
  ↓
Check Ollama availability
  ↓
If NOT installed:
  - Show prominent setup banner
  - Link to installation guide
  - Allow recipe book browsing
  - Allow manual meal entry
  ↓
If installed but no models:
  - Guide user to download recommended model
  - Estimate download time/size
```

---

### Question 3: Multi-Language Support

**Question:** Should the app support multiple languages?

**Context:**
- UI text localization (i18n)
- AI-generated content (recipes, meal names)
- Recipe imports from non-English sources

**Impact:**
- Adds significant complexity
- Ollama models vary in multilingual capability
- User base expansion

**Recommendation:** English-only for MVP, add i18n in v2

**Note:** Some Ollama models (Qwen2.5) are excellent at multilingual, so this is easy to add later

---

### Question 4: Offline-First vs Cloud-Optional

**Question:** Should the app work 100% offline, or is internet required for some features?

**Current Architecture:**
- Ollama: Fully offline
- Database: Local (Docker)
- Next.js: Local

**Potential Cloud Dependencies:**
- Image hosting (Vercel Blob)
- Recipe URL imports (requires internet to fetch)
- Analytics (optional)

**Options:**
A. **100% offline:** All features work without internet
B. **Offline-first:** Core features offline, enhancements require internet
C. **Cloud-optional:** Offline mode with degraded experience

**Recommendation:** Option B (offline-first)
- Meal planning: 100% offline
- Recipe book: 100% offline
- URL imports: Requires internet (obviously)
- Image uploads: Store locally, sync to cloud optionally

---

### Question 5: Data Export and Portability

**Question:** Should users be able to export their data (recipes, meal plans)?

**Use Cases:**
- Backup before uninstalling
- Switch to different device
- Share recipe collection with friend
- Print weekly meal plan

**Formats:**
- JSON (full data export)
- PDF (formatted meal plan, recipes)
- CSV (ingredient list, shopping list)
- Text (simple format)

**Recommendation:** Include basic export in MVP
- JSON export (full data backup)
- PDF export (meal plan + recipes)
- CSV export (shopping list)

**Implementation Effort:** Low (1-2 days)

---

### Question 6: Recipe Versioning

**Question:** If a user edits a recipe that's already in their meal plan, what happens?

**Scenarios:**
1. User imports "Chocolate Chip Cookies" recipe
2. Adds it to Monday dessert
3. Later, edits the recipe (changes sugar amount)
4. What happens to Monday's planned meal?

**Options:**
A. **Live update:** Meal plan shows updated recipe (users might be confused)
B. **Snapshot:** Meal plan stores a copy at time of planning (safest)
C. **Versioning:** Keep recipe history, meal plan references specific version

**Recommendation:** Option B (snapshot) for MVP
- When meal is validated, store a copy of recipe at that moment
- Edits to recipe book don't affect past meal plans
- Users can "update" planned meal manually if desired

**Implementation:** Add `recipe_snapshot` JSONB column to `planned_meals` table

---

## Risk Assessment

### High-Priority Risks

#### Risk 1: Ollama Setup Friction

**Description:** Users may struggle to install and configure Ollama

**Probability:** High (60%)
**Impact:** High (blocks core functionality)

**Mitigation:**
1. Extremely clear, step-by-step installation guide
2. Platform-specific instructions (macOS, Linux, Windows)
3. Video tutorial
4. Troubleshooting FAQ
5. Fallback: Manual meal entry mode
6. Consider: Automated Ollama installer in start.sh

**Docker Approach:** Bundle Ollama in Docker Compose to reduce setup friction

---

#### Risk 2: AI Output Quality Variance

**Description:** Ollama models may produce inconsistent or low-quality recipes

**Probability:** Medium (40%)
**Impact:** High (poor user experience)

**Mitigation:**
1. Extensive prompt engineering and testing
2. Output validation (check JSON structure)
3. Fallback prompts if first attempt fails
4. Allow users to choose larger models for better quality
5. Implement retry with different temperature/parameters
6. Human review of sample outputs during testing

**Acceptance Criteria:** 80%+ of generated recipes should be usable without retry

---

#### Risk 3: Performance on Low-End Hardware

**Description:** Slow AI generation on older laptops may frustrate users

**Probability:** Medium (40%)
**Impact:** Medium (degraded experience)

**Mitigation:**
1. Clear hardware requirements in documentation
2. Recommend lightweight 3B model for older hardware
3. Show estimated generation time before starting
4. Progress indicators during generation
5. Option to generate overnight (schedule for low-priority)
6. Caching frequently generated recipes

**Acceptance Criteria:** < 10 seconds per meal on recommended hardware (M1 Mac, modern Intel i7)

---

### Medium-Priority Risks

#### Risk 4: Database Schema Changes

**Description:** Evolving requirements may require database migrations

**Probability:** High (70%)
**Impact:** Low (Prisma handles migrations)

**Mitigation:**
1. Use Prisma migrations from start
2. Test migrations on staging database
3. Backup before migration
4. Design schema to be extensible (JSONB for flexible fields)

---

#### Risk 5: Recipe Import Failures

**Description:** AI extraction from external sources may fail or produce garbage

**Probability:** Medium (50%)
**Impact:** Medium (feature partially broken)

**Mitigation:**
1. Manual text paste as primary method (most reliable)
2. URL import as enhancement (best-effort)
3. Allow manual correction of AI extraction
4. Show preview before saving
5. Error messages guide users to manual entry

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Basic app structure and infrastructure

**Tasks:**
- [ ] Initialize Next.js 16 project with App Router
- [ ] Set up Tailwind CSS + Shadcn UI
- [ ] Configure Prisma with PostgreSQL
- [ ] Create Docker Compose setup
- [ ] Write beautiful start.sh script
- [ ] Design database schema
- [ ] Create initial Prisma migrations
- [ ] Set up Ollama integration
- [ ] Build basic page layouts (home, recipe book, settings)

**Deliverables:**
- Working Docker environment
- Database schema implemented
- Basic UI components
- Ollama connection established

---

### Phase 2: AI Integration (Week 3)

**Goal:** Meal generation and recipe transcription with Ollama

**Tasks:**
- [ ] Create Ollama API client service
- [ ] Write meal generation prompts (breakfast, lunch, dinner)
- [ ] Implement recipe extraction prompts
- [ ] Build nutrition estimation logic
- [ ] Add error handling and retries
- [ ] Test with multiple Ollama models
- [ ] Optimize prompts for quality and speed
- [ ] Implement response caching

**Deliverables:**
- AI-powered meal generation working
- Recipe extraction from text working
- Nutrition estimation functional

---

### Phase 3: Meal Planning (Week 4)

**Goal:** Complete meal planning workflow

**Tasks:**
- [ ] Build calendar component (7 days x 3 meals)
- [ ] Implement "Generate Week" functionality
- [ ] Create meal card component
- [ ] Add "Retry" functionality
- [ ] Implement "Validate/Keep" state management
- [ ] Build meal detail modal/page
- [ ] Create "Save to Recipe Book" action
- [ ] Add week navigation (prev/next)
- [ ] Implement loading states

**Deliverables:**
- Full meal planning interface
- Users can generate and manage weekly meals
- Validated meals persist in database

---

### Phase 4: Recipe Book (Week 5)

**Goal:** Recipe management system

**Tasks:**
- [ ] Build "Add Recipe" modal with import options
- [ ] Implement text paste import
- [ ] Create recipe grid view
- [ ] Build recipe detail page
- [ ] Add basic search functionality
- [ ] Implement recipe CRUD operations
- [ ] Create placeholder images for categories
- [ ] Add image upload capability
- [ ] Build basic shopping list generator

**Deliverables:**
- Recipe book with import and browsing
- Search and filtering
- Shopping list export

---

### Phase 5: Polish & Launch (Week 6)

**Goal:** Production-ready MVP

**Tasks:**
- [ ] Implement dark mode
- [ ] Add dietary preferences settings
- [ ] Responsive design refinements (mobile, tablet)
- [ ] Error handling and user feedback
- [ ] Performance optimization
- [ ] Write user documentation
- [ ] Create Ollama setup guide
- [ ] Test on multiple devices/browsers
- [ ] User acceptance testing
- [ ] Fix bugs and polish UI
- [ ] Prepare deployment
- [ ] Create demo video/screenshots

**Deliverables:**
- Production-ready application
- Documentation complete
- Deployed and accessible

---

### Post-MVP (v2.0 - Future)

**Phase 6: Enhanced Features**
- Search and advanced filtering
- Recipe editing
- Weekly nutrition charts (Recharts)
- Export to PDF
- URL import (web scraping)

**Phase 7: Multi-User & Authentication**
- User accounts (Supabase Auth)
- Data isolation
- Social features (share recipes)

**Phase 8: Advanced AI**
- Meal prep mode
- Macro goal optimization
- Fine-tuned custom models
- Recipe recommendations

---

## Success Criteria

### MVP Launch Success Metrics

After 1 month in production, success is defined as:

1. **Functional:**
   - [ ] Users can generate full week (21 meals) in < 5 minutes
   - [ ] AI suggestion acceptance rate > 60%
   - [ ] Recipe import success rate > 80%
   - [ ] No critical bugs blocking core workflows

2. **Performance:**
   - [ ] Page load time < 2 seconds (LCP)
   - [ ] AI generation < 10 seconds per meal on recommended hardware

3. **Adoption:**
   - [ ] 80%+ of test users complete first meal plan
   - [ ] 60%+ return for second week
   - [ ] Average 5+ recipes saved per user

4. **Quality:**
   - [ ] User satisfaction > 4/5 stars
   - [ ] No major UX complaints
   - [ ] Positive feedback on "cozy" design theme

---

## Summary of Recommended Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| User Auth | Single-user MVP | Simplicity, faster launch |
| Week Start | Monday (fixed) | ISO standard, simple |
| AI Trigger | Manual button | User control, no API costs |
| Meal Editing | Read-only | Reduces complexity |
| Instagram Import | Text paste | Most reliable |
| Nutrition Source | AI only | Fast, good enough for MVP |
| Recipe Images | Placeholders | Zero cost, good UX |
| Shopping List | Basic version | High value, moderate effort |
| Dietary Prefs | Include | Critical for relevance |
| Dark Mode | Include | Easy, popular |
| Database | PostgreSQL | Robust, future-proof |
| ORM | Prisma | Type-safe, great DX |
| State Mgmt | Server Components | Leverage Next.js 16 |

---

## Next Steps

1. **Review this document** with stakeholders
2. **Get approval** on critical decisions
3. **Answer open questions** (target users, first-run experience, etc.)
4. **Begin Phase 1 development**
5. **Set up project repository** and Docker environment
6. **Create initial UI mockups** in Figma (optional)
7. **Start coding!**

---

## Document Approval

**Status:** Awaiting user review

**Questions for User:**
1. Do you agree with the recommended decisions?
2. Any concerns about the 6-week timeline?
3. What is your target user's expected hardware?
4. Should we build the Docker setup first or Next.js app first?
5. Any features you feel strongly should/shouldn't be in MVP?

---

**Ready to build?** Let's start with Phase 1 and get the foundation in place!
