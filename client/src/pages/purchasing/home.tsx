import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, FileText, Truck, UserPlus, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Link } from "wouter";
import { MOCK_ORDERS, MOCK_VENDORS } from "@/lib/mockData";
import { StatusBadge } from "@/components/common/StatusBadge";

export default function PurchasingHome() {
  const recentOrders = MOCK_ORDERS.slice(0, 3);
  const totalSpend = MOCK_ORDERS.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Purchasing Overview" 
        subtitle="Manage procurement, vendor relationships, and spend analysis."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/purchasing/orders/new">
              <Button size="lg" className="gap-2 shadow-md bg-primary hover:bg-primary/90 transition-all hover:-translate-y-0.5">
                <Plus className="size-4" />
                New Purchase Order
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="size-4" /> Weekly Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpend.toFixed(2)}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="size-3" /> +12.5% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="size-4" /> Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 sent, 1 needs receiving
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="size-4" /> Open Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-amber-600 font-medium mt-1">
              2 due within 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold tracking-tight mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/purchasing/orders">
                <div className="group cursor-pointer rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-primary/50 p-6 flex flex-col items-center justify-center gap-3 text-center h-32">
                  <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <FileText className="size-6" />
                  </div>
                  <span className="font-medium group-hover:text-primary transition-colors">Manage Orders</span>
                </div>
              </Link>
              
              <Link href="/purchasing/invoices">
                <div className="group cursor-pointer rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-primary/50 p-6 flex flex-col items-center justify-center gap-3 text-center h-32">
                  <div className="p-3 rounded-full bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform">
                    <Truck className="size-6" />
                  </div>
                  <span className="font-medium group-hover:text-blue-600 transition-colors">Invoices</span>
                </div>
              </Link>
              
              <Link href="/purchasing/vendors">
                <div className="group cursor-pointer rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-primary/50 p-6 flex flex-col items-center justify-center gap-3 text-center h-32">
                  <div className="p-3 rounded-full bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform">
                    <UserPlus className="size-6" />
                  </div>
                  <span className="font-medium group-hover:text-purple-600 transition-colors">Vendor Directory</span>
                </div>
              </Link>
            </div>
          </section>

          {/* Recent Activity Table */}
          <section>
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight">Recent Orders</h2>
              <Link href="/purchasing/orders">
                <Button variant="link" className="h-auto p-0 text-primary">View All &rarr;</Button>
              </Link>
            </div>
            
            <Card className="overflow-hidden border-border shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                          <FileText className="size-5 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{order.id} • {order.vendorName}</span>
                          <span className="text-xs text-muted-foreground">Delivery: {order.deliveryDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-mono font-medium">${order.total.toFixed(2)}</span>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar / Insights */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">Suggested Orders</CardTitle>
              <CardDescription>Based on low inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50">
                <div>
                  <div className="font-medium text-sm">Sysco Foods</div>
                  <div className="text-xs text-muted-foreground">3 items below par</div>
                </div>
                <Button size="sm" variant="secondary" className="h-7 text-xs">Review</Button>
              </div>
              <div className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50">
                <div>
                  <div className="font-medium text-sm">Baldor Specialty</div>
                  <div className="text-xs text-muted-foreground">Heavy Cream low</div>
                </div>
                <Button size="sm" variant="secondary" className="h-7 text-xs">Review</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Vendors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_VENDORS.slice(0, 3).map((vendor, i) => (
                <div key={vendor.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-sm text-muted-foreground w-4">{i + 1}</div>
                    <div className="text-sm font-medium">{vendor.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    ${(Math.random() * 5000).toFixed(0)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
