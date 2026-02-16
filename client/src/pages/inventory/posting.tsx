import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Search } from "lucide-react";
import { SimpleTable } from "@/components/common/SimpleTable";
import { MOCK_POSTINGS } from "@/lib/mockData";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useMemo, useState } from "react";

export default function InventoryPostingList() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom).getTime() : null;
    const to = dateTo ? new Date(dateTo).getTime() : null;

    return MOCK_POSTINGS.filter(p => {
      const haystack = `${p.id} ${p.location} ${p.createdBy} ${p.status}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      if (!matchesSearch) return false;

      const t = new Date(p.date).getTime();
      if (from !== null && t < from) return false;
      if (to !== null) {
        // include full day
        const end = to + 24 * 60 * 60 * 1000 - 1;
        if (t > end) return false;
      }
      return true;
    });
  }, [search, dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 text-muted-foreground -ml-2"
        onClick={() => setLocation("/inventory")}
      >
        <ArrowLeft className="size-4" />
        Back to Inventory
      </Button>

      <PageHeader 
        title="Inventory Postings" 
        subtitle="History of inventory counts and adjustments"
        actions={
          <Button className="gap-2 shadow-sm" onClick={() => setLocation("/inventory/posting/new")}>
            <Plus className="size-4" />
            New Posting
          </Button>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 border border-border rounded-lg shadow-sm">
        <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              data-testid="input-posting-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Posting ID, location, or creator..." 
              className="pl-9 bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <Input data-testid="input-posting-date-from" type="date" className="w-auto bg-background" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <span className="text-muted-foreground">-</span>
            <Input data-testid="input-posting-date-to" type="date" className="w-auto bg-background" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button data-testid="button-posting-export" variant="outline" onClick={() => {
            const rows = filtered.map(p => [p.id, p.date, p.location, p.status, `${p.itemsCounted}/${p.totalItems}`, p.createdBy]);
            const csv = [
              ['Posting ID','Date','Location','Status','Completion','Created By'],
              ...rows
            ].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventory_postings_${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}>Export CSV</Button>
          <Button data-testid="button-posting-clear" variant="ghost" className="text-muted-foreground" onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }}>Clear</Button>
        </div>
      </div>

      <SimpleTable 
        data={filtered}
        onRowClick={(item) => setLocation(`/inventory/posting/${item.id}`)}
        columns={[
          { header: "Posting ID", accessorKey: "id", className: "font-mono font-medium" },
          { header: "Date", accessorKey: "date" },
          { header: "Location", accessorKey: "location" },
          { 
            header: "Completion", 
            accessorKey: "itemsCounted", 
            cell: (item) => (
              <span className="text-muted-foreground">
                {item.itemsCounted} / {item.totalItems} items
              </span>
            )
          },
          { header: "Created By", accessorKey: "createdBy" },
          { 
            header: "Status", 
            accessorKey: "status", 
            cell: (item) => <StatusBadge status={item.status as any} />
          },
        ]}
      />
    </div>
  );
}