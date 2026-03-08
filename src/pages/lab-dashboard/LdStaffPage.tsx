import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { useLdStaff, useCreateLdStaff, useUpdateLdStaff } from "@/hooks/useLabDashboard";

export default function LdStaffPage() {
  const { data: staff = [], isLoading } = useLdStaff();
  const createStaff = useCreateLdStaff();
  const updateStaff = useUpdateLdStaff();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      full_name: fd.get("full_name") as string,
      role: fd.get("role") as string,
      specialty: fd.get("specialty") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      status: fd.get("status") as string,
    };
    if (editStaff) {
      updateStaff.mutate({ id: editStaff.id, ...values }, { onSuccess: () => { setDialogOpen(false); setEditStaff(null); } });
    } else {
      createStaff.mutate(values, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lab Staff</h1>
          <p className="text-sm text-muted-foreground">Manage technicians and lab personnel</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditStaff(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Staff</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editStaff ? "Edit Staff" : "Add Staff"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Full Name *</Label><Input name="full_name" required defaultValue={editStaff?.full_name || ""} /></div>
                <div>
                  <Label>Role</Label>
                  <select name="role" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editStaff?.role || "technician"}>
                    <option value="technician">Technician</option>
                    <option value="senior_technician">Senior Technician</option>
                    <option value="manager">Manager</option>
                    <option value="assistant">Assistant</option>
                  </select>
                </div>
                <div><Label>Specialty</Label><Input name="specialty" defaultValue={editStaff?.specialty || ""} /></div>
                <div><Label>Phone</Label><Input name="phone" defaultValue={editStaff?.phone || ""} /></div>
                <div><Label>Email</Label><Input name="email" defaultValue={editStaff?.email || ""} /></div>
                <div>
                  <Label>Status</Label>
                  <select name="status" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editStaff?.status || "active"}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full">{editStaff ? "Update" : "Add Staff"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Specialty</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Phone</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !staff.length ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No staff found</td></tr>
                ) : staff.map((s: any) => (
                  <tr key={s.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-medium">{s.full_name}</td>
                    <td className="p-3 capitalize">{s.role.replace("_", " ")}</td>
                    <td className="p-3 text-xs">{s.specialty || "—"}</td>
                    <td className="p-3 text-xs">{s.phone || "—"}</td>
                    <td className="p-3"><Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge></td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditStaff(s); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
