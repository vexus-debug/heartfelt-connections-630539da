import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useTreatments } from "@/hooks/useTreatments";
import { useState } from "react";

export default function TreatmentsPage() {
  const [search, setSearch] = useState("");
  const { data: treatments = [], isLoading } = useTreatments();

  const filtered = treatments.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
  const categories = [...new Set(treatments.map((t) => t.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Treatments & Procedures</h1>
        <p className="text-sm text-muted-foreground">Treatment catalog with pricing</p>
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
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
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
    </div>
  );
}
