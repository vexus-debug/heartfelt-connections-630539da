import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useLabCases } from "@/hooks/useLabCases";
import { useStaff } from "@/hooks/useStaff";

export default function LabTechniciansPage() {
  const { data: cases = [], isLoading: casesLoading } = useLabCases();
  const { data: staffList = [], isLoading: staffLoading } = useStaff();

  const isLoading = casesLoading || staffLoading;

  // Filter lab technicians from staff (role = 'lab_technician' or assigned to lab cases)
  const technicianIds = new Set(
    cases
      .filter((c) => c.assigned_technician_id)
      .map((c) => c.assigned_technician_id!)
  );

  const technicians = staffList.filter(
    (s) => s.role === "lab_technician" || technicianIds.has(s.id)
  );

  const getWorkload = (techId: string) => {
    const assigned = cases.filter(
      (c) =>
        c.assigned_technician_id === techId &&
        !["delivered"].includes(c.status)
    );
    return {
      total: assigned.length,
      pending: assigned.filter((c) => c.status === "pending").length,
      inProgress: assigned.filter((c) => c.status === "in-progress").length,
      ready: assigned.filter((c) => c.status === "ready").length,
      urgent: assigned.filter((c) => c.is_urgent).length,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lab Technicians</h1>
        <p className="text-sm text-muted-foreground">
          View technician workload and assignments
        </p>
      </div>

      {technicians.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No lab technicians found. Add staff with the "lab_technician" role
              to see them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technicians.map((tech) => {
            const workload = getWorkload(tech.id);
            return (
              <Card key={tech.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {tech.full_name}
                    </CardTitle>
                    <Badge
                      variant={
                        tech.status === "active" ? "default" : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {tech.status}
                    </Badge>
                  </div>
                  {tech.specialty && (
                    <p className="text-xs text-muted-foreground">
                      {tech.specialty}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded-md bg-muted/50">
                      <p className="text-lg font-bold">{workload.total}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Active
                      </p>
                    </div>
                    <div className="p-2 rounded-md bg-muted/50">
                      <p className="text-lg font-bold text-blue-600">
                        {workload.inProgress}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        In Progress
                      </p>
                    </div>
                    <div className="p-2 rounded-md bg-muted/50">
                      <p className="text-lg font-bold text-amber-600">
                        {workload.pending}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Pending
                      </p>
                    </div>
                    <div className="p-2 rounded-md bg-muted/50">
                      <p className="text-lg font-bold text-destructive">
                        {workload.urgent}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Urgent
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
