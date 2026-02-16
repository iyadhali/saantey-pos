import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_INVENTORY } from "@/lib/mockData";
import { Check, Plus, Search, UtensilsCrossed, X, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import menuThumb from "@/assets/images/menu-item-thumb.jpg";
import { useMenuStore } from "@/lib/menuStore";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

type MenuRow = {
  id: string;
  name: string;
  category: string;
  active: boolean;
  imageSrc: string;
};

export default function MenuItems() {
  const [, setLocation] = useLocation();
  const createMenuDraft = useMenuStore((s) => s.createMenuDraft);
  const { toast } = useToast();

  const [q, setQ] = useState("");
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const menuItems: MenuRow[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    
    // Combine MOCK_INVENTORY items with some hardcoded mock menu items for testing
    const mockMenuItems = [
      { id: "MENU-001", name: "Classic Cheeseburger", category: "Mains", active: true, imageSrc: menuThumb },
      { id: "MENU-002", name: "Caesar Salad", category: "Salads", active: true, imageSrc: menuThumb },
      { id: "MENU-003", name: "Chocolate Lava Cake", category: "Desserts", active: false, imageSrc: menuThumb },
    ];

    const base = [...MOCK_INVENTORY.filter((i) => i.type === "Menu").map(i => ({
        id: i.id,
        name: i.name,
        category: i.category,
        active: true,
        imageSrc: menuThumb,
    })), ...mockMenuItems]
      .filter((i) => !deletedIds.has(i.id));

    return base.filter((i) => {
      if (!query) return true;
      const hay = `${i.name} ${i.id} ${i.category}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, deletedIds]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this menu item?")) {
      setDeletedIds(prev => new Set(prev).add(id));
      toast({
        title: "Menu Item Deleted",
        description: `Menu item ${id} has been removed.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Menu Items"
        subtitle="Menu items can be built using raw ingredients and prep items"
        actions={
          <Button
            data-testid="button-menuitems-add"
            className="gap-2"
            onClick={() => {
              const id = createMenuDraft();
              setLocation(`/recipes/menu/new/${id}`);
            }}
          >
            <Plus className="size-4" />
            New Menu Item
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative md:max-w-sm w-full">
          <Search className="size-4 text-muted-foreground absolute left-3 top-3" />
          <Input
            data-testid="input-menuitems-search"
            className="pl-9"
            placeholder="Search item id, name, category..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UtensilsCrossed className="size-4" />
            Menu Items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Item ID</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Item Category</TableHead>
                <TableHead className="w-[140px] text-center">Status</TableHead>
                <TableHead className="w-[64px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-28 text-center text-muted-foreground" data-testid="text-menuitems-empty">
                    No menu items found.
                  </TableCell>
                </TableRow>
              ) : (
                menuItems.map((i) => (
                  <TableRow
                    key={i.id}
                    data-testid={`row-menuitem-${i.id}`}
                    className="cursor-pointer hover:bg-muted/50 group"
                    onClick={() => setLocation(`/recipes/menu/new/${i.id}`)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground" data-testid={`text-menuitem-id-${i.id}`}>
                      {i.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-md overflow-hidden border border-border bg-muted/30 shrink-0">
                          <img
                            data-testid={`img-menuitem-${i.id}`}
                            src={i.imageSrc}
                            alt={i.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate" data-testid={`text-menuitem-name-${i.id}`}>{i.name}</div>
                          <div className="text-xs text-muted-foreground truncate" data-testid={`text-menuitem-sub-${i.id}`}>Menu item</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-menuitem-category-${i.id}`}>{i.category}</TableCell>
                    <TableCell className="text-center">
                      {i.active ? (
                        <span
                          data-testid={`status-menuitem-active-${i.id}`}
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium"
                        >
                          <Check className="size-3.5" />
                          Active
                        </span>
                      ) : (
                        <span
                          data-testid={`status-menuitem-inactive-${i.id}`}
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium"
                        >
                          <X className="size-3.5" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleDelete(e, i.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
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
