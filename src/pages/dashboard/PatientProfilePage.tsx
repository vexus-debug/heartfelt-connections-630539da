import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Phone, Mail, AlertTriangle, User, FileText } from "lucide-react";
import {
  usePatientDetail, usePatientVisits, usePatientTreatmentPlans, usePatientInvoices, usePatientPrescriptions,
} from "@/hooks/usePatientProfile";

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-red-100 text-red-700",
  partial: "bg-amber-100 text-amber-700",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export default function PatientProfilePage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const { data: patient, isLoading } = usePatientDetail(patientId);
  const { data: visits = [] } = usePatientVisits(patientId);
  const { data: plans = [] } = usePatientTreatmentPlans(patientId);
  const { data: invoices = [] } = usePatientInvoices(patientId);
  const { data: prescriptions = [] } = usePatientPrescriptions(patientId);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Patient not found.</p>
        <Button variant="outline" onClick={() => navigate("/dashboard/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
        </Button>
      </div>
    );
  }

  const allergies = patient.allergies ? patient.allergies.split(",").map((a: string) => a.trim()).filter(Boolean) : [];
  const outstandingBalance = invoices.reduce((sum, inv: any) => sum + (Number(inv.total_amount) - Number(inv.amount_paid)), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/patients")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{patient.first_name} {patient.last_name}</h1>
            <Badge variant={patient.status === "active" ? "default" : "secondary"} className={patient.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
              {patient.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{patient.gender} · Registered: {patient.registered_date}</p>
        </div>
        {outstandingBalance > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Outstanding</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(outstandingBalance)}</p>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Dental History</TabsTrigger>
          <TabsTrigger value="plans">Treatment Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4" /> Personal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Date of Birth</span><span>{patient.date_of_birth || "N/A"}</span></div>
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
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{patient.phone}</div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{patient.email || "N/A"}</div>
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Emergency Contact</p>
                  <p className="font-medium">{patient.emergency_contact_name || "N/A"}</p>
                  <p className="text-muted-foreground">{patient.emergency_contact_phone || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4" /> Medical History</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p>{patient.medical_history || "No significant medical history"}</p>
                {allergies.length > 0 && (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 border border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-red-700">Allergies</p>
                      <p className="text-xs text-red-600">{allergies.join(", ")}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Dental History */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Visit History</CardTitle>
              <CardDescription>{visits.length} recorded visits</CardDescription>
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No visit history found.</p>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                  {visits.map((v: any) => (
                    <div key={v.id} className="relative">
                      <div className="absolute -left-6 top-1 h-4 w-4 rounded-full border-2 border-secondary bg-background" />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{v.treatment}</p>
                          <p className="text-xs text-muted-foreground">{v.dentist} · {v.date}</p>
                          <p className="text-xs text-muted-foreground mt-1">{v.notes}</p>
                        </div>
                        <span className="text-sm font-medium shrink-0">{formatCurrency(v.cost)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatment Plans */}
        <TabsContent value="plans" className="mt-4 space-y-4">
          {plans.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No treatment plans found.</CardContent></Card>
          ) : plans.map((plan: any) => {
            const procs = plan.treatment_plan_procedures || [];
            const completedCount = procs.filter((p: any) => p.status === "done").length;
            const progress = procs.length ? Math.round((completedCount / procs.length) * 100) : 0;
            return (
              <Card key={plan.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">{plan.name}</CardTitle>
                      <CardDescription>{plan.start_date} → {plan.estimated_end || "Ongoing"}</CardDescription>
                    </div>
                    <Badge className={plan.status === "active" ? "bg-blue-100 text-blue-700" : plan.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                      {plan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Progress value={progress} className="flex-1 h-2" />
                    <span className="text-xs font-medium">{progress}%</span>
                  </div>
                  <div className="space-y-2">
                    {procs.map((proc: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className={`h-2 w-2 rounded-full ${proc.status === "done" ? "bg-emerald-500" : "bg-gray-300"}`} />
                        <span className={proc.status === "done" ? "line-through text-muted-foreground" : ""}>{proc.procedure_name}</span>
                        {proc.completed_date && <span className="text-xs text-muted-foreground ml-auto">{proc.completed_date}</span>}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs border-t pt-2">
                    <span className="text-muted-foreground">Total: {formatCurrency(Number(plan.total_cost))}</span>
                    <span className="text-muted-foreground">Paid: {formatCurrency(Number(plan.paid_amount))}</span>
                    <span className="font-medium text-red-600">Due: {formatCurrency(Number(plan.total_cost) - Number(plan.paid_amount))}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No invoices found.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="py-2 px-4 text-left font-medium text-muted-foreground">Invoice</th>
                      <th className="py-2 px-4 text-left font-medium text-muted-foreground">Date</th>
                      <th className="py-2 px-4 text-left font-medium text-muted-foreground">Amount</th>
                      <th className="py-2 px-4 text-left font-medium text-muted-foreground">Paid</th>
                      <th className="py-2 px-4 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv: any) => (
                      <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="py-2 px-4 font-mono text-xs">{inv.invoice_number}</td>
                        <td className="py-2 px-4 text-muted-foreground">{inv.invoice_date}</td>
                        <td className="py-2 px-4 font-medium">{formatCurrency(Number(inv.total_amount))}</td>
                        <td className="py-2 px-4 text-muted-foreground">{formatCurrency(Number(inv.amount_paid))}</td>
                        <td className="py-2 px-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[inv.status] || ""}`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions */}
        <TabsContent value="prescriptions" className="mt-4 space-y-4">
          {prescriptions.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No prescriptions found.</CardContent></Card>
          ) : prescriptions.map((rx: any) => (
            <Card key={rx.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">{(rx.staff as any)?.full_name || "Unknown"}</CardTitle>
                    <CardDescription>{rx.prescription_date}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(rx.prescription_medications || []).map((med: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                      <span className="h-5 w-5 rounded-full bg-secondary/20 text-secondary text-[10px] flex items-center justify-center font-medium shrink-0">{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.dosage} · {med.frequency} · {med.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
