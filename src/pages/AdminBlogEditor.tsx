import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  FileText,
  Settings,
  Image as ImageIcon,
  BarChart3,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AdvancedRichTextEditor from "@/components/editor/AdvancedRichTextEditor";
import ImageUploader from "@/components/editor/ImageUploader";
import BlogAutosaveIndicator from "@/components/blog/BlogAutosaveIndicator";
import {
  useAllBlogs,
  useCreateBlog,
  useUpdateBlog,
  BlogInput,
} from "@/hooks/useBlogs";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";

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

  const [focusMode, setFocusMode] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChangesRef = useRef(false);

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

  // Autosave functionality
  const autosave = useCallback(async () => {
    if (!isEditing || !existingBlog || !hasChangesRef.current) return;

    setAutosaveStatus("saving");
    try {
      await updateBlog.mutateAsync({ id: existingBlog.id, ...formData });
      setAutosaveStatus("saved");
      setLastSaved(new Date());
      hasChangesRef.current = false;
      setTimeout(() => setAutosaveStatus("idle"), 3000);
    } catch (error) {
      setAutosaveStatus("error");
    }
  }, [isEditing, existingBlog, formData, updateBlog]);

  // Trigger autosave on content changes
  useEffect(() => {
    if (!isEditing) return;

    hasChangesRef.current = true;

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      autosave();
    }, 5000);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [formData.content, formData.title, isEditing, autosave]);

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

  // Calculate stats
  const getTextFromHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const wordCount = getTextFromHtml(formData.content)
    .split(/\s+/)
    .filter(Boolean).length;
  const charCount = getTextFromHtml(formData.content).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Count headings for TOC preview
  const headingCount = (formData.content.match(/<h[1-3][^>]*>/g) || []).length;

  return (
    <div className={cn("min-h-screen bg-muted/30", focusMode && "bg-background")}>
      {!focusMode && <AdminSidebar />}

      <div className={cn("transition-all duration-300", !focusMode && "lg:ml-64 pt-16 lg:pt-0")}>
        <div className={cn("p-6 lg:p-8", focusMode && "max-w-5xl mx-auto py-4")}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3 flex-1">
                {!focusMode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/admin/blogs")}
                    className="shrink-0"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground truncate">
                      {isEditing ? "Edit Blog" : "New Blog Post"}
                    </h1>
                    {formData.is_published ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3.5 w-3.5" />
                      {wordCount} words
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {readingTime} min read
                    </span>
                    {headingCount > 0 && (
                      <span className="hidden sm:flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        {headingCount} headings
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isEditing && (
                  <BlogAutosaveIndicator
                    status={autosaveStatus}
                    lastSaved={lastSaved}
                    className="hidden md:flex"
                  />
                )}
                <div className="flex gap-2">
                  {isEditing && existingBlog && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/blog/${existingBlog.slug}`, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  )}
                  <Button
                    onClick={handleSubmit}
                    size="sm"
                    disabled={createBlog.isPending || updateBlog.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Update" : "Save"}
                  </Button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content - Takes 3 columns */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Title Input - Large and prominent */}
                  <div className="space-y-2">
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          title: e.target.value,
                          slug: generateSlug(e.target.value),
                        });
                      }}
                      placeholder="Enter your blog title..."
                      className="text-2xl md:text-3xl font-bold h-auto py-4 px-4 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                      required
                    />
                  </div>

                  {/* Editor */}
                  <AdvancedRichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Tell your story..."
                    onFocusModeChange={setFocusMode}
                  />
                </div>

                {/* Sidebar - Takes 1 column */}
                <div className={cn("space-y-4", focusMode && "hidden")}>
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="is_published" className="text-sm">
                          Publish
                        </Label>
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
                          ? "Visible to everyone"
                          : "Only you can see this"}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Cover Image */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Cover Image
                      </CardTitle>
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

                  {/* SEO Settings */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        SEO
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-xs">
                          URL Slug
                        </Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({ ...formData, slug: e.target.value })
                          }
                          placeholder="blog-url-slug"
                          className="h-8 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-xs">
                          Excerpt
                        </Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) =>
                            setFormData({ ...formData, excerpt: e.target.value })
                          }
                          placeholder="Brief summary for listings..."
                          rows={3}
                          className="text-sm resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.excerpt?.length || 0}/160 characters
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Writing Tips */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Writing Tips
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1.5">
                        <li>• Use H2 and H3 for structure</li>
                        <li>• Keep paragraphs short</li>
                        <li>• Add images to break up text</li>
                        <li>• Write a compelling excerpt</li>
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
