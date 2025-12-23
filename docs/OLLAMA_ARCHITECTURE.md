# Ollama Local AI Architecture - Update Summary

**Document Version:** 1.1
**Date:** 2025-12-23
**Status:** Architectural Decision Implemented in PRD

---

## Overview

The AI Weekly Meal Planner now uses **Ollama running locally** instead of cloud-based AI services (OpenAI, Anthropic, etc.). This is a fundamental architectural decision with significant implications for privacy, cost, and user experience.

---

## Key Benefits

### 1. Zero Ongoing Costs
- **No API fees:** $0 per month vs. estimated $0.01+ per user with cloud AI
- **One-time investment:** Users only pay for capable hardware (if needed)
- **Unlimited usage:** No rate limits or quotas

### 2. Complete Privacy
- **All AI processing on local machine:** Recipe data never leaves user's computer
- **No external API calls:** No data sent to OpenAI, Google, etc.
- **Data sovereignty:** Users maintain full control over their meal plans and recipes
- **GDPR/Privacy compliance:** Inherent by design

### 3. Offline Functionality
- **Works without internet:** Once models are downloaded, no connection needed
- **Reliable operation:** No dependency on external service uptime
- **No network latency:** Faster in some cases (no round-trip to cloud)

---

## Trade-offs & Limitations

### 1. Hardware Requirements
**Minimum (Basic Functionality):**
- CPU: 4+ cores
- RAM: 8GB (16GB recommended)
- Storage: 10GB free space
- OS: macOS, Linux, or Windows (WSL2)

**Recommended (Optimal Performance):**
- CPU: 8+ cores OR
- GPU: NVIDIA GPU with 8GB+ VRAM
- RAM: 16GB+
- Storage: 20GB+ SSD

### 2. Setup Complexity
- Users must install Ollama separately
- Must download AI models (2-9GB per model)
- Must run `ollama serve` to start API server
- Requires basic command-line knowledge

### 3. Variable Performance
- **Speed depends on user's hardware**
  - Fast laptop: 2-5 seconds per meal
  - Older laptop: 10-30 seconds per meal
- **Quality depends on chosen model**
  - Small models (3B): Fast but less sophisticated
  - Large models (70B+): May not run on most hardware

### 4. Model Quality
- Open-source models (Llama, Mistral) are good but not as consistent as GPT-4
- May require more prompt engineering
- Nutrition estimation may be less accurate (10-20% variance)

---

## Recommended Ollama Models

### Primary Model (MVP): **Llama 3.2 (3B)**
```bash
ollama pull llama3.2:3b
```
- **Size:** ~2GB
- **Speed:** 2-5 seconds per meal (on recommended hardware)
- **Quality:** Good for structured recipe generation
- **Best for:** Fast meal suggestions, basic recipe transcription

### Alternative: **Mistral (7B)**
```bash
ollama pull mistral:7b
```
- **Size:** ~4.1GB
- **Speed:** 5-10 seconds per meal
- **Quality:** Excellent instruction-following, reliable JSON output
- **Best for:** All recipe tasks, nutrition estimation

### High-Quality Option: **Llama 3.1 (8B)**
```bash
ollama pull llama3.1:8b
```
- **Size:** ~4.7GB
- **Speed:** 5-10 seconds per meal
- **Quality:** Strong reasoning, more accurate nutrition
- **Best for:** Users with capable hardware who want better quality

### Power User: **Qwen2.5 (14B)**
```bash
ollama pull qwen2.5:14b
```
- **Size:** ~9GB
- **Speed:** 10-20 seconds per meal
- **Quality:** Excellent structured outputs, multilingual support
- **Best for:** High-end hardware, complex recipe extraction

---

## Ollama API Integration

### Endpoint
```
http://localhost:11434/api/generate
```

### Example API Call
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

### Streaming Support (for Progressive UI)
```typescript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3.2:3b',
    prompt: '...',
    stream: true
  })
});

const reader = response.body.getReader();
// Process stream chunks for real-time UI updates
```

---

## User Setup Instructions

### 1. Install Ollama

**macOS:**
```bash
brew install ollama
# OR download from https://ollama.ai
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
- Download from https://ollama.ai
- Requires WSL2

### 2. Start Ollama Service
```bash
ollama serve
```
This starts the local API server on `http://localhost:11434`

