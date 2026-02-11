import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useClinicSettings, useUpdateClinicSettings } from "@/hooks/useClinicSettings";
import { useNotificationPreferences, useUpsertNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useAllUsersWithRoles, useAssignRole, useRemoveRole } from "@/hooks/useUserRoles";
import { useAuth } from "@/hooks/useAuth";
import { getRoleLabel } from "@/config/roleAccess";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { motion } from "framer-motion";

const allRoles = ["admin", "dentist", "assistant", "hygienist", "receptionist", "accountant"] as const;

export default function SettingsPage() {
  const { roles: myRoles } = useAuth();
  const isAdmin = myRoles.includes("admin");

  // Clinic settings
  const { data: clinicSettings } = useClinicSettings();
  const updateClinic = useUpdateClinicSettings();
  const [clinicForm, setClinicForm] = useState<Record<string, string>>({});

  const getClinicValue = (key: string) => clinicForm[key] ?? (clinicSettings as any)?.[key] ?? "";

  const handleSaveClinic = () => {
    if (!clinicSettings) return;
    updateClinic.mutate({ id: clinicSettings.id, ...clinicForm });
  };

  // Notification preferences
  const { data: notifPrefs } = useNotificationPreferences();
  const upsertPrefs = useUpsertNotificationPreferences();

  const handleTogglePref = (key: string, value: boolean) => {
    upsertPrefs.mutate({ [key]: value });
  };

  // Roles & access
  const { data: users = [] } = useAllUsersWithRoles();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();
  const [addRoleUserId, setAddRoleUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  const handleAssignRole = () => {
    if (!addRoleUserId || !newRole) return;
    assignRole.mutate({ user_id: addRoleUserId, role: newRole as any });
    setAddRoleUserId(null);
    setNewRole("");
  };

  const notifItems = [
    { key: "appointment_reminders", label: "Appointment Reminders", desc: "Send reminders before appointments" },
    { key: "payment_alerts", label: "Payment Alerts", desc: "Notify on overdue payments" },
    { key: "lab_completion_alerts", label: "Lab Completion Alerts", desc: "Notify when lab work is ready" },
    { key: "low_stock_alerts", label: "Low Stock Alerts", desc: "Alert when inventory is low" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage clinic profile and preferences" />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="clinic">
          <TabsList className="bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="clinic">Clinic Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {isAdmin && <TabsTrigger value="roles">Roles & Access</TabsTrigger>}
          </TabsList>

          <TabsContent value="clinic" className="mt-4">
            <Card className="glass-card">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-base">Clinic Information</CardTitle>
                <CardDescription>Update your clinic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-lg pt-6">
                <div className="space-y-2">
                  <Label htmlFor="clinicName" className="text-xs font-medium">Clinic Name</Label>
                  <Input id="clinicName" className="bg-muted/30 border-border/40" value={getClinicValue("clinic_name")} onChange={(e) => setClinicForm({ ...clinicForm, clinic_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-medium">Address</Label>
                  <Input id="address" className="bg-muted/30 border-border/40" value={getClinicValue("address")} onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-medium">Phone</Label>
                    <Input id="phone" className="bg-muted/30 border-border/40" value={getClinicValue("phone")} onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <Input id="email" className="bg-muted/30 border-border/40" value={getClinicValue("email")} onChange={(e) => setClinicForm({ ...clinicForm, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openTime" className="text-xs font-medium">Opening Time</Label>
                    <Input id="openTime" className="bg-muted/30 border-border/40" value={getClinicValue("opening_time")} onChange={(e) => setClinicForm({ ...clinicForm, opening_time: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closeTime" className="text-xs font-medium">Closing Time</Label>
                    <Input id="closeTime" className="bg-muted/30 border-border/40" value={getClinicValue("closing_time")} onChange={(e) => setClinicForm({ ...clinicForm, closing_time: e.target.value })} />
                  </div>
                </div>
                <Button className="bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" onClick={handleSaveClinic} disabled={updateClinic.isPending || !isAdmin}>
                  {updateClinic.isPending ? "Saving..." : "Save Changes"}
                </Button>
                {!isAdmin && <p className="text-xs text-muted-foreground">Only admins can update clinic settings</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <Card className="glass-card">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription>Control what alerts you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 max-w-lg pt-4">
                {notifItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifPrefs ? (notifPrefs as any)[item.key] : true}
                      onCheckedChange={(checked) => handleTogglePref(item.key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="roles" className="mt-4">
              <Card className="glass-card">
                <CardHeader className="border-b border-border/30">
                  <CardTitle className="text-base">User Roles</CardTitle>
                  <CardDescription>Manage access levels for each user</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {users.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No users found.</p>
                    ) : (
                      users.map((user) => (
                        <div key={user.user_id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card/50 hover:bg-accent/20 transition-colors">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.full_name || "Unnamed User"}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.roles.length === 0 ? (
                                <span className="text-xs text-muted-foreground">No roles assigned</span>
                              ) : (
                                user.roles.map((role) => (
                                  <Badge key={role} variant="secondary" className="text-[10px] gap-1 bg-secondary/10 text-secondary border-secondary/20">
                                    {getRoleLabel(role)}
                                    <button onClick={() => removeRole.mutate({ user_id: user.user_id, role: role as any })} className="hover:text-red-600 transition-colors">
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))
                              )}
                            </div>
                          </div>
                          {addRoleUserId === user.user_id ? (
                            <div className="flex items-center gap-2">
                              <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger className="w-32 h-8 text-xs bg-muted/30"><SelectValue placeholder="Select role" /></SelectTrigger>
                                <SelectContent>
                                  {allRoles.filter((r) => !user.roles.includes(r)).map((r) => (
                                    <SelectItem key={r} value={r} className="capitalize text-xs">{getRoleLabel(r)}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button size="sm" className="h-8 text-xs bg-secondary hover:bg-secondary/90" onClick={handleAssignRole} disabled={!newRole}>
                                Add
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setAddRoleUserId(null)}>
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" className="h-8 text-xs border-border/50" onClick={() => { setAddRoleUserId(user.user_id); setNewRole(""); }}>
                              <Plus className="mr-1 h-3 w-3" /> Add Role
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
}