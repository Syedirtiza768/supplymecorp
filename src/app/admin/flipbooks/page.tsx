"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye, Star, Upload, Image, Download } from "lucide-react";
import { FlipbookPreviewModal } from "@/components/admin/FlipbookPreviewModal";

interface Flipbook {
  id: string;
  title: string;
  description?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  pages?: Array<{ id: string; pageNumber: number }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const AUTH_HEADER = process.env.NEXT_PUBLIC_CUSTOMERS_AUTH || "";

export default function FlipbookManagementPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [flipbooks, setFlipbooks] = useState<Flipbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFlipbook, setSelectedFlipbook] = useState<Flipbook | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFlipbooks();
  }, []);

  const loadFlipbooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/flipbooks`, {
        headers: { Authorization: AUTH_HEADER },
      });
      if (!res.ok) throw new Error("Failed to load flipbooks");
      const data = await res.json();
      setFlipbooks(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load flipbooks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/flipbooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH_HEADER,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create flipbook");
      const newFlipbook = await res.json();

      toast({
        title: "Success",
        description: "Flipbook created successfully",
      });

      setShowCreateDialog(false);
      setFormData({ title: "", description: "" });
      loadFlipbooks();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create flipbook",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedFlipbook || !formData.title.trim()) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/flipbooks/${selectedFlipbook.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH_HEADER,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update flipbook");

      toast({
        title: "Success",
        description: "Flipbook updated successfully",
      });

      setShowEditDialog(false);
      setSelectedFlipbook(null);
      setFormData({ title: "", description: "" });
      loadFlipbooks();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update flipbook",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFlipbook) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/flipbooks/${selectedFlipbook.id}`, {
        method: "DELETE",
        headers: { Authorization: AUTH_HEADER },
      });

      if (!res.ok) throw new Error("Failed to delete flipbook");

      toast({
        title: "Success",
        description: "Flipbook deleted successfully",
      });

      setShowDeleteDialog(false);
      setSelectedFlipbook(null);
      loadFlipbooks();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete flipbook",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (flipbook: Flipbook) => {
    try {
      const res = await fetch(`${API_URL}/api/flipbooks/${flipbook.id}/toggle-featured`, {
        method: "PATCH",
        headers: { Authorization: AUTH_HEADER },
      });

      if (!res.ok) throw new Error("Failed to toggle featured");

      toast({
        title: "Success",
        description: flipbook.isFeatured
          ? "Removed from featured"
          : "Set as featured flipbook",
      });

      loadFlipbooks();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (flipbook: Flipbook) => {
    setSelectedFlipbook(flipbook);
    setFormData({
      title: flipbook.title,
      description: flipbook.description || "",
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (flipbook: Flipbook) => {
    setSelectedFlipbook(flipbook);
    setShowDeleteDialog(true);
  };

  const openPreview = (flipbook: Flipbook) => {
    setSelectedFlipbook(flipbook);
    setShowPreviewModal(true);
  };

  const handleDownloadPDF = async (flipbook: Flipbook) => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your PDF...",
      });

      const res = await fetch(`${API_URL}/api/flipbooks/${flipbook.id}/export/pdf`, {
        headers: { Authorization: AUTH_HEADER },
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${flipbook.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading flipbooks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Flipbook Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your digital catalog flipbooks
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Flipbook
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Pages</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flipbooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No flipbooks found. Create your first flipbook to get started.
                </TableCell>
              </TableRow>
            ) : (
              flipbooks.map((flipbook) => (
                <TableRow key={flipbook.id}>
                  <TableCell className="font-medium">{flipbook.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {flipbook.description || "-"}
                  </TableCell>
                  <TableCell>{flipbook.pages?.length || 0}</TableCell>
                  <TableCell>
                    {flipbook.isFeatured && (
                      <Badge variant="default" className="gap-1">
                        <Star className="h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(flipbook.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openPreview(flipbook)}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* Download PDF button */}
                      {flipbook.pages && flipbook.pages.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadPDF(flipbook)}
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {/* Annotate button: only show if at least one page exists */}
                      {flipbook.pages && flipbook.pages.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/flipbooks/${flipbook.id}/pages/${flipbook.pages![0].pageNumber}/annotate`)}
                          title="Annotate First Page"
                        >
                          <span className="sr-only">Annotate</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z" /></svg>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(
                            `/admin/flipbooks/${flipbook.id}/pages/upload`
                          )
                        }
                        title="Upload Pages"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFeatured(flipbook)}
                        title={flipbook.isFeatured ? "Remove Featured" : "Set as Featured"}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            flipbook.isFeatured ? "fill-yellow-400 text-yellow-400" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(flipbook)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(flipbook)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Flipbook</DialogTitle>
            <DialogDescription>
              Add a new digital catalog flipbook to your collection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., 2025 Spring Catalog"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Flipbook</DialogTitle>
            <DialogDescription>Update flipbook details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={saving}>
              {saving ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the flipbook "{selectedFlipbook?.title}" and
              all of its pages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={saving}>
              {saving ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Modal */}
      {selectedFlipbook && (
        <FlipbookPreviewModal
          flipbookId={selectedFlipbook.id}
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
}
