import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePatients } from "@/hooks/usePatients";
import { useDentalChartEntries, useDeleteDentalChartEntry } from "@/hooks/useDentalCharts";
import { AddProcedureDialog } from "@/components/dashboard/AddProcedureDialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Calendar, User, FileText, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

type ToothStatus = "healthy" | "cavity" | "filling" | "crown" | "extraction" | "planned" | "root_canal" | "implant" | "bridge" | "veneer" | "sealant";

const toothStatusConfig: Record<ToothStatus, { bg: string; ring: string; text: string; label: string; icon: string }> = {
  healthy: { bg: "bg-emerald-500/15", ring: "ring-emerald-500/40", text: "text-emerald-700 dark:text-emerald-300", label: "Healthy", icon: "✓" },
  cavity: { bg: "bg-red-500/15", ring: "ring-red-500/40", text: "text-red-700 dark:text-red-300", label: "Cavity", icon: "●" },
  filling: { bg: "bg-blue-500/15", ring: "ring-blue-500/40", text: "text-blue-700 dark:text-blue-300", label: "Filling", icon: "◆" },
  crown: { bg: "bg-amber-500/15", ring: "ring-amber-500/40", text: "text-amber-700 dark:text-amber-300", label: "Crown", icon: "♛" },
  root_canal: { bg: "bg-orange-500/15", ring: "ring-orange-500/40", text: "text-orange-700 dark:text-orange-300", label: "Root Canal", icon: "⊕" },
  extraction: { bg: "bg-gray-500/15", ring: "ring-gray-500/40", text: "text-gray-500 line-through", label: "Extracted", icon: "✕" },
  implant: { bg: "bg-cyan-500/15", ring: "ring-cyan-500/40", text: "text-cyan-700 dark:text-cyan-300", label: "Implant", icon: "⬡" },
  bridge: { bg: "bg-indigo-500/15", ring: "ring-indigo-500/40", text: "text-indigo-700 dark:text-indigo-300", label: "Bridge", icon: "⌒" },
  veneer: { bg: "bg-pink-500/15", ring: "ring-pink-500/40", text: "text-pink-700 dark:text-pink-300", label: "Veneer", icon: "▽" },
  sealant: { bg: "bg-teal-500/15", ring: "ring-teal-500/40", text: "text-teal-700 dark:text-teal-300", label: "Sealant", icon: "◎" },
  planned: { bg: "bg-violet-500/15", ring: "ring-violet-500/40", text: "text-violet-700 dark:text-violet-300", label: "Planned", icon: "◌" },
};

// Tooth type classification for visual rendering
const toothTypes: Record<number, "molar" | "premolar" | "canine" | "incisor"> = {};
[18, 17, 16, 28, 27, 26, 48, 47, 46, 38, 37, 36].forEach(n => toothTypes[n] = "molar");
[15, 14, 25, 24, 45, 44, 35, 34].forEach(n => toothTypes[n] = "premolar");
[13, 23, 43, 33].forEach(n => toothTypes[n] = "canine");
[12, 11, 22, 21, 42, 41, 32, 31].forEach(n => toothTypes[n] = "incisor");

