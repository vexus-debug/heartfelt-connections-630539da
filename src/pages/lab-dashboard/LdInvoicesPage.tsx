import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useLdInvoices, useCreateLdInvoice, useUpdateLdInvoice, useLdCases, useLdClients } from "@/hooks/useLabDashboard";
import { format } from "date-fns";

const statusColor: Record<string, string> = {
  unpaid: "bg-red-100 text-red-800",
  partial: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
};

export default function LdInvoicesPage() {
  const { data: invoices = [], isLoading } = useLdInvoices();
  const { data: cases = [] } = useLdCases();
  const { data: clients = [] } = useLdClients();
  const createInvoice = useCreateLdInvoice();
  const updateInvoice = useUpdateLdInvoice();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

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

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search invoices..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-border/50">
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
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !filtered.length ? (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No invoices found</td></tr>
                ) : filtered.map((i: any) => (
                  <tr key={i.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-mono text-xs">{i.invoice_number}</td>
                    <td className="p-3">{i.patient_name || "—"}</td>
                    <td className="p-3 text-xs">{i.case?.case_number || "—"}</td>
                    <td className="p-3 text-xs">{i.client?.clinic_name || "—"}</td>
                    <td className="p-3 text-xs">{format(new Date(i.invoice_date), "MMM d, yyyy")}</td>
                    <td className="p-3 text-right font-medium">₦{Number(i.total_amount).toLocaleString()}</td>
                    <td className="p-3 text-right">₦{Number(i.amount_paid).toLocaleString()}</td>
                    <td className="p-3">
                      <Badge className={`text-[10px] ${statusColor[i.status] || "bg-muted text-muted-foreground"}`}>{i.status}</Badge>
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
