import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Filter, MoreHorizontal } from "lucide-react";
import { patients } from "@/data/mockDashboardData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-sm text-muted-foreground">{patients.length} total patients</p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or phone..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Patient ID</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Name</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Phone</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden lg:table-cell">Last Visit</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden lg:table-cell">Balance</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors cursor-pointer">
                    <td className="py-2.5 px-4 font-mono text-xs">{p.id}</td>
                    <td className="py-2.5 px-4 font-medium">{p.name}</td>
                    <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{p.phone}</td>
                    <td className="py-2.5 px-4 hidden lg:table-cell text-muted-foreground">{p.lastVisit}</td>
                    <td className="py-2.5 px-4 hidden lg:table-cell">
                      {p.balance > 0 ? (
                        <span className="text-red-600 font-medium">₦{p.balance.toLocaleString()}</span>
                      ) : (
                        <span className="text-emerald-600">Cleared</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge variant={p.status === "active" ? "default" : "secondary"} className={p.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Book Appointment</DropdownMenuItem>
                          <DropdownMenuItem>Create Invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
