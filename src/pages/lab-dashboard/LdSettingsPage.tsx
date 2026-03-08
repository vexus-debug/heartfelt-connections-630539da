import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLdSettings } from "@/hooks/useLabDashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function LdSettingsPage() {
  const { data: settings, isLoading } = useLdSettings();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ lab_name: "", address: "", phone: "", email: "" });

  useEffect(() => {
    if (settings) {
      setForm({
        lab_name: settings.lab_name || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings?.id) return;
    setSaving(true);
    const { error } = await supabase.from("ld_settings").update(form as any).eq("id", settings.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  };

  if (isLoading) return <p className="text-muted-foreground p-8">Loading...</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lab Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your lab details</p>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Lab Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Lab Name</Label><Input value={form.lab_name} onChange={(e) => setForm(f => ({ ...f, lab_name: e.target.value }))} /></div>
          <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          </div>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
