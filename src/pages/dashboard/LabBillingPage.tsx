import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { useLabCases, useUpdateLabCase } from "@/hooks/useLabCases";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LabBillingPage() {
  const { data: cases = [], isLoading } = useLabCases();
  const updateCase = useUpdateLabCase();

  const billableCases = cases.filter((c) => Number(c.lab_fee) > 0);
  const totalFees = billableCases.reduce(
    (sum, c) => sum + Number(c.lab_fee),
    0
  );
  const paidFees = billableCases
    .filter((c) => c.is_paid)
    .reduce((sum, c) => sum + Number(c.lab_fee), 0);

  const togglePaid = (id: string, currentPaid: boolean) => {
    updateCase.mutate({ id, is_paid: !currentPaid });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lab Billing</h1>
        <p className="text-sm text-muted-foreground">
          Track lab fees and payment status
        </p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-xl font-bold">
                ₦{totalFees.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Fees</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-8 w-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-xl font-bold text-emerald-600">
                ₦{paidFees.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-8 w-8 text-destructive shrink-0" />
            <div>
              <p className="text-xl font-bold text-destructive">
                ₦{(totalFees - paidFees).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Outstanding</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All Billable Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {billableCases.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No billable lab cases yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case #</TableHead>
                    <TableHead>Work Type</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billableCases.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-xs font-mono">
                        {c.case_number}
                      </TableCell>
                      <TableCell className="text-sm">{c.work_type}</TableCell>
                      <TableCell className="text-sm">
                        {c.patients
                          ? `${c.patients.first_name} ${c.patients.last_name}`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        ₦{Number(c.lab_fee).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] capitalize"
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={c.is_paid ? "default" : "destructive"}
                          className="text-[10px]"
                        >
                          {c.is_paid ? "Paid" : "Unpaid"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={c.is_paid ? "outline" : "default"}
                          className="text-xs h-7"
                          onClick={() => togglePaid(c.id, c.is_paid)}
                          disabled={updateCase.isPending}
                        >
                          {c.is_paid ? "Mark Unpaid" : "Mark Paid"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
