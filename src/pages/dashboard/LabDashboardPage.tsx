import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical, Clock, AlertTriangle, CheckCircle2, Truck, DollarSign, TrendingUp,
} from "lucide-react";
import { useLabCaseStats } from "@/hooks/useLabCases";
import { useLabRevenueSummary } from "@/hooks/useLabAllocation";
import { format } from "date-fns";

const fmt = (v: number) => `₦${v.toLocaleString()}`;

export default function LabDashboardPage() {
  const { stats, cases, isLoading } = useLabCaseStats();
  const { data: revSummary } = useLabRevenueSummary();

  const urgentCases = cases
    .filter((c) => c.is_urgent && !["delivered"].includes(c.status))
    .slice(0, 5);

  const upcomingDue = cases
    .filter((c) => c.due_date && new Date(c.due_date) >= new Date() && !["delivered"].includes(c.status))
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5);

  const overdueCases = cases
    .filter((c) => c.due_date && new Date(c.due_date) < new Date() && !["delivered", "ready"].includes(c.status))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Cases", value: stats.total, icon: FlaskConical, color: "text-primary" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
    { title: "In Progress", value: stats.inProgress, icon: TrendingUp, color: "text-blue-500" },
    { title: "Ready", value: stats.ready, icon: CheckCircle2, color: "text-emerald-500" },
    { title: "Delivered", value: stats.delivered, icon: Truck, color: "text-muted-foreground" },
    { title: "Urgent", value: stats.urgent, icon: AlertTriangle, color: "text-destructive" },
    { title: "Overdue", value: stats.overdue, icon: Clock, color: "text-destructive" },
    { title: "Unpaid", value: stats.unpaid, icon: DollarSign, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lab Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of lab cases and financials — separate from clinic operations</p>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-3 p-4">
              <stat.icon className={`h-8 w-8 ${stat.color} shrink-0`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lab Financial Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Lab Financial Summary (Independent)
          </CardTitle>
          <CardDescription>Lab revenue is tracked separately from clinic revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">{fmt(revSummary?.totalRevenue ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Total Lab Revenue</p>
            </div>
            <div>
              <p className="text-lg font-bold">{fmt(revSummary?.monthRevenue ?? 0)}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600">{fmt(revSummary?.totalPaid ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Paid</p>
            </div>
            <div>
              <p className="text-lg font-bold text-destructive">{fmt(revSummary?.outstanding ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Outstanding</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Urgent Cases */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" /> Urgent Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {urgentCases.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No urgent cases</p>
            ) : urgentCases.map((c) => (
              <div key={c.id} className="p-2 rounded-md border bg-destructive/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.work_type}</span>
                  <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.patients ? `${c.patients.first_name} ${c.patients.last_name}` : "Unknown"}
                </p>
                {c.due_date && <p className="text-[10px] text-muted-foreground mt-1">Due: {format(new Date(c.due_date), "MMM d, yyyy")}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overdue Cases */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <Clock className="h-4 w-4" /> Overdue Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueCases.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No overdue cases</p>
            ) : overdueCases.map((c) => (
              <div key={c.id} className="p-2 rounded-md border bg-destructive/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.work_type}</span>
                  <Badge variant="outline" className="text-[10px] capitalize">{c.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.patients ? `${c.patients.first_name} ${c.patients.last_name}` : "Unknown"}
                </p>
                {c.due_date && <p className="text-[10px] text-destructive mt-1">Was due: {format(new Date(c.due_date), "MMM d, yyyy")}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Due */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" /> Upcoming Due Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingDue.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No upcoming due dates</p>
            ) : upcomingDue.map((c) => (
              <div key={c.id} className="p-2 rounded-md border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.work_type}</span>
                  <Badge variant="outline" className="text-[10px] capitalize">{c.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.patients ? `${c.patients.first_name} ${c.patients.last_name}` : "Unknown"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Due: {format(new Date(c.due_date!), "MMM d, yyyy")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
