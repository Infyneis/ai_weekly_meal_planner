"use client";

import { Clock, Users, ChefHat, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  prepTime?: number | null;
  cookTime?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  cuisine?: string | null;
  dietaryTags?: string[];
  calories?: number | null;
  source?: string | null;
  onClick?: () => void;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const sourceEmoji: Record<string, string> = {
  "ai-generated": "🤖",
  instagram: "📸",
  website: "🌐",
  manual: "✏️",
};

export function RecipeCard({
  title,
  description,
  imageUrl,
  prepTime,
  cookTime,
  servings,
  difficulty,
  cuisine,
  dietaryTags = [],
  calories,
  source,
  onClick,
}: RecipeCardProps) {
  const totalTime = (prepTime || 0) + (cookTime || 0);

  return (
    <Card
      className="card-cozy overflow-hidden cursor-pointer group h-full"
      onClick={onClick}
    >
      {/* Image or Placeholder */}
      <div className="relative h-40 bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <ChefHat className="h-12 w-12 text-primary/40" />
          </div>
        )}

        {/* Source Badge */}
        {source && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="backdrop-blur-sm bg-card/80">
              {sourceEmoji[source] || "📝"}{" "}
              {source.charAt(0).toUpperCase() + source.slice(1).replace("-", " ")}
            </Badge>
          </div>
        )}

        {/* Difficulty Badge */}
        {difficulty && (
          <div className="absolute top-2 right-2">
            <Badge
              className={cn(
                "capitalize",
                difficultyColors[difficulty as keyof typeof difficultyColors]
              )}
            >
              {difficulty}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{totalTime} min</span>
            </div>
          )}
          {servings && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{servings}</span>
            </div>
          )}
          {calories && (
            <div className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              <span>{calories} kcal</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {(cuisine || dietaryTags.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {cuisine && (
              <Badge variant="outline" className="text-xs">
                {cuisine}
              </Badge>
            )}
            {dietaryTags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {dietaryTags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{dietaryTags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
