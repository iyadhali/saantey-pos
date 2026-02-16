import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, SlidersHorizontal, Search, ArrowLeft } from "lucide-react";
import { SimpleTable } from "@/components/common/SimpleTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MOCK_ORDERS } from "@/lib/mockData";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";

export default function OrdersList() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 text-muted-foreground -ml-2"
        onClick={() => setLocation("/purchasing")}
      >
        <ArrowLeft className="size-4" />
        Back to Purchasing
      </Button>

      <PageHeader 
        title="Purchase Orders"  
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              Export
            </Button>
            <Button className="gap-2 shadow-sm" onClick={() => setLocation("/purchasing/orders/new")}>
              <Plus className="size-4" />
              New PO
            </Button>
          </div>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 border border-border rounded-lg shadow-sm">
        <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search PO # or Vendor..." 
              className="pl-9 bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <Input type="date" className="w-auto bg-background" />
            <span className="text-muted-foreground">-</span>
            <Input type="date" className="w-auto bg-background" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="receiving">Needs Receiving</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-muted/50 p-1 rounded-md">
             <Button variant="secondary" size="sm" className="h-7 text-xs bg-background shadow-sm">All</Button>
             <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">Open</Button>
             <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">Sent</Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <SimpleTable 
        data={MOCK_ORDERS}
        onRowClick={(item) => setLocation(`/purchasing/orders/${item.id}`)}
        columns={[
          { header: "PO ID", accessorKey: "id", className: "font-mono font-medium" },
          { header: "Vendor", accessorKey: "vendorName", className: "font-medium" },
          { header: "Order Date", accessorKey: "orderDate" },
          { header: "Delivery Date", accessorKey: "deliveryDate" },
          { header: "Memo", accessorKey: "memo", className: "text-muted-foreground italic text-sm" },
          { 
            header: "Total", 
            accessorKey: "total", 
            cell: (item) => `$${item.total.toFixed(2)}`,
            className: "text-right font-mono"
          },
        ]}
        actions={(item) => (
          <>
            <DropdownMenuItem onClick={() => setLocation(`/purchasing/invoices/new?po=${item.id}`)}>Create Invoice</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation(`/purchasing/orders/${item.id}`)}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Duplicate Order</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">Delete Order</DropdownMenuItem>
          </>
        )}
      />
    </div>
  );
}
