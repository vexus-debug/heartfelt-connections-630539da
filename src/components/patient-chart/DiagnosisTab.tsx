import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";
import { useCreateClinicalNote, useUpdateClinicalNote } from "@/hooks/useClinicalNotes";

interface DiagnosisTabProps {
  patientId: string;
  clinicalNotes: any[];
  canEdit: boolean;
  userId?: string;
}

export function DiagnosisTab({ patientId, clinicalNotes, canEdit, userId }: DiagnosisTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [form, setForm] = useState({ subjective: "", objective: "", assessment: "", plan: "" });
  const createNote = useCreateClinicalNote();
  const updateNote = useUpdateClinicalNote();

  const openNew = () => {
    setEditingNote(null);
    setForm({ subjective: "", objective: "", assessment: "", plan: "" });
    setDialogOpen(true);
  };

  const openEdit = (note: any) => {
    setEditingNote(note);
    setForm({
      subjective: note.subjective || "",
      objective: note.objective || "",
      assessment: note.assessment || "",
      plan: note.plan || "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingNote) {
      updateNote.mutate(
        { id: editingNote.id, ...form },
        { onSuccess: () => { setDialogOpen(false); setEditingNote(null); } }
      );
    } else {
      createNote.mutate(
        { patient_id: patientId, ...form, created_by: userId },
        { onSuccess: () => { setDialogOpen(false); } }
      );
    }
  };

  const isPending = createNote.isPending || updateNote.isPending;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">SOAP Notes / Clinical Diagnosis</h3>
        {canEdit && (
          <Button size="sm" variant="outline" onClick={openNew}>
            <Plus className="mr-1 h-3 w-3" /> Add Note
          </Button>
        )}
      </div>

      {clinicalNotes.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No clinical notes found.</CardContent></Card>
      ) : (
        clinicalNotes.map((note: any) => (
          <Card key={note.id} className="group">
            <CardContent className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</p>
                {canEdit && (
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openEdit(note)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {note.subjective && <div><span className="text-xs font-semibold text-muted-foreground">S: </span><span className="text-sm">{note.subjective}</span></div>}
              {note.objective && <div><span className="text-xs font-semibold text-muted-foreground">O: </span><span className="text-sm">{note.objective}</span></div>}
              {note.assessment && <div><span className="text-xs font-semibold text-muted-foreground">A: </span><span className="text-sm">{note.assessment}</span></div>}
              {note.plan && <div><span className="text-xs font-semibold text-muted-foreground">P: </span><span className="text-sm">{note.plan}</span></div>}
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingNote ? "Edit SOAP Note" : "Add SOAP Note"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Subjective (Complaints)</Label><Textarea value={form.subjective} onChange={e => setForm(f => ({ ...f, subjective: e.target.value }))} rows={2} placeholder="Patient complaints, symptoms..." /></div>
            <div className="space-y-1"><Label className="text-xs">Objective (Findings)</Label><Textarea value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} rows={2} placeholder="Clinical findings, exam results..." /></div>
            <div className="space-y-1"><Label className="text-xs">Assessment (Diagnosis)</Label><Textarea value={form.assessment} onChange={e => setForm(f => ({ ...f, assessment: e.target.value }))} rows={2} placeholder="Diagnosis, clinical impression..." /></div>
            <div className="space-y-1"><Label className="text-xs">Plan (Treatment Plan)</Label><Textarea value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))} rows={2} placeholder="Treatment plan, follow-up..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-secondary hover:bg-secondary/90" disabled={isPending} onClick={handleSave}>
              {isPending ? "Saving..." : editingNote ? "Update Note" : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