### 3. Download Recommended Model
```bash
ollama pull llama3.2:3b
```
Downloads ~2GB (one-time, cached locally)

### 4. Verify Installation
```bash
ollama list  # Shows installed models
ollama run llama3.2:3b "Generate a breakfast recipe"
```

---

## Application Integration Strategy

### 1. Ollama Detection
The Next.js app will check if Ollama is running on startup:
```typescript
async function checkOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    return response.ok;
  } catch {
    return false;
  }
}
```

### 2. User Guidance
If Ollama is not detected:
- Show prominent setup instructions
- Link to installation guide
- Provide troubleshooting tips
- Allow manual meal entry as fallback

### 3. Model Selection
Allow users to choose their preferred model:
- Detect installed models via `/api/tags`
- Let user select from dropdown
- Save preference in local storage
- Recommend models based on detected hardware

### 4. Error Handling
Graceful degradation if Ollama service stops:
- Show cached meal suggestions
- Display clear "Ollama not running" message
- Provide restart instructions
- Allow switching to manual entry mode

---

## Performance Expectations

### Single Meal Generation
| Hardware Spec | Model Size | Expected Time |
|--------------|------------|---------------|
| Apple M1/M2 | 3B | 2-3 seconds |
| Apple M1/M2 | 7B | 4-6 seconds |
| 8-core Intel CPU | 3B | 4-6 seconds |
| 8-core Intel CPU | 7B | 8-12 seconds |
| NVIDIA GPU (8GB) | 7B | 2-4 seconds |
| NVIDIA GPU (8GB) | 13B | 4-8 seconds |

### Full Week Generation (21 meals)
- **Sequential:** 1-5 minutes (depending on hardware)
- **Parallel (3 concurrent):** 30 seconds - 2 minutes
- **With caching (repeats):** 10-30 seconds

---

## Cost Analysis

### Cloud AI (Original Plan)
- **OpenAI GPT-4o-mini:** $0.15 per 1M input tokens
- **Per meal:** ~$0.000075 (500 tokens)
- **Per week (21 meals):** ~$0.0016
- **Per month (4 weeks):** ~$0.0064 per user
- **Annual (single user):** ~$0.077
- **100 users/year:** ~$7.70

### Ollama (New Architecture)
- **API costs:** $0
- **Monthly costs:** $0
- **Annual costs:** $0
- **Scaling costs:** $0 (each user runs their own instance)

**One-time costs:**
- Hardware: $0 (if already have capable laptop)
- Hardware upgrade: $500-2000 (if needed, but optional)
- Model downloads: $0 (free, ~2-9GB bandwidth)

**ROI:** Immediate for users with existing hardware

---

## Privacy & Security Improvements

### Data Privacy
✅ **All AI processing local:** No recipe data sent to external servers
✅ **No API keys required:** No credentials to manage or leak
✅ **Complete user control:** Users own all their data
✅ **GDPR compliant by default:** No data processing agreements needed
✅ **Offline capable:** No network logging or tracking

### Security Benefits
- No external API authentication to compromise
- No sensitive data in environment variables
- No risk of API key exposure
- No dependency on third-party service security

---

## Updated Environment Variables

