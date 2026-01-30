import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAllBlogs, useDeleteBlog } from "@/hooks/useBlogs";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminBlogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: blogs = [], isLoading } = useAllBlogs();
  const deleteBlog = useDeleteBlog();
  const { toast } = useToast();

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteBlog.mutateAsync(deleteId);
      toast({
        title: "Blog Deleted",
        description: "The blog post has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the blog post.",
        variant: "destructive",
      });
    }
    setDeleteId(null);
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Blogs</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your blog posts
                </p>
              </div>
              <Link to="/admin/blogs/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Blog
                </Button>
              </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>

            {/* Blogs List */}
            <Card>
              <CardHeader>
                <CardTitle>All Blogs ({filteredBlogs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : filteredBlogs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? "No blogs found matching your search."
                        : "No blogs yet. Create your first blog!"}
                    </p>
                    {!searchQuery && (
                      <Link to="/admin/blogs/new">
                        <Button>Create Blog</Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">
                            Title
                          </th>
                          <th className="text-left py-3 px-4 font-medium hidden md:table-cell">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">
                            Views
                          </th>
                          <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">
                            Created
                          </th>
                          <th className="text-right py-3 px-4 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBlogs.map((blog) => (
                          <tr
                            key={blog.id}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{blog.title}</p>
                                <p className="text-sm text-muted-foreground md:hidden">
                                  {blog.is_published ? "Published" : "Draft"} •{" "}
                                  {blog.views} views
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  blog.is_published
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-yellow-500/10 text-yellow-500"
                                }`}
                              >
                                {blog.is_published ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="py-3 px-4 hidden lg:table-cell">
                              {blog.views}
                            </td>
                            <td className="py-3 px-4 hidden lg:table-cell">
                              {new Date(blog.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      to={`/blog/${blog.slug}`}
                                      target="_blank"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/admin/blogs/${blog.id}`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setDeleteId(blog.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBlogs;
