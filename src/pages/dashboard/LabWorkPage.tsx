import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, Plus } from "lucide-react";
import { labOrders } from "@/data/mockDashboardData";
import { CreateLabOrderDialog } from "@/components/dashboard/CreateLabOrderDialog";

const statusStyles: Record<string, string> = {
  sent: "bg-blue-100 text-blue-700",
  "in-progress": "bg-amber-100 text-amber-700",
  received: "bg-emerald-100 text-emerald-700",
};

export default function LabWorkPage() {
  const [labOpen, setLabOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lab Work</h1>
          <p className="text-sm text-muted-foreground">Track dental lab orders and results</p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => setLabOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Lab Order
        </Button>
      </div>

      {/* Pipeline */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(["sent", "in-progress", "received"] as const).map((status) => {
          const orders = labOrders.filter((o) => o.status === status);
          return (
            <Card key={status}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm capitalize">{status.replace("-", " ")}</CardTitle>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[status]}`}>
                    {orders.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                    <p className="text-sm font-medium">{order.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{order.patientName}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-muted-foreground">{order.lab}</span>
                      <span className="text-[10px] text-muted-foreground">Due: {order.dueDate}</span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No orders</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <CreateLabOrderDialog open={labOpen} onOpenChange={setLabOpen} />
    </div>
  );
}
