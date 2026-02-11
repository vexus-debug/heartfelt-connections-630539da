import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, TrendingUp, AlertCircle, Loader2, Receipt, CalendarRange } from "lucide-react";
import { CreateInvoiceDialog } from "@/components/dashboard/CreateInvoiceDialog";
import { InvoiceDetailDialog } from "@/components/dashboard/InvoiceDetailDialog";
import { GenerateClientInvoiceDialog } from "@/components/dashboard/GenerateClientInvoiceDialog";
import { useInvoices, useBillingStats, type InvoiceWithPatient } from "@/hooks/useInvoices";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { motion } from "framer-motion";

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  pending: "bg-red-500/10 text-red-700 dark:text-red-400",
  partial: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

const statusDots: Record<string, string> = {
  paid: "bg-emerald-500",
  pending: "bg-red-500",
  partial: "bg-amber-500",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function BillingPage() {
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithPatient | null>(null);
  const { data: invoices = [], isLoading } = useInvoices();
  const { data: stats } = useBillingStats();

  const billingCards = [
    {
      label: "Collected Today",
      value: stats?.collectedToday ?? 0,
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      formatter: formatCurrency,
    },
    {
      label: "Outstanding Balance",
      value: stats?.totalOutstanding ?? 0,
      icon: CreditCard,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      formatter: formatCurrency,
    },
    {
      label: "Overdue Invoices",
      value: stats?.overdueCount ?? 0,
      icon: AlertCircle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Payments" description="Manage invoices and track payments">
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => setStatementOpen(true)}>
            <CalendarRange className="mr-2 h-4 w-4" />
            Client Statement
          </Button>
          <Button size="sm" className="bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" onClick={() => setInvoiceOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </PageHeader>

      {/* Billing Stats */}
      <motion.div className="grid gap-4 sm:grid-cols-3" variants={stagger.container} initial="hidden" animate="visible">
        {billingCards.map((card, i) => (
          <motion.div key={i} variants={stagger.item}>
            <Card className="stat-card glass-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                  <p className="text-xl font-bold tracking-tight">
                    <AnimatedCounter value={card.value} formatter={card.formatter} />
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Invoices */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="text-base">Recent Invoices</CardTitle>
            <CardDescription>Click an invoice to view details</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <TableSkeleton columns={6} rows={6} />
            ) : invoices.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="No invoices yet"
                description="Create your first invoice to start tracking payments."
                actionLabel="Create Invoice"
                onAction={() => setInvoiceOpen(true)}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20">
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Invoice</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Patient</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Paid</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv, i) => (
                      <motion.tr
                        key={inv.id}
                        className="border-b border-border/30 last:border-0 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
                        onClick={() => setSelectedInvoice(inv)}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                      >
                        <td className="py-3 px-4 font-mono text-xs text-secondary font-medium">{inv.invoice_number}</td>
                        <td className="py-3 px-4 font-medium group-hover:text-secondary transition-colors">{inv.patient_name}</td>
                        <td className="py-3 px-4 hidden md:table-cell text-muted-foreground font-mono text-xs">{inv.invoice_date}</td>
                        <td className="py-3 px-4 font-semibold">{formatCurrency(inv.total_amount)}</td>
                        <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{formatCurrency(inv.amount_paid)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[inv.status] || ""}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusDots[inv.status] || ""}`} />
                            {inv.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <CreateInvoiceDialog open={invoiceOpen} onOpenChange={setInvoiceOpen} />
      <InvoiceDetailDialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)} invoice={selectedInvoice} />
      <GenerateClientInvoiceDialog open={statementOpen} onOpenChange={setStatementOpen} />
    </div>
  );
}