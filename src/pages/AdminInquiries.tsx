import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Trash2, CheckCircle, Clock, Mail, Phone, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useInquiries, useUpdateInquiry, useDeleteInquiry, Inquiry } from "@/hooks/useInquiries";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminInquiries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const { data: inquiries = [], isLoading } = useInquiries();
  const updateInquiry = useUpdateInquiry();
  const deleteInquiry = useDeleteInquiry();
  const { toast } = useToast();

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const resolvedCount = inquiries.filter((i) => i.status === "resolved").length;

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateInquiry.mutateAsync({ id, status });
      toast({
        title: "Status Updated",
        description: `Inquiry marked as ${status}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInquiry.mutateAsync(id);
      toast({
        title: "Inquiry Deleted",
        description: "The inquiry has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete inquiry.",
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-8 w-8" />
                  Inquiries
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage contact form submissions
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{inquiries.length}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                      <p className="text-2xl font-bold text-green-500">{resolvedCount}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading...</p>
                ) : filteredInquiries.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {searchTerm ? "No inquiries match your search." : "No inquiries yet."}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead className="hidden md:table-cell">Course</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden md:table-cell">Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInquiries.map((inquiry) => (
                          <TableRow key={inquiry.id}>
                            <TableCell className="font-medium">{inquiry.name}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {inquiry.email}
                                </span>
                                {inquiry.phone && (
                                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {inquiry.phone}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {inquiry.course || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={inquiry.status === "resolved" ? "default" : "secondary"}
                                className={
                                  inquiry.status === "resolved"
                                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                                }
                              >
                                {inquiry.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(inquiry.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedInquiry(inquiry)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleStatusChange(
                                      inquiry.id,
                                      inquiry.status === "pending" ? "resolved" : "pending"
                                    )
                                  }
                                >
                                  {inquiry.status === "pending" ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                  )}
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Inquiry?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. The inquiry from {inquiry.name} will be permanently deleted.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(inquiry.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={selectedInquiry.status === "resolved" ? "default" : "secondary"}
                    className={
                      selectedInquiry.status === "resolved"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }
                  >
                    {selectedInquiry.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {selectedInquiry.email}
                </a>
              </div>
              {selectedInquiry.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {selectedInquiry.phone}
                  </a>
                </div>
              )}
              {selectedInquiry.course && (
                <div>
                  <p className="text-sm text-muted-foreground">Interested Course</p>
                  <p className="font-medium">{selectedInquiry.course}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="font-medium bg-muted p-3 rounded-lg">{selectedInquiry.message}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted On</p>
                <p className="font-medium">
                  {new Date(selectedInquiry.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    handleStatusChange(
                      selectedInquiry.id,
                      selectedInquiry.status === "pending" ? "resolved" : "pending"
                    );
                    setSelectedInquiry(null);
                  }}
                  variant={selectedInquiry.status === "pending" ? "default" : "outline"}
                  className="flex-1"
                >
                  {selectedInquiry.status === "pending" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Mark Pending
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedInquiry.email}`, "_blank")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInquiries;
