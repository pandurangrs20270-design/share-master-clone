import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAllTestimonials,
  useDeleteTestimonial,
  useUpdateTestimonial,
} from "@/hooks/useTestimonials";
import { Link } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const AdminTestimonials = () => {
  const { data: testimonials = [], isLoading } = useAllTestimonials();
  const deleteTestimonial = useDeleteTestimonial();
  const updateTestimonial = useUpdateTestimonial();

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial.mutateAsync(id);
      toast.success("Testimonial deleted successfully");
    } catch (error) {
      toast.error("Failed to delete testimonial");
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updateTestimonial.mutateAsync({ id, is_published: !currentStatus });
      toast.success(currentStatus ? "Testimonial hidden" : "Testimonial published");
    } catch (error) {
      toast.error("Failed to update testimonial");
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
                <p className="text-muted-foreground mt-1">
                  Manage student testimonials and reviews
                </p>
              </div>
              <Link to="/admin/testimonials/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Testimonial
                </Button>
              </Link>
            </div>

            {/* Testimonials List */}
            <Card>
              <CardHeader>
                <CardTitle>All Testimonials ({testimonials.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : testimonials.length === 0 ? (
                  <p className="text-muted-foreground">
                    No testimonials yet. Add your first testimonial!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                      >
                        {testimonial.image_url && (
                          <img
                            src={testimonial.image_url}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{testimonial.name}</h3>
                            <div className="flex items-center gap-0.5">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 text-yellow-500 fill-yellow-500"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                          <p className="text-sm mt-1 line-clamp-2">
                            "{testimonial.content}"
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              testimonial.is_published
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {testimonial.is_published ? "Published" : "Hidden"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              togglePublish(testimonial.id, testimonial.is_published)
                            }
                          >
                            {testimonial.is_published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Link to={`/admin/testimonials/${testimonial.id}`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Testimonial?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently
                                  delete the testimonial from {testimonial.name}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(testimonial.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestimonials;
