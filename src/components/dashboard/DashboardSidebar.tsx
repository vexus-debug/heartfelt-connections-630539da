import { NavLink } from "@/components/NavLink";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Stethoscope,
  CreditCard,
  FlaskConical,
  UserCog,
  Package,
  BarChart3,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { hasPageAccess, getRoleLabel } from "@/config/roleAccess";

const navGroups = [
  {
    label: "General",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Patients", url: "/dashboard/patients", icon: Users },
      { title: "Appointments", url: "/dashboard/appointments", icon: CalendarDays },
    ],
  },
  {
    label: "Clinical",
    items: [
      { title: "Dental Charts", url: "/dashboard/dental-charts", icon: Stethoscope },
      { title: "Treatments", url: "/dashboard/treatments", icon: Stethoscope },
      { title: "Prescriptions", url: "/dashboard/prescriptions", icon: Stethoscope },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
      { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Lab Work", url: "/dashboard/lab-work", icon: FlaskConical },
      { title: "Staff", url: "/dashboard/staff", icon: UserCog },
      { title: "Inventory", url: "/dashboard/inventory", icon: Package },
    ],
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, roles, signOut } = useAuth();

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Staff";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const primaryRole = roles[0] || "staff";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-card">
      <div className="flex items-center gap-2 px-4 py-4 border-b">
        <img src={logo} alt="Vista Dental" className="h-9 w-9 rounded-full object-cover shrink-0" />
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-primary truncate">Vista Dental</span>
            <span className="text-[10px] text-muted-foreground">Clinic Management</span>
          </div>
        )}
      </div>

      <SidebarContent className="pt-2">
        {navGroups.map((group) => {
          // Filter items by role access
          const visibleItems = group.items.filter((item) => hasPageAccess(roles, item.url));
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const active = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                          <NavLink
                            to={item.url}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                            activeClassName="bg-secondary/10 text-secondary font-medium"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {hasPageAccess(roles, "/dashboard/notifications") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Notifications">
                    <NavLink
                      to="/dashboard/notifications"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                      activeClassName="bg-secondary/10 text-secondary font-medium"
                    >
                      <Bell className="h-4 w-4 shrink-0" />
                      <span>Notifications</span>
                      {!collapsed && (
                        <Badge variant="destructive" className="ml-auto h-5 min-w-5 text-[10px] px-1.5">
                          5
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {hasPageAccess(roles, "/dashboard/settings") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <NavLink
                      to="/dashboard/settings"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                      activeClassName="bg-secondary/10 text-secondary font-medium"
                    >
                      <Settings className="h-4 w-4 shrink-0" />
                      <span>Settings</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-secondary/20 text-secondary text-xs">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden flex-1">
              <span className="text-sm font-medium truncate">{displayName}</span>
              <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 mt-0.5">
                {getRoleLabel(primaryRole)}
              </Badge>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
