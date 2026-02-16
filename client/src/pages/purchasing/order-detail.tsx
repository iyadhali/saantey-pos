import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MOCK_ORDERS, MOCK_VENDORS, addMockOrder } from "@/lib/mockData";
import { useParams, useLocation } from "wouter";
import { Check, Printer, Save, ArrowLeft, Plus, Trash2, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  cost: number;
}

export default function OrderDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const isNew = id === "new";
  
  // State for order header
  const [vendorId, setVendorId] = useState<string>("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState("");
  
  // State for order items
  const [items, setItems] = useState<OrderItem[]>([]);

  // Get selected vendor data
  const selectedVendor = MOCK_VENDORS.find(v => v.id === vendorId);
  const vendorProducts = selectedVendor?.products || [];

  const filteredVendors = useMemo(() => {
    const q = vendorSearch.trim().toLowerCase();
    if (!q) return MOCK_VENDORS;
    return MOCK_VENDORS.filter(v =>
      v.id.toLowerCase().includes(q) || v.name.toLowerCase().includes(q)
    );
  }, [vendorSearch]);

  // Load existing data if not new
  useEffect(() => {
    if (!isNew && id) {
      const existing = MOCK_ORDERS.find(o => o.id === id);
      if (existing) {
        setVendorId(existing.vendorId);
        setDeliveryDate(existing.deliveryDate);
        // Mock items for existing orders
        setItems([
          { id: 1, name: "Whole Milk", sku: "DAIRY-001", quantity: 10, unit: "GAL", cost: 4.50 },
          { id: 2, name: "Eggs, Large", sku: "DAIRY-002", quantity: 5, unit: "CS", cost: 45.00 },
        ]);
      }
    }
  }, [id, isNew]);

  const handleAddItem = () => {
    if (!vendorId) {
      toast({
        title: "Select Vendor",
        description: "Please select a vendor before adding items.",
        variant: "destructive"
      });
      return;
    }
    
    // Add a new empty item
    const newItem: OrderItem = {
      id: Date.now(),
      name: "", 
      sku: "", 
      quantity: 1, 
      unit: "", 
      cost: 0.00
    };
    setItems([...items, newItem]);
  };

  const handleProductSelect = (itemId: number, productId: string) => {
    const product = vendorProducts.find(p => p.id === productId);
    if (product) {
      setItems(items.map(item => 
        item.id === itemId ? {
          ...item,
          name: product.name,
          sku: product.sku,
          unit: product.unit,
          cost: product.price
        } : item
      ));
    }
  };

  const updateItem = (id: number, field: keyof OrderItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
  };

  const handleCreateOrder = () => {
    if (!vendorId) {
      toast({ title: "Missing Vendor", description: "Please select a vendor.", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "No Items", description: "Please add at least one item.", variant: "destructive" });
      return;
    }

    const newOrder = {
      id: `PO-${Math.floor(Math.random() * 10000)}`,
      vendorId,
      vendorName: selectedVendor?.name || "Unknown Vendor",
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate,
      status: "Open" as const,
      total: calculateTotal(),
      itemCount: items.length
    };

    addMockOrder(newOrder);
    
    toast({
      title: "Order Created",
      description: `Purchase Order ${newOrder.id} has been created.`
    });
    
    setLocation("/purchasing/orders");
  };

  const existingOrder = MOCK_ORDERS.find(o => o.id === id);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 text-muted-foreground -ml-2"
        onClick={() => setLocation("/purchasing/orders")}
      >
        <ArrowLeft className="size-4" />
        Back to Orders
      </Button>

      <PageHeader 
        title={isNew ? "New Purchase Order" : `Purchase Order ${id}`}
        subtitle={
          <div className="flex items-center gap-2 mt-1">
            {isNew ? (
              <span className="text-muted-foreground">Create a new order</span>
            ) : (
              <>
                <span className="text-foreground font-medium">{existingOrder?.vendorName}</span>
                <span className="text-muted-foreground">•</span>
                <span>{existingOrder?.orderDate}</span>
                <StatusBadge status={existingOrder?.status || "Draft"} className="ml-2" />
              </>
            )}
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
            {!isNew && existingOrder?.status !== "Closed" && (
               <Button variant="secondary" className="gap-2" onClick={() => setLocation(`/purchasing/invoices/new?po=${id}`)}>
                 Create Invoice
               </Button>
            )}
            {(isNew || existingOrder?.status === "Draft") && (
              <Button 
                className="gap-2 shadow-sm bg-primary hover:bg-primary/90"
                onClick={handleCreateOrder}
              >
                <Check className="size-4" />
                {isNew ? "Create Order" : "Send Order"}
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-col space-y-6">
        {/* Top: Order Details */}
        <div className="w-full">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Vendor</label>
                  <Select 
                    disabled={!isNew} 
                    value={vendorId} 
                    onValueChange={(val) => {
                      setVendorId(val);
                      setItems([]); // Clear items when vendor changes
                      setVendorSearch("");
                    }}
                  >
                    <SelectTrigger data-testid="select-vendor">
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2 border-b border-border bg-background">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            data-testid="input-vendor-search"
                            value={vendorSearch}
                            onChange={(e) => setVendorSearch(e.target.value)}
                            placeholder="Search vendor by ID or name..."
                            className="pl-9 h-9"
                          />
                        </div>
                      </div>
                      {filteredVendors.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground">No vendors found.</div>
                      ) : (
                        filteredVendors.map(v => (
                          <SelectItem key={v.id} value={v.id}>
                            <span className="font-medium">{v.name}</span>
                            <span className="text-muted-foreground text-xs ml-2 font-mono">({v.id})</span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {vendorId && (
                    <p className="text-xs text-muted-foreground" data-testid="text-vendor-selected">
                      Selected: <span className="font-medium text-foreground">{selectedVendor?.name}</span> <span className="font-mono">({selectedVendor?.id})</span> • Catalog: {vendorProducts.length} items\n                    </p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Delivery Date</label>
                  <Input 
                    type="date" 
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input 
                    placeholder="Delivery instructions..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom: Order Items */}
        <div className="w-full">
          <Card className="border-border shadow-sm flex flex-col h-full">
            <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Order Items</CardTitle>
              <Button size="sm" variant="outline" className="h-8 gap-2" onClick={handleAddItem}>
                <Plus className="size-3.5" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
               <Table>
                 <TableHeader>
                   <TableRow className="hover:bg-transparent">
                     <TableHead className="w-[35%]">Item</TableHead>
                     <TableHead className="w-[15%] text-right">Qty</TableHead>
                     <TableHead className="w-[15%]">Unit</TableHead>
                     <TableHead className="w-[15%] text-right">Unit Cost</TableHead>
                     <TableHead className="w-[15%] text-right">Total</TableHead>
                     <TableHead className="w-[5%]"></TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {items.length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                         {vendorId 
                           ? "No items added. Click \"Add Item\" to start." 
                           : "Please select a vendor to view their catalog."}
                       </TableCell>
                     </TableRow>
                   ) : (
                     items.map((item) => (
                       <TableRow key={item.id}>
                         <TableCell className="font-medium">
                           {/* Product Selector */}
                           <Select 
                             value={vendorProducts.find(p => p.name === item.name)?.id} 
                             onValueChange={(val) => handleProductSelect(item.id, val)}
                           >
                             <SelectTrigger className="h-8">
                               <SelectValue placeholder="Select Product" />
                             </SelectTrigger>
                             <SelectContent>
                               {vendorProducts.map(p => (
                                 <SelectItem key={p.id} value={p.id}>
                                   {p.name} <span className="text-muted-foreground text-xs ml-2">({p.sku})</span>
                                 </SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                         </TableCell>
                         <TableCell className="text-right">
                           <Input 
                             type="number"
                             min="1"
                             value={item.quantity} 
                             onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                             className="h-8 w-20 text-right ml-auto"
                           />
                         </TableCell>
                         <TableCell>
                           <span className="text-sm text-muted-foreground">{item.unit || "-"}</span>
                         </TableCell>
                         <TableCell className="text-right">
                           <div className="text-sm">
                             ${item.cost.toFixed(2)}
                           </div>
                         </TableCell>
                         <TableCell className="text-right font-mono font-medium">
                           ${(item.quantity * item.cost).toFixed(2)}
                         </TableCell>
                         <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
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
            
            {/* Totals Section - Moved here */}
            <div className="bg-muted/30 p-4 border-t border-border mt-auto">
              <div className="flex flex-col gap-2 ml-auto w-full md:w-1/2 lg:w-1/3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-2 mt-1">
                  <span>Total</span>
                  <span className="font-mono text-primary">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
