import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TreatmentTabProps {
  plans: any[];
  visits: any[];
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function TreatmentTab({ plans, visits }: TreatmentTabProps) {
  return (
    <div className="space-y-6">
      {/* Treatment Plans */}
      <div>
        <h3 className="text-sm font-medium mb-3">Treatment Plans</h3>
        {plans.length === 0 ? (
          <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No treatment plans found.</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {plans.map((plan: any) => {
              const procs = plan.treatment_plan_procedures || [];
              const completedCount = procs.filter((p: any) => p.status === "done").length;
              const progress = procs.length ? Math.round((completedCount / procs.length) * 100) : 0;
              return (
                <Card key={plan.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">{plan.name}</CardTitle>
                        <CardDescription>{plan.start_date} → {plan.estimated_end || "Ongoing"}</CardDescription>
                      </div>
                      <Badge className={plan.status === "active" ? "bg-blue-100 text-blue-700" : plan.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                        {plan.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Progress value={progress} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{progress}%</span>
                    </div>
                    <div className="space-y-2">
                      {procs.map((proc: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className={`h-2 w-2 rounded-full ${proc.status === "done" ? "bg-emerald-500" : "bg-gray-300"}`} />
                          <span className={proc.status === "done" ? "line-through text-muted-foreground" : ""}>{proc.procedure_name}</span>
                          {proc.estimated_cost && <span className="ml-auto text-xs text-muted-foreground">{formatCurrency(Number(proc.estimated_cost))}</span>}
                          {proc.completed_date && <span className="text-xs text-muted-foreground">{proc.completed_date}</span>}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs border-t pt-2">
                      <span className="text-muted-foreground">Total: {formatCurrency(Number(plan.total_cost))}</span>
                      <span className="text-muted-foreground">Paid: {formatCurrency(Number(plan.paid_amount))}</span>
                      <span className="font-medium text-destructive">Due: {formatCurrency(Number(plan.total_cost) - Number(plan.paid_amount))}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Visit History */}
      <div>
        <h3 className="text-sm font-medium mb-3">Completed Visits</h3>
        {visits.length === 0 ? (
          <Card><CardContent className="py-6 text-center text-sm text-muted-foreground">No completed visits found.</CardContent></Card>
        ) : (
          <Card>
            <CardContent className="py-4">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                {visits.map((v: any) => (
                  <div key={v.id} className="relative">
                    <div className="absolute -left-6 top-1 h-4 w-4 rounded-full border-2 border-secondary bg-background" />
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{v.treatment}</p>
                        <p className="text-xs text-muted-foreground">{v.dentist} · {v.date}</p>
                        {v.notes && <p className="text-xs text-muted-foreground mt-1">{v.notes}</p>}
                      </div>
                      <span className="text-sm font-medium shrink-0">{formatCurrency(v.cost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
