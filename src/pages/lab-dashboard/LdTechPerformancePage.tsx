import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useLdCases, useLdStaff } from "@/hooks/useLabDashboard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, CheckCircle, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function LdTechPerformancePage() {
  const { data: cases = [] } = useLdCases();
  const { data: staff = [] } = useLdStaff();

  const technicians = staff.filter((s: any) => s.status === "active");

  const performanceData = useMemo(() => {
    return technicians.map((tech: any) => {
      const techCases = cases.filter((c: any) => c.assigned_technician_id === tech.id);
      const total = techCases.length;
      const fullyCompleted = techCases.filter((c: any) => ["ready", "delivered"].includes(c.status) && (c.completion_type === "full" || !c.completion_type)).length;
      const partiallyCompleted = techCases.filter((c: any) => ["ready", "delivered"].includes(c.status) && c.completion_type === "partial").length;
      const completed = fullyCompleted + partiallyCompleted;
      const inProgress = techCases.filter((c: any) => c.status === "in-progress").length;
      const pending = techCases.filter((c: any) => c.status === "pending").length;
      const rejected = techCases.filter((c: any) => c.remark && ["Rejected", "Damaged", "Remake"].includes(c.remark)).length;
      const overdue = techCases.filter((c: any) => c.due_date && new Date(c.due_date) < new Date() && !["delivered", "ready"].includes(c.status)).length;
      const urgent = techCases.filter((c: any) => c.is_urgent && !["delivered"].includes(c.status)).length;
      
      // Revenue: full value for fully completed, half for partially completed
      const fullRevenue = techCases
        .filter((c: any) => ["ready", "delivered"].includes(c.status) && (c.completion_type === "full" || !c.completion_type))
        .reduce((s: number, c: any) => s + Number(c.net_amount || 0), 0);
      const partialRevenue = techCases
        .filter((c: any) => ["ready", "delivered"].includes(c.status) && c.completion_type === "partial")
        .reduce((s: number, c: any) => s + Number(c.net_amount || 0) * 0.5, 0);
      const totalRevenue = fullRevenue + partialRevenue;

      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0;

      const completedWithDates = techCases.filter((c: any) => c.received_date && c.completed_date);
      const avgTurnaround = completedWithDates.length > 0
        ? Math.round(completedWithDates.reduce((s: number, c: any) => {
            const start = new Date(c.received_date).getTime();
            const end = new Date(c.completed_date).getTime();
            return s + (end - start) / (1000 * 60 * 60 * 24);
          }, 0) / completedWithDates.length)
        : 0;

      return {
        id: tech.id,
        name: tech.full_name,
        role: tech.role,
        specialty: tech.specialty,
        total,
        completed,
        fullyCompleted,
        partiallyCompleted,
        inProgress,
        pending,
        rejected,
        overdue,
        urgent,
        completionRate,
        rejectionRate,
        avgTurnaround,
        totalRevenue,
      };
    }).sort((a, b) => b.total - a.total);
  }, [cases, technicians]);

  const chartData = performanceData.map(t => ({
    name: t.name.split(" ")[0],
    "Fully Completed": t.fullyCompleted,
    "Partially Completed": t.partiallyCompleted,
    "In Progress": t.inProgress,
    Pending: t.pending,
    Rejected: t.rejected,
  }));

  const topPerformer = performanceData.reduce((best, t) => t.completionRate > (best?.completionRate || 0) ? t : best, performanceData[0]);

  return (
    <div className="space-y-6">
      <PageHeader title="Technician Performance" description="Output rates, completion types, and salary-relevant metrics" />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Active Techs</p><p className="text-xl font-bold">{technicians.length}</p></div>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-emerald-500" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Fully Completed</p><p className="text-xl font-bold">{performanceData.reduce((s, t) => s + t.fullyCompleted, 0)}</p></div>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-500" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Partially Completed</p><p className="text-xl font-bold">{performanceData.reduce((s, t) => s + t.partiallyCompleted, 0)}</p></div>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-blue-500" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Top Performer</p><p className="text-sm font-bold truncate">{topPerformer?.name || "—"}</p></div>
        </CardContent></Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Workload Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="Fully Completed" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} stackId="stack" />
                <Bar dataKey="Partially Completed" fill="#f59e0b" radius={[2, 2, 0, 0]} stackId="stack" />
                <Bar dataKey="In Progress" fill="#3b82f6" radius={[2, 2, 0, 0]} stackId="stack" />
                <Bar dataKey="Pending" fill="#94a3b8" radius={[2, 2, 0, 0]} stackId="stack" />
                <Bar dataKey="Rejected" fill="#ef4444" radius={[2, 2, 0, 0]} stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Per-Technician Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {performanceData.map((tech, i) => (
          <motion.div key={tech.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-base">{tech.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {tech.specialty && <Badge variant="outline" className="text-[10px]">{tech.specialty}</Badge>}
                      <Badge variant="secondary" className="text-[10px]">{tech.role}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{tech.total}</p>
                    <p className="text-[10px] text-muted-foreground">Total Cases</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold">{tech.completionRate}%</span>
                    </div>
                    <Progress value={tech.completionRate} className="h-2" />
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center pt-2 border-t border-border/30">
                    <div>
                      <p className="text-sm font-semibold text-emerald-600">{tech.fullyCompleted}</p>
                      <p className="text-[9px] text-muted-foreground">Full</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-500">{tech.partiallyCompleted}</p>
                      <p className="text-[9px] text-muted-foreground">Partial</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-500">{tech.inProgress}</p>
                      <p className="text-[9px] text-muted-foreground">In Prog</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-destructive">{tech.rejected}</p>
                      <p className="text-[9px] text-muted-foreground">Rejected</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-500">{tech.overdue}</p>
                      <p className="text-[9px] text-muted-foreground">Overdue</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/30 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>Avg: {tech.avgTurnaround}d</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span>Reject: {tech.rejectionRate}%</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">₦{tech.totalRevenue.toLocaleString()}</span>
                      <p className="text-[9px] text-muted-foreground">Salary value</p>
                    </div>
                  </div>

                  {tech.partiallyCompleted > 0 && (
                    <div className="text-[10px] p-2 rounded bg-amber-500/10 text-amber-700">
                      ⚠ {tech.partiallyCompleted} partially completed case(s) — value halved for salary calculation
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {performanceData.length === 0 && (
          <div className="col-span-2 text-center py-16 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No active technicians found. Add staff to see performance data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
