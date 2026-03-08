import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, DollarSign, TrendingUp, AlertCircle, MessageCircle } from "lucide-react";
import { useLdInvoices, useCreateLdInvoice, useUpdateLdInvoice, useLdCases, useLdClients, useLdSettings } from "@/hooks/useLabDashboard";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { format } from "date-fns";

const statusColor: Record<string, string> = {
  unpaid: "bg-red-500/10 text-red-700 dark:text-red-400",
  partial: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

const fmt = (v: number) => `₦${v.toLocaleString()}`;

function buildWhatsAppMessage(inv: any, labPhone?: string, labName?: string) {
  const lines = [
    `🏥 *${labName || "Vista Dental Lab"}*`,
    `📄 *Invoice: ${inv.invoice_number}*`,
    ``,
    `🦷 Patient: ${inv.patient_name || "—"}`,
    `📅 Date: ${inv.invoice_date}`,
    ``,
    `💰 Subtotal: ${fmt(Number(inv.subtotal))}`,
    inv.discount > 0 ? `🏷️ Discount: ${fmt(Number(inv.discount))}` : null,
    `✅ Total: ${fmt(Number(inv.total_amount))}`,
    `💵 Paid: ${fmt(Number(inv.amount_paid))}`,
    `⚠️ Outstanding: ${fmt(Number(inv.total_amount) - Number(inv.amount_paid))}`,
    ``,
    `Status: ${inv.status.toUpperCase()}`,
    inv.notes ? `📝 Notes: ${inv.notes}` : null,
  ].filter(Boolean).join("\n");
  const encoded = encodeURIComponent(lines);
  const phone = labPhone ? labPhone.replace(/\D/g, "") : "";
  return phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

export default function LdInvoicesPage() {
  const { data: invoices = [], isLoading } = useLdInvoices();
  const { data: cases = [] } = useLdCases();
  const { data: clients = [] } = useLdClients();
  const { data: settings } = useLdSettings();
  const createInvoice = useCreateLdInvoice();
  const updateInvoice = useUpdateLdInvoice();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalRevenue = invoices.reduce((s: number, i: any) => s + Number(i.total_amount), 0);
  const totalPaid = invoices.reduce((s: number, i: any) => s + Number(i.amount_paid), 0);
  const totalOutstanding = Math.max(totalRevenue - totalPaid, 0);
  const unpaidCount = invoices.filter((i: any) => i.status !== "paid").length;

  const filtered = invoices.filter((i: any) =>
    !search || i.invoice_number?.toLowerCase().includes(search.toLowerCase()) || i.patient_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      case_id: fd.get("case_id") || null,
      client_id: fd.get("client_id") || null,
      patient_name: fd.get("patient_name") as string,
      subtotal: Number(fd.get("subtotal") || 0),
      discount: Number(fd.get("discount") || 0),
      total_amount: Number(fd.get("subtotal") || 0) - Number(fd.get("discount") || 0),
      notes: fd.get("notes") as string,
    };
    createInvoice.mutate(values, { onSuccess: () => setDialogOpen(false) });
  };

  const togglePaid = (inv: any) => {
    const newStatus = inv.status === "paid" ? "unpaid" : "paid";
    const newPaid = newStatus === "paid" ? Number(inv.total_amount) : 0;
    updateInvoice.mutate({ id: inv.id, status: newStatus, amount_paid: newPaid });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground">Lab billing and invoices</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Create Invoice</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Patient Name</Label><Input name="patient_name" /></div>
                <div>
                  <Label>Case</Label>
                  <select name="case_id" className="w-full border rounded-md p-2 text-sm bg-background">
                    <option value="">None</option>
                    {cases.map((c: any) => <option key={c.id} value={c.id}>{c.case_number} - {c.patient_name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Client</Label>
                  <select name="client_id" className="w-full border rounded-md p-2 text-sm bg-background">
                    <option value="">None</option>
                    {clients.map((c: any) => <option key={c.id} value={c.id}>{c.clinic_name}</option>)}
                  </select>
                </div>
                <div><Label>Subtotal (₦)</Label><Input name="subtotal" type="number" step="0.01" /></div>
                <div><Label>Discount (₦)</Label><Input name="discount" type="number" step="0.01" defaultValue={0} /></div>
                <div className="col-span-2"><Label>Notes</Label><Input name="notes" /></div>
              </div>
              <Button type="submit" className="w-full" disabled={createInvoice.isPending}>Create Invoice</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Total Revenue", value: totalRevenue, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
          { label: "Paid", value: totalPaid, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Outstanding", value: totalOutstanding, icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Unpaid Invoices", value: unpaidCount, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-500/10", noFmt: true },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {s.noFmt ? <AnimatedCounter value={s.value} /> : fmt(s.value)}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search invoices..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="border-b border-border/30">
          <CardTitle className="text-base">Lab Invoices</CardTitle>
          <CardDescription>All lab invoices with payment tracking</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Case</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Paid</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Balance</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !filtered.length ? (
                  <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">No invoices found</td></tr>
                ) : filtered.map((i: any) => {
                  const balance = Number(i.total_amount) - Number(i.amount_paid);
                  return (
                    <tr key={i.id} className="border-b border-border/30 hover:bg-muted/20">
                      <td className="p-3 font-mono text-xs text-secondary">{i.invoice_number}</td>
                      <td className="p-3">{i.patient_name || "—"}</td>
                      <td className="p-3 text-xs">{i.case?.case_number || "—"}</td>
                      <td className="p-3 text-xs">{i.client?.clinic_name || "—"}</td>
                      <td className="p-3 text-xs">{format(new Date(i.invoice_date), "MMM d, yyyy")}</td>
                      <td className="p-3 text-right font-medium">{fmt(Number(i.total_amount))}</td>
                      <td className="p-3 text-right">{fmt(Number(i.amount_paid))}</td>
                      <td className="p-3 text-right font-semibold">
                        <span className={balance > 0 ? "text-destructive" : "text-emerald-600"}>{fmt(balance)}</span>
                      </td>
                      <td className="p-3">
                        <Badge className={`text-[10px] ${statusColor[i.status] || "bg-muted text-muted-foreground"}`}>{i.status}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant={i.status === "paid" ? "outline" : "default"}
                            className="text-xs h-7"
                            onClick={() => togglePaid(i)}
                            disabled={updateInvoice.isPending}
                          >
                            {i.status === "paid" ? "Mark Unpaid" : "Mark Paid"}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" title="Send via WhatsApp" asChild>
                            <a href={buildWhatsAppMessage(i, settings?.phone, settings?.lab_name)} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                            </a>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
