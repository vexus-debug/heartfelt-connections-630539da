import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useInventory, useAddInventoryItem, useUpdateInventoryStock, useDeleteInventoryItem } from "@/hooks/useInventory";
import { EditInventoryDialog } from "@/components/dashboard/EditInventoryDialog";
import { useAuth } from "@/hooks/useAuth";
import type { InventoryItem } from "@/hooks/useInventory";

const categories = ["Consumables", "Materials", "Medication", "Instruments", "General"];

export default function InventoryPage() {
  const { data: inventory = [], isLoading } = useInventory();
  const addItem = useAddInventoryItem();
  const updateStock = useUpdateInventoryStock();
  const deleteItem = useDeleteInventoryItem();
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin");

  const [addOpen, setAddOpen] = useState(false);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState("");
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  // Add item form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newQuantity, setNewQuantity] = useState("");
  const [newMinStock, setNewMinStock] = useState("");
  const [newUnit, setNewUnit] = useState("pcs");
  const [newSupplier, setNewSupplier] = useState("");

  const lowStock = inventory.filter((i) => i.quantity <= i.min_stock);

  const handleAddItem = async () => {
    if (!newName.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    try {
      await addItem.mutateAsync({
        name: newName,
        category: newCategory,
        quantity: parseInt(newQuantity) || 0,
        min_stock: parseInt(newMinStock) || 5,
        unit: newUnit,
        supplier: newSupplier,
        last_restocked: new Date().toISOString().split("T")[0],
      });
      toast({ title: "Item added" });
      setAddOpen(false);
      setNewName(""); setNewQuantity(""); setNewMinStock(""); setNewSupplier("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleRestock = async () => {
    if (!restockId || !restockQty) return;
    const item = inventory.find((i) => i.id === restockId);
    if (!item) return;
    try {
      await updateStock.mutateAsync({ id: restockId, quantity: item.quantity + parseInt(restockQty) });
      toast({ title: "Stock updated" });
      setRestockId(null);
      setRestockQty("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast({ title: "Item deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">{inventory.length} items tracked</p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      {lowStock.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Low Stock Alert</p>
              <p className="text-xs text-amber-700">{lowStock.map((i) => i.name).join(", ")} are running low.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : inventory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No inventory items yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Item</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Category</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Stock</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Min</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Supplier</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Status</th>
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const isLow = item.quantity <= item.min_stock;
                    return (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="py-2.5 px-4 font-medium">{item.name}</td>
                        <td className="py-2.5 px-4 text-muted-foreground">{item.category}</td>
                        <td className="py-2.5 px-4 font-medium">{item.quantity} {item.unit}</td>
                        <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{item.min_stock}</td>
                        <td className="py-2.5 px-4 hidden md:table-cell text-muted-foreground">{item.supplier}</td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${isLow ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {isLow ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { setRestockId(item.id); setRestockQty(""); }}>
                              Restock
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditItem(item)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            {isAdmin && (
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Name *</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Latex Gloves" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Unit</Label>
                <Input value={newUnit} onChange={(e) => setNewUnit(e.target.value)} placeholder="pcs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Quantity</Label>
                <Input type="number" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Min Stock</Label>
                <Input type="number" value={newMinStock} onChange={(e) => setNewMinStock(e.target.value)} placeholder="5" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Supplier</Label>
              <Input value={newSupplier} onChange={(e) => setNewSupplier(e.target.value)} placeholder="Supplier name" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem} className="bg-secondary hover:bg-secondary/90" disabled={addItem.isPending}>
              {addItem.isPending ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={!!restockId} onOpenChange={(open) => !open && setRestockId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Restock Item</DialogTitle></DialogHeader>
          <div className="space-y-1">
            <Label className="text-xs">Quantity to Add</Label>
            <Input type="number" min={1} value={restockQty} onChange={(e) => setRestockQty(e.target.value)} placeholder="Enter quantity" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestockId(null)}>Cancel</Button>
            <Button onClick={handleRestock} className="bg-secondary hover:bg-secondary/90" disabled={updateStock.isPending}>
              {updateStock.isPending ? "Updating..." : "Update Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <EditInventoryDialog item={editItem} open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)} />
    </div>
  );
}
