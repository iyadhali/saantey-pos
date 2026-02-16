import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Receipt, Trash2, Download, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useMemo, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MOCK_INVENTORY } from "@/lib/mockData";

type BillCategory = "Petty Cash" | "Local Purchase" | "Urgent Buy" | "Misc";

type BillItem = {
  inventoryItemId: string;
  name: string;
  qty: number;
  unitPrice: number;
};

type BillRow = {
  id: string;
  date: string;
  supplier: string;
  category: BillCategory;
  items: BillItem[];
  gstRate: number;
  subtotal: number;
  gstAmount: number;
  total: number;
  paidBy: string;
  reference: string;
};

const CATEGORY_OPTIONS: BillCategory[] = ["Petty Cash", "Local Purchase", "Urgent Buy", "Misc"];

export const MOCK_BILLS: BillRow[] = [
  {
    id: "BILL-0001",
    date: "2024-05-21",
    supplier: "City Mart",
    category: "Petty Cash",
    items: [
      { inventoryItemId: "ITM-004", name: "House Mayo", qty: 1, unitPrice: 3.0 },
      { inventoryItemId: "ITM-001", name: "Whole Milk", qty: 2, unitPrice: 4.5 },
    ],
    gstRate: 8,
    subtotal: 12.0,
    gstAmount: 0.96,
    total: 12.96,
    paidBy: "Cashier",
    reference: "PC-00091",
  },
  {
    id: "BILL-0002",
    date: "2024-05-22",
    supplier: "Harbor Fish Stall",
    category: "Local Purchase",
    items: [{ inventoryItemId: "ITM-005", name: "Ground Beef 80/20", qty: 4, unitPrice: 23.0 }],
    gstRate: 8,
    subtotal: 92.0,
    gstAmount: 7.36,
    total: 99.36,
    paidBy: "Chef",
    reference: "LP-00114",
  },
];

