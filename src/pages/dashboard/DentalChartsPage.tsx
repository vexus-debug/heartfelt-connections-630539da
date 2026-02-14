import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePatients } from "@/hooks/usePatients";
import { useDentalChartEntries, useDeleteDentalChartEntry } from "@/hooks/useDentalCharts";
import { AddProcedureDialog } from "@/components/dashboard/AddProcedureDialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Calendar, User, FileText, ChevronDown, ChevronUp } from "lucide-react";

type ToothStatus = "healthy" | "decayed" | "treated" | "missing" | "cavity" | "filling" | "crown" | "extraction" | "planned" | "root_canal" | "implant" | "bridge" | "veneer" | "sealant";

const statusColors: Record<string, { bg: string; label: string }> = {
  healthy:    { bg: "bg-emerald-100 border-emerald-300 text-emerald-800", label: "Healthy" },
  decayed:    { bg: "bg-amber-100 border-amber-300 text-amber-800", label: "Decayed" },
  cavity:     { bg: "bg-amber-100 border-amber-300 text-amber-800", label: "Decayed" },
  treated:    { bg: "bg-indigo-100 border-indigo-300 text-indigo-800", label: "Treated" },
  filling:    { bg: "bg-indigo-100 border-indigo-300 text-indigo-800", label: "Treated" },
  crown:      { bg: "bg-indigo-100 border-indigo-300 text-indigo-800", label: "Treated" },
  root_canal: { bg: "bg-indigo-100 border-indigo-300 text-indigo-800", label: "Treated" },
  veneer:     { bg: "bg-indigo-100 border-indigo-300 text-indigo-800", label: "Treated" },
  sealant:    { bg: "bg-indigo-100 border-indigo-300 text-indigo-800", label: "Treated" },
  bridge:     { bg: "bg-indigo-100 border-indigo-300 text-indigo-800", label: "Treated" },
  implant:    { bg: "bg-indigo-100 border-indigo-300 text-indigo-800", label: "Treated" },
  missing:    { bg: "bg-red-100 border-red-300 text-red-800", label: "Missing" },
  extraction: { bg: "bg-red-100 border-red-300 text-red-800", label: "Missing" },
  planned:    { bg: "bg-violet-100 border-violet-300 text-violet-800", label: "Planned" },
};

const legendItems = [
  { color: "bg-emerald-200", label: "Healthy" },
  { color: "bg-amber-200", label: "Decayed" },
  { color: "bg-indigo-200", label: "Treated" },
  { color: "bg-red-200", label: "Missing" },
];

// Grid layout matching the reference image
const upperRows = [
  [18, 17, 16, 15, 14, 13, 12],
  [11, 21, 22, 23, 24, 25, 26],
  [null, null, 27, 28, null, null, null],
];
const lowerRows = [
  [48, 47, 46, 45, 44, 43, 42],
  [41, 31, 32, 33, 34, 35, 36],
  [null, null, 37, 38, null, null, null],
];

function getStatus(status: string): { bg: string; label: string } {
  return statusColors[status] || statusColors.healthy;
}

