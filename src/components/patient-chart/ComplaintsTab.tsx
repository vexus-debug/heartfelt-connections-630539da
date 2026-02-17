import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useCreateClinicalNote } from "@/hooks/useClinicalNotes";

interface ComplaintsTabProps {
  patientId: string;
  clinicalNotes: any[];
  canEdit: boolean;
  userId?: string;
}

export function ComplaintsTab({ patientId, clinicalNotes, canEdit, userId }: ComplaintsTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [complaint, setComplaint] = useState("");
  const createNote = useCreateClinicalNote();

  // Show notes that have subjective (complaint) entries
  const complaints = clinicalNotes.filter((n: any) => n.subjective);

  const handleSave = () => {
    createNote.mutate(
      { patient_id: patientId, subjective: complaint, created_by: userId },
      { onSuccess: () => { setDialogOpen(false); setComplaint(""); } }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Patient Complaints</h3>
        {canEdit && (
          <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-1 h-3 w-3" /> Add Complaint
          </Button>
        )}
      </div>

      {complaints.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No complaints recorded.</CardContent></Card>
      ) : (
        complaints.map((note: any) => (
          <Card key={note.id}>
            <CardContent className="py-4 space-y-1">
              <p className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</p>
              <p className="text-sm">{note.subjective}</p>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Patient Complaint</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Complaint / Chief Concern *</Label>
              <Textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} rows={4} placeholder="Describe the patient's complaint..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-secondary hover:bg-secondary/90" disabled={createNote.isPending || !complaint.trim()} onClick={handleSave}>
              {createNote.isPending ? "Saving..." : "Save Complaint"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
