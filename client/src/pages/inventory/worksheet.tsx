import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useLocation } from "wouter";

export default function Worksheet() {
  const [, setLocation] = useLocation();

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
        title="Inventory Worksheet" 
        subtitle="Printable sheets for manual stock taking"
        actions={
          <Button className="gap-2">
            <Printer className="size-4" />
            Print Worksheet
          </Button>
        }
      />

      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg bg-muted/10 text-muted-foreground">
        <p>Worksheet preview and configuration would go here.</p>
        <p className="text-sm mt-2">(Not implemented in this mockup)</p>
      </div>
    </div>
  );
}
