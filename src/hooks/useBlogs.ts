import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  is_published: boolean;
  author_id: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface BlogInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  is_published?: boolean;
}

export const usePublishedBlogs = () => {
  return useQuery({
    queryKey: ["blogs", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Blog[];
    },
  });
};

export const useAllBlogs = () => {
  return useQuery({
    queryKey: ["blogs", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Blog[];
    },
  });
};

export const useBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["blogs", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      
      // Increment views
      await supabase.rpc("increment_blog_views", { blog_id: data.id });
      
      return data as Blog;
    },
    enabled: !!slug,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: BlogInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const insertData = {
        title: blog.title,
        slug: blog.slug || "",
        content: blog.content,
        excerpt: blog.excerpt,
        cover_image: blog.cover_image,
        is_published: blog.is_published,
        author_id: user?.id,
      };
      
      const { data, error } = await supabase
        .from("blogs")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data as Blog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...blog }: BlogInput & { id: string }) => {
      const { data, error } = await supabase
        .from("blogs")
        .update(blog)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Blog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
