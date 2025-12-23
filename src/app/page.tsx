"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { startOfWeek, format } from "date-fns";
import { toast } from "sonner";
import { WeekCalendar } from "@/components/meal-planner/week-calendar";
import { RecipeDetail } from "@/components/recipe-book/recipe-detail";
import { MealType } from "@/components/meal-planner/meal-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Wifi } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PlannedMeal {
  id: string;
  date: Date;
  mealType: MealType;
  status: "SUGGESTED" | "VALIDATED";
  recipe: {
    id: string;
    title: string;
    description?: string | null;
    prepTime?: number | null;
    cookTime?: number | null;
    imageUrl?: string | null;
    instructions?: string[];
    cuisine?: string | null;
    dietaryTags?: string[];
    difficulty?: string | null;
    inRecipeBook?: boolean;
    ingredients?: {
      id: string;
      name: string;
      quantity?: number | null;
      unit?: string | null;
      notes?: string | null;
    }[];
    nutritionInfo?: {
      calories?: number | null;
      protein?: number | null;
      carbs?: number | null;
      fat?: number | null;
      fiber?: number | null;
      isEstimated?: boolean;
    } | null;
  };
}

interface MealPlan {
  id: string;
  weekStart: Date;
  meals: PlannedMeal[];
}

interface AIStatus {
  running: boolean;
  modelAvailable: boolean;
  error?: string;
}

