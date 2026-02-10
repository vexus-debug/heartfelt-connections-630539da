import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { patients } from "@/data/mockDashboardData";

const invoices = [
  { id: "INV-2026-042", patient: "Adewale Johnson", treatment: "Root Canal", amount: 80000, paid: 80000, date: "2026-02-10", status: "paid" },
  { id: "INV-2026-041", patient: "Chinedu Obi", treatment: "Dental Filling", amount: 25000, paid: 0, date: "2026-02-10", status: "pending" },
  { id: "INV-2026-040", patient: "Ngozi Eze", treatment: "Crown Placement", amount: 80000, paid: 35000, date: "2026-02-09", status: "partial" },
  { id: "INV-2026-039", patient: "Blessing Nnamdi", treatment: "Teeth Whitening", amount: 50000, paid: 50000, date: "2026-02-08", status: "paid" },
  { id: "INV-2026-038", patient: "Fatima Bello", treatment: "Scaling & Polishing", amount: 15000, paid: 0, date: "2026-02-07", status: "pending" },
  { id: "INV-2026-037", patient: "Ibrahim Musa", treatment: "Complete Denture", amount: 150000, paid: 30000, date: "2026-02-05", status: "partial" },
];

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-red-100 text-red-700",
  partial: "bg-amber-100 text-amber-700",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export default function BillingPage() {
  const totalOutstanding = patients.reduce((sum, p) => sum + p.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Billing & Payments</h1>
          <p className="text-sm text-muted-foreground">Manage invoices and track payments</p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90">
          <FileText className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Billing Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Collected Today</p>
              <p className="text-xl font-bold">{formatCurrency(130000)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Outstanding Balance</p>
              <p className="text-xl font-bold">{formatCurrency(totalOutstanding)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overdue Invoices</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Invoices</CardTitle>
          <CardDescription>Latest billing activity</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Invoice</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Patient</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Treatment</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Paid</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20 cursor-pointer">
                    <td className="py-2.5 px-4 font-mono text-xs">{inv.id}</td>
                    <td className="py-2.5 px-4 font-medium">{inv.patient}</td>
                    <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{inv.treatment}</td>
                    <td className="py-2.5 px-4 font-medium">{formatCurrency(inv.amount)}</td>
                    <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{formatCurrency(inv.paid)}</td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
