import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, SlidersHorizontal, Search, Truck, ArrowLeft } from "lucide-react";
import { SimpleTable } from "@/components/common/SimpleTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MOCK_INVOICES } from "@/lib/mockData";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";

export default function InvoicesList() {
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
        title="Invoices" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Truck className="size-4" />
              Import
            </Button>
            <Button className="gap-2 shadow-sm" onClick={() => setLocation("/purchasing/invoices/new")}>
              <Plus className="size-4" />
              New Invoice
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
              placeholder="Search Invoice # or Vendor..." 
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="finalized">Finalized</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-muted/50 p-1 rounded-md">
             <Button variant="secondary" size="sm" className="h-7 text-xs bg-background shadow-sm">All</Button>
             <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">Draft</Button>
             <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">Unfinalized</Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <SimpleTable 
        data={MOCK_INVOICES}
        onRowClick={(item) => setLocation(`/purchasing/invoices/${item.id}`)}
        columns={[
          { header: "Invoice No", accessorKey: "id", className: "font-mono font-medium" },
          { header: "Vendor", accessorKey: "vendorName", className: "font-medium" },
          { header: "PO Number", accessorKey: "poNumber", className: "font-mono text-muted-foreground" },
          { header: "Invoice Date", accessorKey: "invoiceDate" },
          { header: "Due Date", accessorKey: "dueDate", cell: (item) => item.dueDate || "-" },
          { 
            header: "Subtotal", 
            accessorKey: "subtotal", 
            cell: (item) => `$${(item.subtotal || 0).toFixed(2)}`,
            className: "text-right font-mono text-muted-foreground"
          },
          { 
            header: "GST (6%)", 
            accessorKey: "gst", 
            cell: (item) => `$${(item.gst || 0).toFixed(2)}`,
            className: "text-right font-mono text-muted-foreground"
          },
          { 
            header: "Total", 
            accessorKey: "total", 
            cell: (item) => `$${item.total.toFixed(2)}`,
            className: "text-right font-mono font-medium"
          },
          { 
            header: "Status", 
            accessorKey: "status", 
            cell: (item) => <StatusBadge status={item.status} />
          },
          { header: "Updated", accessorKey: "updatedAt", className: "text-muted-foreground text-xs" },
        ]}
        actions={(item) => (
          <>
            <DropdownMenuItem onClick={() => setLocation(`/purchasing/invoices/${item.id}`)}>Edit</DropdownMenuItem>
            {item.status !== "Finalized" && <DropdownMenuItem>Finalize</DropdownMenuItem>}
            <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
          </>
        )}
      />
    </div>
  );
}
