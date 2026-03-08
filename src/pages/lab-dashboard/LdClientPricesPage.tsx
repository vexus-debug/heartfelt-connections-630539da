import { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, DollarSign, Percent } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useLdClientPrices, useAddLdClientPrice, useUpdateLdClientPrice, useDeleteLdClientPrice } from "@/hooks/useLdExtendedFeatures";
import { useLdClients, useLdWorkTypes } from "@/hooks/useLabDashboard";
import { motion } from "framer-motion";

export default function LdClientPricesPage() {
  const { data: prices = [], isLoading } = useLdClientPrices();
  const { data: clients = [] } = useLdClients();
  const { data: workTypes = [] } = useLdWorkTypes();
  const addPrice = useAddLdClientPrice();
  const updatePrice = useUpdateLdClientPrice();
  const deletePrice = useDeleteLdClientPrice();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<any>(null);
  const [filterClientId, setFilterClientId] = useState<string>("all");

  const [formClientId, setFormClientId] = useState("");
  const [formWorkTypeId, setFormWorkTypeId] = useState("");
  const [formCustomPrice, setFormCustomPrice] = useState(0);
  const [formDiscountPercent, setFormDiscountPercent] = useState(0);
  const [formEffectiveFrom, setFormEffectiveFrom] = useState(format(new Date(), "yyyy-MM-dd"));
  const [formEffectiveTo, setFormEffectiveTo] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const filteredPrices = useMemo(() => {
    if (filterClientId === "all") return prices;
    return prices.filter(p => p.client_id === filterClientId);
  }, [prices, filterClientId]);

  const resetForm = () => {
    setFormClientId("");
    setFormWorkTypeId("");
    setFormCustomPrice(0);
    setFormDiscountPercent(0);
    setFormEffectiveFrom(format(new Date(), "yyyy-MM-dd"));
    setFormEffectiveTo("");
    setFormNotes("");
    setEditingPrice(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (price: any) => {
    setEditingPrice(price);
    setFormClientId(price.client_id || "");
    setFormWorkTypeId(price.work_type_id || "");
    setFormCustomPrice(price.custom_price || 0);
    setFormDiscountPercent(price.discount_percent || 0);
    setFormEffectiveFrom(price.effective_from || "");
    setFormEffectiveTo(price.effective_to || "");
    setFormNotes(price.notes || "");
    setDialogOpen(true);
  };

  const handleWorkTypeChange = (wtId: string) => {
    setFormWorkTypeId(wtId);
    const wt = workTypes.find(w => w.id === wtId);
    if (wt) {
      setFormCustomPrice(wt.base_price || 0);
    }
  };

  const handleSave = async () => {
    if (!formClientId || !formWorkTypeId) {
      toast.error("Client and work type are required");
      return;
    }
    const payload = {
      client_id: formClientId,
      work_type_id: formWorkTypeId,
      custom_price: formCustomPrice,
      discount_percent: formDiscountPercent,
      effective_from: formEffectiveFrom || null,
      effective_to: formEffectiveTo || null,
      notes: formNotes,
    };
    try {
      if (editingPrice) {
        await updatePrice.mutateAsync({ id: editingPrice.id, ...payload });
        toast.success("Price updated");
      } else {
        await addPrice.mutateAsync(payload as any);
        toast.success("Custom price added");
      }
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this custom price?")) return;
    try {
      await deletePrice.mutateAsync(id);
      toast.success("Deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getClientName = (id: string | null) => clients.find(c => c.id === id)?.clinic_name || "Unknown";
  const getWorkTypeName = (id: string | null) => workTypes.find(w => w.id === id)?.name || "Unknown";
  const getBasePrice = (id: string | null) => workTypes.find(w => w.id === id)?.base_price || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Price Lists"
        description="Custom pricing and discounts per client"
      >
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" /> Add Custom Price
        </Button>
      </PageHeader>
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Custom Prices
          </CardTitle>
          <Select value={filterClientId} onValueChange={setFilterClientId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.clinic_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : filteredPrices.length === 0 ? (
            <p className="text-muted-foreground">No custom prices defined yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Work Type</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Custom Price</TableHead>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Effective From</TableHead>
                  <TableHead>Effective To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.map((p, idx) => {
                  const basePrice = getBasePrice(p.work_type_id);
                  const savings = basePrice - p.custom_price;
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b"
                    >
                      <TableCell className="font-medium">{getClientName(p.client_id)}</TableCell>
                      <TableCell>{getWorkTypeName(p.work_type_id)}</TableCell>
                      <TableCell className="text-muted-foreground">${basePrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="font-semibold">${p.custom_price.toFixed(2)}</span>
                        {savings > 0 && (
                          <Badge variant="outline" className="ml-2 text-emerald-600 border-emerald-300">
                            -${savings.toFixed(0)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {p.discount_percent ? (
                          <Badge variant="secondary" className="gap-1">
                            <Percent className="h-3 w-3" />
                            {p.discount_percent}%
                          </Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell>{p.effective_from ? format(new Date(p.effective_from), "MMM dd, yyyy") : "-"}</TableCell>
                      <TableCell>{p.effective_to ? format(new Date(p.effective_to), "MMM dd, yyyy") : "Ongoing"}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => openEditDialog(p)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPrice ? "Edit Custom Price" : "Add Custom Price"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Client *</Label>
              <Select value={formClientId} onValueChange={setFormClientId}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.clinic_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Work Type *</Label>
              <Select value={formWorkTypeId} onValueChange={handleWorkTypeChange}>
                <SelectTrigger><SelectValue placeholder="Select work type" /></SelectTrigger>
                <SelectContent>
                  {workTypes.filter(w => w.is_active).map(w => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name} (${w.base_price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Custom Price ($)</Label>
                <Input type="number" value={formCustomPrice} onChange={e => setFormCustomPrice(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Discount %</Label>
                <Input type="number" value={formDiscountPercent} onChange={e => setFormDiscountPercent(Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Effective From</Label>
                <Input type="date" value={formEffectiveFrom} onChange={e => setFormEffectiveFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Effective To</Label>
                <Input type="date" value={formEffectiveTo} onChange={e => setFormEffectiveTo(e.target.value)} placeholder="Leave empty for ongoing" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={addPrice.isPending || updatePrice.isPending}>
              {editingPrice ? "Save Changes" : "Add Price"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
