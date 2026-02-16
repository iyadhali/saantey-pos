import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Printer } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useState } from "react";
import { MOCK_INVENTORY, MOCK_POSTINGS } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";

export default function InventoryPostingDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  
  const posting = MOCK_POSTINGS.find(p => p.id === id) || {
    id: id,
    date: "2024-05-21",
    location: "Downtown Location",
    status: "Posted",
    itemsCounted: 45,
    totalItems: 45,
    createdBy: "Unknown"
  };

  // Simulate loaded counts
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(MOCK_INVENTORY.map(item => [item.id, item.onHand]))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground"
            onClick={() => setLocation("/inventory/posting")}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Count #{posting.id}</h1>
            <div className="text-sm text-muted-foreground flex gap-2 items-center">
              <span>{posting.date}</span>
              <span>•</span>
              <span>{posting.location}</span>
              <StatusBadge status={posting.status as any} className="ml-2" />
            </div>
          </div>
         </div>
         <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
             <Printer className="size-4" />
             Print
           </Button>
           <Button variant="outline" disabled>
             <Save className="size-4 mr-2" />
             Save Changes
           </Button>
         </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right w-[150px]">Counted Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVENTORY.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
                  <TableCell className="font-medium">
                    <div>{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.category}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.locations.join(", ")}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-right font-mono">
                    {counts[item.id] || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t bg-muted/20 flex justify-between items-center text-sm text-muted-foreground">
           <div>
             {posting.itemsCounted} of {posting.totalItems} items counted
           </div>
           <div>
             Posted by {posting.createdBy}
           </div>
        </div>
      </Card>
    </div>
  );
}