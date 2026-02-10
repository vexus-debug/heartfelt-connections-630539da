import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Printer, CreditCard } from "lucide-react";

interface Invoice {
  id: string;
  patient: string;
  treatment: string;
  amount: number;
  paid: number;
  date: string;
  status: string;
}

interface InvoiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

const mockLineItems = [
  { description: "Consultation", qty: 1, unitPrice: 5000 },
  { description: "X-Ray (Periapical)", qty: 2, unitPrice: 3000 },
];

const mockPaymentHistory = [
  { date: "2026-02-05", amount: 35000, method: "Bank Transfer", ref: "TXN-8834" },
];

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function InvoiceDetailDialog({ open, onOpenChange, invoice }: InvoiceDetailDialogProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("cash");

  if (!invoice) return null;

  const balance = invoice.amount - invoice.paid;
  const treatmentPrice = invoice.amount - mockLineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  const statusStyles: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700",
    pending: "bg-red-100 text-red-700",
    partial: "bg-amber-100 text-amber-700",
  };

  const handleRecordPayment = () => {
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0 || amount > balance) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    toast({ title: "Payment recorded", description: `${formatCurrency(amount)} via ${payMethod}` });
    setShowPayment(false);
    setPayAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice {invoice.id}</DialogTitle>
            <Badge className={statusStyles[invoice.status]}>{invoice.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Header info */}
          <div className="grid grid-cols-2 gap-3 text-muted-foreground">
            <div><span className="font-medium text-foreground">Patient:</span> {invoice.patient}</div>
            <div><span className="font-medium text-foreground">Date:</span> {invoice.date}</div>
          </div>

          <Separator />

          {/* Line items */}
          <div>
            <h4 className="font-semibold mb-2">Line Items</h4>
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
                {mockLineItems.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-1.5">{item.description}</td>
                    <td className="text-center py-1.5">{item.qty}</td>
                    <td className="text-right py-1.5">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-1.5">{formatCurrency(item.qty * item.unitPrice)}</td>
                  </tr>
                ))}
                <tr className="border-b">
                  <td className="py-1.5">{invoice.treatment}</td>
                  <td className="text-center py-1.5">1</td>
                  <td className="text-right py-1.5">{formatCurrency(treatmentPrice)}</td>
                  <td className="text-right py-1.5">{formatCurrency(treatmentPrice)}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between mt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(invoice.amount)}</span>
            </div>
          </div>

          <Separator />

          {/* Payment history */}
          <div>
            <h4 className="font-semibold mb-2">Payment History</h4>
            {invoice.paid > 0 ? (
              <div className="space-y-1.5">
                {mockPaymentHistory.map((p, i) => (
                  <div key={i} className="flex justify-between text-xs bg-muted/30 rounded p-2">
                    <span>{p.date} · {p.method}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(p.amount)}</span>
                  </div>
                ))}
                {invoice.paid > mockPaymentHistory.reduce((s, p) => s + p.amount, 0) && (
                  <div className="flex justify-between text-xs bg-muted/30 rounded p-2">
                    <span>{invoice.date} · Cash</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(invoice.paid - mockPaymentHistory.reduce((s, p) => s + p.amount, 0))}</span>
                  </div>
                )}
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
                <Button size="sm" onClick={handleRecordPayment} className="bg-secondary hover:bg-secondary/90">Confirm Payment</Button>
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
