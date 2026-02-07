import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/editor/RichTextEditor";
import ImageUploader from "@/components/editor/ImageUploader";
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

  // Calculate word count and reading time
  const getTextFromHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
  
  const wordCount = getTextFromHtml(formData.content).split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">
                  {isEditing ? "Edit Blog" : "New Blog Post"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isEditing
                    ? "Update your blog post with rich formatting"
                    : "Create a new blog post with our advanced editor"}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Blog Content
                      </CardTitle>
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
                          placeholder="Enter an engaging blog title"
                          className="text-lg"
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
                          Auto-generated from title. Customize if needed.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt / Summary</Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) =>
                            setFormData({ ...formData, excerpt: e.target.value })
                          }
                          placeholder="Write a brief summary that will appear in blog listings..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rich Text Editor */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Editor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="editor" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="editor">Visual Editor</TabsTrigger>
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="editor">
                          <RichTextEditor
                            content={formData.content}
                            onChange={(content) =>
                              setFormData({ ...formData, content })
                            }
                            placeholder="Start writing your blog post... Use the toolbar above for formatting."
                          />
                        </TabsContent>
                        <TabsContent value="preview">
                          <div className="border border-border rounded-lg p-6 min-h-[400px] bg-background">
                            {formData.content ? (
                              <div 
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: formData.content }}
                              />
                            ) : (
                              <p className="text-muted-foreground">
                                Nothing to preview yet. Start writing in the editor.
                              </p>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Publish Settings</CardTitle>
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

                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Button 
                          type="submit" 
                          className="flex-1 gap-2"
                          disabled={createBlog.isPending || updateBlog.isPending}
                        >
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
                      <ImageUploader
                        value={formData.cover_image}
                        onChange={(url) =>
                          setFormData({ ...formData, cover_image: url })
                        }
                        bucket="blog-images"
                        folder="covers"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Use descriptive titles under 60 characters
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Write a compelling excerpt (150-160 chars)
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Include relevant keywords naturally
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Add images with descriptive alt text
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Use headings to structure content
                        </li>
                      </ul>
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
