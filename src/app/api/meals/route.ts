import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startOfWeek, endOfWeek, parseISO } from "date-fns";

// GET /api/meals - Get meals for a specific week
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const weekStartParam = searchParams.get("weekStart");

    const weekStart = weekStartParam
      ? startOfWeek(parseISO(weekStartParam), { weekStartsOn: 1 })
      : startOfWeek(new Date(), { weekStartsOn: 1 });

    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    // Find or create meal plan for this week
    let mealPlan = await prisma.mealPlan.findUnique({
      where: { weekStart },
      include: {
        meals: {
          include: {
            recipe: {
              include: {
                nutritionInfo: true,
                ingredients: true,
              },
            },
          },
          orderBy: [{ date: "asc" }, { mealType: "asc" }],
        },
      },
    });

    if (!mealPlan) {
      mealPlan = await prisma.mealPlan.create({
        data: { weekStart },
        include: {
          meals: {
            include: {
              recipe: {
                include: {
                  nutritionInfo: true,
                  ingredients: true,
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json(mealPlan);
  } catch (error) {
    console.error("Error fetching meals:", error);
    return NextResponse.json(
      { error: "Failed to fetch meals" },
      { status: 500 }
    );
  }
}

// POST /api/meals - Create a new planned meal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, mealType, recipeId, weekStart } = body;

    // Find or create meal plan
    let mealPlan = await prisma.mealPlan.findUnique({
      where: { weekStart: new Date(weekStart) },
    });

    if (!mealPlan) {
      mealPlan = await prisma.mealPlan.create({
        data: { weekStart: new Date(weekStart) },
      });
    }

    // Check if meal already exists for this slot
    const existingMeal = await prisma.plannedMeal.findUnique({
      where: {
        mealPlanId_date_mealType: {
          mealPlanId: mealPlan.id,
          date: new Date(date),
          mealType,
        },
      },
    });

    if (existingMeal) {
      // Update existing meal
      const updatedMeal = await prisma.plannedMeal.update({
        where: { id: existingMeal.id },
        data: {
          recipeId,
          status: "SUGGESTED",
        },
        include: {
          recipe: {
            include: {
              nutritionInfo: true,
              ingredients: true,
            },
          },
        },
      });
      return NextResponse.json(updatedMeal);
    }

    // Create new meal
    const meal = await prisma.plannedMeal.create({
      data: {
        mealPlanId: mealPlan.id,
        date: new Date(date),
        mealType,
        recipeId,
        status: "SUGGESTED",
      },
      include: {
        recipe: {
          include: {
            nutritionInfo: true,
            ingredients: true,
          },
        },
      },
    });

    return NextResponse.json(meal);
  } catch (error) {
    console.error("Error creating meal:", error);
    return NextResponse.json(
      { error: "Failed to create meal" },
      { status: 500 }
    );
  }
}
