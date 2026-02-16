import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MOCK_RECIPES, MOCK_INVENTORY } from "@/lib/mockData";
import { Plus, ChefHat, ArrowLeft, Save, Trash2, Info, ExternalLink } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type UnitOption = {
  value: string;
  label: string;
};

const COMMON_UNITS: UnitOption[] = [
  { value: "EA", label: "EA" },
  { value: "KG", label: "KG" },
  { value: "GM", label: "GM" },
  { value: "LB", label: "LB" },
  { value: "OZ", label: "OZ" },
  { value: "L", label: "L" },
  { value: "ML", label: "ML" },
  { value: "GAL", label: "GAL" },
  { value: "QT", label: "QT" },
  { value: "PT", label: "PT" },
  { value: "CS", label: "CS" },
  { value: "HD", label: "HD" },
  { value: "SRV", label: "SRV" },
];

interface RecipeIngredient {
  id: number;
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export default function RecipeDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isNew = id === "new";

  const [name, setName] = useState(isNew ? "New Recipe" : "");
  const [category, setCategory] = useState("Mains");
  const [yieldAmount, setYieldAmount] = useState(1);
  const [yieldUnit, setYieldUnit] = useState("SRV");
  const [menuPrice, setMenuPrice] = useState(0);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      const existing = MOCK_RECIPES.find((r) => r.id === id);
      if (existing) {
        setName(existing.name);
        setCategory(existing.category);
        setYieldAmount(existing.yield);
        setYieldUnit(existing.yieldUnit);
        setMenuPrice(existing.price);

        if (id === "RCP-001") {
          setIngredients([
            { id: 1, inventoryItemId: "ITM-003", name: "Burger Patty (Prep)", quantity: 1, unit: "EA", unitCost: 1.85 },
            { id: 2, inventoryItemId: "ITM-005", name: "Ground Beef 80/20", quantity: 0.25, unit: "LB", unitCost: 4.25 },
            { id: 3, inventoryItemId: "ITM-006", name: "Romaine Lettuce", quantity: 0.1, unit: "HD", unitCost: 1.5 },
          ]);
        } else if (id === "RCP-002") {
          setIngredients([
            { id: 1, inventoryItemId: "ITM-006", name: "Romaine Lettuce", quantity: 0.5, unit: "HD", unitCost: 1.5 },
            { id: 2, inventoryItemId: "ITM-002", name: "Eggs, Large", quantity: 2, unit: "EA", unitCost: 0.25 },
          ]);
        }
      }
    }
  }, [id, isNew]);

  const totalCost = useMemo(() => ingredients.reduce((sum, item) => sum + item.quantity * item.unitCost, 0), [ingredients]);
  const costPerPortion = yieldAmount > 0 ? totalCost / yieldAmount : 0;
  const foodCostPercent = menuPrice > 0 ? (costPerPortion / menuPrice) * 100 : 0;

  const handleAddIngredient = () => {
    const newIng: RecipeIngredient = {
      id: Date.now(),
      inventoryItemId: "",
      name: "",
      quantity: 1,
      unit: "EA",
      unitCost: 0,
    };
    setIngredients([...ingredients, newIng]);
  };

  const handleUpdateIngredient = (ingId: number, field: keyof RecipeIngredient, value: string | number) => {
    setIngredients(ingredients.map((ing) => (ing.id !== ingId ? ing : { ...ing, [field]: value })));
  };

  const handleSelectInventoryItem = (ingId: number, itemId: string) => {
    const item = MOCK_INVENTORY.find((i) => i.id === itemId);
    if (!item) return;

    setIngredients(
      ingredients.map((ing) =>
        ing.id === ingId
          ? {
              ...ing,
              inventoryItemId: item.id,
              name: item.name,
              unitCost: item.cost,
              unit: ing.unit && ing.unit !== "-" ? ing.unit : item.unit,
            }
          : ing
      )
    );
  };

  const handleRemoveIngredient = (ingId: number) => {
    setIngredients(ingredients.filter((ing) => ing.id !== ingId));
  };

  const handleSave = () => {
    toast({
      title: "Recipe Saved",
      description: `${name} has been saved successfully.`,
    });
    setLocation("/recipes");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/recipes" data-testid="link-recipes-back">
            <Button data-testid="button-recipes-back" variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            {isNew ? (
              <Input
                data-testid="input-recipe-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold tracking-tight h-auto px-0 border-0 focus-visible:ring-0 bg-transparent w-[300px]"
                placeholder="Recipe Name"
              />
            ) : (
              <h1 className="text-2xl font-bold tracking-tight" data-testid="text-recipe-title">
                {name}
              </h1>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs" data-testid="text-recipe-id">
                {isNew ? "DRAFT" : id}
              </span>
              <span>•</span>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-recipe-category" className="h-6 w-[120px] text-xs border-0 bg-transparent p-0 hover:bg-muted/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mains">Mains</SelectItem>
                  <SelectItem value="Appetizers">Appetizers</SelectItem>
                  <SelectItem value="Salads">Salads</SelectItem>
                  <SelectItem value="Desserts">Desserts</SelectItem>
                  <SelectItem value="Sauces">Sauces</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button data-testid="button-recipe-save-draft" variant="outline" className="gap-2" onClick={handleSave}>
            <Save className="size-4" />
            Save Draft
          </Button>
          <Button data-testid="button-recipe-publish" className="gap-2" onClick={handleSave}>
            Publish Recipe
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          <Card className="flex-1 flex flex-col min-h-0 border-border shadow-sm">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <ChefHat className="size-4 text-primary" />
                Ingredients
              </h3>
              <Button data-testid="button-ingredient-add" size="sm" variant="secondary" className="gap-2 shadow-sm bg-background hover:bg-accent" onClick={handleAddIngredient}>
                <Plus className="size-4" />
                Add Ingredient
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/10">
                    <TableHead className="w-[40%] pl-4">Ingredient (linked item)</TableHead>
                    <TableHead className="w-[15%] text-right">Qty</TableHead>
                    <TableHead className="w-[12%]">Unit</TableHead>
                    <TableHead className="w-[15%] text-right">Unit Cost</TableHead>
                    <TableHead className="w-[15%] text-right">Total</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground" data-testid="text-ingredients-empty">
                        No ingredients added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    ingredients.map((ing, idx) => (
                      <TableRow key={ing.id} className="group" data-testid={`row-ingredient-${idx}`}>
                        <TableCell className="pl-4">
                          <div className="space-y-1">
                            <Select value={ing.inventoryItemId} onValueChange={(val) => handleSelectInventoryItem(ing.id, val)}>
                              <SelectTrigger data-testid={`select-ingredient-item-${idx}`} className="h-8 border-transparent focus:border-input hover:bg-muted/50">
                                <SelectValue placeholder="Select inventory item" />
                              </SelectTrigger>
                              <SelectContent>
                                {MOCK_INVENTORY.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.name} <span className="text-muted-foreground text-xs ml-2">({item.id})</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {ing.inventoryItemId ? (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-mono" data-testid={`text-ingredient-itemid-${idx}`}>{ing.inventoryItemId}</span>
                                <span>•</span>
                                <button
                                  type="button"
                                  data-testid={`button-ingredient-open-item-${idx}`}
                                  className="inline-flex items-center gap-1 hover:underline"
                                  onClick={() => setLocation("/inventory/lookup")}
                                >
                                  View item
                                  <ExternalLink className="size-3" />
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <Input
                            data-testid={`input-ingredient-qty-${idx}`}
                            type="number"
                            min="0"
                            step="0.01"
                            className="h-8 w-20 text-right ml-auto border-transparent focus:border-input bg-transparent hover:bg-muted/50"
                            value={ing.quantity}
                            onChange={(e) => handleUpdateIngredient(ing.id, "quantity", Number(e.target.value))}
                          />
                        </TableCell>

                        <TableCell>
                          <Select value={ing.unit} onValueChange={(v) => handleUpdateIngredient(ing.id, "unit", v)}>
                            <SelectTrigger data-testid={`select-ingredient-unit-${idx}`} className="h-8 w-[88px] border-transparent focus:border-input bg-transparent hover:bg-muted/50">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {COMMON_UNITS.map((u) => (
                                <SelectItem key={u.value} value={u.value}>
                                  {u.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell className="text-right text-sm" data-testid={`text-ingredient-unitcost-${idx}`}>
                          ${ing.unitCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium" data-testid={`text-ingredient-total-${idx}`}>
                          ${(ing.quantity * ing.unitCost).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            data-testid={`button-ingredient-remove-${idx}`}
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveIngredient(ing.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="p-3 bg-muted/20 border-t border-border flex justify-end gap-6 text-sm">
              <div className="flex gap-2">
                <span className="text-muted-foreground">Total Ingredients:</span>
                <span className="font-medium" data-testid="text-ingredients-count">{ingredients.length}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground">Raw Cost:</span>
                <span className="font-mono font-medium" data-testid="text-ingredients-rawcost">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <Card className="h-1/3 min-h-[200px] border-border shadow-sm flex flex-col">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Preparation Instructions</h3>
            </div>
            <CardContent className="p-0 flex-1">
              <textarea
                data-testid="textarea-recipe-instructions"
                className="w-full h-full resize-none bg-transparent outline-none text-sm leading-relaxed p-4"
                placeholder="Enter step-by-step preparation steps here..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 overflow-y-auto pr-1">
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <Info className="size-4" />
                Costing Analysis
              </h3>
            </div>
            <CardContent className="p-5 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase text-muted-foreground">Yield Qty</label>
                  <Input
                    data-testid="input-recipe-yield-qty"
                    type="number"
                    min="1"
                    className="font-mono bg-muted/30"
                    value={yieldAmount}
                    onChange={(e) => setYieldAmount(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase text-muted-foreground">Unit</label>
                  <Input
                    data-testid="input-recipe-yield-unit"
                    className="font-medium bg-muted/30"
                    value={yieldUnit}
                    onChange={(e) => setYieldUnit(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase text-muted-foreground">Target Menu Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    data-testid="input-recipe-menu-price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-7 font-mono text-lg bg-background"
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-3 bg-muted/30 p-3 rounded-md border border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Batch Cost</span>
                  <span className="font-mono" data-testid="text-recipe-total-cost">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-border/50">
                  <span>Cost per {yieldUnit || "Unit"}</span>
                  <span className="font-mono" data-testid="text-recipe-cost-per-portion">${costPerPortion.toFixed(2)}</span>
                </div>
              </div>

              <div
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  foodCostPercent > 0 && foodCostPercent <= 28
                    ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900"
                    : foodCostPercent > 28 && foodCostPercent <= 35
                      ? "bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900"
                      : foodCostPercent > 35
                        ? "bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900"
                        : "bg-muted border-border"
                )}
              >
                <div className="flex justify-between items-end mb-1">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      foodCostPercent <= 28 ? "text-emerald-800" : foodCostPercent <= 35 ? "text-amber-800" : "text-red-800"
                    )}
                  >
                    FOOD COST %
                  </span>
                  <span
                    className={cn(
                      "text-xl font-bold",
                      foodCostPercent <= 28 ? "text-emerald-700" : foodCostPercent <= 35 ? "text-amber-700" : "text-red-700"
                    )}
                    data-testid="text-recipe-foodcost-percent"
                  >
                    {foodCostPercent > 0 ? `${foodCostPercent.toFixed(1)}%` : "-"}
                  </span>
                </div>
                <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      foodCostPercent <= 28 ? "bg-emerald-500" : foodCostPercent <= 35 ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${Math.min(foodCostPercent, 100)}%` }}
                  />
                </div>
                <p
                  className={cn(
                    "text-xs mt-2 font-medium",
                    foodCostPercent <= 28 ? "text-emerald-600" : foodCostPercent <= 35 ? "text-amber-600" : "text-red-600"
                  )}
                >
                  {foodCostPercent === 0
                    ? "Set a menu price to calculate."
                    : foodCostPercent <= 28
                      ? "Excellent! Within profit margin."
                      : foodCostPercent <= 35
                        ? "Warning: Approaching limit."
                        : "High Cost! Review pricing."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-sm">Allergens & Tags</h3>
            </div>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {["Gluten", "Dairy", "Nuts", "Shellfish"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full border border-border bg-background text-xs font-medium cursor-pointer hover:bg-muted transition-colors"
                    data-testid={`chip-recipe-tag-${tag.toLowerCase()}`}
                  >
                    {tag}
                  </span>
                ))}
                <Button data-testid="button-recipe-tag-add" variant="outline" size="sm" className="h-7 text-xs border-dashed rounded-full px-3">
                  + Add Tag
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
