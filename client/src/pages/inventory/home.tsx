import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList, Trash2, Search, FileSpreadsheet, Package } from "lucide-react";
import { Link } from "wouter";
import { SimpleTable } from "@/components/common/SimpleTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MOCK_INVENTORY } from "@/lib/mockData";

export default function InventoryHome() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Inventory Management" 
        subtitle="Track stock, manage counts, and control waste"
      />

      {/* Submodules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/inventory/lookup">
          <Card className="hover:border-primary/50 cursor-pointer transition-colors h-full">
            <CardHeader>
              <Search className="size-8 text-primary mb-2" />
              <CardTitle className="text-lg">Item Lookup</CardTitle>
              <CardDescription>Search and view details for all inventory items</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/inventory/posting">
          <Card className="hover:border-primary/50 cursor-pointer transition-colors h-full">
            <CardHeader>
              <ClipboardList className="size-8 text-blue-500 mb-2" />
              <CardTitle className="text-lg">Inventory Posting</CardTitle>
              <CardDescription>Perform daily, weekly, or monthly stock counts</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/inventory/waste">
          <Card className="hover:border-primary/50 cursor-pointer transition-colors h-full">
            <CardHeader>
              <Trash2 className="size-8 text-red-500 mb-2" />
              <CardTitle className="text-lg">Wastage</CardTitle>
              <CardDescription>Record spoilage, spills, and other loss</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/inventory/worksheet">
          <Card className="hover:border-primary/50 cursor-pointer transition-colors h-full">
            <CardHeader>
              <FileSpreadsheet className="size-8 text-green-500 mb-2" />
              <CardTitle className="text-lg">Worksheet</CardTitle>
              <CardDescription>View and print blank count sheets</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Low Stock Alerts</CardTitle>
              <Link href="/inventory/lookup">
                <Button variant="ghost" size="sm" className="text-primary">View All Items</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <SimpleTable 
                data={MOCK_INVENTORY.filter(i => i.onHand <= i.par)}
                columns={[
                  { header: "Item Name", accessorKey: "name", className: "font-medium" },
                  { header: "Category", accessorKey: "category", className: "text-muted-foreground text-sm" },
                  { header: "On Hand", accessorKey: "onHand", className: "text-right font-mono text-amber-600 font-bold" },
                  { header: "Unit", accessorKey: "unit", className: "text-sm text-muted-foreground" },
                  { header: "Par", accessorKey: "par", className: "text-right text-muted-foreground font-mono" },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Counts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">Weekly Count</span>
                    <span className="text-xs text-muted-foreground">May 2{i}, 2024</span>
                  </div>
                  <StatusBadge status="Completed" type="success" showIcon={false} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
