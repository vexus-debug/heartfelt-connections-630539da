import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useDentalChartEntries(patientId: string | undefined) {
  return useQuery({
    queryKey: ["dental-chart", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dental_chart_entries")
        .select("*, staff:dentist_id(full_name)")
        .eq("patient_id", patientId!)
        .order("entry_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateDentalChartEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: {
      patient_id: string;
      tooth_number: number;
      procedure: string;
      status: string;
      entry_date: string;
      notes?: string;
      dentist_id?: string;
    }) => {
      const { data, error } = await supabase
        .from("dental_chart_entries")
        .insert(entry)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dental-chart", data.patient_id] });
      toast({ title: "Procedure recorded", description: `${data.procedure} on tooth #${data.tooth_number}` });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
