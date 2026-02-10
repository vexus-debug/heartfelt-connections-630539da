import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type StaffMember = Tables<"staff">;

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("full_name");
      if (error) throw error;
      return data as StaffMember[];
    },
  });
}

export function useDentists() {
  return useQuery({
    queryKey: ["staff", "dentists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("role", "dentist")
        .eq("status", "active")
        .order("full_name");
      if (error) throw error;
      return data as StaffMember[];
    },
  });
}
