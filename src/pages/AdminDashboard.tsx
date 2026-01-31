import { motion } from "framer-motion";
import {
  FileText,
  Eye,
  TrendingUp,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllBlogs } from "@/hooks/useBlogs";
import { Link } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminDashboard = () => {
  const { data: blogs = [], isLoading: blogsLoading } = useAllBlogs();

  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const publishedBlogs = blogs.filter((b) => b.is_published).length;
  const draftBlogs = blogs.filter((b) => !b.is_published).length;

  const stats = [
    {
      title: "Total Blogs",
      value: blogs.length,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Published Blogs",
      value: publishedBlogs,
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Draft Blogs",
      value: draftBlogs,
      icon: FileText,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
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

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Blog Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Create and manage blog posts for your website with our advanced rich text editor.
                </p>
                <div className="flex gap-3">
                  <Link to="/admin/blogs/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Blog Post
                    </Button>
                  </Link>
                  <Link to="/admin/blogs">
                    <Button variant="outline">View All Blogs</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

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
