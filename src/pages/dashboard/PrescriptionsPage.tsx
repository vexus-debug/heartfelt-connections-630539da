import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Printer } from "lucide-react";
import { CreatePrescriptionDialog } from "@/components/dashboard/CreatePrescriptionDialog";
import { usePrescriptions } from "@/hooks/usePrescriptions";

export default function PrescriptionsPage() {
  const [rxOpen, setRxOpen] = useState(false);
  const { data: prescriptions = [], isLoading } = usePrescriptions();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Prescriptions</h1>
          <p className="text-sm text-muted-foreground">Digital prescriptions and medication records</p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => setRxOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Prescription
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-10">Loading prescriptions...</p>
      ) : prescriptions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No prescriptions yet. Create one to get started.</p>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <Card key={rx.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">
                      {rx.patients ? `${rx.patients.first_name} ${rx.patients.last_name}` : "Unknown"}
                    </CardTitle>
                    <CardDescription>
                      {rx.staff?.full_name || "Unknown"} · {rx.prescription_date}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Printer className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rx.prescription_medications.map((med, i) => (
                    <div key={med.id} className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                      <span className="h-5 w-5 rounded-full bg-secondary/20 text-secondary text-[10px] flex items-center justify-center font-medium shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.dosage} · {med.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <CreatePrescriptionDialog open={rxOpen} onOpenChange={setRxOpen} />
    </div>
  );
}
