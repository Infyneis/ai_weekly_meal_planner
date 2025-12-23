"use client";

import { useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  addWeeks,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealCard, EmptyMealCard, MealType, MealStatus } from "./meal-card";
import { cn } from "@/lib/utils";

interface PlannedMeal {
  id: string;
  date: Date;
  mealType: MealType;
  status: MealStatus;
  recipe: {
    id: string;
    title: string;
    description?: string | null;
    prepTime?: number | null;
    cookTime?: number | null;
    imageUrl?: string | null;
    inRecipeBook?: boolean;
    nutritionInfo?: {
      calories?: number | null;
      protein?: number | null;
    } | null;
  };
}

interface WeekCalendarProps {
  meals: PlannedMeal[];
  onValidateMeal: (mealId: string) => void;
  onRetryMeal: (date: Date, mealType: MealType) => Promise<void>;
  onGenerateMeal: (date: Date, mealType: MealType) => Promise<void | string | null>;
  onSaveToBook: (recipeId: string, currentlySaved?: boolean) => void;
  onViewRecipe: (recipeId: string) => void;
  onGenerateWeek: () => Promise<void>;
  isGeneratingWeek: boolean;
  loadingSlots?: Set<string>; // Slots currently being loaded (from parent)
}

const MEAL_TYPES: MealType[] = ["BREAKFAST", "LUNCH", "DINNER"];

export function WeekCalendar({
  meals,
  onValidateMeal,
  onRetryMeal,
  onGenerateMeal,
  onSaveToBook,
  onViewRecipe,
  onGenerateWeek,
  isGeneratingWeek,
  loadingSlots = new Set(),
}: WeekCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [generatingMeals, setGeneratingMeals] = useState<Set<string>>(
    new Set()
  );

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const getMealForSlot = (date: Date, mealType: MealType) => {
    return meals.find(
      (meal) =>
        isSameDay(new Date(meal.date), date) && meal.mealType === mealType
    );
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  const handleGoToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const handleGenerateMeal = async (date: Date, mealType: MealType) => {
    const key = `${format(date, "yyyy-MM-dd")}-${mealType}`;
    setGeneratingMeals((prev) => new Set(prev).add(key));
    try {
      await onGenerateMeal(date, mealType);
    } finally {
      setGeneratingMeals((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleRetryMeal = async (date: Date, mealType: MealType) => {
    const key = `${format(date, "yyyy-MM-dd")}-${mealType}`;
    setGeneratingMeals((prev) => new Set(prev).add(key));
    try {
      await onRetryMeal(date, mealType);
    } finally {
      setGeneratingMeals((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Weekly Meal Plan</h1>
          <p className="text-muted-foreground">
            {format(currentWeekStart, "MMMM d")} -{" "}
            {format(addDays(currentWeekStart, 6), "MMMM d, yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onGenerateWeek}
            disabled={isGeneratingWeek}
            className="gap-2"
          >
            <Sparkles
              className={cn("h-4 w-4", isGeneratingWeek && "animate-pulse")}
            />
            {isGeneratingWeek ? "Generating..." : "Generate Week"}
          </Button>

          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousWeek}
              className="rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoToToday}
              className="rounded-none px-3"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextWeek}
              className="rounded-l-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="space-y-3">
            {/* Day Header */}
            <div
              className={cn(
                "text-center p-2 rounded-lg",
                isToday(day)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50"
              )}
            >
              <div className="text-xs font-medium uppercase tracking-wide">
                {format(day, "EEE")}
              </div>
              <div className="text-lg font-bold">{format(day, "d")}</div>
            </div>

            {/* Meal Slots */}
            <div className="space-y-3">
              {MEAL_TYPES.map((mealType) => {
                const meal = getMealForSlot(day, mealType);
                const key = `${format(day, "yyyy-MM-dd")}-${mealType}`;
                const isGenerating = generatingMeals.has(key) || loadingSlots.has(key);

                if (meal) {
                  return (
                    <MealCard
                      key={meal.id}
                      id={meal.id}
                      title={meal.recipe.title}
                      description={meal.recipe.description || undefined}
                      prepTime={meal.recipe.prepTime || undefined}
                      cookTime={meal.recipe.cookTime || undefined}
                      calories={meal.recipe.nutritionInfo?.calories || undefined}
                      protein={meal.recipe.nutritionInfo?.protein || undefined}
                      imageUrl={meal.recipe.imageUrl || undefined}
                      mealType={mealType}
                      status={meal.status}
                      isLoading={isGenerating}
                      isSaved={meal.recipe.inRecipeBook}
                      onValidate={() => onValidateMeal(meal.id)}
                      onRetry={() => handleRetryMeal(day, mealType)}
                      onSaveToBook={() => onSaveToBook(meal.recipe.id, meal.recipe.inRecipeBook)}
                      onViewDetails={() => onViewRecipe(meal.recipe.id)}
                    />
                  );
                }

                return (
                  <EmptyMealCard
                    key={key}
                    mealType={mealType}
                    onGenerate={() => handleGenerateMeal(day, mealType)}
                    isGenerating={isGenerating}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
