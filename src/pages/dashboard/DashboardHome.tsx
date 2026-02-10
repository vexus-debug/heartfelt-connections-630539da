import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users, CalendarDays, CreditCard, TrendingUp, UserPlus, CalendarPlus, FileText, Clock, Activity,
  ArrowUpRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import {
  useDashboardStats, useWeeklyAppointments, useRevenueData, useTodaySchedule, useRecentActivity, useCurrentUserName,
} from "@/hooks/useDashboardData";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { hasPageAccess } from "@/config/roleAccess";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  "in-progress": "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const activityIcons: Record<string, typeof Activity> = {
  appointment: CalendarDays,
  payment: CreditCard,
  patient: Users,
  lab: FileText,
  prescription: FileText,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
}

export default function DashboardHome() {
  const { data: stats } = useDashboardStats();
  const { data: weeklyData } = useWeeklyAppointments();
  const { data: revenueData } = useRevenueData();
  const { data: todayAppointments } = useTodaySchedule();
  const { data: activities } = useRecentActivity();
  const { data: userName } = useCurrentUserName();
  const { roles } = useAuth();

  const s = stats || { totalPatients: 0, todayAppointments: 0, pendingPayments: 0, monthlyRevenue: 0 };
  const schedule = todayAppointments || [];
  const recentActivities = activities || [];
  const currentMonth = format(new Date(), "MMM");

  const canSeePatients = hasPageAccess(roles, "/dashboard/patients");
  const canSeeBilling = hasPageAccess(roles, "/dashboard/billing");
  const canSeeAppointments = hasPageAccess(roles, "/dashboard/appointments");
  const canSeeReports = hasPageAccess(roles, "/dashboard/reports");

  // Determine quick actions by role
  const quickActions = [
    canSeePatients && { to: "/dashboard/patients", icon: UserPlus, title: "Register Patient", desc: "Add a new patient record" },
    canSeeAppointments && { to: "/dashboard/appointments", icon: CalendarPlus, title: "Book Appointment", desc: "Schedule a visit" },
    canSeeBilling && { to: "/dashboard/billing", icon: FileText, title: "Create Invoice", desc: "Generate a bill" },
  ].filter(Boolean) as { to: string; icon: typeof UserPlus; title: string; desc: string }[];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {userName || "Doctor"}. Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          {canSeePatients && (
            <Button size="sm" variant="outline" asChild>
              <Link to="/dashboard/patients"><UserPlus className="mr-2 h-4 w-4" />New Patient</Link>
            </Button>
          )}
          {canSeeAppointments && (
            <Button size="sm" className="bg-secondary hover:bg-secondary/90" asChild>
              <Link to="/dashboard/appointments"><CalendarPlus className="mr-2 h-4 w-4" />Book Appointment</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stat Cards - show based on role relevance */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {canSeePatients && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold mt-1">{s.totalPatients.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {canSeeAppointments && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Today's Appointments</p>
                  <p className="text-2xl font-bold mt-1">{s.todayAppointments}</p>
                  <p className="text-xs text-emerald-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    {schedule.filter((a) => a.status === "completed").length} completed
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {canSeeBilling && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold mt-1">{s.pendingPayments}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {canSeeBilling && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Revenue ({currentMonth})</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(s.monthlyRevenue)}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Charts Row - only for roles that see relevant data */}
      {(canSeeAppointments || canSeeBilling) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {canSeeAppointments && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weekly Appointments</CardTitle>
                <CardDescription>Appointment trends this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyData || []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                    <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
          {canSeeBilling && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue trend (₦)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueData || []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => [formatCurrency(value), "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Schedule + Activity Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {canSeeAppointments && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Today's Schedule</CardTitle>
                  <CardDescription>
                    {schedule.filter((a) => a.status === "completed").length} completed,{" "}
                    {schedule.filter((a) => a.status === "in-progress").length} in progress,{" "}
                    {schedule.filter((a) => a.status === "scheduled").length} upcoming
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard/appointments">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Time</th>
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Patient</th>
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Dentist</th>
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden lg:table-cell">Chair</th>
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Treatment</th>
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.length === 0 ? (
                      <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No appointments today.</td></tr>
                    ) : schedule.map((apt) => (
                      <tr key={apt.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-4 font-medium"><div className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-muted-foreground" />{apt.time}</div></td>
                        <td className="py-2.5 px-4">{apt.patientName}</td>
                        <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{apt.dentist}</td>
                        <td className="py-2.5 px-4 hidden lg:table-cell text-muted-foreground">{apt.chair}</td>
                        <td className="py-2.5 px-4">{apt.treatment}</td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[apt.status] || ""}`}>
                            {apt.status.replace("-", " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className={canSeeAppointments ? "" : "lg:col-span-3"}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest clinic updates</CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
              ) : recentActivities.map((activity) => {
                const Icon = activityIcons[activity.event_type] || Activity;
                return (
                  <div key={activity.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{activity.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {format(new Date(activity.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - filtered by role */}
      {quickActions.length > 0 && (
        <div className={`grid gap-3 sm:grid-cols-${quickActions.length}`}>
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <Card className="hover:border-secondary/50 hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <action.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
