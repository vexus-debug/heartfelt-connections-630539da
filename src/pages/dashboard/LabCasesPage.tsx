import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useLabCases } from "@/hooks/useLabCases";
import { format } from "date-fns";

const statusStyles: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  "in-progress": "bg-blue-100 text-blue-700",
  ready: "bg-emerald-100 text-emerald-700",
  delivered: "bg-muted text-muted-foreground",
};

export default function LabCasesPage() {
  const { data: cases = [], isLoading } = useLabCases();
  const statuses = ["pending", "in-progress", "ready", "delivered"] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lab Cases</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all lab cases
          </p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Lab Case
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-10">
          Loading lab cases...
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statuses.map((status) => {
            const filtered = cases.filter((c) => c.status === status);
            return (
              <Card key={status}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm capitalize">
                      {status.replace("-", " ")}
                    </CardTitle>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[status]}`}
                    >
                      {filtered.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filtered.map((c) => (
                    <div
                      key={c.id}
                      className={`p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow ${
                        c.is_urgent ? "border-destructive/50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{c.work_type}</p>
                        {c.is_urgent && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] px-1.5"
                          >
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {c.patients
                          ? `${c.patients.first_name} ${c.patients.last_name}`
                          : "Unknown"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {c.case_number}
                      </p>
                      {c.assigned_technician_id && c.technician && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Tech: {c.technician.full_name}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-muted-foreground">
                          ₦{Number(c.lab_fee).toLocaleString()}
                        </span>
                        {c.due_date && (
                          <span
                            className={`text-[10px] ${
                              new Date(c.due_date) < new Date() &&
                              !["delivered", "ready"].includes(c.status)
                                ? "text-destructive font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            Due:{" "}
                            {format(new Date(c.due_date), "MMM d")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No cases
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
