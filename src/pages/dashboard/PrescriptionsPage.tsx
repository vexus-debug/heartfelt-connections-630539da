import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Printer } from "lucide-react";

const prescriptions = [
  { id: "RX-001", patient: "Chinedu Obi", dentist: "Dr. Okonkwo", date: "2026-02-10", medications: [{ name: "Amoxicillin 500mg", dosage: "1 cap 3x daily", duration: "7 days" }, { name: "Ibuprofen 400mg", dosage: "1 tab 2x daily after meals", duration: "5 days" }] },
  { id: "RX-002", patient: "Adewale Johnson", dentist: "Dr. Okonkwo", date: "2026-02-10", medications: [{ name: "Metronidazole 400mg", dosage: "1 tab 3x daily", duration: "5 days" }] },
  { id: "RX-003", patient: "Fatima Bello", dentist: "Dr. Adeyemi", date: "2026-02-09", medications: [{ name: "Chlorhexidine Mouthwash", dosage: "Rinse 2x daily", duration: "14 days" }] },
  { id: "RX-004", patient: "Ngozi Eze", dentist: "Dr. Nwosu", date: "2026-02-08", medications: [{ name: "Amoxicillin 500mg", dosage: "1 cap 3x daily", duration: "7 days" }, { name: "Paracetamol 500mg", dosage: "1-2 tabs as needed", duration: "3 days" }] },
];

export default function PrescriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Prescriptions</h1>
          <p className="text-sm text-muted-foreground">Digital prescriptions and medication records</p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Prescription
        </Button>
      </div>

      <div className="space-y-4">
        {prescriptions.map((rx) => (
          <Card key={rx.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">{rx.patient}</CardTitle>
                  <CardDescription>{rx.dentist} · {rx.date}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{rx.id}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Printer className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rx.medications.map((med, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
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
    </div>
  );
}
