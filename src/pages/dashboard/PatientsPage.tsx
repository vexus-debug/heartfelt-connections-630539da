import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Filter, MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddPatientDialog } from "@/components/dashboard/AddPatientDialog";
import { BookAppointmentDialog } from "@/components/dashboard/BookAppointmentDialog";
import { usePatients } from "@/hooks/usePatients";

export default function PatientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [addOpen, setAddOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  const { data: patients = [], isLoading } = usePatients();

  const filtered = patients
    .filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      if (sortBy === "registered") return b.registered_date.localeCompare(a.registered_date);
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-sm text-muted-foreground">{patients.length} total patients</p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => setAddOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, ID, or phone..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="registered">Sort by Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <p className="text-sm text-muted-foreground py-10 text-center">Loading patients...</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Name</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Phone</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden lg:table-cell">Email</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden lg:table-cell">Registered</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Status</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/patients/${p.id}`)}>
                      <td className="py-2.5 px-4 font-medium">{p.first_name} {p.last_name}</td>
                      <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{p.phone}</td>
                      <td className="py-2.5 px-4 hidden lg:table-cell text-muted-foreground">{p.email}</td>
                      <td className="py-2.5 px-4 hidden lg:table-cell text-muted-foreground">{p.registered_date}</td>
                      <td className="py-2.5 px-4">
                        <Badge variant={p.status === "active" ? "default" : "secondary"} className={p.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/patients/${p.id}`)}>View Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedPatientId(p.id); setBookOpen(true); }}>Book Appointment</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !isLoading && (
                    <tr><td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">No patients found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      <AddPatientDialog open={addOpen} onOpenChange={setAddOpen} />
      <BookAppointmentDialog open={bookOpen} onOpenChange={setBookOpen} preselectedPatientId={selectedPatientId} />
    </div>
  );
}
