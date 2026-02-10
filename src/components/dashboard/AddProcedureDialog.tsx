import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCreateDentalChartEntry } from "@/hooks/useDentalCharts";
import { useStaff } from "@/hooks/useStaff";
import { toast } from "@/hooks/use-toast";

type ToothStatus = "healthy" | "cavity" | "filling" | "crown" | "extraction" | "planned";

interface AddProcedureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toothNumber: number;
  currentStatus: ToothStatus;
  patientId: string;
}

const procedures = [
  "Composite Filling", "Amalgam Filling", "Root Canal", "Crown (PFM)",
  "Crown (Ceramic)", "Extraction (Simple)", "Extraction (Surgical)",
  "Sealant", "Scaling & Polishing", "Veneer", "Inlay/Onlay", "Implant",
];

export function AddProcedureDialog({ open, onOpenChange, toothNumber, currentStatus, patientId }: AddProcedureDialogProps) {
  const [status, setStatus] = useState<ToothStatus>(currentStatus);
  const [procedure, setProcedure] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dentistId, setDentistId] = useState("");

  const createEntry = useCreateDentalChartEntry();
  const { data: staffList = [] } = useStaff();
  const dentists = staffList.filter((s: any) => s.role === "dentist");

  const handleSubmit = () => {
    if (!procedure) {
      toast({ title: "Please select a procedure", variant: "destructive" });
      return;
    }
    createEntry.mutate({
      patient_id: patientId,
      tooth_number: toothNumber,
      procedure,
      status,
      entry_date: date,
      notes,
      dentist_id: dentistId || undefined,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setProcedure("");
        setNotes("");
        setStatus(currentStatus);
        setDentistId("");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Procedure — Tooth #{toothNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Procedure</Label>
            <Select value={procedure} onValueChange={setProcedure}>
              <SelectTrigger><SelectValue placeholder="Select procedure" /></SelectTrigger>
              <SelectContent>
                {procedures.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Update Tooth Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ToothStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["healthy", "cavity", "filling", "crown", "extraction", "planned"] as ToothStatus[]).map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Dentist</Label>
            <Select value={dentistId} onValueChange={setDentistId}>
              <SelectTrigger><SelectValue placeholder="Select dentist" /></SelectTrigger>
              <SelectContent>
                {dentists.map((d: any) => (
                  <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-secondary hover:bg-secondary/90" disabled={createEntry.isPending}>
            {createEntry.isPending ? "Saving..." : "Save Procedure"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
