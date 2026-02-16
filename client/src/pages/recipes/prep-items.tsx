import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_INVENTORY } from "@/lib/mockData";
import { ChefHat, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

export default function PrepItems() {
  const [, setLocation] = useLocation();
  const [q, setQ] = useState("");

  const prep = useMemo(() => {
    const query = q.trim().toLowerCase();
    return MOCK_INVENTORY
      .filter((i) => i.type === "Prep")
      .filter((i) => {
        if (!query) return true;
        const hay = `${i.name} ${i.id} ${i.sku} ${i.category}`.toLowerCase();
        return hay.includes(query);
      });
  }, [q]);

  return (
    <div className="space-y-6">
      <PageHeader title="Prep Items" subtitle="Prep recipes used as components in menu items" />

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative md:max-w-sm w-full">
          <Search className="size-4 text-muted-foreground absolute left-3 top-3" />
          <Input
            data-testid="input-prepitems-search"
            className="pl-9"
            placeholder="Search prep items by name, SKU, category..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Button data-testid="button-prepitems-new" className="gap-2">
          <ChefHat className="size-4" />
          New Prep Recipe
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold">Prep Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">On Hand</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prep.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-28 text-center text-muted-foreground" data-testid="text-prepitems-empty">
                    No prep items found.
                  </TableCell>
                </TableRow>
              ) : (
                prep.map((i) => (
                  <TableRow
                    key={i.id}
                    data-testid={`row-prepitem-${i.id}`}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setLocation(`/recipes/detail/${i.id}`)}
                  >
                    <TableCell>
                      <div className="font-medium" data-testid={`text-prepitem-name-${i.id}`}>{i.name}</div>
                      <div className="text-xs text-muted-foreground font-mono" data-testid={`text-prepitem-id-${i.id}`}>{i.id}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-prepitem-category-${i.id}`}>{i.category}</TableCell>
                    <TableCell className="text-right font-mono" data-testid={`text-prepitem-onhand-${i.id}`}>{i.onHand}</TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-prepitem-unit-${i.id}`}>{i.unit}</TableCell>
                    <TableCell className="text-right font-mono" data-testid={`text-prepitem-cost-${i.id}`}>${i.cost.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
