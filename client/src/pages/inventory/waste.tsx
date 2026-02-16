import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Calculator } from "lucide-react";
import { useLocation } from "wouter";
import { useMemo, useState } from "react";
import { MOCK_INVENTORY } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type WasteType = "Raw" | "Prep" | "Menu";

type WasteReason = "Expired" | "Spilled/Damaged" | "Preparation Mistake" | "Overproduction" | "Returned";

type WasteEntryRow = {
  id: string;
  date: string;
  time: string;
  type: WasteType;
  itemId: string;
  itemName: string;
  unit: string;
  quantity: number;
  reason: WasteReason;
  cost: number;
  onHandAtTime: number;
};

const REASONS: WasteReason[] = [
  "Expired",
  "Spilled/Damaged",
  "Preparation Mistake",
  "Overproduction",
  "Returned",
];

export default function WasteEntry() {
  const [, setLocation] = useLocation();

  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [type, setType] = useState<WasteType>("Raw");
  const [itemId, setItemId] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState<WasteReason>("Expired");

  const [rows, setRows] = useState<WasteEntryRow[]>([
    {
      id: "WST-0001",
      date: "2024-05-21",
      time: "10:15",
      type: "Raw",
      itemId: "ITM-001",
      itemName: "Whole Milk",
      unit: "GAL",
      quantity: 1,
      reason: "Expired",
      cost: 4.5,
      onHandAtTime: 12,
    },
    {
      id: "WST-0002",
      date: "2024-05-21",
      time: "17:40",
      type: "Prep",
      itemId: "ITM-003",
      itemName: "Burger Patty (Prep)",
      unit: "EA",
      quantity: 3,
      reason: "Overproduction",
      cost: 5.55,
      onHandAtTime: 45,
    },
  ]);

  const filteredItems = useMemo(() => {
    return MOCK_INVENTORY.filter((i) => i.type === type);
  }, [type]);

  const selectedItem = useMemo(() => {
    return MOCK_INVENTORY.find((i) => i.id === itemId) || null;
  }, [itemId]);

  const unitOptions = useMemo(() => {
    if (!selectedItem) return [] as string[];
    const base = [selectedItem.unit];
    // keep it simple for mockup; allow same unit only
    return Array.from(new Set(base));
  }, [selectedItem]);

  const costPreview = useMemo(() => {
    if (!selectedItem || !unit || quantity <= 0) {
      return {
        canShow: false,
        extendedCost: 0,
      };
    }
    return {
      canShow: true,
      extendedCost: Number((quantity * selectedItem.cost).toFixed(2)),
    };
  }, [selectedItem, unit, quantity]);

  const resetForm = () => {
    setType("Raw");
    setItemId("");
    setUnit("");
    setQuantity(0);
    setReason("Expired");
    setTime(new Date().toTimeString().slice(0, 5));
  };

  const canAdd = !!selectedItem && !!unit && quantity > 0 && !!reason && !!date && !!time;

  const handleAdd = () => {
    if (!selectedItem) return;
    if (!canAdd) return;

    const newRow: WasteEntryRow = {
      id: `WST-${String(rows.length + 1).padStart(4, "0")}`,
      date,
      time,
      type,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      unit,
      quantity,
      reason,
      cost: Number((quantity * selectedItem.cost).toFixed(2)),
      onHandAtTime: selectedItem.onHand,
    };

    setRows([newRow, ...rows]);
    resetForm();
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <Button
        data-testid="button-back-inventory"
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground -ml-2"
        onClick={() => setLocation("/inventory")}
      >
        <ArrowLeft className="size-4" />
        Back to Inventory
      </Button>

      <PageHeader title="Wastage" subtitle="Record waste and review cost impact" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">New Waste Entry</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  data-testid="input-waste-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input
                  data-testid="input-waste-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={type} onValueChange={(v) => {
                  setType(v as WasteType);
                  setItemId("");
                  setUnit("");
                }}>
                  <SelectTrigger data-testid="select-waste-type">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Raw">Raw</SelectItem>
                    <SelectItem value="Prep">Prep</SelectItem>
                    <SelectItem value="Menu">Menu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Item</label>
                <Select value={itemId} onValueChange={(v) => {
                  setItemId(v);
                  const item = MOCK_INVENTORY.find((i) => i.id === v);
                  if (item) setUnit(item.unit);
                }}>
                  <SelectTrigger data-testid="select-waste-item">
                    <SelectValue placeholder="Select item..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredItems.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.name} <span className="text-muted-foreground text-xs ml-2">({i.id})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedItem && (
                  <div className="text-xs text-muted-foreground" data-testid="text-waste-item-selected">
                    Selected: <span className="font-medium text-foreground">{selectedItem.name}</span> <span className="font-mono">({selectedItem.id})</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger data-testid="select-waste-unit">
                    <SelectValue placeholder="Select unit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.length === 0 ? (
                      <SelectItem value="-" disabled>
                        Select an item first
                      </SelectItem>
                    ) : (
                      unitOptions.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  data-testid="input-waste-quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={Number.isFinite(quantity) ? quantity : 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setQuantity(val < 0 ? 0 : val);
                  }}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <Select value={reason} onValueChange={(v) => setReason(v as WasteReason)}>
                  <SelectTrigger data-testid="select-waste-reason">
                    <SelectValue placeholder="Select reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    {REASONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cost Preview */}
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium" data-testid="text-waste-cost-preview-title">
                      <Calculator className="size-4" />
                      Cost Preview
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Preview uses the current item unit cost and current on-hand.
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Estimated Waste Cost</div>
                    <div className="text-2xl font-bold font-mono" data-testid="text-waste-cost-total">
                      ${costPreview.canShow ? costPreview.extendedCost.toFixed(2) : "0.00"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  <div className="p-3 rounded-md bg-muted/30 border border-border/60">
                    <div className="text-xs text-muted-foreground">Item</div>
                    <div className="font-medium" data-testid="text-waste-cost-item">
                      {selectedItem ? selectedItem.name : "-"}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono" data-testid="text-waste-cost-itemid">
                      {selectedItem ? selectedItem.id : "-"}
                    </div>
                  </div>
                  <div className="p-3 rounded-md bg-muted/30 border border-border/60">
                    <div className="text-xs text-muted-foreground">Unit Cost</div>
                    <div className="font-mono font-medium" data-testid="text-waste-cost-unitcost">
                      {selectedItem ? `$${selectedItem.cost.toFixed(2)} / ${selectedItem.unit}` : "-"}
                    </div>
                  </div>
                  <div className="p-3 rounded-md bg-muted/30 border border-border/60">
                    <div className="text-xs text-muted-foreground">Current On Hand</div>
                    <div className="font-mono font-medium" data-testid="text-waste-cost-onhand">
                      {selectedItem ? `${selectedItem.onHand} ${selectedItem.unit}` : "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <Button
                data-testid="button-add-waste"
                size="lg"
                className="gap-2"
                disabled={!canAdd}
                onClick={handleAdd}
              >
                <Plus className="size-4" />
                Add Waste Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entries</span>
              <span className="font-mono" data-testid="text-waste-summary-count">{rows.filter(r => r.date === date).length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Cost</span>
              <span className="font-mono font-medium" data-testid="text-waste-summary-cost">
                ${rows.filter(r => r.date === date).reduce((sum, r) => sum + r.cost, 0).toFixed(2)}
              </span>
            </div>
            <div className="pt-3 border-t border-border text-xs text-muted-foreground">
              Tip: Log waste during prep or after service to keep food cost accurate.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Waste Entries Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold">Waste Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">On Hand</TableHead>
                <TableHead className="w-[64px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-28 text-center text-muted-foreground" data-testid="text-waste-empty">
                    No waste entries yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell className="font-mono">{r.time}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          r.type === "Raw"
                            ? "bg-blue-100 text-blue-800"
                            : r.type === "Prep"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                        data-testid={`badge-waste-type-${r.id}`}
                      >
                        {r.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium" data-testid={`text-waste-item-${r.id}`}>{r.itemName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{r.itemId}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{r.quantity}</TableCell>
                    <TableCell className="text-muted-foreground">{r.unit}</TableCell>
                    <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                    <TableCell className="text-right font-mono font-medium">${r.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{r.onHandAtTime}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        data-testid={`button-delete-waste-${r.id}`}
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteRow(r.id)}
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
