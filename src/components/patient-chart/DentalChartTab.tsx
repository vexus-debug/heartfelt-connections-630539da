import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";
import { useDentalChartEntries, useCreateDentalChartEntry } from "@/hooks/useDentalCharts";
import { useAuth } from "@/hooks/useAuth";

interface DentalChartTabProps {
  patientId: string;
  canEdit: boolean;
}

const CONDITIONS = ["Healthy", "Decayed", "Treated", "Missing"] as const;
const TREATMENTS = ["Crown", "Inlay/Onlay", "Referral", "Impacted", "Partial Denture", "Filling", "Extraction", "Root Canal"] as const;

const conditionColors: Record<string, string> = {
  Healthy: "bg-emerald-500",
  Decayed: "bg-red-500",
  Treated: "bg-blue-500",
  Missing: "bg-gray-400",
};

// FDI notation teeth
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];

export function DentalChartTab({ patientId, canEdit }: DentalChartTabProps) {
  const { user } = useAuth();
  const { data: entries = [] } = useDentalChartEntries(patientId);
  const createEntry = useCreateDentalChartEntry();
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [form, setForm] = useState({ condition: "Healthy", procedure: "", notes: "" });

  // Build tooth status map from latest entries
  const toothMap = new Map<number, any>();
  entries.forEach((e: any) => {
    if (!toothMap.has(e.tooth_number)) {
      toothMap.set(e.tooth_number, e);
    }
  });

  const handleToothClick = (tooth: number) => {
    if (!canEdit) return;
    setEditingEntry(null);
    setSelectedTooth(tooth);
    const existing = toothMap.get(tooth);
    setForm({
      condition: existing?.status || "Healthy",
      procedure: existing?.procedure || "",
      notes: "",
    });
    setDialogOpen(true);
  };

  const openAddNew = () => {
    setEditingEntry(null);
    setSelectedTooth(null);
    setForm({ condition: "Healthy", procedure: "", notes: "" });
    setDialogOpen(true);
  };

  const openEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setSelectedTooth(entry.tooth_number);
    setForm({
      condition: entry.status || "Healthy",
      procedure: entry.procedure || "",
      notes: entry.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const toothNum = editingEntry ? editingEntry.tooth_number : selectedTooth;
    if (!toothNum && !selectedTooth) return;
    createEntry.mutate({
      patient_id: patientId,
      tooth_number: toothNum || selectedTooth!,
      status: form.condition,
      procedure: form.procedure || form.condition,
      entry_date: new Date().toISOString().split("T")[0],
      notes: form.notes,
      dentist_id: undefined,
    }, {
      onSuccess: () => { setDialogOpen(false); setSelectedTooth(null); setEditingEntry(null); },
    });
  };

  const renderTooth = (tooth: number) => {
    const entry = toothMap.get(tooth);
    const status = entry?.status || "Healthy";
    const colorClass = conditionColors[status] || "bg-emerald-500";

    return (
      <button
        key={tooth}
        onClick={() => handleToothClick(tooth)}
        className={`flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-accent/50 transition-colors ${canEdit ? "cursor-pointer" : "cursor-default"}`}
        title={`Tooth #${tooth}: ${status}${entry?.procedure ? ` (${entry.procedure})` : ""}`}
      >
        <div className={`w-7 h-8 rounded-md border-2 ${entry ? "border-foreground/30" : "border-border"} flex items-center justify-center relative`}>
          <div className={`w-3 h-3 rounded-full ${colorClass}`} />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">{tooth}</span>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Dental Chart (FDI Notation)</h3>
        <div className="flex items-center gap-3">
          {CONDITIONS.map((c) => (
            <div key={c} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${conditionColors[c]}`} />
              <span className="text-[10px] text-muted-foreground">{c}</span>
            </div>
          ))}
          {canEdit && (
            <Button size="sm" variant="outline" onClick={openAddNew}>
              <Plus className="mr-1 h-3 w-3" /> Add Entry
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="py-6">
          {/* Upper Jaw */}
          <div className="text-center mb-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Upper Jaw</span>
          </div>
          <div className="flex justify-center gap-0.5 mb-1">
            <div className="flex gap-0.5 border-r border-border pr-2 mr-2">
              {UPPER_RIGHT.map(renderTooth)}
            </div>
            <div className="flex gap-0.5">
              {UPPER_LEFT.map(renderTooth)}
            </div>
          </div>

          <div className="border-t border-dashed border-border my-4" />

          {/* Lower Jaw */}
          <div className="flex justify-center gap-0.5 mb-1">
            <div className="flex gap-0.5 border-r border-border pr-2 mr-2">
              {LOWER_RIGHT.map(renderTooth)}
            </div>
            <div className="flex gap-0.5">
              {LOWER_LEFT.map(renderTooth)}
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Lower Jaw</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-3">Recent Entries</h4>
            <div className="space-y-2">
              {entries.slice(0, 10).map((e: any) => (
                <div key={e.id} className="flex items-center justify-between text-sm group">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono">#{e.tooth_number}</Badge>
                    <span>{e.procedure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] ${conditionColors[e.status] || ""} text-white`}>{e.status}</Badge>
                    <span className="text-xs text-muted-foreground">{e.entry_date}</span>
                    {canEdit && (
                      <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openEditEntry(e)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tooth Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingEntry ? `Edit Entry — Tooth #${selectedTooth}` : selectedTooth ? `Tooth #${selectedTooth}` : "New Dental Entry"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {!selectedTooth && !editingEntry && (
              <div className="space-y-1">
                <Label className="text-xs">Tooth Number *</Label>
                <Input type="number" min={11} max={48} placeholder="e.g. 21" onChange={(e) => setSelectedTooth(Number(e.target.value) || null)} />
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-xs">Condition</Label>
              <Select value={form.condition} onValueChange={(v) => setForm(f => ({ ...f, condition: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Treatment / Procedure</Label>
              <Select value={form.procedure} onValueChange={(v) => setForm(f => ({ ...f, procedure: v }))}>
                <SelectTrigger><SelectValue placeholder="Select treatment" /></SelectTrigger>
                <SelectContent>
                  {TREATMENTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Input value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-secondary hover:bg-secondary/90" disabled={createEntry.isPending || (!selectedTooth && !editingEntry)} onClick={handleSave}>
              {createEntry.isPending ? "Saving..." : editingEntry ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
