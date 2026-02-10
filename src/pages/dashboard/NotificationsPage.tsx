import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CalendarDays, CreditCard, FlaskConical, CheckCircle2 } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const typeIcons: Record<string, typeof Bell> = {
  appointment: CalendarDays,
  payment: CreditCard,
  lab: FlaskConical,
};

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread notifications</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending || unread === 0}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 divide-y">
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-10 text-center">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">No notifications yet.</p>
          ) : (
            notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;
              return (
                <div
                  key={notif.id}
                  className={`flex gap-3 p-4 hover:bg-muted/20 transition-colors cursor-pointer ${!notif.read ? "bg-secondary/5" : ""}`}
                  onClick={() => !notif.read && markRead.mutate(notif.id)}
                >
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${!notif.read ? "bg-secondary/20" : "bg-muted"}`}>
                    <Icon className={`h-4 w-4 ${!notif.read ? "text-secondary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!notif.read ? "font-semibold" : "font-medium"}`}>{notif.title}</p>
                      {!notif.read && <span className="h-2 w-2 rounded-full bg-secondary shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
