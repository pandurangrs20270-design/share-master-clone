import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAllSyllabus,
  useCreateSyllabusTopic,
  useUpdateSyllabusTopic,
  SyllabusInput,
} from "@/hooks/useSyllabus";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminSyllabusEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: syllabus = [] } = useAllSyllabus();
  const createTopic = useCreateSyllabusTopic();
  const updateTopic = useUpdateSyllabusTopic();

  const isEditing = id && id !== "new";
  const existingTopic = isEditing ? syllabus.find((t) => t.id === id) : null;

  const [formData, setFormData] = useState<SyllabusInput>({
    title: "",
    description: "",
    content: "",
    order_index: syllabus.length,
    course_type: "general",
    is_published: false,
  });

  useEffect(() => {
    if (existingTopic) {
      setFormData({
        title: existingTopic.title,
        description: existingTopic.description || "",
        content: existingTopic.content,
        order_index: existingTopic.order_index,
        course_type: existingTopic.course_type,
        is_published: existingTopic.is_published,
      });
    }
  }, [existingTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && existingTopic) {
        await updateTopic.mutateAsync({ id: existingTopic.id, ...formData });
        toast({
          title: "Topic Updated",
          description: "The syllabus topic has been updated successfully.",
        });
      } else {
        await createTopic.mutateAsync(formData);
        toast({
          title: "Topic Created",
          description: "The syllabus topic has been created successfully.",
        });
      }
      navigate("/admin/syllabus");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save the topic.",
        variant: "destructive",
      });
    }
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
                onClick={() => navigate("/admin/syllabus")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {isEditing ? "Edit Topic" : "New Topic"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isEditing
                    ? "Update syllabus topic"
                    : "Create a new syllabus topic"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Topic Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          placeholder="Enter topic title"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Brief description of the topic..."
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
                          placeholder="Detailed content for this topic... (Supports Markdown)"
                          rows={12}
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
                      <CardTitle>Settings</CardTitle>
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

                      <div className="space-y-2">
                        <Label htmlFor="course_type">Course Type</Label>
                        <Select
                          value={formData.course_type}
                          onValueChange={(value) =>
                            setFormData({ ...formData, course_type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select course type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="online">Online Course</SelectItem>
                            <SelectItem value="offline">Offline Course</SelectItem>
                            <SelectItem value="live">Live Market Training</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="order_index">Order</Label>
                        <Input
                          id="order_index"
                          type="number"
                          value={formData.order_index}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              order_index: parseInt(e.target.value) || 0,
                            })
                          }
                          min={0}
                        />
                        <p className="text-xs text-muted-foreground">
                          Lower numbers appear first
                        </p>
                      </div>

                      <Button type="submit" className="w-full gap-2 mt-4">
                        <Save className="h-4 w-4" />
                        {isEditing ? "Update Topic" : "Create Topic"}
                      </Button>
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

export default AdminSyllabusEditor;
