"use client";

import { useState } from "react";
import {
  Check,
  RefreshCw,
  Clock,
  Flame,
  BookmarkPlus,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";
export type MealStatus = "SUGGESTED" | "VALIDATED";

interface MealCardProps {
  id?: string;
  title: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  calories?: number;
  protein?: number;
  imageUrl?: string;
  mealType: MealType;
  status: MealStatus;
  isLoading?: boolean;
  onValidate?: () => void;
  onRetry?: () => void;
  onSaveToBook?: () => void;
  onViewDetails?: () => void;
}

const mealTypeConfig = {
  BREAKFAST: {
    label: "Breakfast",
    emoji: "🌅",
    className: "meal-breakfast",
  },
  LUNCH: {
    label: "Lunch",
    emoji: "☀️",
    className: "meal-lunch",
  },
  DINNER: {
    label: "Dinner",
    emoji: "🌙",
    className: "meal-dinner",
  },
};

export function MealCard({
  title,
  description,
  prepTime,
  cookTime,
  calories,
  protein,
  mealType,
  status,
  isLoading = false,
  onValidate,
  onRetry,
  onSaveToBook,
  onViewDetails,
}: MealCardProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const config = mealTypeConfig[mealType];
  const totalTime = (prepTime || 0) + (cookTime || 0);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry?.();
    setIsRetrying(false);
  };

  if (isLoading) {
    return (
      <Card className={cn("card-cozy overflow-hidden relative", config.className)}>
        {/* Loading Overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <span className="text-sm font-medium text-muted-foreground">Finding recipe...</span>
        </div>
        <CardContent className="p-4 opacity-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{config.emoji}</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {config.label}
              </span>
            </div>
          </div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "card-cozy overflow-hidden cursor-pointer group",
        config.className,
        status === "VALIDATED" && "ring-2 ring-primary"
      )}
      onClick={onViewDetails}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.emoji}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {config.label}
            </span>
          </div>
          {status === "VALIDATED" && (
            <Badge variant="default" className="bg-primary/90">
              <Check className="h-3 w-3 mr-1" />
              Kept
            </Badge>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{totalTime} min</span>
            </div>
          )}
          {calories && (
            <div className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              <span>{calories} kcal</span>
            </div>
          )}
          {protein && (
            <div className="flex items-center gap-1">
              <span className="font-medium">P:</span>
              <span>{protein}g</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-2 pt-2 border-t border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          {status === "SUGGESTED" ? (
            <>
              <Button
                size="sm"
                variant="default"
                className="flex-1"
                onClick={onValidate}
              >
                <Check className="h-4 w-4 mr-1" />
                Keep
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetry}
                disabled={isRetrying}
              >
                <RefreshCw
                  className={cn("h-4 w-4", isRetrying && "animate-spin")}
                />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={onValidate}
              >
                Unkeep
              </Button>
              <Button size="sm" variant="ghost" onClick={onSaveToBook}>
                <BookmarkPlus className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" onClick={onViewDetails}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyMealCard({
  mealType,
  onGenerate,
  isGenerating = false,
}: {
  mealType: MealType;
  onGenerate?: () => void;
  isGenerating?: boolean;
}) {
  const config = mealTypeConfig[mealType];

  if (isGenerating) {
    return (
      <Card
        className={cn(
          "card-cozy overflow-hidden",
          config.className
        )}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center min-h-[160px] text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">
            Finding {config.label.toLowerCase()}...
          </p>
          <p className="text-xs text-muted-foreground">
            Searching recipes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "card-cozy overflow-hidden border-dashed",
        config.className
      )}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center min-h-[160px] text-center">
        <span className="text-2xl mb-2">{config.emoji}</span>
        <p className="text-sm text-muted-foreground mb-3">
          No {config.label.toLowerCase()} planned
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={onGenerate}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate
        </Button>
      </CardContent>
    </Card>
  );
}
