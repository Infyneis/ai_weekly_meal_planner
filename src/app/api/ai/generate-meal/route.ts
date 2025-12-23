import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRandomRecipeForMealType } from "@/lib/mealdb";

// POST /api/ai/generate-meal - Fetch a recipe from TheMealDB
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mealType, existingMeals = [] } = body;

    // Map meal type to mealdb format
    const mealDbType = mealType.toLowerCase() as "breakfast" | "lunch" | "dinner";

    // Fetch recipe from TheMealDB
    const mealDbRecipe = await getRandomRecipeForMealType(mealDbType, existingMeals);

    if (!mealDbRecipe) {
      return NextResponse.json(
        { error: "Could not find a suitable recipe. Please try again." },
        { status: 404 }
      );
    }

    // Check if recipe already exists in database (by title)
    const existing = await prisma.recipe.findFirst({
      where: { title: mealDbRecipe.title },
      include: {
        nutritionInfo: true,
        ingredients: true,
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // Create recipe in database
    const recipe = await prisma.recipe.create({
      data: {
        title: mealDbRecipe.title,
        description: mealDbRecipe.description,
        imageUrl: mealDbRecipe.imageUrl,
        prepTime: 15, // TheMealDB doesn't provide prep time
        cookTime: 30, // Estimate
        totalTime: 45,
        servings: 4,
        instructions: mealDbRecipe.instructions,
        cuisine: mealDbRecipe.cuisine,
        mealType: [mealType],
        dietaryTags: mealDbRecipe.tags,
        difficulty: "medium",
        source: "mealdb",
        sourceUrl: `https://www.themealdb.com/meal/${mealDbRecipe.externalId}`,
        inRecipeBook: false,
        ingredients: {
          create: mealDbRecipe.ingredients.map((ing) => ({
            name: ing.name,
            quantity: parseFloat(ing.quantity) || null,
            unit: ing.unit || null,
          })),
        },
        nutritionInfo: {
          create: {
            calories: 350 + Math.floor(Math.random() * 200), // Estimate 350-550
            protein: 20 + Math.floor(Math.random() * 20),    // Estimate 20-40g
            carbs: 25 + Math.floor(Math.random() * 30),      // Estimate 25-55g
            fat: 12 + Math.floor(Math.random() * 15),        // Estimate 12-27g
            fiber: 4 + Math.floor(Math.random() * 6),        // Estimate 4-10g
            isEstimated: true,
          },
        },
      },
      include: {
        nutritionInfo: true,
        ingredients: true,
      },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching meal:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal from recipe database." },
      { status: 500 }
    );
  }
}
