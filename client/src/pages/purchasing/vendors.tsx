import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Download } from "lucide-react";
import { SimpleTable } from "@/components/common/SimpleTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MOCK_VENDORS } from "@/lib/mockData";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";

export default function VendorsList() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vendors" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              Export
            </Button>
            <Button className="gap-2 shadow-sm" onClick={() => setLocation("/purchasing/vendors/new")}>
              <UserPlus className="size-4" />
              New Vendor
            </Button>
          </div>
        }
      />

      {/* Filters Bar */}
      <div className="bg-card p-4 border border-border rounded-lg shadow-sm">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Vendors..." 
            className="pl-9 bg-background"
          />
        </div>
      </div>

      {/* Data Table */}
      <SimpleTable 
        data={MOCK_VENDORS}
        onRowClick={(item) => setLocation(`/purchasing/vendors/${item.id}`)}
        columns={[
          { header: "Vendor Name", accessorKey: "name", className: "font-medium" },
          { header: "Contact", accessorKey: "contactName" },
          { header: "Email", accessorKey: "email", className: "text-muted-foreground" },
          { header: "Last Order", accessorKey: "lastOrder" },
          { 
            header: "Status", 
            accessorKey: "status", 
            cell: (item) => <StatusBadge status={item.status} />
          },
        ]}
        actions={() => (
          <>
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Order History</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">Deactivate</DropdownMenuItem>
          </>
        )}
      />
    </div>
  );
}
