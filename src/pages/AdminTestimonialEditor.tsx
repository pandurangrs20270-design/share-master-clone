import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useTestimonial,
  useCreateTestimonial,
  useUpdateTestimonial,
} from "@/hooks/useTestimonials";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ImageUploader from "@/components/editor/ImageUploader";
import { toast } from "sonner";

const AdminTestimonialEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const { data: testimonial, isLoading } = useTestimonial(id || "");
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    image_url: "",
    is_published: true,
    order_index: 0,
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        role: testimonial.role || "",
        content: testimonial.content,
        rating: testimonial.rating,
        image_url: testimonial.image_url || "",
        is_published: testimonial.is_published,
        order_index: testimonial.order_index,
      });
    }
  }, [testimonial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isNew) {
        await createTestimonial.mutateAsync(formData);
        toast.success("Testimonial created successfully");
      } else {
        await updateTestimonial.mutateAsync({ id: id!, ...formData });
        toast.success("Testimonial updated successfully");
      }
      navigate("/admin/testimonials");
    } catch (error) {
      toast.error("Failed to save testimonial");
    }
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
                onClick={() => navigate("/admin/testimonials")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {isNew ? "Add Testimonial" : "Edit Testimonial"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isNew
                    ? "Add a new student testimonial"
                    : "Update testimonial details"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Testimonial Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role / Profession</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Testimonial Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label>Profile Image</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a photo or paste an image URL. Shown next to the testimonial on the website.
                    </p>
                    <div className="max-w-xs">
                      <ImageUploader
                        bucket="blog-images"
                        folder="testimonials"
                        value={formData.image_url}
                        onChange={(url) =>
                          setFormData({ ...formData, image_url: url })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, rating: star })
                            }
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                star <= formData.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="order_index">Display Order</Label>
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

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <Label htmlFor="is_published">Show on website</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Hidden testimonials are not shown to visitors.
                      </p>
                    </div>
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_published: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                {isNew ? "Add Testimonial" : "Save Changes"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestimonialEditor;
