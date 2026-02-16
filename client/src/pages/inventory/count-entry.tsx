import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimpleTable } from "@/components/common/SimpleTable";
import { MOCK_INVENTORY } from "@/lib/mockData";
import { Save, Check } from "lucide-react";
import { useParams } from "wouter";

export default function CountEntry() {
  const { batchId } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Weekly Count" 
        subtitle={`Batch: ${batchId} • Downtown Location`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Save className="size-4" />
              Save Draft
            </Button>
            <Button className="gap-2 shadow-sm bg-primary">
              <Check className="size-4" />
              Submit Count
            </Button>
          </div>
        }
      />

      <SimpleTable 
        data={MOCK_INVENTORY}
        columns={[
          { header: "Item", accessorKey: "name", className: "font-medium" },
          { header: "Unit", accessorKey: "unit", className: "text-muted-foreground w-20" },
          { 
            header: "Count", 
            accessorKey: "id", 
            cell: () => (
              <Input 
                type="number" 
                className="w-32 text-right font-mono" 
                placeholder="0"
                min="0"
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (Number(target.value) < 0) target.value = "0";
                }}
              />
            ),
            className: "text-right w-40" 
          },
        ]}
      />
    </div>
  );
}
