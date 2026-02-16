import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_TABLES } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Users, Clock } from "lucide-react";
import { Link } from "wouter";

export default function POSHome() {
  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Floor Plan" 
          subtitle="Main Restaurant • Dinner Service"
          className="border-0 p-0"
        />
        <div className="flex gap-2">
          <Button variant="outline">KDS View</Button>
          <Button>New Tab</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {MOCK_TABLES.map((table) => (
          <Link key={table.id} href={`/pos/table/${table.id}`} className="block group">
            <Card className={cn(
              "h-48 cursor-pointer transition-all hover:shadow-md border-2",
              table.status === "Occupied" ? "border-primary/50 bg-primary/5" :
              table.status === "Dirty" ? "border-destructive/30 bg-destructive/5" :
              table.status === "Reserved" ? "border-amber-300/50 bg-amber-50" :
              "border-border hover:border-primary/30"
            )}>
              <CardContent className="p-4 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-bold text-foreground/80">{table.name}</span>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    table.status === "Occupied" ? "bg-primary text-primary-foreground" :
                    table.status === "Dirty" ? "bg-destructive text-destructive-foreground" :
                    table.status === "Reserved" ? "bg-amber-100 text-amber-800" :
                    "bg-secondary text-secondary-foreground"
                  )}>
                    {table.status}
                  </span>
                </div>

                {table.status === "Occupied" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="size-4" />
                      <span>{table.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="size-4" />
                      <span>{table.timeSeated}</span>
                    </div>
                    <div className="font-mono font-medium text-lg pt-2">
                      ${table.checkTotal?.toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground/30">
                    <span className="text-sm font-medium">Capacity: {table.capacity}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
