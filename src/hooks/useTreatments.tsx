import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Treatment = Tables<"treatments">;

export function useTreatments() {
  return useQuery({
    queryKey: ["treatments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatments")
        .select("*")
        .order("category", { ascending: true });
      if (error) throw error;
      return data as Treatment[];
    },
  });
}
