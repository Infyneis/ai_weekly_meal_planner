"use client";

import {
  Clock,
  Users,
  ChefHat,
  Flame,
  BookmarkPlus,
  X,
  Check,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NutritionChart } from "./nutrition-chart";
import { cn } from "@/lib/utils";

interface Ingredient {
  id: string;
  name: string;
  quantity?: number | null;
  unit?: string | null;
  notes?: string | null;
}

interface NutritionInfo {
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  fiber?: number | null;
  sugar?: number | null;
  isEstimated?: boolean;
}

interface RecipeDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: {
    id: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    prepTime?: number | null;
    cookTime?: number | null;
    totalTime?: number | null;
    servings?: number | null;
    difficulty?: string | null;
    cuisine?: string | null;
    dietaryTags?: string[];
    instructions?: string[];
    source?: string | null;
    sourceUrl?: string | null;
    inRecipeBook?: boolean;
    ingredients?: Ingredient[];
    nutritionInfo?: NutritionInfo | null;
  } | null;
  onSaveToBook?: () => void;
  onDelete?: () => void;
  isSaved?: boolean;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function RecipeDetail({
  open,
  onOpenChange,
  recipe,
  onSaveToBook,
  onDelete,
  isSaved = false,
}: RecipeDetailProps) {
  if (!recipe) return null;

  const totalTime =
    recipe.totalTime || (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden" showCloseButton={false}>
        <ScrollArea className="max-h-[90vh]">
          {/* Header Image */}
          <div className="relative h-48 bg-muted">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <ChefHat className="h-16 w-16 text-primary/40" />
              </div>
            )}

            {/* Close button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full backdrop-blur-sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            <DialogHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <DialogTitle className="text-2xl font-bold">
                  {recipe.title}
                </DialogTitle>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant={isSaved ? "secondary" : "default"}
                    size="sm"
                    onClick={onSaveToBook}
                  >
                    {isSaved ? (
                      <>
                        <Check className="h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onDelete}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {recipe.description && (
                <p className="text-muted-foreground">{recipe.description}</p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {recipe.difficulty && (
                  <Badge
                    className={cn(
                      "capitalize",
                      difficultyColors[
                        recipe.difficulty as keyof typeof difficultyColors
                      ]
                    )}
                  >
                    {recipe.difficulty}
                  </Badge>
                )}
                {recipe.cuisine && (
                  <Badge variant="outline">{recipe.cuisine}</Badge>
                )}
                {recipe.dietaryTags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </DialogHeader>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {totalTime > 0 && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="font-semibold">{totalTime} min</div>
                  <div className="text-xs text-muted-foreground">Total Time</div>
                </div>
              )}
              {recipe.prepTime && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="font-semibold">{recipe.prepTime} min</div>
                  <div className="text-xs text-muted-foreground">Prep</div>
                </div>
              )}
              {recipe.cookTime && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Flame className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="font-semibold">{recipe.cookTime} min</div>
                  <div className="text-xs text-muted-foreground">Cook</div>
                </div>
              )}
              {recipe.servings && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="font-semibold">{recipe.servings}</div>
                  <div className="text-xs text-muted-foreground">Servings</div>
                </div>
              )}
            </div>

            {/* Nutrition */}
            {recipe.nutritionInfo && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    Nutrition per serving
                    {recipe.nutritionInfo.isEstimated && (
                      <Badge variant="outline" className="text-xs font-normal">
                        AI Estimated
                      </Badge>
                    )}
                  </h3>
                  <NutritionChart nutrition={recipe.nutritionInfo} />
                </div>
              </>
            )}

            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient) => (
                      <li
                        key={ingredient.id}
                        className="flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>
                          {ingredient.quantity && (
                            <span className="font-medium">
                              {ingredient.quantity}
                            </span>
                          )}{" "}
                          {ingredient.unit && (
                            <span className="text-muted-foreground">
                              {ingredient.unit}
                            </span>
                          )}{" "}
                          {ingredient.name}
                          {ingredient.notes && (
                            <span className="text-muted-foreground text-sm">
                              {" "}
                              ({ingredient.notes})
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Instructions */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Instructions</h3>
                  <ol className="space-y-4">
                    {recipe.instructions.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}

            {/* Source */}
            {recipe.sourceUrl && (
              <>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  Source:{" "}
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {recipe.sourceUrl}
                  </a>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
