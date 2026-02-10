import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateLabOrderDialog } from "@/components/dashboard/CreateLabOrderDialog";
import { useLabOrders } from "@/hooks/useLabOrders";

const statusStyles: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  "in-progress": "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export default function LabWorkPage() {
  const [labOpen, setLabOpen] = useState(false);
  const { data: labOrders = [], isLoading } = useLabOrders();

  const statuses = ["pending", "sent", "in-progress", "completed"] as const;

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

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-10">Loading lab orders...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statuses.map((status) => {
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
                      <p className="text-sm font-medium">{order.lab_work_type}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.patients ? `${order.patients.first_name} ${order.patients.last_name}` : "Unknown"}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-muted-foreground">{order.lab_name}</span>
                        {order.due_date && <span className="text-[10px] text-muted-foreground">Due: {order.due_date}</span>}
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
      )}
      <CreateLabOrderDialog open={labOpen} onOpenChange={setLabOpen} />
    </div>
  );
}
