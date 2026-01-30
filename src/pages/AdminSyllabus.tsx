import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  GripVertical,
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
import { useAllSyllabus, useDeleteSyllabusTopic } from "@/hooks/useSyllabus";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminSyllabus = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: syllabus = [], isLoading } = useAllSyllabus();
  const deleteTopic = useDeleteSyllabusTopic();
  const { toast } = useToast();

  const filteredSyllabus = syllabus.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteTopic.mutateAsync(deleteId);
      toast({
        title: "Topic Deleted",
        description: "The syllabus topic has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the syllabus topic.",
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
                <h1 className="text-3xl font-bold text-foreground">Syllabus</h1>
                <p className="text-muted-foreground mt-1">
                  Manage course syllabus topics
                </p>
              </div>
              <Link to="/admin/syllabus/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Topic
                </Button>
              </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>

            {/* Syllabus List */}
            <Card>
              <CardHeader>
                <CardTitle>All Topics ({filteredSyllabus.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : filteredSyllabus.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? "No topics found matching your search."
                        : "No syllabus topics yet. Create your first topic!"}
                    </p>
                    {!searchQuery && (
                      <Link to="/admin/syllabus/new">
                        <Button>Create Topic</Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSyllabus.map((topic, index) => (
                      <div
                        key={topic.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <span className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full font-medium text-sm">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-medium">{topic.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {topic.course_type} •{" "}
                            {topic.is_published ? "Published" : "Draft"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            topic.is_published
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {topic.is_published ? "Published" : "Draft"}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/syllabus/${topic.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteId(topic.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
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
              syllabus topic.
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

export default AdminSyllabus;
