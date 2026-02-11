import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AllocationRule {
  id: string;
  category: string;
  percentage: number;
  is_active: boolean;
  updated_at: string;
}

interface RevenueAllocation {
  id: string;
  payment_id: string;
  category: string;
  percentage: number;
  amount: number;
  created_at: string;
}

export function useAllocationRules() {
  return useQuery({
    queryKey: ["revenue-allocation-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revenue_allocation_rules" as any)
        .select("*")
        .order("category");
      if (error) throw error;
      return (data as any[]) as AllocationRule[];
    },
  });
}

export function useUpdateAllocationRules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rules: { id: string; percentage: number; is_active: boolean }[]) => {
      for (const rule of rules) {
        const { error } = await supabase
          .from("revenue_allocation_rules" as any)
          .update({ percentage: rule.percentage, is_active: rule.is_active } as any)
          .eq("id", rule.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue-allocation-rules"] });
      toast.success("Allocation rules updated");
    },
    onError: (err: any) => toast.error(err.message),
  });
}

export function useRevenueSummary() {
  return useQuery({
    queryKey: ["revenue-summary"],
    queryFn: async () => {
      // Total revenue all time
      const { data: allPayments, error: e1 } = await supabase
        .from("payments")
        .select("amount");
      if (e1) throw e1;

      const now = new Date();
      const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

      const { data: monthPayments, error: e2 } = await supabase
        .from("payments")
        .select("amount")
        .gte("payment_date", startOfMonth);
      if (e2) throw e2;

      const { data: warChest, error: e3 } = await supabase
        .from("war_chest_entries" as any)
        .select("excess_amount");
      if (e3) throw e3;

      const totalRevenue = (allPayments || []).reduce((s, p) => s + Number(p.amount), 0);
      const monthRevenue = (monthPayments || []).reduce((s, p) => s + Number(p.amount), 0);
      const warChestTotal = ((warChest as any[]) || []).reduce((s, w) => s + Number(w.excess_amount), 0);

      return { totalRevenue, monthRevenue, warChestTotal };
    },
  });
}

export function useAllocationBreakdown() {
  return useQuery({
    queryKey: ["allocation-breakdown"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revenue_allocations" as any)
        .select("category, percentage, amount, created_at");
      if (error) throw error;

      const now = new Date();
      const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

      const rows = (data as any[]) || [];
      const categories: Record<string, { allTime: number; thisMonth: number; percentage: number }> = {};

      for (const row of rows) {
        if (!categories[row.category]) {
          categories[row.category] = { allTime: 0, thisMonth: 0, percentage: Number(row.percentage) };
        }
        categories[row.category].allTime += Number(row.amount);
        if (row.created_at >= startOfMonth) {
          categories[row.category].thisMonth += Number(row.amount);
        }
      }

      return Object.entries(categories).map(([category, vals]) => ({
        category,
        ...vals,
      }));
    },
  });
}

export function useHistoricalAllocations() {
  return useQuery({
    queryKey: ["historical-allocations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revenue_allocations" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;

      const rows = (data as any[]) as RevenueAllocation[];

      // Group by payment_id
      const grouped: Record<string, { created_at: string; payment_id: string; total: number; categories: Record<string, number> }> = {};
      for (const row of rows) {
        if (!grouped[row.payment_id]) {
          grouped[row.payment_id] = { created_at: row.created_at, payment_id: row.payment_id, total: 0, categories: {} };
        }
        grouped[row.payment_id].total += Number(row.amount);
        grouped[row.payment_id].categories[row.category] = Number(row.amount);
      }

      return Object.values(grouped).sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
  });
}
