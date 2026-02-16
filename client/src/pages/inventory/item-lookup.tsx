import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { SimpleTable } from "@/components/common/SimpleTable";
import { MOCK_INVENTORY } from "@/lib/mockData";
import { useLocation } from "wouter";

export default function ItemLookup() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 text-muted-foreground -ml-2"
        onClick={() => setLocation("/inventory")}
      >
        <ArrowLeft className="size-4" />
        Back to Inventory
      </Button>

      <PageHeader 
        title="Item Lookup" 
        subtitle="Search and view inventory items"
      />

      {/* Search & Filter Bar */}
      <div className="flex gap-4 items-center bg-card p-4 border border-border rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Name, ID, or Category..." 
            className="pl-9 bg-background"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="size-4" />
          Filters
        </Button>
      </div>

      <SimpleTable 
        data={MOCK_INVENTORY}
        columns={[
          { header: "Item ID", accessorKey: "id", className: "font-mono text-sm text-muted-foreground" },
          { header: "Item Name", accessorKey: "name", className: "font-medium" },
          { header: "Category", accessorKey: "category" },
          { header: "Type", accessorKey: "type", cell: (item) => (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              item.type === 'Raw' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {item.type}
            </span>
          )},
          { header: "Unit", accessorKey: "unit", className: "text-muted-foreground text-sm" },
          { header: "Par Level", accessorKey: "par", className: "text-right font-mono" },
          { 
            header: "On Hand", 
            accessorKey: "onHand", 
            className: "text-right font-mono font-medium",
            cell: (item) => {
              const isLow = item.onHand < item.par;
              const isCritical = item.onHand < (item.par * 0.5);
              
              return (
                <div className="flex items-center justify-end gap-2">
                  {isLow && (
                    <span className={`h-2 w-2 rounded-full ${isCritical ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} title={isCritical ? "Critical Low Stock" : "Low Stock"} />
                  )}
                  <span className={isLow ? (isCritical ? "text-red-600 font-bold" : "text-amber-600 font-semibold") : ""}>
                    {item.onHand}
                  </span>
                </div>
              );
            }
          },
        ]}
      />
    </div>
  );
}
