import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle } from "lucide-react";
import { inventory } from "@/data/mockDashboardData";

export default function InventoryPage() {
  const lowStock = inventory.filter((i) => i.quantity <= i.minStock);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-sm text-muted-foreground">{inventory.length} items tracked</p>
      </div>

      {lowStock.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Low Stock Alert</p>
              <p className="text-xs text-amber-700">{lowStock.map((i) => i.name).join(", ")} are running low.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Item</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Category</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Stock</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Min</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Supplier</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const isLow = item.quantity <= item.minStock;
                  return (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="py-2.5 px-4 font-medium">{item.name}</td>
                      <td className="py-2.5 px-4 text-muted-foreground">{item.category}</td>
                      <td className="py-2.5 px-4 font-medium">{item.quantity} {item.unit}</td>
                      <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{item.minStock}</td>
                      <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{item.supplier}</td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${isLow ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                          {isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
