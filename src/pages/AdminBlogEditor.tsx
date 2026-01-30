import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAllBlogs,
  useCreateBlog,
  useUpdateBlog,
  BlogInput,
} from "@/hooks/useBlogs";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: blogs = [] } = useAllBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  const isEditing = id && id !== "new";
  const existingBlog = isEditing ? blogs.find((b) => b.id === id) : null;

  const [formData, setFormData] = useState<BlogInput>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    is_published: false,
  });

  useEffect(() => {
    if (existingBlog) {
      setFormData({
        title: existingBlog.title,
        slug: existingBlog.slug,
        excerpt: existingBlog.excerpt || "",
        content: existingBlog.content,
        cover_image: existingBlog.cover_image || "",
        is_published: existingBlog.is_published,
      });
    }
  }, [existingBlog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && existingBlog) {
        await updateBlog.mutateAsync({ id: existingBlog.id, ...formData });
        toast({
          title: "Blog Updated",
          description: "Your blog post has been updated successfully.",
        });
      } else {
        await createBlog.mutateAsync(formData);
        toast({
          title: "Blog Created",
          description: "Your blog post has been created successfully.",
        });
      }
      navigate("/admin/blogs");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save the blog post.",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />

      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/blogs")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {isEditing ? "Edit Blog" : "New Blog"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isEditing
                    ? "Update your blog post"
                    : "Create a new blog post"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              title: e.target.value,
                              slug: generateSlug(e.target.value),
                            });
                          }}
                          placeholder="Enter blog title"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({ ...formData, slug: e.target.value })
                          }
                          placeholder="blog-url-slug"
                        />
                        <p className="text-xs text-muted-foreground">
                          Leave empty to auto-generate from title
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) =>
                            setFormData({ ...formData, excerpt: e.target.value })
                          }
                          placeholder="Brief description of the blog post..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) =>
                            setFormData({ ...formData, content: e.target.value })
                          }
                          placeholder="Write your blog content here... (Supports Markdown)"
                          rows={15}
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Publish</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="is_published">Published</Label>
                        <Switch
                          id="is_published"
                          checked={formData.is_published}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, is_published: checked })
                          }
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formData.is_published
                          ? "This blog will be visible to everyone."
                          : "This blog is saved as a draft."}
                      </p>

                      <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1 gap-2">
                          <Save className="h-4 w-4" />
                          {isEditing ? "Update" : "Save"}
                        </Button>
                        {isEditing && existingBlog && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              window.open(`/blog/${existingBlog.slug}`, "_blank")
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cover Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor="cover_image">Image URL</Label>
                        <Input
                          id="cover_image"
                          value={formData.cover_image}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cover_image: e.target.value,
                            })
                          }
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      {formData.cover_image && (
                        <div className="mt-4">
                          <img
                            src={formData.cover_image}
                            alt="Cover preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;
