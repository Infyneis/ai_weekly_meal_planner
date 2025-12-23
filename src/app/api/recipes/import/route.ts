import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRecipeById } from "@/lib/mealdb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { externalId } = body;

    if (!externalId) {
      return NextResponse.json(
        { error: "External recipe ID is required" },
        { status: 400 }
      );
    }

    // Check if already imported
    const existing = await prisma.recipe.findFirst({
      where: { sourceUrl: { contains: externalId } },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // Fetch from MealDB
    const mealDbRecipe = await getRecipeById(externalId);

    if (!mealDbRecipe) {
      return NextResponse.json(
        { error: "Recipe not found in MealDB" },
        { status: 404 }
      );
    }

    // Create recipe in database
    const recipe = await prisma.recipe.create({
      data: {
        title: mealDbRecipe.title,
        description: mealDbRecipe.description,
        imageUrl: mealDbRecipe.imageUrl,
        cuisine: mealDbRecipe.cuisine,
        difficulty: "medium",
        source: "mealdb",
        sourceUrl: `https://www.themealdb.com/meal/${externalId}`,
        inRecipeBook: true,
        instructions: mealDbRecipe.instructions,
        dietaryTags: mealDbRecipe.tags,
        ingredients: {
          create: mealDbRecipe.ingredients.map((ing) => ({
            name: ing.name,
            quantity: parseFloat(ing.quantity) || null,
            unit: ing.unit || null,
          })),
        },
        // Estimate nutrition (MealDB doesn't provide nutrition info)
        nutritionInfo: {
          create: {
            calories: 400,
            protein: 25,
            carbs: 35,
            fat: 18,
            fiber: 6,
            isEstimated: true,
          },
        },
      },
      include: {
        ingredients: true,
        nutritionInfo: true,
      },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error importing recipe:", error);
    return NextResponse.json(
      { error: "Failed to import recipe" },
      { status: 500 }
    );
  }
}
