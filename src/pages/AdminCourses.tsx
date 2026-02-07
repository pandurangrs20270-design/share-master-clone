import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllCourses, useDeleteCourse, useUpdateCourse } from "@/hooks/useCourses";
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

const AdminCourses = () => {
  const { data: courses = [], isLoading } = useAllCourses();
  const deleteCourse = useDeleteCourse();
  const updateCourse = useUpdateCourse();

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse.mutateAsync(id);
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updateCourse.mutateAsync({ id, is_published: !currentStatus });
      toast.success(currentStatus ? "Course hidden from website" : "Course shown on website");
    } catch (error) {
      toast.error("Failed to update course");
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
                <h1 className="text-3xl font-bold text-foreground">Courses</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your training courses
                </p>
              </div>
              <Link to="/admin/courses/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Course
                </Button>
              </Link>
            </div>

            {/* Courses List */}
            <Card>
              <CardHeader>
                <CardTitle>All Courses ({courses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : courses.length === 0 ? (
                  <p className="text-muted-foreground">
                    No courses yet. Create your first course!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{course.title}</h3>
                            {course.is_popular && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {course.subtitle} • {course.price}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-muted-foreground">
                              {course.rating} • {course.students_count} students
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              course.is_published
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {course.is_published ? "Shown" : "Hidden"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={course.is_published ? "Hide from website" : "Show on website"}
                            onClick={() =>
                              togglePublish(course.id, course.is_published)
                            }
                          >
                            {course.is_published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Link to={`/admin/courses/${course.id}`}>
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
                                <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently
                                  delete "{course.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(course.id)}
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

export default AdminCourses;
