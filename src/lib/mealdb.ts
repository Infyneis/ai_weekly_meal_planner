// TheMealDB API Integration
// Free recipe API - no API key required
// https://www.themealdb.com/api.php

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  // Ingredients and measures (strIngredient1-20, strMeasure1-20)
  [key: string]: string | null;
}

interface MealDBResponse {
  meals: MealDBMeal[] | null;
}

export interface ParsedRecipe {
  externalId: string;
  title: string;
  description: string;
  imageUrl: string;
  cuisine: string;
  category: string;
  instructions: string[];
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  sourceUrl: string | null;
  youtubeUrl: string | null;
  tags: string[];
}

// Parse ingredients from MealDB format (strIngredient1-20, strMeasure1-20)
function parseIngredients(meal: MealDBMeal): ParsedRecipe["ingredients"] {
  const ingredients: ParsedRecipe["ingredients"] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      // Parse measure into quantity and unit
      const measureStr = (measure || "").trim();
      const match = measureStr.match(/^([\d./\s]+)?\s*(.*)$/);

      ingredients.push({
        name: ingredient.trim(),
        quantity: match?.[1]?.trim() || "",
        unit: match?.[2]?.trim() || "",
      });
    }
  }

  return ingredients;
}

// Parse instructions into steps
function parseInstructions(instructions: string): string[] {
  if (!instructions) return [];

  // Split by newlines or numbered steps
  return instructions
    .split(/\r?\n|\d+\.\s+/)
    .map((step) => step.trim())
    .filter((step) => step.length > 10); // Filter out empty or very short fragments
}

// Convert MealDB meal to our format
function parseMeal(meal: MealDBMeal): ParsedRecipe {
  return {
    externalId: meal.idMeal,
    title: meal.strMeal,
    description: `${meal.strCategory} dish from ${meal.strArea} cuisine`,
    imageUrl: meal.strMealThumb,
    cuisine: meal.strArea || "International",
    category: meal.strCategory || "Main Course",
    instructions: parseInstructions(meal.strInstructions),
    ingredients: parseIngredients(meal),
    sourceUrl: meal.strSource,
    youtubeUrl: meal.strYoutube,
    tags: meal.strTags ? meal.strTags.split(",").map((t) => t.trim()) : [],
  };
}

// Search recipes by name
export async function searchRecipes(query: string): Promise<ParsedRecipe[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
    );
    const data: MealDBResponse = await response.json();

    if (!data.meals) return [];

    return data.meals.map(parseMeal);
  } catch (error) {
    console.error("Error searching MealDB:", error);
    return [];
  }
}

// Get recipe by ID
export async function getRecipeById(id: string): Promise<ParsedRecipe | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data: MealDBResponse = await response.json();

    if (!data.meals || data.meals.length === 0) return null;

    return parseMeal(data.meals[0]);
  } catch (error) {
    console.error("Error fetching recipe from MealDB:", error);
    return null;
  }
}

// Get random recipe
export async function getRandomRecipe(): Promise<ParsedRecipe | null> {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data: MealDBResponse = await response.json();

    if (!data.meals || data.meals.length === 0) return null;

    return parseMeal(data.meals[0]);
  } catch (error) {
    console.error("Error fetching random recipe from MealDB:", error);
    return null;
  }
}

// List categories
export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/list.php?c=list`);
    const data = await response.json();

    return data.meals?.map((m: { strCategory: string }) => m.strCategory) || [];
  } catch (error) {
    console.error("Error fetching categories from MealDB:", error);
    return [];
  }
}

// List cuisines (areas)
export async function getCuisines(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/list.php?a=list`);
    const data = await response.json();

    return data.meals?.map((m: { strArea: string }) => m.strArea) || [];
  } catch (error) {
    console.error("Error fetching cuisines from MealDB:", error);
    return [];
  }
}

// Filter by category
export async function filterByCategory(category: string): Promise<ParsedRecipe[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
    );
    const data: MealDBResponse = await response.json();

    if (!data.meals) return [];

    // Filter endpoint returns limited data, need to fetch full details
    const recipes = await Promise.all(
      data.meals.slice(0, 12).map((meal) => getRecipeById(meal.idMeal))
    );

    return recipes.filter((r): r is ParsedRecipe => r !== null);
  } catch (error) {
    console.error("Error filtering by category:", error);
    return [];
  }
}

// Filter by cuisine (area)
export async function filterByCuisine(cuisine: string): Promise<ParsedRecipe[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/filter.php?a=${encodeURIComponent(cuisine)}`
    );
    const data: MealDBResponse = await response.json();

    if (!data.meals) return [];

    // Filter endpoint returns limited data, need to fetch full details
    const recipes = await Promise.all(
      data.meals.slice(0, 12).map((meal) => getRecipeById(meal.idMeal))
    );

    return recipes.filter((r): r is ParsedRecipe => r !== null);
  } catch (error) {
    console.error("Error filtering by cuisine:", error);
    return [];
  }
}

// Meal type to category mapping
const MEAL_TYPE_CATEGORIES = {
  breakfast: ["Breakfast"],
  lunch: ["Side", "Starter", "Vegetarian", "Miscellaneous", "Pasta"],
  dinner: ["Beef", "Chicken", "Pork", "Seafood", "Lamb", "Pasta", "Goat", "Vegan"],
};

// Get list of meal IDs for a category (lightweight, no full fetch)
async function getMealIdsForCategory(category: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
    );
    const data = await response.json();

    if (!data.meals) return [];

    return data.meals.map((m: { idMeal: string }) => m.idMeal);
  } catch (error) {
    console.error(`Error fetching meal IDs for category ${category}:`, error);
    return [];
  }
}

// Get a random recipe suitable for a meal type, avoiding certain titles
export async function getRandomRecipeForMealType(
  mealType: "breakfast" | "lunch" | "dinner",
  excludeTitles: string[] = []
): Promise<ParsedRecipe | null> {
  const categories = MEAL_TYPE_CATEGORIES[mealType];
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Pick a random category for this meal type
    const category = categories[Math.floor(Math.random() * categories.length)];

    // Get all meal IDs for this category
    const mealIds = await getMealIdsForCategory(category);

    if (mealIds.length === 0) continue;

    // Pick a random meal ID
    const randomId = mealIds[Math.floor(Math.random() * mealIds.length)];

    // Fetch the full recipe
    const recipe = await getRecipeById(randomId);

    if (recipe && !excludeTitles.includes(recipe.title)) {
      return recipe;
    }
  }

  // Fallback: try completely random recipe
  for (let attempt = 0; attempt < 3; attempt++) {
    const recipe = await getRandomRecipe();
    if (recipe && !excludeTitles.includes(recipe.title)) {
      return recipe;
    }
  }

  return null;
}
