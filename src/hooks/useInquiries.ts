import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  course: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InquiryInput {
  name: string;
  email: string;
  phone?: string;
  course?: string;
  message: string;
}

// Fetch all inquiries (admin only)
export const useInquiries = () => {
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Inquiry[];
    },
  });
};

// Create inquiry (public)
export const useCreateInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: InquiryInput) => {
      const { data, error } = await supabase
        .from("inquiries")
        .insert([{ ...input, status: "pending" }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
};

// Update inquiry status (admin only)
export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      const { data, error } = await supabase
        .from("inquiries")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
};

// Delete inquiry (admin only)
export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("inquiries")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
};
