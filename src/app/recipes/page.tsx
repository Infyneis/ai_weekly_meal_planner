"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Filter, BookOpen, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RecipeCard } from "@/components/recipe-book/recipe-card";
import { RecipeDetail } from "@/components/recipe-book/recipe-detail";
import { RecipeImport } from "@/components/recipe-book/recipe-import";
import { RecipeSearch } from "@/components/recipe-book/recipe-search";

interface Recipe {
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
  instructions?: string[];
  source?: string | null;
  sourceUrl?: string | null;
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
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  // Fetch recipes
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const params = new URLSearchParams();
        params.set("inRecipeBook", "true");
        if (searchQuery) params.set("search", searchQuery);
        if (sourceFilter !== "all") params.set("source", sourceFilter);

        const res = await fetch(`/api/recipes?${params.toString()}`);
        const data = await res.json();

        // Handle error responses or non-array data
        if (Array.isArray(data)) {
          setRecipes(data);
        } else if (data.error) {
          console.error("API error:", data.error);
          toast.error(data.error);
          setRecipes([]);
        } else {
          setRecipes([]);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        toast.error("Failed to load recipes. Is the database running?");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, sourceFilter]);

  // Handle recipe import
  const handleImport = async (content: string, source: "url" | "text") => {
    try {
      const res = await fetch("/api/ai/transcribe-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          source: source === "url" ? "website" : "manual",
          sourceUrl: source === "url" ? content : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to transcribe recipe");
      }

      const recipe = await res.json();
      setRecipes((prev) => [recipe, ...prev]);
      toast.success(`Imported "${recipe.title}" successfully!`);
    } catch (error) {
      console.error("Error importing recipe:", error);
      toast.error("Failed to import recipe. Is Ollama running?");
      throw error;
    }
  };

  // Handle save to book toggle
  const handleSaveToBook = async (recipeId: string, save: boolean = true) => {
    try {
      await fetch(`/api/recipes/${recipeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inRecipeBook: save }),
      });

      if (!save) {
        setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
        setSelectedRecipe(null);
        toast.success("Recipe removed from book");
      } else {
        setRecipes((prev) =>
          prev.map((r) =>
            r.id === recipeId ? { ...r, inRecipeBook: true } : r
          )
        );
        setSelectedRecipe((prev) =>
          prev ? { ...prev, inRecipeBook: true } : null
        );
        toast.success("Recipe saved to book");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe");
    }
  };

  // Handle import from MealDB
  const handleMealDBImport = async (externalId: string) => {
    try {
      const res = await fetch("/api/recipes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ externalId }),
      });

      if (!res.ok) {
        throw new Error("Failed to import recipe");
      }

      const recipe = await res.json();
      setRecipes((prev) => [recipe, ...prev]);
      toast.success(`Imported "${recipe.title}" successfully!`);
    } catch (error) {
      console.error("Error importing from MealDB:", error);
      toast.error("Failed to import recipe");
      throw error;
    }
  };

  // Handle delete recipe - open confirmation dialog
  const handleDeleteClick = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setDeleteDialogOpen(true);
  };

  // Confirm delete recipe
  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;

    try {
      const res = await fetch(`/api/recipes/${recipeToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete recipe");
      }

      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
      setSelectedRecipe(null);
      toast.success("Recipe deleted");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    } finally {
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    }
  };

  // Get unique sources for filter
  const sources = Array.from(new Set(recipes.map((r) => r.source).filter(Boolean)));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Recipe Book
          </h1>
          <p className="text-muted-foreground">
            {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSearchDialogOpen(true)}>
            <Globe className="h-4 w-4 mr-2" />
            Search Online
          </Button>
          <Button onClick={() => setImportDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Import Recipe
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="ai-generated">AI Generated</SelectItem>
            <SelectItem value="mealdb">TheMealDB</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {(searchQuery || sourceFilter !== "all") && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setSearchQuery("")}
            >
              Search: {searchQuery} ×
            </Badge>
          )}
          {sourceFilter !== "all" && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setSourceFilter("all")}
            >
              Source: {sourceFilter} ×
            </Badge>
          )}
        </div>
      )}

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No recipes yet</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || sourceFilter !== "all"
              ? "No recipes match your filters"
              : "Start by importing a recipe or generating meal suggestions"}
          </p>
          {!searchQuery && sourceFilter === "all" && (
            <Button onClick={() => setImportDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Import Your First Recipe
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              prepTime={recipe.prepTime}
              cookTime={recipe.cookTime}
              servings={recipe.servings}
              difficulty={recipe.difficulty}
              cuisine={recipe.cuisine}
              dietaryTags={recipe.dietaryTags}
              calories={recipe.nutritionInfo?.calories}
              source={recipe.source}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {/* Recipe Detail Modal */}
      <RecipeDetail
        open={!!selectedRecipe}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
        recipe={selectedRecipe}
        onSaveToBook={() =>
          selectedRecipe && handleSaveToBook(selectedRecipe.id, !selectedRecipe.inRecipeBook)
        }
        onDelete={() => selectedRecipe && handleDeleteClick(selectedRecipe)}
        isSaved={selectedRecipe?.inRecipeBook}
      />

      {/* Import Dialog */}
      <RecipeImport
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
      />

      {/* Search Online Dialog */}
      <RecipeSearch
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onImport={handleMealDBImport}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{recipeToDelete?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
