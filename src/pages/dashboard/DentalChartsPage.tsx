import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePatients } from "@/hooks/usePatients";
import { useDentalChartEntries } from "@/hooks/useDentalCharts";
import { AddProcedureDialog } from "@/components/dashboard/AddProcedureDialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { motion } from "framer-motion";

const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

type ToothStatus = "healthy" | "cavity" | "filling" | "crown" | "extraction" | "planned";

const toothStatusColors: Record<ToothStatus, string> = {
  healthy: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-900 dark:text-emerald-300 border-emerald-500/30",
  cavity: "bg-red-500/20 hover:bg-red-500/30 text-red-900 dark:text-red-300 border-red-500/30",
  filling: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-900 dark:text-blue-300 border-blue-500/30",
  crown: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-300 border-amber-500/30",
  extraction: "bg-muted hover:bg-muted/80 text-muted-foreground line-through border-border/50",
  planned: "bg-violet-500/20 hover:bg-violet-500/30 text-violet-900 dark:text-violet-300 border-violet-500/30",
};

export default function DentalChartsPage() {
  const { data: patients = [] } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [procedureOpen, setProcedureOpen] = useState(false);

  const patientId = selectedPatientId || patients[0]?.id;
  const { data: entries = [] } = useDentalChartEntries(patientId);

  const toothData: Record<number, { status: ToothStatus; notes: string; history: { date: string; procedure: string; dentist: string }[] }> = {};
  entries.forEach((e: any) => {
    if (!toothData[e.tooth_number]) {
      toothData[e.tooth_number] = { status: e.status as ToothStatus, notes: e.notes || "", history: [] };
    }
    toothData[e.tooth_number].history.push({
      date: e.entry_date,
      procedure: e.procedure,
      dentist: (e.staff as any)?.full_name || "Unknown",
    });
  });

  const selectedData = selectedTooth ? toothData[selectedTooth] : null;
  const patient = patients.find((p) => p.id === patientId);

  return (
    <div className="space-y-6">
      <PageHeader title="Dental Charts" description="Visual tooth chart with FDI numbering">
        <div className="w-64">
          <Select value={patientId || ""} onValueChange={(v) => { setSelectedPatientId(v); setSelectedTooth(null); }}>
            <SelectTrigger className="bg-muted/30 border-border/40"><SelectValue placeholder="Select patient" /></SelectTrigger>
            <SelectContent className="backdrop-blur-xl">
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader className="pb-2 border-b border-border/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base">Patient: {patient ? `${patient.first_name} ${patient.last_name}` : "Select a patient"}</CardTitle>
                <CardDescription>{entries.length} recorded entries</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(toothStatusColors).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <span className={`h-3 w-3 rounded-sm border ${color.split(" ").slice(0, 1).join(" ")} ${color.split(" ").slice(-1).join(" ")}`} />
                    <span className="text-[10px] text-muted-foreground capitalize font-medium">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="mb-3">
              <p className="text-[10px] text-muted-foreground text-center mb-1.5 font-medium uppercase tracking-wider">Upper</p>
              <div className="flex justify-center gap-1">
                {upperTeeth.map((tooth) => {
                  const status: ToothStatus = toothData[tooth]?.status || "healthy";
                  return (
                    <button key={tooth} onClick={() => setSelectedTooth(tooth)}
                      className={`w-9 h-10 rounded-t-lg border text-xs font-mono flex flex-col items-center justify-center transition-all duration-200 ${toothStatusColors[status]} ${selectedTooth === tooth ? "ring-2 ring-secondary scale-110 shadow-lg shadow-secondary/20" : "hover:scale-105"}`}>
                      <span className="text-[10px] leading-none">{tooth}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="flex justify-center gap-1">
                {lowerTeeth.map((tooth) => {
                  const status: ToothStatus = toothData[tooth]?.status || "healthy";
                  return (
                    <button key={tooth} onClick={() => setSelectedTooth(tooth)}
                      className={`w-9 h-10 rounded-b-lg border text-xs font-mono flex flex-col items-center justify-center transition-all duration-200 ${toothStatusColors[status]} ${selectedTooth === tooth ? "ring-2 ring-secondary scale-110 shadow-lg shadow-secondary/20" : "hover:scale-105"}`}>
                      <span className="text-[10px] leading-none">{tooth}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1.5 font-medium uppercase tracking-wider">Lower</p>
            </div>

            {selectedTooth && (
              <motion.div
                className="mt-6 p-4 rounded-xl border border-border/40 bg-muted/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-sm">Tooth #{selectedTooth}</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${toothStatusColors[selectedData?.status || "healthy"].split(" ").slice(0, 2).join(" ")}`}>
                    {selectedData?.status || "healthy"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedData?.notes || "No procedures recorded. Tooth is healthy."}
                </p>
                {selectedData?.history && selectedData.history.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">Procedure History</h4>
                    <div className="space-y-1.5">
                      {selectedData.history.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs bg-card/60 rounded-lg p-2.5 border border-border/30">
                          <span className="text-muted-foreground font-mono w-20 shrink-0">{h.date}</span>
                          <span className="font-medium">{h.procedure}</span>
                          <span className="text-muted-foreground ml-auto">{h.dentist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-xs" onClick={() => setProcedureOpen(true)}>Add Procedure</Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {selectedTooth && patientId && (
        <AddProcedureDialog
          open={procedureOpen}
          onOpenChange={setProcedureOpen}
          toothNumber={selectedTooth}
          currentStatus={selectedData?.status || "healthy"}
          patientId={patientId}
        />
      )}
    </div>
  );
}