import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PrescriptionTabProps {
  prescriptions: any[];
}

export function PrescriptionTab({ prescriptions }: PrescriptionTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Prescriptions</h3>
      {prescriptions.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No prescriptions found.</CardContent></Card>
      ) : (
        prescriptions.map((rx: any) => (
          <Card key={rx.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{(rx.staff as any)?.full_name || "Unknown"}</CardTitle>
              <CardDescription>{rx.prescription_date}{rx.diagnosis ? ` · ${rx.diagnosis}` : ""}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(rx.prescription_medications || []).map((med: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                    <span className="h-5 w-5 rounded-full bg-secondary/20 text-secondary text-[10px] flex items-center justify-center font-medium shrink-0">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.dosage} · {med.frequency} · {med.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              {rx.notes && <p className="text-xs text-muted-foreground mt-3 border-t pt-2">{rx.notes}</p>}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
