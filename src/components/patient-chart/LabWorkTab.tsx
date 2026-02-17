import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePatientLabCases } from "@/hooks/usePatientLabCases";
import { MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LabWorkTabProps {
  patientId: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  "in-progress": "bg-blue-100 text-blue-700",
  ready: "bg-emerald-100 text-emerald-700",
  delivered: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function LabWorkTab({ patientId }: LabWorkTabProps) {
  const { data: labCases = [], isLoading } = usePatientLabCases(patientId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground py-6 text-center">Loading lab cases...</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Lab Work ({labCases.length} cases)</h3>

      {labCases.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No lab work found for this patient.</CardContent></Card>
      ) : (
        labCases.map((lc: any) => (
          <Card key={lc.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm flex items-center gap-2">
                    {lc.case_number}
                    {lc.is_urgent && <Badge variant="destructive" className="text-[10px]">Urgent</Badge>}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{lc.work_type} · {(lc.dentist as any)?.full_name || "N/A"}</p>
                </div>
                <Badge className={statusColors[lc.status] || ""}>{lc.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Sent: </span>{lc.sent_date || "—"}</div>
                <div><span className="text-muted-foreground">Due: </span>{lc.due_date || "—"}</div>
                <div><span className="text-muted-foreground">Completed: </span>{lc.completed_date || "—"}</div>
                <div><span className="text-muted-foreground">Delivered: </span>{lc.delivered_date || "—"}</div>
                {lc.tooth_number && <div><span className="text-muted-foreground">Tooth: </span>#{lc.tooth_number}</div>}
                {lc.shade && <div><span className="text-muted-foreground">Shade: </span>{lc.shade}</div>}
              </div>
              {lc.instructions && <p className="text-xs text-muted-foreground border-t pt-2">{lc.instructions}</p>}
              <div className="flex items-center justify-between border-t pt-2">
                <div className="text-xs">
                  <span className="text-muted-foreground">Fee: </span>
                  <span className="font-medium">{formatCurrency(Number(lc.lab_fee))}</span>
                  {lc.is_paid ? (
                    <Badge variant="outline" className="ml-2 text-[10px] text-emerald-600 border-emerald-300">Paid</Badge>
                  ) : (
                    <Badge variant="outline" className="ml-2 text-[10px] text-amber-600 border-amber-300">Unpaid</Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" title="Send via WhatsApp" asChild>
                    <a href={`https://wa.me/?text=Lab%20Order%20${lc.case_number}%20-%20${lc.work_type}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                    </a>
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" title="Send via Email" asChild>
                    <a href={`mailto:?subject=Lab%20Order%20${lc.case_number}&body=Work%20Type:%20${lc.work_type}`}>
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
