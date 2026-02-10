import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage clinic profile and preferences</p>
      </div>

      <Tabs defaultValue="clinic">
        <TabsList>
          <TabsTrigger value="clinic">Clinic Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="roles">Roles & Access</TabsTrigger>
        </TabsList>

        <TabsContent value="clinic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Clinic Information</CardTitle>
              <CardDescription>Update your clinic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <Label htmlFor="clinicName">Clinic Name</Label>
                <Input id="clinicName" defaultValue="Vista Dental Care" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Dental Avenue, Lekki, Lagos" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="070 8878 8880" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="Vista.dcs@gmail.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Opening Time</Label>
                  <Input id="openTime" defaultValue="08:00 AM" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Closing Time</Label>
                  <Input id="closeTime" defaultValue="05:00 PM" />
                </div>
              </div>
              <Button className="bg-secondary hover:bg-secondary/90">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              {[
                { label: "Appointment Reminders", desc: "Send reminders before appointments" },
                { label: "Payment Alerts", desc: "Notify on overdue payments" },
                { label: "Lab Completion Alerts", desc: "Notify when lab work is ready" },
                { label: "Low Stock Alerts", desc: "Alert when inventory is low" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">User Roles</CardTitle>
              <CardDescription>Manage access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Admin", "Dentist", "Assistant", "Receptionist", "Accountant"].map((role) => (
                  <div key={role} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">{role}</p>
                      <p className="text-xs text-muted-foreground">
                        {role === "Admin" ? "Full access to all features" : role === "Dentist" ? "Clinical features, patient records" : role === "Receptionist" ? "Appointments, patient registration" : role === "Accountant" ? "Billing, payments, reports" : "Limited clinical access"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
