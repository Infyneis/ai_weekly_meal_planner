"use client";

import { useState } from "react";
import { Loader2, Sparkles, Link, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RecipeImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (content: string, source: "url" | "text") => Promise<void>;
}

export function RecipeImport({
  open,
  onOpenChange,
  onImport,
}: RecipeImportProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "url">("text");

  const handleImport = async () => {
    const content = activeTab === "url" ? url : text;
    if (!content.trim()) return;

    setIsImporting(true);
    try {
      await onImport(content, activeTab);
      setUrl("");
      setText("");
      onOpenChange(false);
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Import Recipe
          </DialogTitle>
          <DialogDescription>
            Paste recipe text from Instagram, websites, or anywhere else. Our AI
            will automatically transcribe it into a beautiful format.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "text" | "url")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="gap-2">
              <FileText className="h-4 w-4" />
              Paste Text
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2">
              <Link className="h-4 w-4" />
              URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="recipe-text">Recipe Content</Label>
              <Textarea
                id="recipe-text"
                placeholder="Paste your recipe here...

Example:
Creamy Garlic Pasta
Serves 4 | 30 minutes

Ingredients:
- 1 lb pasta
- 4 cloves garlic, minced
- 1 cup heavy cream
- 1/2 cup parmesan cheese
- Salt and pepper to taste

Instructions:
1. Cook pasta according to package directions
2. Sauté garlic in butter until fragrant
3. Add cream and simmer for 5 minutes
4. Toss with pasta and parmesan
5. Season to taste and serve"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="recipe-url">Recipe URL</Label>
              <Input
                id="recipe-url"
                type="url"
                placeholder="https://example.com/recipe"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Works with Instagram posts, food blogs, and most recipe
                websites.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={
              isImporting ||
              (activeTab === "url" ? !url.trim() : !text.trim())
            }
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Import with AI
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
