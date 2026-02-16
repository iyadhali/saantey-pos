import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, FileText, Settings, ArrowRight, AlertCircle, Monitor, ChefHat } from "lucide-react";
import { Link } from "wouter";

const MODULES = [
  {
    title: "Point of Sale",
    icon: Monitor,
    href: "/pos",
    description: "Floor plan, orders, and payments",
    counters: [
      { label: "Active Tables", value: "8", type: "neutral" },
      { label: "Open Checks", value: "12", type: "warning" }
    ]
  },
  {
    title: "Purchasing",
    icon: ShoppingCart,
    href: "/purchasing",
    description: "Manage orders, invoices, and vendors",
    counters: [
      { label: "Unfinalized Invoices", value: "3", type: "warning" },
      { label: "Open Orders", value: "5", type: "neutral" }
    ]
  },
  {
    title: "Inventory",
    icon: Package,
    href: "/inventory",
    description: "Counts, waste logs, and transfers",
    counters: [
      { label: "Counts Due", value: "1", type: "warning" },
      { label: "Low Stock", value: "12", type: "error" }
    ]
  },
  {
    title: "Recipes",
    icon: ChefHat,
    href: "/recipes",
    description: "Recipe costing and menu management",
    counters: [
      { label: "High Variance", value: "2", type: "error" }
    ]
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/reports",
    description: "Cost of goods, variance, and usage",
    counters: [
      { label: "Pending Review", value: "0", type: "neutral" }
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    description: "System configuration and users",
    counters: []
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome back, John. Here is what needs your attention today."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((module) => (
          <Link key={module.title} href={module.href}>
            <a className="block group">
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer border-border/60 bg-card/50">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-secondary/80 text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <module.icon className="size-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-3">
                    {module.counters.map((counter, i) => (
                      <div 
                        key={i} 
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border
                          ${counter.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            counter.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 
                            'bg-secondary/50 text-secondary-foreground border-transparent'}
                        `}
                      >
                        {counter.type !== 'neutral' && <AlertCircle className="size-3.5" />}
                        <span>{counter.value} {counter.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