export default function Bills() {
  const [, setLocation] = useLocation();

  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [supplier, setSupplier] = useState<string>("");
  const [category, setCategory] = useState<BillCategory>("Petty Cash");
  const [gstRate, setGstRate] = useState<number>(8);
  const [paidBy, setPaidBy] = useState<string>("Cashier");
  const [reference, setReference] = useState<string>("");

  const [rows, setRows] = useState<BillRow[]>(MOCK_BILLS);

  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const [items, setItems] = useState<BillItem[]>([]);
  const [itemPickerOpen, setItemPickerOpen] = useState(false);
  const [itemPickerQuery, setItemPickerQuery] = useState("");
  const qtyRef = useRef<HTMLInputElement | null>(null);

  const filteredInventory = useMemo(() => {
    const q = itemPickerQuery.trim().toLowerCase();
    if (!q) return MOCK_INVENTORY;
    return MOCK_INVENTORY.filter((i) => {
      const hay = `${i.name} ${i.id} ${i.sku} ${i.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [itemPickerQuery]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
  }, [items]);

  const gstAmount = useMemo(() => {
    return Number(((subtotal * gstRate) / 100).toFixed(2));
  }, [subtotal, gstRate]);

  const total = useMemo(() => {
    return Number((subtotal + gstAmount).toFixed(2));
  }, [subtotal, gstAmount]);

  const canAddBill = !!date && items.length > 0 && total > 0 && !!paidBy;

  const filteredBills = useMemo(() => {
    const q = search.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom).getTime() : null;
    const to = dateTo ? new Date(dateTo).getTime() : null;

    return rows.filter((r) => {
      const itemsText = r.items.map((it) => it.name).join(" ");
      const haystack = `${r.id} ${r.supplier} ${r.category} ${itemsText} ${r.paidBy} ${r.reference}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      if (!matchesSearch) return false;

      const t = new Date(r.date).getTime();
      if (from !== null && t < from) return false;
      if (to !== null) {
        const end = to + 24 * 60 * 60 * 1000 - 1;
        if (t > end) return false;
      }
      return true;
    });
  }, [rows, search, dateFrom, dateTo]);

  const totalInRange = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom).getTime() : null;
    const to = dateTo ? new Date(dateTo).getTime() : null;

    return rows
      .filter((r) => {
        const t = new Date(r.date).getTime();
        if (from !== null && t < from) return false;
        if (to !== null) {
          const end = to + 24 * 60 * 60 * 1000 - 1;
          if (t > end) return false;
        }
        return true;
      })
      .reduce((sum, r) => sum + r.total, 0);
  }, [rows, dateFrom, dateTo]);

  const resetForm = () => {
    setDate(new Date().toISOString().slice(0, 10));
    setSupplier("");
    setCategory("Petty Cash");
    setGstRate(8);
    setPaidBy("Cashier");
    setReference("");
    setItems([]);
    setItemPickerQuery("");
    setItemPickerOpen(false);
  };

  const handleAddBill = () => {
    if (!canAddBill) return;

    const nextIdNum = rows.length + 1;
    const newRow: BillRow = {
      id: `BILL-${String(nextIdNum).padStart(4, "0")}`,
      date,
      supplier: supplier || "(No supplier)",
      category,
      items,
      gstRate,
      subtotal: Number(subtotal.toFixed(2)),
      gstAmount,
      total,
      paidBy,
      reference: reference || "-",
    };

    setRows([newRow, ...rows]);
    resetForm();
  };

  const exportCsv = () => {
    const csv = [
      ["Bill ID", "Date", "Supplier", "Category", "Items", "GST %", "Subtotal", "GST", "Total", "Paid By", "Reference"],
      ...filteredBills.map((r) => [
        r.id,
        r.date,
        r.supplier,
        r.category,
        r.items.map((it) => `${it.name} x${it.qty}`).join("; "),
        String(r.gstRate),
        r.subtotal.toFixed(2),
        r.gstAmount.toFixed(2),
        r.total.toFixed(2),
        r.paidBy,
        r.reference,
      ]),
    ]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchasing_bills_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addInventoryItemToBill = (inventoryItemId: string) => {
    const inv = MOCK_INVENTORY.find((x) => x.id === inventoryItemId);
    if (!inv) return;

    const existingIndex = items.findIndex((it) => it.inventoryItemId === inv.id);
    if (existingIndex !== -1) {
      const copy = [...items];
      copy[existingIndex] = {
        ...copy[existingIndex],
        qty: Number((copy[existingIndex].qty + 1).toFixed(2)),
      };
      setItems(copy);
    } else {
      setItems([
        ...items,
        {
          inventoryItemId: inv.id,
          name: inv.name,
          qty: 1,
          unitPrice: inv.cost,
        },
      ]);
    }

    setItemPickerOpen(false);
    setItemPickerQuery("");
    setTimeout(() => qtyRef.current?.focus(), 50);
  };

  const updateItem = (index: number, patch: Partial<BillItem>) => {
    setItems(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Button
        data-testid="button-back-purchasing"
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground -ml-2"
        onClick={() => setLocation("/purchasing")}
      >
        <ArrowLeft className="size-4" />
        Back to Purchasing
      </Button>

      <PageHeader
        title="Bills"
        subtitle="Capture small purchases paid by petty cash / urgent buys"
        actions={
          <Button data-testid="button-bills-export" variant="outline" className="gap-2" onClick={exportCsv}>
            <Download className="size-4" />
            Export CSV
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Receipt className="size-4" />
              New Bill Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input data-testid="input-bills-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={(v) => setCategory(v as BillCategory)}>
                  <SelectTrigger data-testid="select-bills-category">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier (optional)</label>
                <Input
                  data-testid="input-bills-supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="e.g., City Mart"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Paid By</label>
                <Input
                  data-testid="input-bills-paidby"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  placeholder="e.g., Cashier"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">GST %</label>
                <Input
                  data-testid="input-bills-gst-rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={Number.isFinite(gstRate) ? gstRate : 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setGstRate(val < 0 ? 0 : val);
                  }}
                  placeholder="8"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reference (optional)</label>
                <Input
                  data-testid="input-bills-reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g., receipt # / voucher #"
                />
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border">
                <div className="text-sm font-medium">Items</div>
                <Popover open={itemPickerOpen} onOpenChange={setItemPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button data-testid="button-bills-add-item" variant="outline" size="sm" className="gap-2">
                      <Plus className="size-4" />
                      Add item
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[360px]" align="end">
                    <Command>
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                        <Search className="size-4 text-muted-foreground" />
                        <CommandInput
                          data-testid="input-bills-item-search"
                          value={itemPickerQuery}
                          onValueChange={setItemPickerQuery}
                          placeholder="Search inventory items..."
                        />
                      </div>
                      <CommandList>
                        <CommandEmpty>No matching items.</CommandEmpty>
                        <CommandGroup heading="Inventory">
                          {filteredInventory.slice(0, 30).map((inv) => (
                            <CommandItem
                              key={inv.id}
                              value={`${inv.name} ${inv.id}`}
                              data-testid={`option-bills-item-${inv.id}`}
                              onSelect={() => addInventoryItemToBill(inv.id)}
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{inv.name}</span>
                                <span className="text-xs text-muted-foreground font-mono">{inv.id} · {inv.unit} · ${inv.cost.toFixed(2)}</span>
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
                    <TableHead className="text-right w-[120px]">Qty</TableHead>
                    <TableHead className="text-right w-[140px]">Unit Price</TableHead>
                    <TableHead className="text-right w-[140px]">Line Total</TableHead>
                    <TableHead className="w-[64px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-28 text-center text-muted-foreground" data-testid="text-bills-items-empty">
                        Add items from your inventory to build this bill.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((it, idx) => (
                      <TableRow key={`${it.inventoryItemId}-${idx}`} data-testid={`row-bills-item-${idx}`}>
                        <TableCell>
                          <div className="font-medium" data-testid={`text-bills-item-name-${idx}`}>{it.name}</div>
                          <div className="text-xs text-muted-foreground font-mono" data-testid={`text-bills-item-id-${idx}`}>{it.inventoryItemId}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            ref={idx === items.length - 1 ? qtyRef : undefined}
                            data-testid={`input-bills-item-qty-${idx}`}
                            type="number"
                            min="0"
                            step="0.01"
                            className="text-right"
                            value={Number.isFinite(it.qty) ? it.qty : 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateItem(idx, { qty: val < 0 ? 0 : val });
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            data-testid={`input-bills-item-unitprice-${idx}`}
                            type="number"
                            min="0"
                            step="0.01"
                            className="text-right"
                            value={Number.isFinite(it.unitPrice) ? it.unitPrice : 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateItem(idx, { unitPrice: val < 0 ? 0 : val });
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium" data-testid={`text-bills-item-total-${idx}`}>
                          ${(it.qty * it.unitPrice).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            data-testid={`button-bills-item-remove-${idx}`}
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(idx)}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono" data-testid="text-bills-subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">GST ({gstRate}%)</span>
                    <span className="font-mono" data-testid="text-bills-gst-amount">${gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-mono font-medium" data-testid="text-bills-total">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                data-testid="button-bills-add"
                size="lg"
                className="gap-2"
                disabled={!canAddBill}
                onClick={handleAddBill}
              >
                <Plus className="size-4" />
                Add Bill
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">Quick Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bills (filtered)</span>
              <span className="font-mono" data-testid="text-bills-count">{filteredBills.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total (date range)</span>
              <span className="font-mono font-medium" data-testid="text-bills-total-range">${totalInRange.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-border text-xs text-muted-foreground">
              Tip: Use Bills for petty cash / urgent buys that don’t go through a full PO + invoice flow.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold">Bills Register</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <Input
              data-testid="input-bills-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bill ID, supplier, items, category, paid by..."
              className="md:max-w-sm"
            />
            <div className="flex items-center gap-2">
              <Input data-testid="input-bills-date-from" type="date" className="w-auto" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <span className="text-muted-foreground">-</span>
              <Input data-testid="input-bills-date-to" type="date" className="w-auto" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              <Button
                data-testid="button-bills-clear"
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => {
                  setSearch("");
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Bill ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="w-[64px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-28 text-center text-muted-foreground" data-testid="text-bills-empty">
                      No bills found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBills.map((r) => (
                    <TableRow key={r.id} data-testid={`row-bill-${r.id}`}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        <button
                          type="button"
                          data-testid={`button-bill-open-${r.id}`}
                          className="text-left hover:underline"
                          onClick={() => setLocation(`/purchasing/bills/${r.id}`)}
                        >
                          {r.id}
                        </button>
                      </TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell className="font-medium" data-testid={`text-bills-supplier-${r.id}`}>{r.supplier}</TableCell>
                      <TableCell className="text-muted-foreground">{r.category}</TableCell>
                      <TableCell className="text-muted-foreground" data-testid={`text-bills-items-${r.id}`}>{r.items.map((it) => it.name).join(", ")}</TableCell>
                      <TableCell className="text-right font-mono font-medium" data-testid={`text-bills-total-${r.id}`}>${r.total.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">{r.paidBy}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{r.reference}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          data-testid={`button-bills-delete-${r.id}`}
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
