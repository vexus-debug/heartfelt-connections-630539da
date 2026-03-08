import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useLdCases, useLdInvoices, useLdPayments, useLdClients, useLdStaff } from "@/hooks/useLabDashboard";
import { useLdCreditNotes } from "@/hooks/useLdCaseExtras";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, FileText, DollarSign, ClipboardList, Building2 } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { motion } from "framer-motion";

const fmt = (v: number) => `₦${v.toLocaleString()}`;

function exportCSV(rows: any[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

export default function LdReportsPage() {
  const { data: cases = [] } = useLdCases();
  const { data: invoices = [] } = useLdInvoices();
  const { data: payments = [] } = useLdPayments();
  const { data: clients = [] } = useLdClients();
  const { data: staff = [] } = useLdStaff();
  const { data: creditNotes = [] } = useLdCreditNotes();

  const [period, setPeriod] = useState("6");
  const months = Number(period);

  // Monthly revenue data
  const monthlyData = useMemo(() => {
    const now = new Date();
    const intervals = eachMonthOfInterval({ start: subMonths(now, months - 1), end: now });
    return intervals.map(month => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      const monthInvoices = invoices.filter((i: any) => {
        const d = new Date(i.invoice_date);
        return d >= start && d <= end;
      });
      const monthPayments = payments.filter((p: any) => {
        const d = new Date(p.payment_date);
        return d >= start && d <= end;
      });
      const monthCases = cases.filter((c: any) => {
        const d = new Date(c.created_at);
        return d >= start && d <= end;
      });

      return {
        month: format(month, "MMM yy"),
        billed: monthInvoices.reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0),
        collected: monthPayments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0),
        cases: monthCases.length,
      };
    });
  }, [invoices, payments, cases, months]);

  // Work type revenue breakdown
  const workTypeRevenue = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    cases.forEach((c: any) => {
      const name = c.work_type_name || "Unknown";
      if (!map[name]) map[name] = { count: 0, revenue: 0 };
      map[name].count++;
      map[name].revenue += Number(c.net_amount || 0);
    });
    return Object.entries(map).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.revenue - a.revenue);
  }, [cases]);

  // Client revenue breakdown
  const clientRevenue = useMemo(() => {
    return clients.map((client: any) => {
      const clientInvoices = invoices.filter((i: any) => i.client_id === client.id);
      const billed = clientInvoices.reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0);
      const paid = clientInvoices.reduce((s: number, i: any) => s + Number(i.amount_paid || 0), 0);
      return { name: client.clinic_name, billed, paid, balance: billed - paid };
    }).filter(c => c.billed > 0).sort((a, b) => b.billed - a.billed);
  }, [clients, invoices]);

  // Export handlers
  const exportCases = () => {
    const rows = cases.map((c: any) => ({
      "Case #": c.case_number, Patient: c.patient_name, "Work Type": c.work_type_name,
      Status: c.status, "Lab Fee": c.lab_fee, Discount: c.discount, "Net Amount": c.net_amount,
      "Due Date": c.due_date || "", "Received": c.received_date || "", "Completed": c.completed_date || "",
      Technician: c.technician?.full_name || "", Client: c.client?.clinic_name || "",
      Urgent: c.is_urgent ? "Yes" : "No", Paid: c.is_paid ? "Yes" : "No",
    }));
    exportCSV(rows, `lab-cases-${format(new Date(), "yyyy-MM-dd")}.csv`);
  };

  const exportInvoices = () => {
    const rows = invoices.map((i: any) => ({
      "Invoice #": i.invoice_number, Date: i.invoice_date, Patient: i.patient_name || "",
      Client: i.client?.clinic_name || "", Subtotal: i.subtotal, Discount: i.discount,
      Total: i.total_amount, Paid: i.amount_paid, Status: i.status,
    }));
    exportCSV(rows, `lab-invoices-${format(new Date(), "yyyy-MM-dd")}.csv`);
  };

  const exportPayments = () => {
    const rows = payments.map((p: any) => ({
      Date: p.payment_date, Invoice: p.invoice?.invoice_number || "", Amount: p.amount,
      Method: p.payment_method, Reference: p.reference || "", Remark: p.remark || "",
    }));
    exportCSV(rows, `lab-payments-${format(new Date(), "yyyy-MM-dd")}.csv`);
  };

  const totalBilled = invoices.reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0);
  const totalCollected = payments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
  const totalCreditsAmt = creditNotes.filter((cn: any) => cn.type === "credit").reduce((s: number, cn: any) => s + Number(cn.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Reports & Export" description="Generate reports and export data for accounting" />
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-[10px] text-muted-foreground uppercase">Total Billed</p>
          <p className="text-xl font-bold">{fmt(totalBilled)}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-[10px] text-muted-foreground uppercase">Total Collected</p>
          <p className="text-xl font-bold text-emerald-600">{fmt(totalCollected)}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-[10px] text-muted-foreground uppercase">Credits Issued</p>
          <p className="text-xl font-bold text-amber-600">{fmt(totalCreditsAmt)}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-[10px] text-muted-foreground uppercase">Total Cases</p>
          <p className="text-xl font-bold">{cases.length}</p>
        </CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="billed" stroke="hsl(var(--primary))" strokeWidth={2} name="Billed" />
                <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} name="Collected" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Cases per Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="cases" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Work Type */}
      {workTypeRevenue.length > 0 && (
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Revenue by Work Type</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Work Type</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Cases</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Avg/Case</th>
                </tr></thead>
                <tbody>
                  {workTypeRevenue.map(wt => (
                    <tr key={wt.name} className="border-b border-border/30">
                      <td className="p-3">{wt.name}</td>
                      <td className="p-3 text-right">{wt.count}</td>
                      <td className="p-3 text-right font-medium">{fmt(wt.revenue)}</td>
                      <td className="p-3 text-right text-muted-foreground">{fmt(wt.count > 0 ? Math.round(wt.revenue / wt.count) : 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Buttons */}
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Export Data</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" onClick={exportCases} className="h-auto py-4 flex-col gap-2">
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs">Export Cases</span>
              <span className="text-[10px] text-muted-foreground">{cases.length} records</span>
            </Button>
            <Button variant="outline" onClick={exportInvoices} className="h-auto py-4 flex-col gap-2">
              <FileText className="h-5 w-5" />
              <span className="text-xs">Export Invoices</span>
              <span className="text-[10px] text-muted-foreground">{invoices.length} records</span>
            </Button>
            <Button variant="outline" onClick={exportPayments} className="h-auto py-4 flex-col gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-xs">Export Payments</span>
              <span className="text-[10px] text-muted-foreground">{payments.length} records</span>
            </Button>
            <Button variant="outline" onClick={() => {
              const rows = clientRevenue.map(c => ({ Client: c.name, Billed: c.billed, Paid: c.paid, Balance: c.balance }));
              exportCSV(rows, `client-balances-${format(new Date(), "yyyy-MM-dd")}.csv`);
            }} className="h-auto py-4 flex-col gap-2">
              <Building2 className="h-5 w-5" />
              <span className="text-xs">Export Client Balances</span>
              <span className="text-[10px] text-muted-foreground">{clientRevenue.length} clients</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