export default function DentalChartsPage() {
  const { data: patients = [] } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [procedureOpen, setProcedureOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<any>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const deleteEntry = useDeleteDentalChartEntry();
  const patientId = selectedPatientId || patients[0]?.id;
  const { data: entries = [] } = useDentalChartEntries(patientId);

  // Build per-tooth data
  const toothData: Record<number, {
    status: ToothStatus;
    history: { id: string; date: string; procedure: string; dentist: string; status: string; notes: string; dentist_id: string | null }[];
  }> = {};

  entries.forEach((e: any) => {
    if (!toothData[e.tooth_number]) {
      toothData[e.tooth_number] = { status: e.status as ToothStatus, history: [] };
    }
    toothData[e.tooth_number].history.push({
      id: e.id, date: e.entry_date, procedure: e.procedure,
      dentist: (e.staff as any)?.full_name || "Unknown",
      status: e.status, notes: e.notes || "", dentist_id: e.dentist_id,
    });
  });

  const selectedData = selectedTooth ? toothData[selectedTooth] : null;
  const patient = patients.find((p) => p.id === patientId);

  const handleAddProcedure = () => { setEditEntry(null); setProcedureOpen(true); };
  const handleEditEntry = (entry: any) => {
    setEditEntry({ id: entry.id, tooth_number: selectedTooth!, procedure: entry.procedure, status: entry.status, entry_date: entry.date, notes: entry.notes, dentist_id: entry.dentist_id, patient_id: patientId });
    setProcedureOpen(true);
  };
  const handleDeleteEntry = (entryId: string) => { if (patientId) deleteEntry.mutate({ id: entryId, patient_id: patientId }); };

  const displayedHistory = selectedData?.history
    ? showAllHistory ? selectedData.history : selectedData.history.slice(0, 5)
    : [];

  const renderToothGrid = (rows: (number | null)[][]) => (
    <div className="flex flex-col items-center gap-1.5">
      {rows.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1.5">
          {row.map((tooth, ci) =>
            tooth === null ? (
              <div key={`empty-${ri}-${ci}`} className="w-10 h-10 sm:w-12 sm:h-12" />
            ) : (
              <button
                key={tooth}
                onClick={() => setSelectedTooth(tooth)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md border-2 flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${getStatus(toothData[tooth]?.status || "healthy").bg}
                  ${selectedTooth === tooth ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-md z-10" : "hover:scale-105 hover:shadow-sm"}`}
              >
                {tooth}
              </button>
            )
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Dental Charts" description="Interactive tooth chart per patient">
        <div className="w-64">
          <Select value={patientId || ""} onValueChange={(v) => { setSelectedPatientId(v); setSelectedTooth(null); }}>
            <SelectTrigger className="bg-muted/30 border-border/40">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {/* Dental Chart Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">
            Tooth Chart — Adult (FDI Notation)
          </CardTitle>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upper Jaw */}
          <div>
            <p className="text-center text-sm font-medium text-muted-foreground mb-3">Upper Jaw</p>
            {renderToothGrid(upperRows)}
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-border/50" />

          {/* Lower Jaw */}
          <div>
            <p className="text-center text-sm font-medium text-muted-foreground mb-3">Lower Jaw</p>
            {renderToothGrid(lowerRows)}
          </div>
        </CardContent>
      </Card>

      {/* Selected Tooth Detail */}
      <AnimatePresence>
        {selectedTooth && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Tooth #{selectedTooth}</CardTitle>
                    <Badge variant="secondary" className="mt-1 text-[10px] capitalize">
                      {getStatus(selectedData?.status || "healthy").label}
                    </Badge>
                  </div>
                  <Button size="sm" onClick={handleAddProcedure} className="gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Procedure
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(!selectedData?.history || selectedData.history.length === 0) ? (
                  <div className="text-center py-6">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No procedures recorded</p>
                  </div>
                ) : (
                  <>
                    <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> History ({selectedData.history.length})
                    </h4>
                    <div className="space-y-2">
                      {displayedHistory.map((h, i) => (
                        <div key={h.id} className="group flex items-start gap-3 text-xs bg-muted/30 rounded-lg p-3 border border-border/20 hover:border-border/40 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{h.procedure}</span>
                              <Badge variant="outline" className="text-[9px] capitalize">{h.status}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{h.date}</span>
                              <span className="flex items-center gap-1"><User className="h-3 w-3" />{h.dentist}</span>
                            </div>
                            {h.notes && <p className="mt-1 text-muted-foreground/80 italic">"{h.notes}"</p>}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditEntry(h)}><Edit2 className="h-3 w-3" /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteEntry(h.id)} disabled={deleteEntry.isPending}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedData.history.length > 5 && (
                      <Button variant="ghost" size="sm" className="w-full mt-2 text-xs text-muted-foreground" onClick={() => setShowAllHistory(!showAllHistory)}>
                        {showAllHistory ? <><ChevronUp className="h-3 w-3 mr-1" /> Show less</> : <><ChevronDown className="h-3 w-3 mr-1" /> Show all {selectedData.history.length} entries</>}
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedTooth && patientId && (
        <AddProcedureDialog
          open={procedureOpen}
          onOpenChange={setProcedureOpen}
          toothNumber={selectedTooth}
          currentStatus={(selectedData?.status || "healthy") as any}
          patientId={patientId}
          editEntry={editEntry}
        />
      )}
    </div>
  );
}
