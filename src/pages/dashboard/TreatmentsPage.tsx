import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useTreatments, useDeleteTreatment, type Treatment } from "@/hooks/useTreatments";
import { TreatmentDialog } from "@/components/dashboard/TreatmentDialog";
import { useAuth } from "@/hooks/useAuth";

export default function TreatmentsPage() {
  const [search, setSearch] = useState("");
  const { data: treatments = [], isLoading } = useTreatments();
  const deleteTreatment = useDeleteTreatment();
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTreatment, setEditTreatment] = useState<Treatment | null>(null);

  const filtered = treatments.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
  const categories = [...new Set(treatments.map((t) => t.category))];

  const handleDelete = async (id: string) => {
    await deleteTreatment.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Treatments & Procedures</h1>
          <p className="text-sm text-muted-foreground">Treatment catalog with pricing</p>
        </div>
        {isAdmin && (
          <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => { setEditTreatment(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Treatment
          </Button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search treatments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-10">Loading treatments...</p>
      ) : (
        categories.map((cat) => {
          const catTreatments = filtered.filter((t) => t.category === cat);
          if (catTreatments.length === 0) return null;
          return (
            <div key={cat}>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3">{cat}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {catTreatments.map((t) => (
                  <Card key={t.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{t.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1 shrink-0 ml-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditTreatment(t); setDialogOpen(true); }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleDelete(t.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm font-bold text-secondary">₦{t.price.toLocaleString()}</span>
                        <span className="text-[10px] text-muted-foreground">{t.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })
      )}

      <TreatmentDialog treatment={editTreatment} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
