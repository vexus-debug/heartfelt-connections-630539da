import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CalendarDays, CreditCard, FlaskConical, CheckCircle2 } from "lucide-react";

const notifications = [
  { id: 1, type: "appointment", title: "Appointment Reminder", message: "Amina Yusuf has an orthodontic check at 10:30 AM", time: "5 min ago", read: false },
  { id: 2, type: "payment", title: "Payment Overdue", message: "Ibrahim Musa has ₦120,000 outstanding balance (30+ days)", time: "1 hour ago", read: false },
  { id: 3, type: "lab", title: "Lab Work Ready", message: "PFM Crown for Ngozi Eze received from Lagos Dental Lab", time: "2 hours ago", read: false },
  { id: 4, type: "appointment", title: "Walk-in Patient", message: "Grace Okafor registered as walk-in for veneer consultation", time: "3 hours ago", read: true },
  { id: 5, type: "payment", title: "Payment Received", message: "₦45,000 received from Adewale Johnson (Root Canal)", time: "4 hours ago", read: true },
  { id: 6, type: "lab", title: "Lab Order Sent", message: "Porcelain veneers x4 sent to Precision Dental for Blessing Nnamdi", time: "Yesterday", read: true },
  { id: 7, type: "appointment", title: "Appointment Cancelled", message: "Tunde Bakare cancelled tomorrow's appointment", time: "Yesterday", read: true },
];

const typeIcons: Record<string, typeof Bell> = {
  appointment: CalendarDays,
  payment: CreditCard,
  lab: FlaskConical,
};

export default function NotificationsPage() {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread notifications</p>
        </div>
        <Button variant="outline" size="sm">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 divide-y">
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Bell;
            return (
              <div key={notif.id} className={`flex gap-3 p-4 hover:bg-muted/20 transition-colors ${!notif.read ? "bg-secondary/5" : ""}`}>
                <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${!notif.read ? "bg-secondary/20" : "bg-muted"}`}>
                  <Icon className={`h-4 w-4 ${!notif.read ? "text-secondary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!notif.read ? "font-semibold" : "font-medium"}`}>{notif.title}</p>
                    {!notif.read && <span className="h-2 w-2 rounded-full bg-secondary shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
