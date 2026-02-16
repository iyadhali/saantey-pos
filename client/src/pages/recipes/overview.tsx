import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_RECIPES, MOCK_INVENTORY } from "@/lib/mockData";
import { ChefHat, UtensilsCrossed, Package } from "lucide-react";

export default function RecipesOverview() {
  const prepItems = MOCK_INVENTORY.filter((i) => i.type === "Prep");
  const rawItems = MOCK_INVENTORY.filter((i) => i.type === "Raw");
  const menuItems = MOCK_INVENTORY.filter((i) => i.type === "Menu");

  return (
    <div className="space-y-6">
      <PageHeader title="Recipes" subtitle="Overview of menu items, prep items, and costing" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <UtensilsCrossed className="size-4" />
              Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-2">
            <div className="text-3xl font-semibold" data-testid="text-recipes-overview-menu-count">
              {menuItems.length}
            </div>
            <div className="text-sm text-muted-foreground">Inventory items marked as Menu.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ChefHat className="size-4" />
              Prep Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-2">
            <div className="text-3xl font-semibold" data-testid="text-recipes-overview-prep-count">
              {prepItems.length}
            </div>
            <div className="text-sm text-muted-foreground">Inventory items marked as Prep.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Package className="size-4" />
              Raw Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-2">
            <div className="text-3xl font-semibold" data-testid="text-recipes-overview-raw-count">
              {rawItems.length}
            </div>
            <div className="text-sm text-muted-foreground">Inventory items marked as Raw.</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold">Recipe Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border bg-muted/10">
              <div className="text-xs uppercase text-muted-foreground">Total Recipes</div>
              <div className="text-2xl font-semibold mt-1" data-testid="text-recipes-overview-recipes-count">
                {MOCK_RECIPES.length}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-muted/10">
              <div className="text-xs uppercase text-muted-foreground">Avg Food Cost %</div>
              <div className="text-2xl font-semibold mt-1" data-testid="text-recipes-overview-avg-foodcost">
                {(() => {
                  const vals = MOCK_RECIPES.map((r) => r.foodCostPercent).filter((v) => v > 0);
                  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
                  return avg ? `${avg.toFixed(1)}%` : "-";
                })()}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-muted/10">
              <div className="text-xs uppercase text-muted-foreground">Highest Cost Item</div>
              <div className="text-sm font-medium mt-2" data-testid="text-recipes-overview-highest-cost">
                {(() => {
                  const sorted = [...MOCK_RECIPES].sort((a, b) => b.cost - a.cost);
                  return sorted[0] ? `${sorted[0].name} ($${sorted[0].cost.toFixed(2)})` : "-";
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
