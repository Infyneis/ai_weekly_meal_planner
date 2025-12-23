"use client";

import { useState, useEffect } from "react";
import { Search, Globe, ChefHat, Loader2, Plus, ExternalLink, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchResult {
  externalId: string;
  title: string;
  description: string;
  imageUrl: string;
  cuisine: string;
  category: string;
  tags: string[];
}

interface RecipeSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (recipeId: string) => Promise<void>;
}

export function RecipeSearch({ open, onOpenChange, onImport }: RecipeSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Load cuisines and categories on mount
  useEffect(() => {
    async function loadFilters() {
      try {
        const [cuisineRes, categoryRes] = await Promise.all([
          fetch("/api/recipes/search?listCuisines=true"),
          fetch("/api/recipes/search?listCategories=true"),
        ]);
        const cuisineData = await cuisineRes.json();
        const categoryData = await categoryRes.json();
        setCuisines(cuisineData.cuisines || []);
        setCategories(categoryData.categories || []);
      } catch (error) {
        console.error("Error loading filters:", error);
      }
    }
    if (open) {
      loadFilters();
    }
  }, [open]);

  // Search recipes
  const handleSearch = async () => {
    if (!query && !selectedCuisine && !selectedCategory) return;

    setLoading(true);
    try {
      let url = "/api/recipes/search?";
      if (query) url += `q=${encodeURIComponent(query)}`;
      else if (selectedCuisine) url += `cuisine=${encodeURIComponent(selectedCuisine)}`;
      else if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}`;

      const res = await fetch(url);
      const data = await res.json();
      setResults(data.recipes || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get random recipe
  const handleRandom = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recipes/search?random=true");
      const data = await res.json();
      setResults(data.recipes || []);
    } catch (error) {
      console.error("Random recipe error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Import recipe
  const handleImport = async (recipeId: string) => {
    setImporting(recipeId);
    try {
      await onImport(recipeId);
      // Mark as imported instead of removing
      setImportedIds((prev) => new Set(prev).add(recipeId));
    } catch (error) {
      console.error("Import error:", error);
    } finally {
      setImporting(null);
    }
  };

  // Handle filter change
  const handleCuisineChange = (value: string) => {
    setSelectedCuisine(value);
    setSelectedCategory("");
    setQuery("");
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedCuisine("");
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Search Online Recipes
          </DialogTitle>
          <DialogDescription>
            Search thousands of recipes from TheMealDB and import them to your cookbook
          </DialogDescription>
        </DialogHeader>

        {/* Search Controls */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes (e.g., pasta, chicken, salad)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedCuisine("");
                  setSelectedCategory("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCuisine} onValueChange={handleCuisineChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="By Cuisine" />
              </SelectTrigger>
              <SelectContent>
                {cuisines.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="By Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleRandom} disabled={loading}>
              <ChefHat className="h-4 w-4 mr-2" />
              Random
            </Button>

            {(selectedCuisine || selectedCategory) && (
              <Button variant="secondary" onClick={handleSearch} disabled={loading}>
                Apply Filter
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="h-[400px] mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Search for recipes or try a random one!</p>
            </div>
          ) : (
            <div className="grid gap-4 pr-4">
              {results.map((recipe) => (
                <div
                  key={recipe.externalId}
                  className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{recipe.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary">{recipe.cuisine}</Badge>
                      <Badge variant="outline">{recipe.category}</Badge>
                      {recipe.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant={importedIds.has(recipe.externalId) ? "secondary" : "default"}
                      onClick={() => handleImport(recipe.externalId)}
                      disabled={importing === recipe.externalId || importedIds.has(recipe.externalId)}
                    >
                      {importing === recipe.externalId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : importedIds.has(recipe.externalId) ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Import
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                    >
                      <a
                        href={`https://www.themealdb.com/meal/${recipe.externalId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
