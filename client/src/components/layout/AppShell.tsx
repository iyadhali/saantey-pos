import { 
  Users, 
  ShoppingCart, 
  Package, 
  Settings, 
  LayoutDashboard, 
  Search,
  Bell,
  Menu,
  ChefHat,
  Monitor
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  {
    label: "Purchasing",
    icon: ShoppingCart,
    href: "/purchasing",
    children: [
      { label: "Overview", href: "/purchasing" },
      { label: "Purchase Orders", href: "/purchasing/orders" },
      { label: "Invoices", href: "/purchasing/invoices" },
      { label: "Bills", href: "/purchasing/bills" },
      { label: "Vendors", href: "/purchasing/vendors" },
    ],
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/inventory",
    children: [
      { label: "Overview", href: "/inventory" },
      { label: "Item Lookup", href: "/inventory/lookup" },
      { label: "Postings", href: "/inventory/posting" },
      { label: "Wastage", href: "/inventory/waste" },
      { label: "Worksheet", href: "/inventory/worksheet" },
    ],
  },
  {
    label: "Recipes",
    icon: ChefHat,
    href: "/recipes",
    children: [
      { label: "Overview", href: "/recipes/overview" },
      { label: "Menu Items", href: "/recipes/menu" },
      { label: "Prep Items", href: "/recipes/prep" },
    ],
  },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // For POS route, we might want a different shell (fullscreen, no sidebar)
  // But for now we'll keep it consistent or simple
  const isPOS = location.startsWith("/pos");

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Purchasing: location.startsWith("/purchasing"),
    Inventory: location.startsWith("/inventory"),
    Recipes: location.startsWith("/recipes"),
  });

  const NavContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2 font-semibold text-lg text-sidebar-foreground">
          <div className="size-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
            S
          </div>
          Saantey
        </div>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasChildren = Array.isArray((item as any).children) && (item as any).children.length > 0;
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));

          if (!hasChildren) {
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => onNavigate?.()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          }

          const groupKey = item.label;
          const isOpenGroup = !!openGroups[groupKey];

          return (
            <div key={item.href} className="space-y-1">
              <button
                type="button"
                data-testid={`button-nav-group-${groupKey.toLowerCase()}`}
                onClick={() => setOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }))}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4" />
                  {item.label}
                </span>
                <span className={cn(
                  "text-xs text-muted-foreground transition-transform",
                  isOpenGroup && "rotate-180"
                )}>▼</span>
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  isOpenGroup ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    {(item as any).children.map((child: any) => {
                      const childActive = location === child.href || location.startsWith(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          data-testid={`link-nav-${groupKey.toLowerCase()}-${child.label.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => onNavigate?.()}
                          className={cn(
                            "flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors",
                            childActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
          <Avatar className="size-8 rounded">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-medium text-sidebar-foreground">John Doe</span>
            <span className="text-xs text-muted-foreground">Manager</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Hidden on POS for full immersion if needed, but keeping for now */}
      {!isPOS && (
        <aside className="hidden md:block w-64 fixed inset-y-0 z-50">
          <NavContent />
        </aside>
      )}

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          <NavContent onNavigate={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className={cn(
        "flex-1 flex flex-col min-h-screen",
        !isPOS && "md:ml-64"
      )}>
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* Mobile Menu Trigger */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(true)}>
              <Menu className="size-5" />
            </Button>
            
            {/* Context Switcher (Org -> Property -> Outlet) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 font-normal">
                  <div className="flex flex-col items-start text-xs leading-none">
                    <span className="font-semibold">Maldives Resort & Spa</span>
                    <span className="text-muted-foreground">Main Restaurant</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2 opacity-50">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Select Outlet</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Main Restaurant</DropdownMenuItem>
                <DropdownMenuItem>Pool Bar</DropdownMenuItem>
                <DropdownMenuItem>Room Service</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs text-muted-foreground">Switch Property...</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </div>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-destructive rounded-full border-2 border-background" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-x-hidden",
          isPOS ? "p-0" : "p-6"
        )}>
          <div className={cn(
            isPOS ? "h-full" : "max-w-7xl mx-auto space-y-6"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