### Before (Cloud AI)
```bash
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."  # REMOVED
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### After (Local AI)
```bash
DATABASE_URL="postgresql://..."
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OLLAMA_BASE_URL="http://localhost:11434"  # Optional, defaults to localhost
OLLAMA_DEFAULT_MODEL="llama3.2:3b"  # Optional, user-configurable
```

---

## Implementation Checklist

### Phase 1: Core Integration
- [ ] Create Ollama client service
- [ ] Implement model detection
- [ ] Add Ollama availability check
- [ ] Create setup instructions page
- [ ] Handle connection errors gracefully

### Phase 2: Meal Generation
- [ ] Port meal generation prompts to Ollama
- [ ] Test with multiple models (3B, 7B, 8B)
- [ ] Implement streaming for progressive UI
- [ ] Add caching layer
- [ ] Optimize prompt templates

### Phase 3: Recipe Management
- [ ] Port recipe extraction to Ollama
- [ ] Test URL import with local AI
- [ ] Implement nutrition estimation
- [ ] Add retry logic with different models

### Phase 4: User Experience
- [ ] Create model selection UI
- [ ] Add performance monitoring
- [ ] Show generation progress
- [ ] Implement background generation
- [ ] Add hardware detection hints

### Phase 5: Polish
- [ ] Write user documentation
- [ ] Create troubleshooting guide
- [ ] Add performance benchmarks
- [ ] Test on various hardware configs
- [ ] Optimize for slower machines

---

## Testing Strategy

### Hardware Diversity Testing
Test on multiple hardware configurations:
- [ ] Apple Silicon (M1/M2/M3)
- [ ] Intel MacBook Pro
- [ ] Linux desktop (AMD Ryzen)
- [ ] Windows 11 (WSL2)
- [ ] Low-spec laptop (8GB RAM)
- [ ] NVIDIA GPU setup

### Model Quality Testing
Compare outputs across models:
- [ ] Llama 3.2 (3B) - baseline
- [ ] Mistral (7B) - quality reference
- [ ] Llama 3.1 (8B) - balanced option
- [ ] Qwen2.5 (14B) - high-end option

### Performance Benchmarks
Measure and document:
- [ ] Single meal generation time
- [ ] Full week generation time
- [ ] Memory usage during generation
- [ ] CPU/GPU utilization
- [ ] Model loading time

---

## Documentation Updates Needed

### User-Facing Docs
1. **Installation Guide:**
   - Step-by-step Ollama setup
   - Platform-specific instructions
   - Troubleshooting common issues

2. **Model Selection Guide:**
   - Comparison of available models
   - Hardware requirements per model
   - Quality vs. speed trade-offs

3. **FAQ:**
   - Why local AI?
   - What if I don't have powerful hardware?
   - Can I use cloud AI instead?
   - How to upgrade/change models?

### Developer Docs
1. **Ollama Integration Guide:**
   - API reference
   - Prompt engineering tips
   - Error handling patterns

2. **Performance Optimization:**
   - Caching strategies
   - Parallel generation
   - Streaming implementation

---

## Future Enhancements

### Post-MVP Features
1. **Hybrid Mode:** Option to use cloud AI as fallback
2. **Model Auto-Selection:** Choose model based on hardware detection
3. **Background Model Updates:** Auto-download model updates
4. **Fine-Tuned Models:** Train custom models on user's recipe preferences
5. **Multi-Model Ensemble:** Use multiple models for consensus
6. **GPU Acceleration Detection:** Optimize for NVIDIA/AMD GPUs

---

## Summary of PRD Changes

The following sections have been updated in the main PRD:

✅ **Executive Summary:** Added Ollama architectural decision note
✅ **AI Integration (Section 7.3):** Complete rewrite for Ollama
  - Hardware requirements
  - Recommended models
  - API integration examples
  - Setup instructions
✅ **Performance Requirements (Section 7.5):** Updated timing expectations
✅ **Security Requirements (Section 7.6):** Added privacy benefits
✅ **API & Integration Requirements (Section 8):** Removed OpenAI, added Ollama
✅ **Success Metrics (Section 11):** Removed API cost metrics
✅ **Technical Stack Summary (Appendix A):** Updated to show Ollama
✅ **Environment Setup (Appendix F):** Removed OPENAI_API_KEY
✅ **Cost Analysis:** Updated to show $0 AI costs

---

## Questions for User

1. **Default Model:** Should we default to Llama 3.2 (3B) for fastest performance, or Mistral (7B) for better quality?

2. **Setup Friction:** Are you comfortable requiring users to install Ollama separately, or should we explore bundling it with the app?

3. **Fallback Strategy:** If Ollama is not running, should we:
   - Block meal generation entirely?
   - Allow manual meal entry only?
   - Offer optional cloud AI as paid upgrade?

4. **Model Downloads:** Should the app help users download models, or direct them to CLI commands?

5. **Hardware Warnings:** Should we detect low-spec hardware and recommend smaller models or warn about performance?

---

**For full details, see the updated PRD at:**
`/Users/samy/Workspace/year_coding_challenge/11.ai_weekly_meal_planner/PRD.md`

