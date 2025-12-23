import { NextRequest, NextResponse } from "next/server";
import {
  searchRecipes,
  getRandomRecipe,
  filterByCategory,
  filterByCuisine,
  getCategories,
  getCuisines,
} from "@/lib/mealdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const cuisine = searchParams.get("cuisine");
  const random = searchParams.get("random");
  const listCategories = searchParams.get("listCategories");
  const listCuisines = searchParams.get("listCuisines");

  try {
    // List available categories
    if (listCategories === "true") {
      const categories = await getCategories();
      return NextResponse.json({ categories });
    }

    // List available cuisines
    if (listCuisines === "true") {
      const cuisines = await getCuisines();
      return NextResponse.json({ cuisines });
    }

    // Get random recipe
    if (random === "true") {
      const recipe = await getRandomRecipe();
      return NextResponse.json({ recipes: recipe ? [recipe] : [] });
    }

    // Filter by category
    if (category) {
      const recipes = await filterByCategory(category);
      return NextResponse.json({ recipes });
    }

    // Filter by cuisine
    if (cuisine) {
      const recipes = await filterByCuisine(cuisine);
      return NextResponse.json({ recipes });
    }

    // Search by query
    if (query) {
      const recipes = await searchRecipes(query);
      return NextResponse.json({ recipes });
    }

    return NextResponse.json(
      { error: "Please provide a search query, category, or cuisine filter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Recipe search error:", error);
    return NextResponse.json(
      { error: "Failed to search recipes" },
      { status: 500 }
    );
  }
}
