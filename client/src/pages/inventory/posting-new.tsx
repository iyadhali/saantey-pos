import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { MOCK_INVENTORY } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type Step = "setup" | "counting";

export default function InventoryPostingNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("setup");

  // Setup State
  const [frequency, setFrequency] = useState<string>("Weekly");
  const [type, setType] = useState<string>("new"); // new vs existing
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Counting State
  // Initialize counts with 0 or existing onHand values
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(MOCK_INVENTORY.map(item => [item.id, item.onHand]))
  );

  const handleContinue = () => {
    setStep("counting");
  };

  const handleFinish = () => {
    toast({
      title: "Count Posted",
      description: `Inventory count for ${date} has been successfully posted.`,
    });
    setLocation("/inventory/posting");
  };

  const updateCount = (id: string, value: string) => {
    setCounts(prev => ({
      ...prev,
      [id]: Number(value)
    }));
  };

  if (step === "setup") {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-muted-foreground -ml-2"
          onClick={() => setLocation("/inventory/posting")}
        >
          <ArrowLeft className="size-4" />
          Back to Postings
        </Button>

        <PageHeader title="New Inventory Posting" subtitle="Configure your count session" />
        
        <Card className="max-w-xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Count Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <div className="grid grid-cols-3 gap-3">
                {['Daily', 'Weekly', 'Monthly'].map((freq) => (
                  <Button 
                    key={freq} 
                    variant={frequency === freq ? "default" : "outline"}
                    className="h-12"
                    onClick={() => setFrequency(freq)}
                  >
                    {freq}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Session Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Start New Count</SelectItem>
                  <SelectItem value="existing">Continue Existing Count</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Count Date</label>
              <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={handleContinue} className="w-full sm:w-auto gap-2">
                Continue to Worksheet
                <ArrowRight className="size-4" />
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    );
  }

  // Counting Step
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground"
            onClick={() => setStep("setup")}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory Count</h1>
            <div className="text-sm text-muted-foreground flex gap-2">
              <span>{frequency}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
         </div>
         <div className="flex gap-2">
           <Button variant="outline" onClick={() => setLocation("/inventory/posting")}>Cancel</Button>
           <Button onClick={handleFinish} className="gap-2">
             <Save className="size-4" />
             Post Count
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
                <TableHead className="text-right w-[150px]">On Hand</TableHead>
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
                  <TableCell className="text-right">
                    <Input 
                      type="number" 
                      min="0"
                      step="0.1"
                      className={`text-right font-mono ${
                        (counts[item.id] || 0) < 0 ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                      value={counts[item.id] === undefined ? "" : counts[item.id]}
                      placeholder="-"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                           const newCounts = {...counts};
                           delete newCounts[item.id];
                           setCounts(newCounts);
                           return;
                        }
                        const num = parseFloat(val);
                        if (num < 0) return; // Prevent negative input
                        updateCount(item.id, val);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t bg-muted/20 flex justify-between items-center text-sm text-muted-foreground">
           <div>
             {Object.keys(counts).length} of {MOCK_INVENTORY.length} items counted
           </div>
           {Object.keys(counts).length < MOCK_INVENTORY.length && (
             <div className="flex items-center gap-2 text-amber-600">
               <span className="h-2 w-2 rounded-full bg-amber-500" />
               Partial count - Uncounted items will remain unchanged
             </div>
           )}
        </div>
      </Card>
    </div>
  );
}