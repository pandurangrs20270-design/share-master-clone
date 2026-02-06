import { motion } from "framer-motion";
import {
  FileText,
  Eye,
  TrendingUp,
  Plus,
  ExternalLink,
  BookOpen,
  MessageSquareQuote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllBlogs } from "@/hooks/useBlogs";
import { useAllCourses } from "@/hooks/useCourses";
import { useAllTestimonials } from "@/hooks/useTestimonials";
import { Link } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminDashboard = () => {
  const { data: blogs = [], isLoading: blogsLoading } = useAllBlogs();
  const { data: courses = [] } = useAllCourses();
  const { data: testimonials = [] } = useAllTestimonials();

  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const publishedBlogs = blogs.filter((b) => b.is_published).length;
  const draftBlogs = blogs.filter((b) => !b.is_published).length;

  const stats = [
    {
      title: "Total Courses",
      value: courses.length,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Testimonials",
      value: testimonials.length,
      icon: MessageSquareQuote,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Blogs",
      value: blogs.length,
      icon: FileText,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

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
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back! Here's an overview of your content.
                </p>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View Website
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Manage your training courses and programs.
                  </p>
                  <div className="flex gap-2">
                    <Link to="/admin/courses/new">
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </Link>
                    <Link to="/admin/courses">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquareQuote className="h-5 w-5" />
                    Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Add and manage student testimonials.
                  </p>
                  <div className="flex gap-2">
                    <Link to="/admin/testimonials/new">
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </Link>
                    <Link to="/admin/testimonials">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Blog Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Create and manage blog content.
                  </p>
                  <div className="flex gap-2">
                    <Link to="/admin/blogs/new">
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </Link>
                    <Link to="/admin/blogs">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Blogs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Blogs</CardTitle>
              </CardHeader>
              <CardContent>
                {blogsLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : blogs.length === 0 ? (
                  <p className="text-muted-foreground">No blogs yet. Create your first blog!</p>
                ) : (
                  <div className="space-y-4">
                    {blogs.slice(0, 5).map((blog) => (
                      <div
                        key={blog.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div>
                          <h3 className="font-medium">{blog.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(blog.created_at).toLocaleDateString()} •{" "}
                            {blog.views} views
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              blog.is_published
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {blog.is_published ? "Published" : "Draft"}
                          </span>
                          <Link to={`/admin/blogs/${blog.id}`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
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

export default AdminDashboard;
