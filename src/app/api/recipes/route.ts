import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/recipes - Get all recipes (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const inRecipeBook = searchParams.get("inRecipeBook");
    const cuisine = searchParams.get("cuisine");
    const source = searchParams.get("source");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { cuisine: { contains: search, mode: "insensitive" } },
      ];
    }

    if (inRecipeBook === "true") {
      where.inRecipeBook = true;
    }

    if (cuisine) {
      where.cuisine = cuisine;
    }

    if (source) {
      where.source = source;
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        nutritionInfo: true,
        ingredients: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      prepTime,
      cookTime,
      servings,
      instructions,
      cuisine,
      mealType,
      dietaryTags,
      difficulty,
      source,
      sourceUrl,
      inRecipeBook,
      ingredients,
      nutrition,
    } = body;

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        imageUrl,
        prepTime,
        cookTime,
        totalTime: (prepTime || 0) + (cookTime || 0),
        servings,
        instructions,
        cuisine,
        mealType,
        dietaryTags,
        difficulty,
        source,
        sourceUrl,
        inRecipeBook: inRecipeBook || false,
        ingredients: ingredients
          ? {
              create: ingredients.map(
                (ing: {
                  name: string;
                  quantity?: number;
                  unit?: string;
                  notes?: string;
                }) => ({
                  name: ing.name,
                  quantity: ing.quantity,
                  unit: ing.unit,
                  notes: ing.notes,
                })
              ),
            }
          : undefined,
        nutritionInfo: nutrition
          ? {
              create: {
                calories: nutrition.calories,
                protein: nutrition.protein,
                carbs: nutrition.carbs,
                fat: nutrition.fat,
                fiber: nutrition.fiber,
                sugar: nutrition.sugar,
                isEstimated: true,
              },
            }
          : undefined,
      },
      include: {
        nutritionInfo: true,
        ingredients: true,
      },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
