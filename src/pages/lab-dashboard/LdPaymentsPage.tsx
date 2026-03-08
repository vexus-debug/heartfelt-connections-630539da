import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useLdPayments, useCreateLdPayment, useLdInvoices } from "@/hooks/useLabDashboard";
import { format } from "date-fns";

export default function LdPaymentsPage() {
  const { data: payments = [], isLoading } = useLdPayments();
  const { data: invoices = [] } = useLdInvoices();
  const createPayment = useCreateLdPayment();
  const [dialogOpen, setDialogOpen] = useState(false);

  const unpaidInvoices = invoices.filter((i: any) => i.status !== "paid");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      invoice_id: fd.get("invoice_id") as string,
      amount: Number(fd.get("amount") || 0),
      payment_method: fd.get("payment_method") as string,
      reference: fd.get("reference") as string,
    };
    createPayment.mutate(values, { onSuccess: () => setDialogOpen(false) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">Payment tracking for lab invoices</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Record Payment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label>Invoice *</Label>
                <select name="invoice_id" required className="w-full border rounded-md p-2 text-sm bg-background">
                  <option value="">Select invoice...</option>
                  {unpaidInvoices.map((i: any) => (
                    <option key={i.id} value={i.id}>{i.invoice_number} — ₦{Number(i.total_amount - i.amount_paid).toLocaleString()} outstanding</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Amount (₦) *</Label><Input name="amount" type="number" step="0.01" required /></div>
                <div>
                  <Label>Method</Label>
                  <select name="payment_method" className="w-full border rounded-md p-2 text-sm bg-background">
                    <option value="cash">Cash</option>
                    <option value="transfer">Transfer</option>
                    <option value="card">Card</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>
              <div><Label>Reference</Label><Input name="reference" /></div>
              <Button type="submit" className="w-full" disabled={createPayment.isPending}>Record Payment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Invoice</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Method</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Reference</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !payments.length ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No payments recorded</td></tr>
                ) : payments.map((p: any) => (
                  <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-mono text-xs">{p.invoice?.invoice_number || "—"}</td>
                    <td className="p-3 text-xs">{format(new Date(p.payment_date), "MMM d, yyyy")}</td>
                    <td className="p-3 text-right font-medium">₦{Number(p.amount).toLocaleString()}</td>
                    <td className="p-3 capitalize">{p.payment_method}</td>
                    <td className="p-3 text-xs">{p.reference || "—"}</td>
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
