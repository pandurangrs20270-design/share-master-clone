import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SyllabusTopic {
  id: string;
  title: string;
  description: string | null;
  content: string;
  order_index: number;
  course_type: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SyllabusInput {
  title: string;
  description?: string;
  content: string;
  order_index?: number;
  course_type?: string;
  is_published?: boolean;
}

export const usePublishedSyllabus = () => {
  return useQuery({
    queryKey: ["syllabus", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("syllabus_topics")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as SyllabusTopic[];
    },
  });
};

export const useAllSyllabus = () => {
  return useQuery({
    queryKey: ["syllabus", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("syllabus_topics")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as SyllabusTopic[];
    },
  });
};

export const useCreateSyllabusTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topic: SyllabusInput) => {
      const { data, error } = await supabase
        .from("syllabus_topics")
        .insert(topic)
        .select()
        .single();

      if (error) throw error;
      return data as SyllabusTopic;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syllabus"] });
    },
  });
};

export const useUpdateSyllabusTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...topic }: SyllabusInput & { id: string }) => {
      const { data, error } = await supabase
        .from("syllabus_topics")
        .update(topic)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as SyllabusTopic;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syllabus"] });
    },
  });
};

export const useDeleteSyllabusTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("syllabus_topics")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syllabus"] });
    },
  });
};
