import { Ollama } from "ollama";

// 🦙 Initialize Ollama client with local server
const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || "http://localhost:11434",
});

const MODEL = process.env.OLLAMA_MODEL || "llama3.2";

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ 🍽️ MEAL SUGGESTION TYPES                                                  │
// └───────────────────────────────────────────────────────────────────────────┘

export interface MealSuggestion {
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    notes?: string;
  }[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  dietaryTags: string[];
}

export type MealType = "breakfast" | "lunch" | "dinner";

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ 🔧 JSON REPAIR HELPER                                                     │
// │ Try to fix common JSON issues from LLM output                             │
// └───────────────────────────────────────────────────────────────────────────┘

function tryParseJSON(text: string): MealSuggestion | null {
  // First, try direct parse
  try {
    return JSON.parse(text);
  } catch {
    // Continue to repairs
  }

  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // Continue
    }
  }

  // Try to find JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  let jsonStr = jsonMatch[0];

  // Common fixes
  // 1. Remove trailing commas before } or ]
  jsonStr = jsonStr.replace(/,\s*([}\]])/g, "$1");

  // 2. Fix unquoted property names (simple cases)
  jsonStr = jsonStr.replace(/(\{|,)\s*(\w+)\s*:/g, '$1"$2":');

  // 3. Replace single quotes with double quotes
  jsonStr = jsonStr.replace(/'/g, '"');

  // 4. Fix missing commas between array elements or object properties
  jsonStr = jsonStr.replace(/"\s*\n\s*"/g, '",\n"');
  jsonStr = jsonStr.replace(/(\d)\s*\n\s*"/g, '$1,\n"');
  jsonStr = jsonStr.replace(/"\s*\n\s*(\d)/g, '",\n$1');

  // 5. Remove any control characters
  jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g, " ");

  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ 🧠 GENERATE MEAL SUGGESTION                                               │
// │ Ask AI to suggest a meal based on type and preferences                    │
// └───────────────────────────────────────────────────────────────────────────┘

export async function generateMealSuggestion(
  mealType: MealType,
  existingMeals: string[] = [],
  dietaryPreferences: string[] = []
): Promise<MealSuggestion> {
  const avoidList =
    existingMeals.length > 0
      ? `Avoid these meals that are already planned: ${existingMeals.join(", ")}.`
      : "";

  const dietaryRestrictions =
    dietaryPreferences.length > 0
      ? `Consider these dietary preferences: ${dietaryPreferences.join(", ")}.`
      : "";

  const mealTypeGuide = {
    breakfast:
      "a breakfast meal (e.g., eggs, pancakes, oatmeal, smoothie bowl, toast)",
    lunch:
      "a lunch meal (e.g., salad, sandwich, soup, grain bowl, light pasta)",
    dinner:
      "a dinner meal (e.g., protein with sides, pasta, stir-fry, casserole)",
  };

  const prompt = `You are a professional chef assistant. Suggest ${mealTypeGuide[mealType]}.

${avoidList}
${dietaryRestrictions}

IMPORTANT:
- Return ONLY valid JSON. No text before or after. No markdown.
- Provide 5-8 DETAILED instruction steps with specific techniques, temperatures, and timing.
- Each step should be a complete sentence explaining exactly what to do.

{
  "title": "Recipe Title",
  "description": "A flavorful description of the dish",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 4,
  "difficulty": "easy",
  "cuisine": "Italian",
  "ingredients": [
    {"name": "chicken breast", "quantity": 2, "unit": "lbs", "notes": "boneless, skinless"},
    {"name": "olive oil", "quantity": 2, "unit": "tbsp"}
  ],
  "instructions": [
    "Preheat your oven to 400°F (200°C) and position the rack in the middle.",
    "Season the chicken generously with salt and pepper on both sides.",
    "Heat olive oil in a large oven-safe skillet over medium-high heat until shimmering.",
    "Sear the chicken for 3-4 minutes per side until golden brown.",
    "Transfer the skillet to the preheated oven and roast for 15-20 minutes until internal temperature reaches 165°F.",
    "Let rest for 5 minutes before slicing to allow juices to redistribute."
  ],
  "nutrition": {
    "calories": 350,
    "protein": 25,
    "carbs": 30,
    "fat": 15,
    "fiber": 5
  },
  "dietaryTags": ["high-protein", "gluten-free"]
}`;

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await ollama.generate({
        model: MODEL,
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.7 - attempt * 0.2, // Lower temp on retries
          num_predict: 2000,
        },
      });

      const meal = tryParseJSON(response.response);
      if (meal && meal.title && meal.ingredients) {
        // Validate and provide defaults
        return {
          title: meal.title || "Untitled Recipe",
          description: meal.description || "",
          prepTime: meal.prepTime || 15,
          cookTime: meal.cookTime || 20,
          servings: meal.servings || 4,
          difficulty: meal.difficulty || "medium",
          cuisine: meal.cuisine || "International",
          ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
          instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
          nutrition: {
            calories: meal.nutrition?.calories || 300,
            protein: meal.nutrition?.protein || 20,
            carbs: meal.nutrition?.carbs || 30,
            fat: meal.nutrition?.fat || 10,
            fiber: meal.nutrition?.fiber || 5,
          },
          dietaryTags: Array.isArray(meal.dietaryTags) ? meal.dietaryTags : [],
        };
      }
      lastError = new Error("Invalid meal structure");
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
    }
  }

  console.error("All attempts failed:", lastError);
  throw new Error(
    "Failed to generate meal suggestion. Make sure Ollama is running."
  );
}

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ 📝 TRANSCRIBE RECIPE                                                      │
// │ Convert raw recipe text/URL content into structured format                │
// └───────────────────────────────────────────────────────────────────────────┘

