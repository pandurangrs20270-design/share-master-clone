import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCourse,
  useCreateCourse,
  useUpdateCourse,
} from "@/hooks/useCourses";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { toast } from "sonner";

const AdminCourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const { data: course, isLoading } = useCourse(id || "");
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    mode: "",
    best_for: "",
    description: "",
    duration: "",
    price: "",
    original_price: "",
    students_count: "0",
    rating: 4.5,
    features: [] as string[],
    topics: [] as string[],
    is_popular: false,
    color_gradient: "from-blue-500 to-cyan-500",
    is_published: false,
    order_index: 0,
  });

  const [newFeature, setNewFeature] = useState("");
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        subtitle: course.subtitle || "",
        mode: course.mode,
        best_for: course.best_for || "",
        description: course.description || "",
        duration: course.duration || "",
        price: course.price,
        original_price: course.original_price || "",
        students_count: course.students_count || "0",
        rating: course.rating || 4.5,
        features: course.features || [],
        topics: course.topics || [],
        is_popular: course.is_popular,
        color_gradient: course.color_gradient || "from-blue-500 to-cyan-500",
        is_published: course.is_published,
        order_index: course.order_index,
      });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isNew) {
        await createCourse.mutateAsync(formData);
        toast.success("Course created successfully");
      } else {
        await updateCourse.mutateAsync({ id: id!, ...formData });
        toast.success("Course updated successfully");
      }
      navigate("/admin/courses");
    } catch (error) {
      toast.error("Failed to save course");
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const addTopic = () => {
    if (newTopic.trim()) {
      setFormData({
        ...formData,
        topics: [...formData.topics, newTopic.trim()],
      });
      setNewTopic("");
    }
  };

  const removeTopic = (index: number) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((_, i) => i !== index),
    });
  };

  if (!isNew && isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
                onClick={() => navigate("/admin/courses")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {isNew ? "New Course" : "Edit Course"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isNew ? "Create a new course" : "Update course details"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({ ...formData, title: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="subtitle">Subtitle</Label>
                          <Input
                            id="subtitle"
                            value={formData.subtitle}
                            onChange={(e) =>
                              setFormData({ ...formData, subtitle: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={3}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="mode">Mode *</Label>
                          <Input
                            id="mode"
                            value={formData.mode}
                            onChange={(e) =>
                              setFormData({ ...formData, mode: e.target.value })
                            }
                            placeholder="e.g., Online (Live Classes)"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="best_for">Best For</Label>
                          <Input
                            id="best_for"
                            value={formData.best_for}
                            onChange={(e) =>
                              setFormData({ ...formData, best_for: e.target.value })
                            }
                            placeholder="e.g., Beginners, Professionals"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            value={formData.duration}
                            onChange={(e) =>
                              setFormData({ ...formData, duration: e.target.value })
                            }
                            placeholder="e.g., 6-8 Weeks"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price *</Label>
                          <Input
                            id="price"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({ ...formData, price: e.target.value })
                            }
                            placeholder="e.g., ₹10,000"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="original_price">Original Price</Label>
                          <Input
                            id="original_price"
                            value={formData.original_price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                original_price: e.target.value,
                              })
                            }
                            placeholder="e.g., ₹15,000"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="students_count">Students Count</Label>
                          <Input
                            id="students_count"
                            value={formData.students_count}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                students_count: e.target.value,
                              })
                            }
                            placeholder="e.g., 5000+"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rating">Rating</Label>
                          <Input
                            id="rating"
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            value={formData.rating}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                rating: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="order_index">Order</Label>
                          <Input
                            id="order_index"
                            type="number"
                            value={formData.order_index}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                order_index: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Add a feature..."
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addFeature())
                          }
                        />
                        <Button type="button" onClick={addFeature}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Topics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>What You'll Learn</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="Add a topic..."
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTopic())
                          }
                        />
                        <Button type="button" onClick={addTopic}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                          >
                            {topic}
                            <button
                              type="button"
                              onClick={() => removeTopic(index)}
                              className="hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="is_popular">Mark as Popular</Label>
                        <Switch
                          id="is_popular"
                          checked={formData.is_popular}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, is_popular: checked })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Color Gradient</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <select
                        value={formData.color_gradient}
                        onChange={(e) =>
                          setFormData({ ...formData, color_gradient: e.target.value })
                        }
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="from-blue-500 to-cyan-500">Blue → Cyan</option>
                        <option value="from-primary to-accent">Primary → Accent</option>
                        <option value="from-orange-500 to-red-500">Orange → Red</option>
                        <option value="from-green-500 to-emerald-500">Green → Emerald</option>
                        <option value="from-purple-500 to-pink-500">Purple → Pink</option>
                      </select>
                      <div
                        className={`mt-3 h-8 rounded-md bg-gradient-to-r ${formData.color_gradient}`}
                      />
                    </CardContent>
                  </Card>

                  <Button type="submit" className="w-full gap-2">
                    <Save className="h-4 w-4" />
                    {isNew ? "Create Course" : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseEditor;
