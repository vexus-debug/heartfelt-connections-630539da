import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BillingTabProps {
  invoices: any[];
}

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-red-100 text-red-700",
  partial: "bg-amber-100 text-amber-700",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function BillingTab({ invoices }: BillingTabProps) {
  const totalBilled = invoices.reduce((sum, inv: any) => sum + Number(inv.total_amount), 0);
  const totalPaid = invoices.reduce((sum, inv: any) => sum + Number(inv.amount_paid), 0);
  const outstanding = totalBilled - totalPaid;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-xs text-muted-foreground">Total Billed</p>
            <p className="text-lg font-bold">{formatCurrency(totalBilled)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-xs text-muted-foreground">Total Paid</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-xs text-muted-foreground">Outstanding</p>
            <p className={`text-lg font-bold ${outstanding > 0 ? "text-destructive" : ""}`}>{formatCurrency(outstanding)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No invoices found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Invoice</th>
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Date</th>
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Paid</th>
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Discount</th>
                  <th className="py-2 px-4 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-2 px-4 font-mono text-xs">{inv.invoice_number}</td>
                    <td className="py-2 px-4 text-muted-foreground">{inv.invoice_date}</td>
                    <td className="py-2 px-4 font-medium">{formatCurrency(Number(inv.total_amount))}</td>
                    <td className="py-2 px-4 text-muted-foreground">{formatCurrency(Number(inv.amount_paid))}</td>
                    <td className="py-2 px-4 text-muted-foreground">{inv.discount_percent > 0 ? `${inv.discount_percent}%` : "—"}</td>
                    <td className="py-2 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[inv.status] || ""}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
