import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MOCK_INVOICES, MOCK_ORDERS, MOCK_ORDER_ITEMS, OrderItem } from "@/lib/mockData";
import { useParams, useLocation } from "wouter";
import { Check, X, Printer, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function InvoiceDetail() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const isNew = id === "new";
  
  // Parse query params for PO
  const searchParams = new URLSearchParams(window.location.search);
  const initialPoId = searchParams.get("po");

  // State
  const [poId, setPoId] = useState<string>(initialPoId || "");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  
  // Derived state from PO
  const selectedOrder = MOCK_ORDERS.find(o => o.id === poId);
  
  // Existing Invoice Data (if not new)
  const existingInvoice = !isNew ? MOCK_INVOICES.find(i => i.id === id) : null;

  // Initialize data for existing invoice
  useEffect(() => {
    if (existingInvoice) {
      setPoId(existingInvoice.poNumber);
      setInvoiceNumber(existingInvoice.id);
      setInvoiceDate(existingInvoice.invoiceDate);
      setDueDate(existingInvoice.dueDate || "");
      // In a real app, we'd fetch the specific invoice items here. 
      // For mock, we'll fallback to the PO items associated with this invoice's PO.
      if (existingInvoice.poNumber && MOCK_ORDER_ITEMS[existingInvoice.poNumber]) {
        setItems(MOCK_ORDER_ITEMS[existingInvoice.poNumber]);
      }
    }
  }, [existingInvoice]);

  // Load items when PO changes (only for new invoices)
  useEffect(() => {
    if (isNew && poId && MOCK_ORDER_ITEMS[poId]) {
      // Deep copy items to allow editing without affecting source mock
      setItems(JSON.parse(JSON.stringify(MOCK_ORDER_ITEMS[poId])));
    }
  }, [poId, isNew]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
  const gstRate = 0.06;
  const gst = Number((subtotal * gstRate).toFixed(2));
  const total = subtotal + gst;

  // Handlers
  const handleQuantityChange = (itemId: number, newQty: number) => {
    // Validate against PO quantity logic could go here
    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity: newQty } : item
    ));
  };

  const handleSave = () => {
    if (!poId) {
      toast({ title: "Validation Error", description: "Please select a Purchase Order.", variant: "destructive" });
      return;
    }
    if (!invoiceNumber) {
      toast({ title: "Validation Error", description: "Please enter an Invoice Number.", variant: "destructive" });
      return;
    }
    
    // Duplicate check
    const isDuplicate = MOCK_INVOICES.some(i => i.id === invoiceNumber && i.id !== id);
    if (isDuplicate) {
      toast({ title: "Duplicate Invoice", description: "This invoice number already exists.", variant: "destructive" });
      return;
    }

    toast({
      title: isNew ? "Invoice Created" : "Invoice Updated",
      description: `Invoice ${invoiceNumber} has been saved.`
    });
    setLocation("/purchasing/invoices");
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 text-muted-foreground -ml-2"
        onClick={() => setLocation("/purchasing/invoices")}
      >
        <ArrowLeft className="size-4" />
        Back to Invoices
      </Button>

      <PageHeader 
        title={isNew ? "New Invoice" : `Invoice ${invoiceNumber || id}`}
        subtitle={
          <div className="flex items-center gap-2 mt-1">
            {selectedOrder ? (
              <>
                <span className="text-foreground font-medium">{selectedOrder.vendorName}</span>
                <span className="text-muted-foreground">•</span>
                <span>PO: {selectedOrder.id}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Select a PO to begin</span>
            )}
            {!isNew && existingInvoice && <StatusBadge status={existingInvoice.status} className="ml-2" />}
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            {!isNew && (
              <Button variant="ghost" size="icon">
                <Printer className="size-4" />
              </Button>
            )}
            <Button variant="outline" className="gap-2">
              <Save className="size-4" />
              Save Draft
            </Button>
            {(!existingInvoice || existingInvoice.status !== "Finalized") && (
              <Button 
                className="gap-2 shadow-sm bg-primary hover:bg-primary/90"
                onClick={handleSave}
              >
                <Check className="size-4" />
                {isNew ? "Create Invoice" : "Finalize"}
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Line Items Table */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Line Items</CardTitle>
              {selectedOrder && (
                <div className="text-xs text-muted-foreground">
                  Populated from PO {selectedOrder.id}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                 <TableHeader>
                   <TableRow className="hover:bg-transparent">
                     <TableHead className="w-[40%]">Item</TableHead>
                     <TableHead className="w-[15%] text-right">Qty</TableHead>
                     <TableHead className="w-[10%]">Unit</TableHead>
                     <TableHead className="w-[15%] text-right">Unit Cost</TableHead>
                     <TableHead className="w-[20%] text-right">Total</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {items.length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                         {isNew && !poId ? (
                           <div className="flex flex-col items-center gap-2">
                             <AlertCircle className="size-8 text-muted-foreground/50" />
                             <span>Please select a Purchase Order to load items.</span>
                           </div>
                         ) : (
                           "No items found for this order."
                         )}
                       </TableCell>
                     </TableRow>
                   ) : (
                     items.map((item) => (
                       <TableRow key={item.id}>
                         <TableCell className="font-medium">
                           <div>{item.name}</div>
                           <div className="text-xs text-muted-foreground font-mono">SKU: {item.sku}</div>
                         </TableCell>
                         <TableCell className="text-right">
                           <Input 
                             type="number"
                             min="0"
                             step="0.01"
                             className="h-8 w-20 text-right ml-auto" 
                             value={item.quantity}
                             onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                           />
                         </TableCell>
                         <TableCell className="text-muted-foreground text-sm">{item.unit}</TableCell>
                         <TableCell className="text-right text-sm">${item.cost.toFixed(2)}</TableCell>
                         <TableCell className="text-right font-mono font-medium">
                           ${(item.quantity * item.cost).toFixed(2)}
                         </TableCell>
                       </TableRow>
                     ))
                   )}
                 </TableBody>
               </Table>
            </CardContent>
            
            {/* Totals Section */}
            {items.length > 0 && (
              <div className="p-4 bg-muted/10 border-t border-border space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">GST (6%)</span>
                  <span className="font-mono">${gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-border/50 pt-2 mt-2">
                  <span>Total</span>
                  <span className="font-mono text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {/* Invoice Details Panel */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              
              {/* PO Selection (Only editable if New) */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Purchase Order <span className="text-destructive">*</span></label>
                {isNew ? (
                  <Select value={poId} onValueChange={setPoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_ORDERS.filter(o => o.status !== "Closed").map(order => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.id} - {order.vendorName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={poId} disabled className="bg-muted" />
                )}
              </div>

              {/* Vendor Display (Read Only) */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Vendor</label>
                <Input 
                  value={selectedOrder?.vendorName || ""} 
                  disabled 
                  className="bg-muted" 
                  placeholder="Auto-filled from PO"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Invoice Number <span className="text-destructive">*</span></label>
                <Input 
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Enter Invoice #" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Invoice Date</label>
                  <Input 
                    type="date" 
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              {!isNew && existingInvoice?.status !== "Finalized" && (
                <div className="pt-4 border-t border-border">
                  <Button variant="destructive" className="w-full gap-2">
                     <X className="size-4" />
                     Reject Invoice
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}