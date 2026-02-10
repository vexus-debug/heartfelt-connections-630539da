import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useRevenueTrend, useTreatmentDistribution, useWeeklyAppointmentTrends, useDentistPerformance } from "@/hooks/useReportsData";
import { CalendarIcon, Download } from "lucide-react";
import { format, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

const COLORS = ["hsl(174, 60%, 40%)", "hsl(220, 60%, 20%)", "hsl(174, 50%, 50%)", "hsl(220, 50%, 30%)", "hsl(165, 40%, 50%)", "hsl(210, 30%, 60%)"];

function formatCurrency(amount: number) {
  return `₦${(amount / 1000000).toFixed(1)}M`;
}

function downloadCSV(data: Record<string, any>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(","), ...data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState<Date>(subMonths(new Date(), 5));
  const [dateTo, setDateTo] = useState<Date>(new Date());

  const { data: revenueData = [] } = useRevenueTrend();
  const { data: treatmentDist = [] } = useTreatmentDistribution();
  const { data: weeklyData = [] } = useWeeklyAppointmentTrends();
  const { data: dentistData = [] } = useDentistPerformance();

  const maxAppts = dentistData.length ? Math.max(...dentistData.map((d) => d.appointments)) : 1;

  // Filter revenue data by date range
  const filteredRevenue = revenueData.filter((_, i) => {
    const monthDate = subMonths(new Date(), revenueData.length - 1 - i);
    return monthDate >= dateFrom && monthDate <= dateTo;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground">Clinic performance and insights</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                {format(dateFrom, "MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={(d) => d && setDateFrom(d)} initialFocus />
            </PopoverContent>
          </Popover>
          <span className="text-xs text-muted-foreground">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                {format(dateTo, "MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={(d) => d && setDateTo(d)} initialFocus />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => downloadCSV(revenueData.map((r) => ({ Month: r.month, Revenue: r.revenue })), "revenue-report.csv")}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={filteredRevenue.length ? filteredRevenue : revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={formatCurrency} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Treatment Distribution</CardTitle>
            <CardDescription>Most common procedures</CardDescription>
          </CardHeader>
          <CardContent>
            {treatmentDist.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">No treatment data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={treatmentDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {treatmentDist.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Appointment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Dentist Performance</CardTitle>
                <CardDescription>Appointments this month</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => downloadCSV(dentistData.map((d) => ({ Dentist: d.name, Appointments: d.appointments, Revenue: d.revenue })), "dentist-performance.csv")}>
                <Download className="mr-1 h-3 w-3" />CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {dentistData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
            ) : (
              <div className="space-y-4">
                {dentistData.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.appointments} appointments</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₦{(doc.revenue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${(doc.appointments / maxAppts) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
