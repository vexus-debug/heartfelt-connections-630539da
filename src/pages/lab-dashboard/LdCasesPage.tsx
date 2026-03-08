import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Search, Pencil, CalendarIcon, Filter } from "lucide-react";
import { useLdCases, useCreateLdCase, useUpdateLdCase, useLdClients, useLdStaff, useLdWorkTypes } from "@/hooks/useLabDashboard";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statuses = ["pending", "in-progress", "ready", "delivered"];
const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  "in-progress": "bg-blue-100 text-blue-800",
  ready: "bg-emerald-100 text-emerald-800",
  delivered: "bg-gray-100 text-gray-800",
};

export default function LdCasesPage() {
  const { data: cases = [], isLoading } = useLdCases();
  const { data: clients = [] } = useLdClients();
  const { data: staff = [] } = useLdStaff();
  const { data: workTypes = [] } = useLdWorkTypes();
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin");
  const createCase = useCreateLdCase();
  const updateCase = useUpdateLdCase();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClientId, setFilterClientId] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCase, setEditCase] = useState<any>(null);

  const filtered = useMemo(() => {
    return cases.filter((c: any) => {
      const matchSearch = !search || c.case_number?.toLowerCase().includes(search.toLowerCase()) || c.patient_name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      const matchClient = filterClientId === "all" || c.client_id === filterClientId;
      const caseDate = c.received_date ? new Date(c.received_date) : new Date(c.created_at);
      const matchFrom = !dateFrom || caseDate >= dateFrom;
      const matchTo = !dateTo || caseDate <= new Date(dateTo.getTime() + 86400000);
      return matchSearch && matchStatus && matchClient && matchFrom && matchTo;
    });
  }, [cases, search, filterStatus, filterClientId, dateFrom, dateTo]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, unknown> = {
      patient_name: fd.get("patient_name"),
      client_id: fd.get("client_id") || null,
      work_type_id: fd.get("work_type_id") || null,
      work_type_name: fd.get("work_type_name"),
      assigned_technician_id: fd.get("assigned_technician_id") || null,
      tooth_number: fd.get("tooth_number") ? Number(fd.get("tooth_number")) : null,
      shade: fd.get("shade"),
      instructions: fd.get("instructions"),
      lab_fee: Number(fd.get("lab_fee") || 0),
      discount: Number(fd.get("discount") || 0),
      due_date: fd.get("due_date") || null,
      is_urgent: fd.get("is_urgent") === "on",
      delivery_method: fd.get("delivery_method"),
    };

    if (editCase) {
      // Only admin can change technician after initial assignment
      if (!isAdmin && editCase.assigned_technician_id && values.assigned_technician_id !== editCase.assigned_technician_id) {
        values.assigned_technician_id = editCase.assigned_technician_id;
      }
      updateCase.mutate({ id: editCase.id, ...values }, { onSuccess: () => { setDialogOpen(false); setEditCase(null); } });
    } else {
      createCase.mutate(values, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleStatusChange = (caseId: string, newStatus: string) => {
    const updates: Record<string, unknown> = { status: newStatus };
    if (newStatus === "ready") updates.completed_date = new Date().toISOString().split("T")[0];
    if (newStatus === "delivered") updates.delivered_date = new Date().toISOString().split("T")[0];
    if (newStatus === "in-progress") updates.started_date = new Date().toISOString().split("T")[0];
    updateCase.mutate({ id: caseId, ...updates });
  };

  const openEdit = (c: any) => {
    setEditCase(c);
    setDialogOpen(true);
  };

  const clearDateFilter = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lab Cases</h1>
          <p className="text-sm text-muted-foreground">{cases.length} total cases</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditCase(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> New Case</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editCase ? "Edit Case" : "New Case"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Patient Name *</Label>
                  <Input name="patient_name" required defaultValue={editCase?.patient_name || ""} />
                </div>
                <div>
                  <Label>Client (Clinic)</Label>
                  <select name="client_id" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editCase?.client_id || ""}>
                    <option value="">Walk-in</option>
                    {clients.map((c: any) => <option key={c.id} value={c.id}>{c.clinic_code ? `[${c.clinic_code}] ` : ""}{c.clinic_name} - {c.doctor_name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Work Type</Label>
                  <select name="work_type_id" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editCase?.work_type_id || ""}>
                    <option value="">Select...</option>
                    {workTypes.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <Label>Work Type Name *</Label>
                  <Input name="work_type_name" required defaultValue={editCase?.work_type_name || ""} />
                </div>
                <div>
                  <Label>Technician {editCase?.assigned_technician_id && !isAdmin ? "(locked)" : ""}</Label>
                  <select
                    name="assigned_technician_id"
                    className="w-full border rounded-md p-2 text-sm bg-background"
                    defaultValue={editCase?.assigned_technician_id || ""}
                    disabled={!!editCase?.assigned_technician_id && !isAdmin}
                  >
                    <option value="">Unassigned</option>
                    {staff.filter((s: any) => s.status === "active").map((s: any, idx: number) => (
                      <option key={s.id} value={s.id}>Technician {idx + 1} — {s.full_name}</option>
                    ))}
                  </select>
                  {editCase?.assigned_technician_id && !isAdmin && (
                    <p className="text-[10px] text-muted-foreground mt-1">Only admin can change technician after assignment</p>
                  )}
                </div>
                <div>
                  <Label>Tooth #</Label>
                  <Input name="tooth_number" type="number" defaultValue={editCase?.tooth_number || ""} />
                </div>
                <div>
                  <Label>Shade</Label>
                  <Input name="shade" defaultValue={editCase?.shade || ""} />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input name="due_date" type="date" defaultValue={editCase?.due_date || ""} />
                </div>
                <div>
                  <Label>Lab Fee (₦)</Label>
                  <Input name="lab_fee" type="number" step="0.01" defaultValue={editCase?.lab_fee || 0} />
                </div>
                <div>
                  <Label>Discount (₦)</Label>
                  <Input name="discount" type="number" step="0.01" defaultValue={editCase?.discount || 0} />
                </div>
                <div>
                  <Label>Delivery Method</Label>
                  <Input name="delivery_method" defaultValue={editCase?.delivery_method || ""} />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Urgent</Label>
                  <Switch name="is_urgent" defaultChecked={editCase?.is_urgent || false} />
                </div>
              </div>
              <div>
                <Label>Instructions</Label>
                <Textarea name="instructions" defaultValue={editCase?.instructions || ""} />
              </div>
              <Button type="submit" className="w-full" disabled={createCase.isPending || updateCase.isPending}>
                {editCase ? "Update Case" : "Create Case"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-end">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cases..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterClientId} onValueChange={setFilterClientId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map((c: any) => (
              <SelectItem key={c.id} value={c.id}>
                {c.clinic_code ? `[${c.clinic_code}] ` : ""}{c.clinic_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("gap-1", (dateFrom || dateTo) && "border-primary text-primary")}>
              <CalendarIcon className="h-3.5 w-3.5" />
              {dateFrom && dateTo
                ? `${format(dateFrom, "MMM d, yyyy")} – ${format(dateTo, "MMM d, yyyy")}`
                : dateFrom
                  ? `From ${format(dateFrom, "MMM d, yyyy")}`
                  : dateTo
                    ? `Until ${format(dateTo, "MMM d, yyyy")}`
                    : "Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 space-y-3" align="end">
            <div className="space-y-1">
              <Label className="text-xs">From Date</Label>
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="pointer-events-auto" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To Date</Label>
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="pointer-events-auto" />
            </div>
            {(dateFrom || dateTo) && (
              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={clearDateFilter}>
                Clear Date Filter
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Cases Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Case #</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Work Type</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Technician</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Due</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !filtered.length ? (
                  <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">No cases found</td></tr>
                ) : filtered.map((c: any) => (
                  <tr key={c.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-mono text-xs">{c.case_number}</td>
                    <td className="p-3">
                      {c.patient_name}
                      {c.is_urgent && <Badge variant="destructive" className="ml-1 text-[10px]">!</Badge>}
                    </td>
                    <td className="p-3">{c.work_type_name}</td>
                    <td className="p-3 text-xs">{c.client?.clinic_name || "—"}</td>
                    <td className="p-3 text-xs">{c.technician?.full_name || "Unassigned"}</td>
                    <td className="p-3">
                      <Select value={c.status} onValueChange={(v) => handleStatusChange(c.id, v)}>
                        <SelectTrigger className="h-7 text-xs w-[120px]">
                          <Badge className={`${statusColor[c.status]} text-[10px]`}>{c.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3 text-xs">{c.due_date ? format(new Date(c.due_date), "MMM d, yyyy") : "—"}</td>
                    <td className="p-3 text-right font-medium">₦{Number(c.net_amount || 0).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
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
