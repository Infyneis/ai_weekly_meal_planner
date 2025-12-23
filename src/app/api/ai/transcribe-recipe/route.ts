import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { transcribeRecipe } from "@/lib/ollama";

// POST /api/ai/transcribe-recipe - Transcribe raw recipe content using AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, source = "manual", sourceUrl } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Recipe content is required" },
        { status: 400 }
      );
    }

    // Transcribe recipe using AI
    const transcribed = await transcribeRecipe(content);

    // Determine meal types based on the recipe
    const mealTypes: string[] = [];
    const title = transcribed.title.toLowerCase();
    if (
      title.includes("breakfast") ||
      title.includes("pancake") ||
      title.includes("oatmeal") ||
      title.includes("egg")
    ) {
      mealTypes.push("BREAKFAST");
    }
    if (
      title.includes("salad") ||
      title.includes("sandwich") ||
      title.includes("soup")
    ) {
      mealTypes.push("LUNCH");
    }
    if (mealTypes.length === 0) {
      mealTypes.push("LUNCH", "DINNER");
    }

    // Create recipe in database
    const recipe = await prisma.recipe.create({
      data: {
        title: transcribed.title,
        description: transcribed.description,
        prepTime: transcribed.prepTime,
        cookTime: transcribed.cookTime,
        totalTime: transcribed.prepTime + transcribed.cookTime,
        servings: transcribed.servings,
        instructions: transcribed.instructions,
        cuisine: transcribed.cuisine,
        mealType: mealTypes,
        dietaryTags: transcribed.dietaryTags,
        difficulty: transcribed.difficulty,
        source: source,
        sourceUrl: sourceUrl,
        inRecipeBook: true, // Imported recipes go directly to recipe book
        ingredients: {
          create: transcribed.ingredients.map((ing) => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes,
          })),
        },
        nutritionInfo: {
          create: {
            calories: transcribed.nutrition.calories,
            protein: transcribed.nutrition.protein,
            carbs: transcribed.nutrition.carbs,
            fat: transcribed.nutrition.fat,
            fiber: transcribed.nutrition.fiber,
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
    console.error("Error transcribing recipe:", error);
    return NextResponse.json(
      { error: "Failed to transcribe recipe. Make sure Ollama is running." },
      { status: 500 }
    );
  }
}