export default function MealPlannerPage() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState<Set<string>>(new Set());
  const [aiStatus, setAiStatus] = useState<AIStatus | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<PlannedMeal["recipe"] | null>(null);

  // Memoize week start to prevent infinite re-renders
  const currentWeekStart = useMemo(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    []
  );
  const weekStartIso = useMemo(
    () => currentWeekStart.toISOString(),
    [currentWeekStart]
  );

  // Check AI status
  useEffect(() => {
    async function checkAI() {
      try {
        const res = await fetch("/api/ai/status");
        const status = await res.json();
        setAiStatus(status);
      } catch {
        setAiStatus({ running: false, modelAvailable: false, error: "Cannot reach server" });
      }
    }
    checkAI();
  }, []);

  // Fetch meal plan
  const fetchMealPlan = useCallback(async () => {
    try {
      const res = await fetch(`/api/meals?weekStart=${weekStartIso}`);
      const data = await res.json();

      // Handle error responses
      if (data.error) {
        console.error("API error:", data.error);
        toast.error("Failed to load meal plan. Is the database running?");
        setMealPlan({ id: "", weekStart: currentWeekStart, meals: [] });
      } else {
        setMealPlan(data);
      }
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      toast.error("Failed to load meal plan. Is the database running?");
      setMealPlan({ id: "", weekStart: currentWeekStart, meals: [] });
    } finally {
      setLoading(false);
    }
  }, [weekStartIso, currentWeekStart]);

  useEffect(() => {
    fetchMealPlan();
  }, [fetchMealPlan]);

  // Validate/unvalidate meal
  const handleValidateMeal = async (mealId: string) => {
    const meal = mealPlan?.meals.find((m) => m.id === mealId);
    if (!meal) return;

    const newStatus = meal.status === "SUGGESTED" ? "VALIDATED" : "SUGGESTED";

    try {
      await fetch(`/api/meals/${mealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setMealPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          meals: prev.meals.map((m) =>
            m.id === mealId ? { ...m, status: newStatus } : m
          ),
        };
      });

      toast.success(newStatus === "VALIDATED" ? "Meal kept!" : "Meal unmarked");
    } catch (error) {
      console.error("Error updating meal:", error);
      toast.error("Failed to update meal");
    }
  };

  // Generate single meal (with optional extra existing meals to avoid)
  const handleGenerateMeal = async (
    date: Date,
    mealType: MealType,
    extraExistingMeals: string[] = []
  ): Promise<string | null> => {
    try {
      // Get existing meal titles to avoid duplicates
      const existingMeals = [
        ...(mealPlan?.meals.map((m) => m.recipe.title) || []),
        ...extraExistingMeals,
      ];

      // Generate new meal with AI
      const aiRes = await fetch("/api/ai/generate-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealType,
          existingMeals,
        }),
      });

      if (!aiRes.ok) {
        throw new Error("Failed to generate meal");
      }

      const recipe = await aiRes.json();

      // Create planned meal
      const mealRes = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.toISOString(),
          mealType,
          recipeId: recipe.id,
          weekStart: weekStartIso,
        }),
      });

      if (!mealRes.ok) {
        throw new Error("Failed to create meal");
      }

      const newMeal = await mealRes.json();

      setMealPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          meals: [...prev.meals.filter(
            (m) =>
              !(
                format(new Date(m.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd") &&
                m.mealType === mealType
              )
          ), newMeal],
        };
      });

      toast.success(`Found: ${recipe.title}`);
      return recipe.title; // Return title for tracking
    } catch (error) {
      console.error("Error generating meal:", error);
      toast.error("Failed to fetch meal. Please try again.");
      return null;
    }
  };

  // Retry meal (generate new one for same slot)
  const handleRetryMeal = async (date: Date, mealType: MealType) => {
    await handleGenerateMeal(date, mealType);
  };

  // Generate entire week
  const handleGenerateWeek = async () => {
    setIsGeneratingWeek(true);

    try {
      const mealTypes: MealType[] = ["BREAKFAST", "LUNCH", "DINNER"];
      const days = 7;
      let generated = 0;

      // Track all generated meal titles during this batch
      const generatedTitles: string[] = [];

      for (let day = 0; day < days; day++) {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + day);

        for (const mealType of mealTypes) {
          // Check if meal already exists and is validated
          const existingMeal = mealPlan?.meals.find(
            (m) =>
              format(new Date(m.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd") &&
              m.mealType === mealType &&
              m.status === "VALIDATED"
          );

          if (existingMeal) continue; // Skip validated meals

          // Set loading state for this slot
          const slotKey = `${format(date, "yyyy-MM-dd")}-${mealType}`;
          setLoadingSlots((prev) => new Set(prev).add(slotKey));

          try {
            // Pass all previously generated titles to avoid duplicates
            const title = await handleGenerateMeal(date, mealType, generatedTitles);
            if (title) {
              generatedTitles.push(title);
              generated++;
            }
          } finally {
            // Clear loading state for this slot
            setLoadingSlots((prev) => {
              const next = new Set(prev);
              next.delete(slotKey);
              return next;
            });
          }

          // Small delay between requests
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      toast.success(`Generated ${generated} meals for the week!`);
    } catch (error) {
      console.error("Error generating week:", error);
      toast.error("Failed to generate all meals");
    } finally {
      setIsGeneratingWeek(false);
      setLoadingSlots(new Set()); // Clear all loading slots
    }
  };

  // Save recipe to book
  const handleSaveToBook = async (recipeId: string) => {
    try {
      await fetch(`/api/recipes/${recipeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inRecipeBook: true }),
      });

      toast.success("Recipe saved to book!");

      // Update local state
      setMealPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          meals: prev.meals.map((m) =>
            m.recipe.id === recipeId
              ? { ...m, recipe: { ...m.recipe, inRecipeBook: true } }
              : m
          ),
        };
      });
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error("Failed to save recipe");
    }
  };

  // View recipe details
  const handleViewRecipe = (recipeId: string) => {
    const meal = mealPlan?.meals.find((m) => m.recipe.id === recipeId);
    if (meal) {
      setSelectedRecipe(meal.recipe);
      setSelectedRecipeId(recipeId);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Status Warning */}
      {aiStatus && !aiStatus.running && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ollama Not Running</AlertTitle>
          <AlertDescription>
            AI features are unavailable. Start Ollama to generate meal
            suggestions.
            <br />
            <code className="text-xs mt-1 block">ollama serve</code>
          </AlertDescription>
        </Alert>
      )}

      {aiStatus && aiStatus.running && !aiStatus.modelAvailable && (
        <Alert>
          <Wifi className="h-4 w-4" />
          <AlertTitle>Model Not Downloaded</AlertTitle>
          <AlertDescription>
            The llama3.2 model needs to be downloaded.
            <br />
            <code className="text-xs mt-1 block">ollama pull llama3.2</code>
          </AlertDescription>
        </Alert>
      )}

      {/* Week Calendar */}
      <WeekCalendar
        meals={mealPlan?.meals || []}
        onValidateMeal={handleValidateMeal}
        onRetryMeal={handleRetryMeal}
        onGenerateMeal={handleGenerateMeal}
        onSaveToBook={handleSaveToBook}
        onViewRecipe={handleViewRecipe}
        onGenerateWeek={handleGenerateWeek}
        isGeneratingWeek={isGeneratingWeek}
        loadingSlots={loadingSlots}
      />

      {/* Recipe Detail Modal */}
      <RecipeDetail
        open={!!selectedRecipeId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRecipeId(null);
            setSelectedRecipe(null);
          }
        }}
        recipe={selectedRecipe}
        onSaveToBook={() => selectedRecipeId && handleSaveToBook(selectedRecipeId)}
        isSaved={selectedRecipe?.inRecipeBook}
      />
    </div>
  );
}