export async function transcribeRecipe(
  rawContent: string
): Promise<MealSuggestion> {
  const prompt = `You are a recipe parser. Convert this recipe into JSON format.

Raw content:
${rawContent}

IMPORTANT: Return ONLY valid JSON. No text before or after. No markdown.

{
  "title": "Recipe Title",
  "description": "Brief description",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 4,
  "difficulty": "easy",
  "cuisine": "Italian",
  "ingredients": [
    {"name": "ingredient", "quantity": 2, "unit": "cups"}
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "nutrition": {
    "calories": 350,
    "protein": 25,
    "carbs": 30,
    "fat": 15,
    "fiber": 5
  },
  "dietaryTags": []
}

Estimate nutrition if not provided.`;

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await ollama.generate({
        model: MODEL,
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.3 - attempt * 0.1,
          num_predict: 1200,
        },
      });

      const recipe = tryParseJSON(response.response);
      if (recipe && recipe.title) {
        return {
          title: recipe.title || "Untitled Recipe",
          description: recipe.description || "",
          prepTime: recipe.prepTime || 15,
          cookTime: recipe.cookTime || 20,
          servings: recipe.servings || 4,
          difficulty: recipe.difficulty || "medium",
          cuisine: recipe.cuisine || "International",
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
          instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
          nutrition: {
            calories: recipe.nutrition?.calories || 300,
            protein: recipe.nutrition?.protein || 20,
            carbs: recipe.nutrition?.carbs || 30,
            fat: recipe.nutrition?.fat || 10,
            fiber: recipe.nutrition?.fiber || 5,
          },
          dietaryTags: Array.isArray(recipe.dietaryTags) ? recipe.dietaryTags : [],
        };
      }
      lastError = new Error("Invalid recipe structure");
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
    }
  }

  console.error("All attempts failed:", lastError);
  throw new Error("Failed to transcribe recipe. Make sure Ollama is running.");
}

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ 🔍 CHECK OLLAMA STATUS                                                    │
// │ Verify Ollama server is running and model is available                    │
// └───────────────────────────────────────────────────────────────────────────┘

export async function checkOllamaStatus(): Promise<{
  running: boolean;
  modelAvailable: boolean;
  error?: string;
}> {
  try {
    const models = await ollama.list();
    const modelAvailable = models.models.some((m) =>
      m.name.includes(MODEL.replace(":latest", ""))
    );
    return { running: true, modelAvailable };
  } catch {
    return {
      running: false,
      modelAvailable: false,
      error: "Cannot connect to Ollama server",
    };
  }
}
