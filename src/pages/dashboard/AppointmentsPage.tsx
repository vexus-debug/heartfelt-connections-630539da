import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarPlus, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { addDays, subDays, format, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import { BookAppointmentDialog } from "@/components/dashboard/BookAppointmentDialog";
import { AppointmentDetailDialog } from "@/components/dashboard/AppointmentDetailDialog";
import { cn } from "@/lib/utils";
import { useAppointmentsByDate, type AppointmentRow } from "@/hooks/useAppointments";

const chairs = ["Chair 1", "Chair 2", "Chair 3"];
const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  "in-progress": "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookOpen, setBookOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRow | null>(null);

  const { data: appointments = [], isLoading } = useAppointmentsByDate(currentDate);

  const displayAppointments = appointments.map((a) => ({
    ...a,
    patientName: a.patients ? `${a.patients.first_name} ${a.patients.last_name}` : "Unknown",
    dentist: a.staff?.full_name || "Unknown",
    time: a.appointment_time,
    treatment: a.treatments?.name || "N/A",
  }));

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-sm text-muted-foreground">Manage and schedule patient visits</p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => setBookOpen(true)}>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentDate(viewMode === "day" ? subDays(currentDate, 1) : subWeeks(currentDate, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-base">
                    {viewMode === "day"
                      ? format(currentDate, "EEEE, MMMM d, yyyy")
                      : `${format(weekStart, "MMM d")} — ${format(addDays(weekStart, 6), "MMM d, yyyy")}`}
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentDate(viewMode === "day" ? addDays(currentDate, 1) : addWeeks(currentDate, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setCurrentDate(new Date())}>Today</Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                        Jump to date
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={currentDate} onSelect={(d) => d && setCurrentDate(d)} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                  <div className="flex border rounded-md overflow-hidden">
                    <button className={cn("px-2.5 py-1 text-xs", viewMode === "day" ? "bg-secondary text-secondary-foreground" : "bg-muted/50 hover:bg-muted")} onClick={() => setViewMode("day")}>Day</button>
                    <button className={cn("px-2.5 py-1 text-xs", viewMode === "week" ? "bg-secondary text-secondary-foreground" : "bg-muted/50 hover:bg-muted")} onClick={() => setViewMode("week")}>Week</button>
                  </div>
                </div>
                <div className="flex gap-2 hidden md:flex">
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
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-10 text-center">Loading appointments...</p>
              ) : viewMode === "day" ? (
                displayAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-10 text-center">No appointments scheduled for this day.</p>
                ) : (
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
                        const appointmentsAtTime = displayAppointments.filter((a) => a.time === time);
                        return (
                          <tr key={time} className="border-b hover:bg-muted/10">
                            <td className="py-2 px-3 text-xs text-muted-foreground font-mono">{time}</td>
                            {chairs.map((chair) => {
                              const apt = appointmentsAtTime.find((a) => a.chair === chair);
                              return (
                                <td key={chair} className="py-1 px-2">
                                  {apt ? (
                                    <div
                                      className={`rounded-md border p-2 text-xs cursor-pointer hover:shadow-md transition-shadow ${statusColors[apt.status] || ""}`}
                                      onClick={() => setSelectedAppointment(apt)}
                                    >
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
                )
              ) : (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  Week view — select a day to see appointments
                  <div className="grid grid-cols-7 gap-2 mt-4">
                    {weekDays.map((day) => {
                      const isToday = isSameDay(day, new Date());
                      return (
                        <button
                          key={day.toISOString()}
                          className={cn("p-3 rounded-lg border text-center hover:bg-muted/50 cursor-pointer", isToday && "bg-secondary/10 border-secondary")}
                          onClick={() => { setCurrentDate(day); setViewMode("day"); }}
                        >
                          <div className="text-[10px] uppercase text-muted-foreground">{format(day, "EEE")}</div>
                          <div className="text-lg font-medium">{format(day, "d")}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-10 text-center">Loading...</p>
              ) : displayAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground py-10 text-center">No appointments scheduled for this day.</p>
              ) : (
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
                    {displayAppointments.map((apt) => (
                      <tr key={apt.id} className="border-b last:border-0 hover:bg-muted/20 cursor-pointer" onClick={() => setSelectedAppointment(apt)}>
                        <td className="py-2.5 px-4 font-mono text-xs">{apt.time}</td>
                        <td className="py-2.5 px-4 font-medium">{apt.patientName}</td>
                        <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{apt.dentist}</td>
                        <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{apt.chair}</td>
                        <td className="py-2.5 px-4">{apt.treatment}</td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${(statusColors[apt.status] || "").split(" ").slice(0, 2).join(" ")}`}>
                            {apt.status.replace("-", " ")}
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
      </Tabs>

      <BookAppointmentDialog open={bookOpen} onOpenChange={setBookOpen} />
      <AppointmentDetailDialog appointment={selectedAppointment} open={!!selectedAppointment} onOpenChange={(o) => !o && setSelectedAppointment(null)} />
    </div>
  );
}
