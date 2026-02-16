import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import NotFound from "@/pages/not-found";

// Components
import Dashboard from "@/pages/dashboard";
import PurchasingHome from "@/pages/purchasing/home";
import OrdersList from "@/pages/purchasing/orders";
import InvoicesList from "@/pages/purchasing/invoices";
import InvoiceDetail from "@/pages/purchasing/invoice-detail";
import VendorsList from "@/pages/purchasing/vendors";
import VendorDetail from "@/pages/purchasing/vendor-detail";
import OrderDetail from "@/pages/purchasing/order-detail";
import Bills from "@/pages/purchasing/bills";
import BillDetail from "@/pages/purchasing/bill-detail";
import InventoryHome from "@/pages/inventory/home";
import InventoryPosting from "@/pages/inventory/posting";
import InventoryPostingNew from "@/pages/inventory/posting-new";
import InventoryPostingDetail from "@/pages/inventory/posting-detail";
import ItemLookup from "@/pages/inventory/item-lookup";
import Worksheet from "@/pages/inventory/worksheet";
import CountEntry from "@/pages/inventory/count-entry";
import WasteEntry from "@/pages/inventory/waste";
import POSHome from "@/pages/pos/home";
import RecipesHome from "@/pages/recipes/home";
import RecipeDetail from "@/pages/recipes/detail";
import MenuItemNew from "@/pages/recipes/menu-item-new";

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Dashboard} />
        
        {/* POS Module */}
        <Route path="/pos" component={POSHome} />
        <Route path="/pos/table/:id" component={() => <div>Table Order Entry (Coming Soon)</div>} />

        {/* Recipes Module */}
        <Route path="/recipes" component={RecipesHome} />
        <Route path="/recipes/overview" component={RecipesHome} />
        <Route path="/recipes/menu" component={RecipesHome} />
        <Route path="/recipes/menu/new/:id" component={MenuItemNew} />
        <Route path="/recipes/prep" component={RecipesHome} />
        <Route path="/recipes/detail/:id" component={RecipeDetail} />
        <Route path="/recipes/new" component={RecipeDetail} />
        
        {/* Purchasing Module */}
        <Route path="/purchasing" component={PurchasingHome} />
        <Route path="/purchasing/orders" component={OrdersList} />
        <Route path="/purchasing/orders/:id" component={OrderDetail} />
        <Route path="/purchasing/invoices" component={InvoicesList} />
        <Route path="/purchasing/invoices/:id" component={InvoiceDetail} />
        <Route path="/purchasing/bills" component={Bills} />
        <Route path="/purchasing/bills/:id" component={BillDetail} />
        <Route path="/purchasing/vendors" component={VendorsList} />
        <Route path="/purchasing/vendors/:id" component={VendorDetail} />
        
        {/* Inventory Module */}
        <Route path="/inventory" component={InventoryHome} />
        <Route path="/inventory/lookup" component={ItemLookup} />
        <Route path="/inventory/posting" component={InventoryPosting} />
        <Route path="/inventory/posting/new" component={InventoryPostingNew} />
        <Route path="/inventory/posting/:id" component={InventoryPostingDetail} />
        <Route path="/inventory/worksheet" component={Worksheet} />
        <Route path="/inventory/waste" component={WasteEntry} />
        
        {/* Fallback */}
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
