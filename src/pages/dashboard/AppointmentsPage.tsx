import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { todayAppointments } from "@/data/mockDashboardData";

const chairs = ["Chair 1", "Chair 2", "Chair 3"];
const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  "in-progress": "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-sm text-muted-foreground">Manage and schedule patient visits</p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Schedule View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-base">Monday, February 10, 2026</CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  {Object.entries(statusColors).map(([status, color]) => (
                    <div key={status} className="flex items-center gap-1">
                      <span className={`h-2.5 w-2.5 rounded-full ${color.split(" ")[0]}`} />
                      <span className="text-[10px] text-muted-foreground capitalize">{status.replace("-", " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="py-2 px-3 text-left font-medium text-muted-foreground w-24">Time</th>
                    {chairs.map((chair) => (
                      <th key={chair} className="py-2 px-3 text-left font-medium text-muted-foreground">{chair}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time) => {
                    const appointmentsAtTime = todayAppointments.filter((a) => a.time === time);
                    return (
                      <tr key={time} className="border-b hover:bg-muted/10">
                        <td className="py-2 px-3 text-xs text-muted-foreground font-mono">{time}</td>
                        {chairs.map((chair) => {
                          const apt = appointmentsAtTime.find((a) => a.chair === chair);
                          return (
                            <td key={chair} className="py-1 px-2">
                              {apt ? (
                                <div className={`rounded-md border p-2 text-xs ${statusColors[apt.status]}`}>
                                  <p className="font-medium truncate">{apt.patientName}</p>
                                  <p className="opacity-75 truncate">{apt.treatment}</p>
                                  <p className="opacity-60 text-[10px]">{apt.dentist}</p>
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Time</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Patient</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Dentist</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Chair</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Treatment</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="py-2.5 px-4 font-mono text-xs">{apt.time}</td>
                      <td className="py-2.5 px-4 font-medium">{apt.patientName}</td>
                      <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{apt.dentist}</td>
                      <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{apt.chair}</td>
                      <td className="py-2.5 px-4">{apt.treatment}</td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[apt.status].split(" ").slice(0, 2).join(" ")}`}>
                          {apt.status.replace("-", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
