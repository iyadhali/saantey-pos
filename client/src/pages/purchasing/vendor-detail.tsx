import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, ArrowLeft, Save, Building2, MapPin, Mail, Phone } from "lucide-react";
import { MOCK_VENDORS } from "@/lib/mockData";
import { useParams, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VendorDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  
  const isNew = id === "new";
  
  const defaultVendor = {
    id: "NEW",
    name: "",
    status: "Active",
    lastOrder: "-",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    code: ""
  };

  const vendor = isNew 
    ? defaultVendor 
    : (MOCK_VENDORS.find(v => v.id === id) || MOCK_VENDORS[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/purchasing/vendors")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isNew ? "New Vendor" : vendor.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{isNew ? "DRAFT" : vendor.id}</span>
              {!isNew && (
                <>
                  <span>•</span>
                  <span className={vendor.status === "Active" ? "text-emerald-600 font-medium" : "text-muted-foreground"}>
                    {vendor.status}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <X className="size-4" />
            Cancel
          </Button>
          <Button className="gap-2">
            <Save className="size-4" />
            Save Vendor
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="ordering">Ordering Rules</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Building2 className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Vendor Name</label>
                  <Input defaultValue={vendor.name} placeholder="e.g. Sysco Foods" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Account Code</label>
                  <Input defaultValue={isNew ? "" : "V-001"} placeholder="Internal or Accounting Code" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tax ID / VAT</label>
                  <Input placeholder="Tax Registration Number" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Mail className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Primary Contact</label>
                    <Input defaultValue={vendor.contactName} placeholder="Name" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input defaultValue={isNew ? "" : "(555) 123-4567"} placeholder="Phone Number" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Email (Orders)</label>
                  <Input defaultValue={vendor.email} placeholder="orders@vendor.com" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea placeholder="Billing/Shipping Address" className="min-h-[80px]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ordering">
          <Card>
            <CardHeader>
              <CardTitle>Ordering Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Configure minimum order amounts, delivery days, and cutoff times.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="catalog">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Manage vendor-specific items and pricing.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