function ToothIcon({ toothNumber, status, isSelected, onClick, entryCount }: {
  toothNumber: number;
  status: ToothStatus;
  isSelected: boolean;
  onClick: () => void;
  entryCount: number;
}) {
  const config = toothStatusConfig[status];
  const type = toothTypes[toothNumber] || "molar";
  const isUpper = toothNumber <= 28;

  const shapeClass = type === "molar"
    ? "rounded-lg"
    : type === "premolar"
      ? "rounded-md"
      : type === "canine"
        ? "rounded-full"
        : isUpper ? "rounded-t-xl rounded-b-md" : "rounded-b-xl rounded-t-md";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`relative w-10 h-12 ${shapeClass} border-2 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group
            ${config.bg} ${config.text}
            ${isSelected
              ? `ring-2 ${config.ring} scale-110 shadow-lg border-secondary z-10`
              : "border-border/40 hover:scale-105 hover:shadow-md hover:border-secondary/50"
            }`}
        >
          <span className="text-[9px] font-bold opacity-60 leading-none">{toothNumber}</span>
          <span className="text-sm leading-none mt-0.5">{config.icon}</span>
          {entryCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm">
              {entryCount}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side={isUpper ? "top" : "bottom"} className="text-xs">
        <p className="font-semibold">Tooth #{toothNumber}</p>
        <p className="text-muted-foreground">{config.label} • {entryCount} record{entryCount !== 1 ? "s" : ""}</p>
      </TooltipContent>
    </Tooltip>
  );
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
    latestNotes: string;
    history: { id: string; date: string; procedure: string; dentist: string; status: string; notes: string; dentist_id: string | null }[];
  }> = {};

  entries.forEach((e: any) => {
    if (!toothData[e.tooth_number]) {
      toothData[e.tooth_number] = { status: e.status as ToothStatus, latestNotes: e.notes || "", history: [] };
    }
    toothData[e.tooth_number].history.push({
      id: e.id,
      date: e.entry_date,
      procedure: e.procedure,
      dentist: (e.staff as any)?.full_name || "Unknown",
      status: e.status,
      notes: e.notes || "",
      dentist_id: e.dentist_id,
    });
  });

  const selectedData = selectedTooth ? toothData[selectedTooth] : null;
  const patient = patients.find((p) => p.id === patientId);

  // Stats
  const totalTeeth = 32;
  const affectedTeeth = Object.keys(toothData).filter(k => toothData[Number(k)]?.status !== "healthy").length;
  const plannedCount = Object.values(toothData).filter(d => d.status === "planned").length;
  const totalProcedures = entries.length;

  const handleAddProcedure = () => {
    setEditEntry(null);
    setProcedureOpen(true);
  };

  const handleEditEntry = (entry: any) => {
    setEditEntry({
      id: entry.id,
      tooth_number: selectedTooth!,
      procedure: entry.procedure,
      status: entry.status,
      entry_date: entry.date,
      notes: entry.notes,
      dentist_id: entry.dentist_id,
      patient_id: patientId,
    });
    setProcedureOpen(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (!patientId) return;
    deleteEntry.mutate({ id: entryId, patient_id: patientId });
  };

  const displayedHistory = selectedData?.history
    ? showAllHistory ? selectedData.history : selectedData.history.slice(0, 5)
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Dental Charts" description="Interactive FDI dental charting system">
        <div className="w-64">
          <Select value={patientId || ""} onValueChange={(v) => { setSelectedPatientId(v); setSelectedTooth(null); }}>
            <SelectTrigger className="bg-muted/30 border-border/40">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-xl">
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {/* Patient Summary Stats */}
      {patient && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Procedures", value: totalProcedures, color: "text-secondary" },
            { label: "Affected Teeth", value: affectedTeeth, color: "text-amber-600 dark:text-amber-400" },
            { label: "Planned Treatments", value: plannedCount, color: "text-violet-600 dark:text-violet-400" },
            { label: "Healthy Teeth", value: totalTeeth - affectedTeeth, color: "text-emerald-600 dark:text-emerald-400" },
          ].map((stat) => (
            <Card key={stat.label} className="glass-card">
              <CardContent className="p-3 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Dental Chart */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {patient ? `${patient.first_name} ${patient.last_name}` : "Select a patient"}
                  {patient && <Badge variant="outline" className="text-[10px]">{entries.length} entries</Badge>}
                </CardTitle>
                <CardDescription>Click any tooth to view details or add procedures</CardDescription>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {Object.entries(toothStatusConfig).map(([status, config]) => (
                  <div key={status} className="flex items-center gap-1">
                    <span className={`${config.bg} ${config.text} text-[10px] w-4 h-4 rounded flex items-center justify-center border border-border/20`}>
                      {config.icon}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-medium">{config.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-4">
            {/* Upper Jaw */}
            <div className="mb-2">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mr-2">R</span>
                <div className="flex gap-0.5 sm:gap-1">
                  {upperTeeth.slice(0, 8).map((tooth) => (
                    <ToothIcon
                      key={tooth}
                      toothNumber={tooth}
                      status={toothData[tooth]?.status as ToothStatus || "healthy"}
                      isSelected={selectedTooth === tooth}
                      onClick={() => setSelectedTooth(tooth)}
                      entryCount={toothData[tooth]?.history.length || 0}
                    />
                  ))}
                </div>
                <div className="w-px h-10 bg-border/50 mx-1" />
                <div className="flex gap-0.5 sm:gap-1">
                  {upperTeeth.slice(8).map((tooth) => (
                    <ToothIcon
                      key={tooth}
                      toothNumber={tooth}
                      status={toothData[tooth]?.status as ToothStatus || "healthy"}
                      isSelected={selectedTooth === tooth}
                      onClick={() => setSelectedTooth(tooth)}
                      entryCount={toothData[tooth]?.history.length || 0}
                    />
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest ml-2">L</span>
              </div>
              <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest">Maxillary (Upper)</p>
            </div>

            {/* Midline */}
            <div className="border-t border-dashed border-border/40 my-3" />

            {/* Lower Jaw */}
            <div>
              <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest mb-1">Mandibular (Lower)</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mr-2">R</span>
                <div className="flex gap-0.5 sm:gap-1">
                  {lowerTeeth.slice(0, 8).map((tooth) => (
                    <ToothIcon
                      key={tooth}
                      toothNumber={tooth}
                      status={toothData[tooth]?.status as ToothStatus || "healthy"}
                      isSelected={selectedTooth === tooth}
                      onClick={() => setSelectedTooth(tooth)}
                      entryCount={toothData[tooth]?.history.length || 0}
                    />
                  ))}
                </div>
                <div className="w-px h-10 bg-border/50 mx-1" />
                <div className="flex gap-0.5 sm:gap-1">
                  {lowerTeeth.slice(8).map((tooth) => (
                    <ToothIcon
                      key={tooth}
                      toothNumber={tooth}
                      status={toothData[tooth]?.status as ToothStatus || "healthy"}
                      isSelected={selectedTooth === tooth}
                      onClick={() => setSelectedTooth(tooth)}
                      entryCount={toothData[tooth]?.history.length || 0}
                    />
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest ml-2">L</span>
              </div>
            </div>

            {/* Selected Tooth Detail Panel */}
            <AnimatePresence>
              {selectedTooth && (
                <motion.div
                  className="mt-6 rounded-xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Detail Header */}
                  <div className="p-4 border-b border-border/30 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${toothStatusConfig[selectedData?.status || "healthy"].bg} ${toothStatusConfig[selectedData?.status || "healthy"].text}`}>
                          {toothStatusConfig[selectedData?.status || "healthy"].icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">Tooth #{selectedTooth}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] capitalize">
                              {toothStatusConfig[selectedData?.status || "healthy"].label}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {toothTypes[selectedTooth]?.replace(/^\w/, c => c.toUpperCase()) || "Unknown"} •{" "}
                              {selectedTooth <= 28 ? "Upper" : "Lower"} {selectedTooth % 10 <= 3 && selectedTooth % 10 >= 1 ? "Anterior" : "Posterior"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" onClick={handleAddProcedure} className="bg-secondary hover:bg-secondary/90 text-xs gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        Add Procedure
                      </Button>
                    </div>
                  </div>

                  {/* Procedure History */}
                  <div className="p-4">
                    {(!selectedData?.history || selectedData.history.length === 0) ? (
                      <div className="text-center py-6">
                        <FileText className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="text-sm text-muted-foreground">No procedures recorded</p>
                        <p className="text-xs text-muted-foreground/70">This tooth is healthy with no treatment history</p>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          Procedure History ({selectedData.history.length})
                        </h4>
                        <div className="space-y-2">
                          {displayedHistory.map((h, i) => (
                            <motion.div
                              key={h.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="group flex items-start gap-3 text-xs bg-muted/30 rounded-lg p-3 border border-border/20 hover:border-border/40 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{h.procedure}</span>
                                  <Badge variant="outline" className="text-[9px] capitalize">{h.status}</Badge>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {h.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {h.dentist}
                                  </span>
                                </div>
                                {h.notes && (
                                  <p className="mt-1 text-muted-foreground/80 italic">"{h.notes}"</p>
                                )}
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleEditEntry(h)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteEntry(h.id)}
                                  disabled={deleteEntry.isPending}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        {selectedData.history.length > 5 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2 text-xs text-muted-foreground"
                            onClick={() => setShowAllHistory(!showAllHistory)}
                          >
                            {showAllHistory ? (
                              <><ChevronUp className="h-3 w-3 mr-1" /> Show less</>
                            ) : (
                              <><ChevronDown className="h-3 w-3 mr-1" /> Show all {selectedData.history.length} entries</>
                            )}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Procedure Dialog */}
      {selectedTooth && patientId && (
        <AddProcedureDialog
          open={procedureOpen}
          onOpenChange={setProcedureOpen}
          toothNumber={selectedTooth}
          currentStatus={selectedData?.status as ToothStatus || "healthy"}
          patientId={patientId}
          editEntry={editEntry}
        />
      )}
    </div>
  );
}
