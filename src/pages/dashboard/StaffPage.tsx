import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { staff } from "@/data/mockDashboardData";

const roleColors: Record<string, string> = {
  dentist: "bg-blue-100 text-blue-700",
  assistant: "bg-purple-100 text-purple-700",
  hygienist: "bg-emerald-100 text-emerald-700",
  receptionist: "bg-amber-100 text-amber-700",
  accountant: "bg-rose-100 text-rose-700",
};

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <p className="text-sm text-muted-foreground">{staff.length} team members</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-secondary/20 text-secondary">
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.specialty || member.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${roleColors[member.role]}`}>
                      {member.role}
                    </span>
                    <Badge variant={member.status === "active" ? "default" : "secondary"} className={member.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] h-5" : "text-[10px] h-5"}>
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{member.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
