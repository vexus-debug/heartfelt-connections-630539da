import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Printer, CreditCard, Loader2 } from "lucide-react";
import { useInvoiceItems } from "@/hooks/useInvoices";
import { usePayments, useRecordPayment } from "@/hooks/usePayments";
import type { InvoiceWithPatient } from "@/hooks/useInvoices";

interface InvoiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceWithPatient | null;
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function InvoiceDetailDialog({ open, onOpenChange, invoice }: InvoiceDetailDialogProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("cash");

  const { data: lineItems = [], isLoading: itemsLoading } = useInvoiceItems(invoice?.id ?? null);
  const { data: payments = [], isLoading: paymentsLoading } = usePayments(invoice?.id ?? null);
  const recordPayment = useRecordPayment();

  if (!invoice) return null;

  const balance = invoice.total_amount - invoice.amount_paid;

  const statusStyles: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700",
    pending: "bg-red-100 text-red-700",
    partial: "bg-amber-100 text-amber-700",
  };

  const handleRecordPayment = async () => {
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0 || amount > balance) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    try {
      await recordPayment.mutateAsync({
        invoice_id: invoice.id,
        amount,
        payment_method: payMethod,
      });
      toast({ title: "Payment recorded", description: `${formatCurrency(amount)} via ${payMethod}` });
      setShowPayment(false);
      setPayAmount("");
    } catch (err: any) {
      toast({ title: "Error recording payment", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice {invoice.invoice_number}</DialogTitle>
            <Badge className={statusStyles[invoice.status]}>{invoice.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3 text-muted-foreground">
            <div><span className="font-medium text-foreground">Patient:</span> {invoice.patient_name}</div>
            <div><span className="font-medium text-foreground">Date:</span> {invoice.invoice_date}</div>
          </div>

          <Separator />

          {/* Line items */}
          <div>
            <h4 className="font-semibold mb-2">Line Items</h4>
            {itemsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Description</th>
                    <th className="text-center py-1.5 text-muted-foreground font-medium w-12">Qty</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Price</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-1.5">{item.description}</td>
                      <td className="text-center py-1.5">{item.quantity}</td>
                      <td className="text-right py-1.5">{formatCurrency(item.unit_price)}</td>
                      <td className="text-right py-1.5">{formatCurrency(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {invoice.discount_percent > 0 && (
              <div className="flex justify-between mt-2 text-xs text-destructive">
                <span>Discount ({invoice.discount_percent}%)</span>
                <span>Applied</span>
              </div>
            )}
            <div className="flex justify-between mt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>

          <Separator />

          {/* Payment history */}
          <div>
            <h4 className="font-semibold mb-2">Payment History</h4>
            {paymentsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : payments.length > 0 ? (
              <div className="space-y-1.5">
                {payments.map((p) => (
                  <div key={p.id} className="flex justify-between text-xs bg-muted/30 rounded p-2">
                    <span>{p.payment_date} · {p.payment_method}{p.reference ? ` · ${p.reference}` : ""}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(p.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No payments recorded yet.</p>
            )}
            <div className="flex justify-between mt-2 font-semibold">
              <span>Balance Due</span>
              <span className={balance > 0 ? "text-red-600" : "text-emerald-600"}>{formatCurrency(balance)}</span>
            </div>
          </div>

          {/* Record payment form */}
          {showPayment && balance > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Record Payment</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Amount</Label>
                    <Input type="number" placeholder={`Max ${formatCurrency(balance)}`} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Method</Label>
                    <Select value={payMethod} onValueChange={setPayMethod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="transfer">Bank Transfer</SelectItem>
                        <SelectItem value="pos">POS</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button size="sm" onClick={handleRecordPayment} className="bg-secondary hover:bg-secondary/90" disabled={recordPayment.isPending}>
                  {recordPayment.isPending ? "Recording..." : "Confirm Payment"}
                </Button>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Print preview opened" })}>
            <Printer className="mr-1.5 h-3.5 w-3.5" />Print
          </Button>
          {balance > 0 && (
            <Button size="sm" onClick={() => setShowPayment(!showPayment)} className="bg-secondary hover:bg-secondary/90">
              <CreditCard className="mr-1.5 h-3.5 w-3.5" />Record Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
