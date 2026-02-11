import { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Vault, Save, Pencil, X } from "lucide-react";
import {
  useAllocationRules,
  useUpdateAllocationRules,
  useRevenueSummary,
  useAllocationBreakdown,
  useHistoricalAllocations,
} from "@/hooks/useRevenueAllocation";
import { format } from "date-fns";

const fmt = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function RevenueAllocationPage() {
  const { data: rules, isLoading: loadingRules } = useAllocationRules();
  const { data: summary, isLoading: loadingSummary } = useRevenueSummary();
  const { data: breakdown, isLoading: loadingBreakdown } = useAllocationBreakdown();
  const { data: history, isLoading: loadingHistory } = useHistoricalAllocations();
  const updateRules = useUpdateAllocationRules();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<{ id: string; category: string; percentage: number; is_active: boolean }[]>([]);

  const startEdit = () => {
    if (rules) {
      setDraft(rules.map((r) => ({ id: r.id, category: r.category, percentage: r.percentage, is_active: r.is_active })));
      setEditing(true);
    }
  };

  const draftTotal = useMemo(() => draft.reduce((s, d) => s + (d.percentage || 0), 0), [draft]);
  const isValid = Math.abs(draftTotal - 100) < 0.01;

  const handleSave = () => {
    updateRules.mutate(draft, { onSuccess: () => setEditing(false) });
  };

  const toggleActive = (active: boolean) => {
    if (!rules) return;
    const updated = rules.map((r) => ({ id: r.id, percentage: r.percentage, is_active: active }));
    updateRules.mutate(updated);
  };

  const isActive = rules?.some((r) => r.is_active) ?? false;

  const allCategories = useMemo(() => {
    const cats = ["Direct Costs", "Base Operations", "Volume Bonus Pool", "Clinical Savings", "Investors", "Tithe"];
    return cats;
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Revenue Allocation" description="Automatic revenue splitting and tracking" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard icon={DollarSign} label="Total Revenue" value={summary ? fmt(summary.totalRevenue) : undefined} loading={loadingSummary} />
        <SummaryCard icon={TrendingUp} label="Revenue This Month" value={summary ? fmt(summary.monthRevenue) : undefined} loading={loadingSummary} />
        <SummaryCard icon={Vault} label="War Chest Balance" value={summary ? fmt(summary.warChestTotal) : undefined} loading={loadingSummary} accent />
      </div>

      {/* Rules Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-semibold">Allocation Rules</CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{isActive ? "Active" : "Disabled"}</span>
              <Switch checked={isActive} onCheckedChange={toggleActive} disabled={loadingRules} />
            </div>
            {!editing ? (
              <Button variant="outline" size="sm" onClick={startEdit} disabled={loadingRules}>
                <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  <X className="h-3.5 w-3.5 mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={!isValid || updateRules.isPending}>
                  <Save className="h-3.5 w-3.5 mr-1.5" /> Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loadingRules ? (
            <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : editing ? (
            <div className="space-y-2">
              {draft.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="text-sm w-40">{d.category}</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    className="w-24 h-8 text-sm"
                    value={d.percentage}
                    onChange={(e) => {
                      const next = [...draft];
                      next[i] = { ...next[i], percentage: Number(e.target.value) };
                      setDraft(next);
                    }}
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t">
                <span className="text-sm font-semibold w-40">Total</span>
                <Badge variant={isValid ? "default" : "destructive"} className="text-sm">
                  {draftTotal.toFixed(2)}%
                </Badge>
                {!isValid && <span className="text-xs text-destructive">Must equal 100%</span>}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules?.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm">{r.category}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{r.percentage}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell className="text-sm font-semibold">Total</TableCell>
                  <TableCell className="text-right text-sm font-bold">
                    {rules?.reduce((s, r) => s + r.percentage, 0)}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Allocation Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Allocation Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingBreakdown ? (
            <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                  <TableHead className="text-right">All-Time</TableHead>
                  <TableHead className="text-right">This Month</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(breakdown && breakdown.length > 0) ? breakdown.map((b) => (
                  <TableRow key={b.category}>
                    <TableCell className="text-sm">{b.category}</TableCell>
                    <TableCell className="text-right text-sm">{b.percentage}%</TableCell>
                    <TableCell className="text-right text-sm font-medium">{fmt(b.allTime)}</TableCell>
                    <TableCell className="text-right text-sm">{fmt(b.thisMonth)}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                      No allocation data yet. Allocations are created automatically when payments are recorded.
                    </TableCell>
                  </TableRow>
                )}
                {breakdown && breakdown.length > 0 && (
                  <TableRow className="border-t-2 font-semibold">
                    <TableCell className="text-sm">Total</TableCell>
                    <TableCell />
                    <TableCell className="text-right text-sm">{fmt(breakdown.reduce((s, b) => s + b.allTime, 0))}</TableCell>
                    <TableCell className="text-right text-sm">{fmt(breakdown.reduce((s, b) => s + b.thisMonth, 0))}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Historical Allocations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Historical Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : history && history.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    {allCategories.map((c) => (
                      <TableHead key={c} className="text-right text-xs">{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.slice(0, 50).map((h) => (
                    <TableRow key={h.payment_id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {format(new Date(h.created_at), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">{fmt(h.total)}</TableCell>
                      {allCategories.map((c) => (
                        <TableCell key={c} className="text-right text-sm">
                          {h.categories[c] ? fmt(h.categories[c]) : "—"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No historical allocations recorded yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, loading, accent }: { icon: any; label: string; value?: string; loading: boolean; accent?: boolean }) {
  return (
    <Card className={accent ? "border-secondary/30 bg-secondary/5" : ""}>
      <CardContent className="flex items-center gap-4 py-5">
        <div className={`rounded-xl p-2.5 ${accent ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          {loading ? <Skeleton className="h-6 w-28 mt-1" /> : <p className="text-xl font-bold tracking-tight">{value}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
