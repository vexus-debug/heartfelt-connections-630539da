import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, AlertTriangle, FileText } from "lucide-react";

interface OverviewTabProps {
  patient: any;
  outstandingBalance: number;
  roles?: string[];
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function OverviewTab({ patient, outstandingBalance, roles = [] }: OverviewTabProps) {
  const allergies = patient.allergies ? patient.allergies.split(",").map((a: string) => a.trim()).filter(Boolean) : [];

  // Dentists cannot see contact PII — only admins and receptionists can
  const isDentistOnly = roles.includes("dentist") && !roles.includes("admin") && !roles.includes("receptionist");

  return (
    <div className="space-y-4">
      {outstandingBalance > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-destructive">Outstanding Balance</span>
            <span className="text-lg font-bold text-destructive">{formatCurrency(outstandingBalance)}</span>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4" /> Personal Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Date of Birth</span><span>{patient.date_of_birth || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Gender</span><span>{patient.gender || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Blood Group</span><span>{patient.blood_group || "N/A"}</span></div>
            <div className="flex justify-between items-start"><span className="text-muted-foreground">Address</span><span className="text-right max-w-[200px]">{patient.address || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Registered</span><span>{patient.registered_date}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Referral</span><span>{patient.referral_source || "N/A"}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Phone className="h-4 w-4" /> Contact & Emergency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isDentistOnly ? (
              <p className="text-xs text-muted-foreground italic">Contact details are restricted to admin and receptionist roles.</p>
            ) : (
              <>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{patient.phone}</div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{patient.email || "N/A"}</div>
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Emergency Contact</p>
                  <p className="font-medium">{patient.emergency_contact_name || "N/A"}</p>
                  <p className="text-muted-foreground">{patient.emergency_contact_phone || "N/A"}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4" /> Medical History</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <p>{patient.medical_history || "No significant medical history"}</p>
            {allergies.length > 0 && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/5 border border-destructive/20">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                <div>
                  <p className="text-xs font-medium text-destructive">Allergies</p>
                  <p className="text-xs text-destructive/80">{allergies.join(", ")}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
