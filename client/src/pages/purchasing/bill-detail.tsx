import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Receipt } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { MOCK_BILLS } from "@/pages/purchasing/bills";

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
  category: string;
  items: BillItem[];
  gstRate: number;
  subtotal: number;
  gstAmount: number;
  total: number;
  paidBy: string;
  reference: string;
};

export default function BillDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/purchasing/bills/:id");
  const billId = params?.id || "";

  const bill = (MOCK_BILLS as BillRow[]).find((b: BillRow) => b.id === billId) || null;

  return (
    <div className="space-y-6">
      <Button
        data-testid="button-back-bills"
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground -ml-2"
        onClick={() => setLocation("/purchasing/bills")}
      >
        <ArrowLeft className="size-4" />
        Back to Bills
      </Button>

      <PageHeader
        title={bill ? `Bill ${bill.id}` : "Bill"}
        subtitle={bill ? `Captured on ${bill.date} · ${bill.supplier}` : "Bill details"}
        actions={
          <Button
            data-testid="button-bill-detail-export"
            variant="outline"
            className="gap-2"
            onClick={() => {
              if (!bill) return;
              const csv = [
                ["Bill ID", "Date", "Supplier", "Category", "Paid By", "Reference", "GST %", "Subtotal", "GST", "Total"],
                [
                  bill.id,
                  bill.date,
                  bill.supplier,
                  bill.category,
                  bill.paidBy,
                  bill.reference,
                  String(bill.gstRate),
                  bill.subtotal.toFixed(2),
                  bill.gstAmount.toFixed(2),
                  bill.total.toFixed(2),
                ],
                [],
                ["Item", "Qty", "Unit Price", "Line Total"],
                ...bill.items.map((it) => [it.name, String(it.qty), it.unitPrice.toFixed(2), (it.qty * it.unitPrice).toFixed(2)]),
              ]
                .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
                .join("\n");

              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `bill_${bill.id}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="size-4" />
            Export
          </Button>
        }
      />

      {!bill ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground" data-testid="text-bill-not-found">
            Bill not found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Receipt className="size-4" />
                Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bill.items.map((it, idx) => (
                    <TableRow key={`${bill.id}-${idx}`} data-testid={`row-bill-item-${idx}`}>
                      <TableCell>
                        <div className="font-medium" data-testid={`text-bill-item-name-${idx}`}>{it.name}</div>
                        <div className="text-xs text-muted-foreground font-mono" data-testid={`text-bill-item-id-${idx}`}>{it.inventoryItemId}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono" data-testid={`text-bill-item-qty-${idx}`}>{it.qty}</TableCell>
                      <TableCell className="text-right font-mono" data-testid={`text-bill-item-unitprice-${idx}`}>${it.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono font-medium" data-testid={`text-bill-item-total-${idx}`}>${(it.qty * it.unitPrice).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bill ID</span>
                <span className="font-mono" data-testid="text-bill-id">{bill.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Supplier</span>
                <span className="font-medium" data-testid="text-bill-supplier">{bill.supplier}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="text-muted-foreground" data-testid="text-bill-category">{bill.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid By</span>
                <span className="text-muted-foreground" data-testid="text-bill-paidby">{bill.paidBy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-muted-foreground" data-testid="text-bill-reference">{bill.reference}</span>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono" data-testid="text-bill-subtotal">${bill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST ({bill.gstRate}%)</span>
                  <span className="font-mono" data-testid="text-bill-gst">${bill.gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-mono font-medium" data-testid="text-bill-total">${bill.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
