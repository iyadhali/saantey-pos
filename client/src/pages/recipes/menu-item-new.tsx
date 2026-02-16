import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_INVENTORY, MOCK_VENDORS } from "@/lib/mockData";
import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, Check, Plus, Receipt, Save, Search, Trash2 } from "lucide-react";
import { useMenuStore } from "@/lib/menuStore";
import ingredientThumb from "@/assets/images/ingredient-thumb.jpg";

const UNIT_OPTIONS = ["EA", "KG", "GM", "LB", "OZ", "L", "ML", "GAL", "QT", "PT", "CS", "HD"];

type PickableInventory = {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: "Raw" | "Prep" | "Menu";
  unit: string;
  cost: number;
};

function getPreferredVendorIdForSku(sku: string): string {
  const v = MOCK_VENDORS.find((ven) => ven.products.some((p) => p.sku === sku));
  return v?.id ?? "-";
}

export default function MenuItemNew() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const draftId = id || "";

  const draft = useMenuStore((s) => s.menuDrafts[draftId]);
  const updateMenuDraft = useMenuStore((s) => s.updateMenuDraft);
  const addLine = useMenuStore((s) => s.addLine);
  const updateLine = useMenuStore((s) => s.updateLine);
  const removeLine = useMenuStore((s) => s.removeLine);

  // If this is an existing item (not starting with MENU-), we should hydrate the store if empty
  // For now in this mockup, we'll just check if draft exists, if not and it looks like a real ID, we could mock load it.
  // But strictly following current patterns, we'll assume the user came from 'New' or 'Edit' click which sets up store or finds it.
  // We'll add a useEffect to simulate "loading" an existing item if it's not found in store but is in MOCK_INVENTORY

  useEffect(() => {
     if (!draft && id && !id.startsWith("MENU-DRAFT")) {
        // Try to find in mock inventory or our hardcoded mock items
        const existing = MOCK_INVENTORY.find(i => i.id === id);
        
        let mockData = null;

        if (existing) {
          mockData = {
            id: existing.id,
            name: existing.name,
            category: existing.category,
            sellingPrice: 18.50,
            lines: [{ id: "line-1", inventoryItemId: "ITM-003", name: "Burger Patty (Prep)", vendorId: "-", unitCost: 1.85, qty: 1, unit: "EA", imageSrc: ingredientThumb }]
          };
        } else if (id === "MENU-001") {
           mockData = {
             id: "MENU-001",
             name: "Classic Cheeseburger",
             category: "Mains",
             sellingPrice: 14.00,
             lines: [
               { id: "l1", inventoryItemId: "ITM-003", name: "Burger Patty (Prep)", vendorId: "-", unitCost: 1.85, qty: 1, unit: "EA", imageSrc: ingredientThumb },
               { id: "l2", inventoryItemId: "ITM-005", name: "Ground Beef 80/20", vendorId: "V-001", unitCost: 4.25, qty: 0.25, unit: "LB", imageSrc: ingredientThumb }
             ]
           };
        } else if (id === "MENU-002") {
           mockData = {
             id: "MENU-002",
             name: "Caesar Salad",
             category: "Salads",
             sellingPrice: 12.00,
             lines: [
               { id: "l1", inventoryItemId: "ITM-006", name: "Romaine Lettuce", vendorId: "V-002", unitCost: 1.50, qty: 0.5, unit: "HD", imageSrc: ingredientThumb }
             ]
           };
        } else if (id === "MENU-003") {
           mockData = {
             id: "MENU-003",
             name: "Chocolate Lava Cake",
             category: "Desserts",
             sellingPrice: 9.00,
             lines: []
           };
        }

        if (mockData) {
           useMenuStore.setState(s => ({
             menuDrafts: {
               ...s.menuDrafts,
               [id]: {
                 id: mockData.id,
                 name: mockData.name,
                 category: mockData.category,
                 active: true,
                 sellingPrice: mockData.sellingPrice,
                 lines: mockData.lines
               }
             }
           }));
        }
     }
  }, [id, draft]);


  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQ, setPickerQ] = useState("");

  const pickables: PickableInventory[] = useMemo(() => {
    const query = pickerQ.trim().toLowerCase();
    return MOCK_INVENTORY
      .filter((i) => i.type === "Raw" || i.type === "Prep")
      .filter((i) => {
        if (!query) return true;
        const hay = `${i.name} ${i.id} ${i.sku} ${i.category} ${i.type}`.toLowerCase();
        return hay.includes(query);
      });
  }, [pickerQ]);

  const totalCost = useMemo(() => {
    if (!draft) return 0;
    return Number(
      draft.lines.reduce((sum, l) => sum + (Number.isFinite(l.qty) ? l.qty : 0) * (Number.isFinite(l.unitCost) ? l.unitCost : 0), 0).toFixed(2)
    );
  }, [draft]);

  const sellingPrice = draft?.sellingPrice || 0;
  const foodCostPercent = sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0;
  const isNew = draftId.startsWith("MENU-");

  if (!draft) {
    return (
      <div className="space-y-6">
        <PageHeader title="Menu Item" subtitle="Loading..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/recipes/menu" data-testid="link-menuitemnew-back">
            <Button data-testid="button-menuitemnew-back" variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <div className="text-xs text-muted-foreground">Menu Items</div>
            <h1 className="text-xl font-semibold" data-testid="text-menuitemnew-title">
              {isNew ? "Build Menu Item" : "Edit Menu Item"}
            </h1>
            {!isNew && (
              <div className="text-xs text-muted-foreground font-mono mt-1" data-testid="text-menuitemnew-id">
                {draft.id}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            data-testid="button-menuitemnew-save"
            className="gap-2"
            onClick={() => {
              setLocation("/recipes/menu");
            }}
          >
            <Save className="size-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Receipt className="size-4" />
              Menu item details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  data-testid="input-menuitemnew-name"
                  value={draft.name}
                  onChange={(e) => updateMenuDraft(draftId, { name: e.target.value })}
                  placeholder="e.g., Cheeseburger"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={draft.category} onValueChange={(v) => updateMenuDraft(draftId, { category: v })}>
                  <SelectTrigger data-testid="select-menuitemnew-category">
                    <SelectValue placeholder="Select category" />
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

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border">
                <div className="text-sm font-medium">Items used in this menu item</div>

                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button data-testid="button-menuitemnew-add-line" size="sm" variant="outline" className="gap-2">
                      <Plus className="size-4" />
                      Add item
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[420px]" align="end">
                    <Command>
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                        <Search className="size-4 text-muted-foreground" />
                        <CommandInput
                          data-testid="input-menuitemnew-item-search"
                          value={pickerQ}
                          onValueChange={setPickerQ}
                          placeholder="Search inventory (raw + prep)..."
                        />
                      </div>
                      <CommandList className="max-h-[320px]">
                        <CommandEmpty>No matches.</CommandEmpty>
                        <CommandGroup heading="Inventory (Raw + Prep)">
                          {pickables.slice(0, 30).map((inv) => (
                            <CommandItem
                              key={inv.id}
                              value={`${inv.name} ${inv.id}`}
                              data-testid={`option-menuitemnew-inv-${inv.id}`}
                              onSelect={() => {
                                const vendorId = getPreferredVendorIdForSku(inv.sku);
                                addLine(draftId, {
                                  id: `line-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                                  inventoryItemId: inv.id,
                                  name: inv.name,
                                  vendorId,
                                  unitCost: inv.cost,
                                  qty: 1,
                                  unit: inv.unit,
                                  imageSrc: ingredientThumb,
                                });
                                setPickerOpen(false);
                                setPickerQ("");
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{inv.name}</span>
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {inv.id} · {inv.type} · {inv.unit} · ${inv.cost.toFixed(2)}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">+ add</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-[120px] text-right">Qty</TableHead>
                    <TableHead className="w-[110px]">Unit</TableHead>
                    <TableHead className="w-[140px] text-right">Unit Cost</TableHead>
                    <TableHead className="w-[140px] text-right">Line Total</TableHead>
                    <TableHead className="w-[64px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draft.lines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-28 text-center text-muted-foreground" data-testid="text-menuitemnew-lines-empty">
                        Add items one-by-one to calculate the menu item cost.
                      </TableCell>
                    </TableRow>
                  ) : (
                    draft.lines.map((l, idx) => (
                      <TableRow key={l.id} data-testid={`row-menuitemnew-line-${idx}`}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="size-9 rounded-md overflow-hidden border border-border bg-muted/30 shrink-0 mt-0.5">
                              <img
                                data-testid={`img-menuitemnew-line-${idx}`}
                                src={l.imageSrc || ingredientThumb}
                                alt={l.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium" data-testid={`text-menuitemnew-line-name-${idx}`}>{l.name}</div>
                              <div className="text-xs text-muted-foreground font-mono" data-testid={`text-menuitemnew-line-itemid-${idx}`}>
                                Item: {l.inventoryItemId}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono" data-testid={`text-menuitemnew-line-vendorid-${idx}`}>
                                Vendor: {l.vendorId}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            data-testid={`input-menuitemnew-line-qty-${idx}`}
                            type="number"
                            min="0"
                            step="0.01"
                            className="text-right"
                            value={Number.isFinite(l.qty) ? l.qty : 0}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              updateLine(draftId, l.id, { qty: v < 0 ? 0 : v });
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Select value={l.unit} onValueChange={(v) => updateLine(draftId, l.id, { unit: v })}>
                            <SelectTrigger data-testid={`select-menuitemnew-line-unit-${idx}`} className="h-10">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {UNIT_OPTIONS.map((u) => (
                                <SelectItem key={u} value={u}>
                                  {u}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right font-mono" data-testid={`text-menuitemnew-line-unitcost-${idx}`}>
                          ${l.unitCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium" data-testid={`text-menuitemnew-line-total-${idx}`}>
                          ${(l.qty * l.unitCost).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            data-testid={`button-menuitemnew-line-remove-${idx}`}
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeLine(draftId, l.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="px-4 py-3 border-t border-border bg-muted/10">
                <div className="flex items-center justify-end gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Items:</span>
                    <span className="font-medium" data-testid="text-menuitemnew-lines-count">{draft.lines.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Total Material Cost:</span>
                    <span className="font-mono font-semibold" data-testid="text-menuitemnew-total-cost">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">Costing & Price</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="p-4 rounded-lg border border-border bg-muted/10 space-y-4">
              <div>
                 <div className="text-xs uppercase text-muted-foreground">Material Cost</div>
                 <div className="text-2xl font-semibold mt-1 font-mono" data-testid="text-menuitemnew-cost-large">
                   ${totalCost.toFixed(2)}
                 </div>
              </div>

              <div>
                <label className="text-xs uppercase text-muted-foreground font-medium block mb-1.5">Selling Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    data-testid="input-menuitemnew-selling-price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-7 bg-background font-mono text-lg"
                    value={sellingPrice}
                    onChange={(e) => updateMenuDraft(draftId, { sellingPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Food Cost %</span>
                  <span className={`font-mono font-bold ${
                    foodCostPercent > 35 ? "text-red-600" : 
                    foodCostPercent > 28 ? "text-amber-600" : 
                    "text-emerald-600"
                  }`}>
                    {sellingPrice > 0 ? `${foodCostPercent.toFixed(1)}%` : "-"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Cost is {sellingPrice > 0 ? foodCostPercent.toFixed(1) : "0"}% of selling price.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium"
                  data-testid="status-menuitemnew-active"
                >
                  <Check className="size-3.5" />
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
