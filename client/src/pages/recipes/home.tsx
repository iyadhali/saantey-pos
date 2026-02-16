import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, UtensilsCrossed, LayoutDashboard } from "lucide-react";
import { Route, Switch, useLocation } from "wouter";
import RecipesOverview from "@/pages/recipes/overview";
import MenuItems from "@/pages/recipes/menu-items";
import PrepItems from "@/pages/recipes/prep-items";

function RecipesSubnav() {
  const [location, setLocation] = useLocation();

  const value = location.startsWith("/recipes/menu")
    ? "menu"
    : location.startsWith("/recipes/prep")
      ? "prep"
      : "overview";

  return (
    <div className="flex items-center justify-between">
      <PageHeader title="Recipe Management" subtitle="Menu items, prep items, and costing" />
      <div className="hidden sm:flex">
        <Tabs value={value} className="w-auto">
          <TabsList>
            <TabsTrigger
              value="overview"
              data-testid="tab-recipes-overview"
              className="gap-2"
              onClick={() => setLocation("/recipes/overview")}
            >
              <LayoutDashboard className="size-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              data-testid="tab-recipes-menu"
              className="gap-2"
              onClick={() => setLocation("/recipes/menu")}
            >
              <UtensilsCrossed className="size-4" />
              Menu Items
            </TabsTrigger>
            <TabsTrigger
              value="prep"
              data-testid="tab-recipes-prep"
              className="gap-2"
              onClick={() => setLocation("/recipes/prep")}
            >
              <ChefHat className="size-4" />
              Prep Items
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="sm:hidden flex gap-2">
        <Button
          data-testid="button-recipes-overview-mobile"
          variant={value === "overview" ? "default" : "outline"}
          size="sm"
          onClick={() => setLocation("/recipes/overview")}
        >
          Overview
        </Button>
        <Button
          data-testid="button-recipes-menu-mobile"
          variant={value === "menu" ? "default" : "outline"}
          size="sm"
          onClick={() => setLocation("/recipes/menu")}
        >
          Menu
        </Button>
        <Button
          data-testid="button-recipes-prep-mobile"
          variant={value === "prep" ? "default" : "outline"}
          size="sm"
          onClick={() => setLocation("/recipes/prep")}
        >
          Prep
        </Button>
      </div>
    </div>
  );
}

export default function RecipesHome() {
  return (
    <div className="space-y-6">
      <RecipesSubnav />

      <Switch>
        <Route path="/recipes" component={() => <RedirectToOverview />} />
        <Route path="/recipes/overview" component={RecipesOverview} />
        <Route path="/recipes/menu" component={MenuItems} />
        <Route path="/recipes/prep" component={PrepItems} />
      </Switch>
    </div>
  );
}

function RedirectToOverview() {
  const [, setLocation] = useLocation();
  setLocation("/recipes/overview");
  return null;
}
