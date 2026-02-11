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
  GraduationCap,
  Microscope,
  ClipboardList,
  DollarSign,
  Wrench,
  MessageSquare,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { hasPageAccess, getRoleLabel } from "@/config/roleAccess";
import { useUnreadCount, useRealtimeNotifications } from "@/hooks/useNotifications";
import { useUnreadMessageCount, useRealtimeMessages } from "@/hooks/useMessages";
import { motion } from "framer-motion";

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
      { title: "Revenue Allocation", url: "/dashboard/revenue-allocation", icon: DollarSign },
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
  {
    label: "Lab Management",
    items: [
      { title: "Lab Dashboard", url: "/dashboard/lab", icon: Microscope },
      { title: "Lab Cases", url: "/dashboard/lab/cases", icon: ClipboardList },
      { title: "Technicians", url: "/dashboard/lab/technicians", icon: Users },
      { title: "Lab Billing", url: "/dashboard/lab/billing", icon: DollarSign },
      { title: "Lab Settings", url: "/dashboard/lab/settings", icon: Wrench },
    ],
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, roles, signOut } = useAuth();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: unreadMsgCount = 0 } = useUnreadMessageCount();
  useRealtimeNotifications();
  useRealtimeMessages();

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
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-card/60 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border/40">
        <div className="relative shrink-0">
          <img src={logo} alt="Vista Dental" className="h-9 w-9 rounded-xl object-cover ring-2 ring-secondary/20" />
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-foreground truncate tracking-tight">Vista Dental</span>
            <span className="text-[10px] text-muted-foreground font-medium">Clinic Management</span>
          </div>
        )}
      </div>

      <SidebarContent className="pt-2 px-2">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => hasPageAccess(roles, item.url));
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold px-2 mb-0.5">
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
                            className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-accent/60 group"
                            activeClassName="bg-secondary/10 text-secondary font-medium shadow-sm"
                          >
                            {active && (
                              <motion.div
                                layoutId="sidebar-active-pill"
                                className="absolute inset-0 rounded-lg bg-secondary/10 border border-secondary/20"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                              />
                            )}
                            <item.icon className={`h-4 w-4 shrink-0 relative z-10 transition-transform duration-200 group-hover:scale-110 ${active ? "text-secondary" : "text-muted-foreground"}`} />
                            <span className="relative z-10">{item.title}</span>
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
              {hasPageAccess(roles, "/dashboard/messages") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Messages">
                    <NavLink
                      to="/dashboard/messages"
                      className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-accent/60 group"
                      activeClassName="bg-secondary/10 text-secondary font-medium"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <span>Messages</span>
                      {!collapsed && unreadMsgCount > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 min-w-5 text-[10px] px-1.5 animate-pulse">
                          {unreadMsgCount}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {hasPageAccess(roles, "/dashboard/notifications") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Notifications">
                    <NavLink
                      to="/dashboard/notifications"
                      className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-accent/60 group"
                      activeClassName="bg-secondary/10 text-secondary font-medium"
                    >
                      <Bell className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <span>Notifications</span>
                      {!collapsed && unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 min-w-5 text-[10px] px-1.5 animate-pulse">
                          {unreadCount}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {hasPageAccess(roles, "/dashboard/tutorials") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Tutorials">
                    <NavLink
                      to="/dashboard/tutorials"
                      className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-accent/60 group"
                      activeClassName="bg-secondary/10 text-secondary font-medium"
                    >
                      <GraduationCap className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <span>Tutorials</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {hasPageAccess(roles, "/dashboard/settings") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <NavLink
                      to="/dashboard/settings"
                      className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-accent/60 group"
                      activeClassName="bg-secondary/10 text-secondary font-medium"
                    >
                      <Settings className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <span>Settings</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="border-t border-border/40 p-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard/profile")} className="shrink-0 group" title="My Profile">
            <Avatar className="h-8 w-8 ring-2 ring-secondary/20 transition-all duration-200 group-hover:ring-secondary/40">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-to-br from-secondary/20 to-secondary/10 text-secondary text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
          </button>
          {!collapsed && (
            <button onClick={() => navigate("/dashboard/profile")} className="flex flex-col overflow-hidden flex-1 text-left hover:opacity-80 transition-opacity">
              <span className="text-sm font-medium truncate">{displayName}</span>
              <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 mt-0.5 border-secondary/30 text-secondary/80">
                {getRoleLabel(primaryRole)}
              </Badge>
            </button>
          )}
          {!collapsed && (
            <button
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10"
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
