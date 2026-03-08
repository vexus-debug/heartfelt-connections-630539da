import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Building2, Users, CreditCard, AlertTriangle, Clock, CheckCircle, DollarSign } from "lucide-react";
import { useLdDashboardStats, useLdCases } from "@/hooks/useLabDashboard";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function LdHomePage() {
  const { data: stats, isLoading } = useLdDashboardStats();
  const { data: recentCases } = useLdCases();

  const statCards = [
    { label: "Total Cases", value: stats?.totalCases ?? 0, icon: ClipboardList, color: "text-blue-500" },
    { label: "Pending", value: stats?.pendingCases ?? 0, icon: Clock, color: "text-amber-500" },
    { label: "In Progress", value: stats?.inProgressCases ?? 0, icon: AlertTriangle, color: "text-orange-500" },
    { label: "Ready", value: stats?.readyCases ?? 0, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Active Clients", value: stats?.activeClients ?? 0, icon: Building2, color: "text-purple-500" },
    { label: "Active Staff", value: stats?.activeStaff ?? 0, icon: Users, color: "text-indigo-500" },
    { label: "Total Revenue", value: `₦${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-600" },
    { label: "Outstanding", value: `₦${(stats?.totalOutstanding ?? 0).toLocaleString()}`, icon: CreditCard, color: "text-red-500" },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    "in-progress": "bg-blue-100 text-blue-800",
    ready: "bg-emerald-100 text-emerald-800",
    delivered: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lab Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your dental laboratory operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold text-foreground">{isLoading ? "..." : s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Cases */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Recent Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {!recentCases?.length ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No cases yet. Create your first case from the Cases page.</p>
          ) : (
            <div className="space-y-3">
              {recentCases.slice(0, 8).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{c.case_number}</span>
                      <Badge className={`text-[10px] ${statusColor[c.status] || "bg-muted text-muted-foreground"}`}>
                        {c.status}
                      </Badge>
                      {c.is_urgent && <Badge variant="destructive" className="text-[10px]">Urgent</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.patient_name} • {c.work_type_name || "N/A"} • {c.client?.clinic_name || "Walk-in"}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>₦{Number(c.net_amount || 0).toLocaleString()}</p>
                    <p>{c.due_date ? format(new Date(c.due_date), "MMM d") : "No due date"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
