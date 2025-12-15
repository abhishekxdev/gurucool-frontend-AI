"use client";

import {
  BookOpen,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pdCatalog, type PdItem, type PdReference } from "@/lib/data";

interface ReferenceMaterialForm {
  type: "pdf" | "png" | "jpeg" | "link";
  title: string;
  file?: File;
  link?: string;
}

const PDContentManagePage = () => {
  const params = useParams();
  const router = useRouter();
  const pdId = params.id as string;

  const [pd, setPd] = useState<PdItem | undefined>(
    pdCatalog.find((p) => p.id === pdId)
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<PdReference | null>(
    null
  );
  const [formData, setFormData] = useState<ReferenceMaterialForm>({
    type: "pdf",
    title: "",
    file: undefined,
    link: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  if (!pd) {
    router.push("/admin/dashboard/pd-content-library");
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.type === "link") {
      if (!formData.link?.trim()) {
        newErrors.link = "Link URL is required";
      } else {
        try {
          new URL(formData.link);
        } catch {
          newErrors.link = "Please enter a valid URL";
        }
      }
    } else {
      if (!formData.file) {
        newErrors.file = "File is required";
      } else {
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (formData.file.size > maxSize) {
          newErrors.file = "File size must be less than 10MB";
        }

        const validTypes: Record<string, string[]> = {
          pdf: ["application/pdf"],
          png: ["image/png"],
          jpeg: ["image/jpeg", "image/jpg"],
        };

        if (!validTypes[formData.type]?.includes(formData.file.type)) {
          newErrors.file = `Invalid file type. Expected ${formData.type.toUpperCase()}`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMaterial = () => {
    setFormData({ type: "pdf", title: "", file: undefined, link: "" });
    setErrors({});
    setIsAddDialogOpen(true);
  };

  const handleEditMaterial = (material: PdReference) => {
    setSelectedMaterial(material);
    setFormData({
      type: material.type === "link" ? "link" : "pdf",
      title: material.title,
      link: material.url || "",
      file: undefined,
    });
    setErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDeleteMaterial = (material: PdReference) => {
    setSelectedMaterial(material);
    setIsDeleteDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file, link: "" });
      setErrors({ ...errors, file: "" });
    }
  };

  const handleSubmitAdd = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate potential failure
      const shouldFail = Math.random() < 0.1;
      if (shouldFail) {
        throw new Error(
          "Network error: Unable to add reference material. Please try again."
        );
      }

      const newMaterial: PdReference = {
        id: `ref-${Date.now()}`,
        title: formData.title.trim(),
        type: formData.type === "link" ? "link" : "pdf",
        url:
          formData.type === "link"
            ? formData.link?.trim()
            : URL.createObjectURL(formData.file!),
        description: "",
      };

      setPd({
        ...pd,
        materials: [...pd.materials, newMaterial],
      });

      toast.success("Reference material added", {
        description: `${formData.title} has been added successfully.`,
      });

      setIsAddDialogOpen(false);
      setFormData({ type: "pdf", title: "", file: undefined, link: "" });
      setErrors({});
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add reference material";
      toast.error("Add failed", {
        description: errorMessage,
      });
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedMaterial || !validateForm()) return;

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const shouldFail = Math.random() < 0.1;
      if (shouldFail) {
        throw new Error(
          "Network error: Unable to update reference material. Please try again."
        );
      }

      const updatedMaterials = pd.materials.map((m) =>
        m.id === selectedMaterial.id
          ? {
              ...m,
              title: formData.title.trim(),
              url:
                formData.type === "link"
                  ? formData.link?.trim()
                  : formData.file
                  ? URL.createObjectURL(formData.file)
                  : m.url,
              type: formData.type === "link" ? "link" : "pdf",
            }
          : m
      );

      setPd({
        ...pd,
        materials: updatedMaterials,
      });

      toast.success("Reference material updated", {
        description: `${formData.title} has been updated successfully.`,
      });

      setIsEditDialogOpen(false);
      setSelectedMaterial(null);
      setFormData({ type: "pdf", title: "", file: undefined, link: "" });
      setErrors({});
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update reference material";
      toast.error("Update failed", {
        description: errorMessage,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedMaterial) return;

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const shouldFail = Math.random() < 0.1;
      if (shouldFail) {
        throw new Error(
          "Network error: Unable to delete reference material. Please try again."
        );
      }

      const updatedMaterials = pd.materials.filter(
        (m) => m.id !== selectedMaterial.id
      );

      setPd({
        ...pd,
        materials: updatedMaterials,
      });

      toast.success("Reference material deleted", {
        description: `${selectedMaterial.title} has been removed.`,
      });

      setIsDeleteDialogOpen(false);
      setSelectedMaterial(null);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete reference material";
      toast.error("Delete failed", {
        description: errorMessage,
      });
    }
  };

  const getMaterialIcon = (type?: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "png":
      case "jpeg":
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      case "link":
        return <LinkIcon className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-auto p-4 sm:p-6 scrollbar-hide font-[montserrat]">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => router.push("/admin/dashboard/pd-content-library")}
          >
            <XCircle className="h-4 w-4 rotate-45" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {pd.title}
            </h1>
            <p className="text-muted-foreground">
              16.1 PD Content Management · {pd.competency}
            </p>
          </div>
        </div>
        <Button className="rounded-xl" onClick={handleAddMaterial}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reference Material
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Context/Rules and Materials */}
        <div className="space-y-6 lg:col-span-2">
          {/* Context/Rules Card */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>AI Context & Rules</CardTitle>
              <CardDescription>
                Context and rules used by AI for content generation (read-only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-2">Description</p>
                  <p className="font-medium">{pd.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Competency</p>
                    <Badge variant="outline" className="mt-1">
                      {pd.competency}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Difficulty</p>
                    <Badge variant="outline" className="mt-1">
                      {pd.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reference Materials Card */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Reference Materials</CardTitle>
              <CardDescription>
                Manage reference materials for this PD. You can add, edit, or
                remove materials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pd.materials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center mb-4">
                    No reference materials added yet
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleAddMaterial}
                    className="rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Material
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {pd.materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-4 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background flex-shrink-0">
                          {getMaterialIcon(material.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {material.title}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {material.type || "file"} ·{" "}
                            {material.url && (
                              <a
                                href={material.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline inline-flex items-center gap-1"
                              >
                                View
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => handleEditMaterial(material)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-destructive hover:text-destructive"
                          onClick={() => handleDeleteMaterial(material)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Quick info */}
        <div className="space-y-6">
          <Card className="rounded-xl border-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                PD Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Total Materials</p>
                <p className="font-medium text-2xl">{pd.materials.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{pd.durationMinutes} minutes</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(pd.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Material Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="font-[montserrat]">
          <DialogHeader>
            <DialogTitle>Add Reference Material</DialogTitle>
            <DialogDescription>
              Add a new reference material to this PD assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Material Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "pdf" | "png" | "jpeg" | "link") => {
                  setFormData({
                    ...formData,
                    type: value,
                    file: undefined,
                    link: "",
                  });
                  setErrors({});
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="png">PNG Image</SelectItem>
                  <SelectItem value="jpeg">JPEG Image</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors({ ...errors, title: "" });
                }}
                placeholder="Enter material title"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {formData.type === "link" ? (
              <div className="space-y-2">
                <Label>Link URL *</Label>
                <Input
                  value={formData.link}
                  onChange={(e) => {
                    setFormData({ ...formData, link: e.target.value });
                    setErrors({ ...errors, link: "" });
                  }}
                  placeholder="https://example.com"
                />
                {errors.link && (
                  <p className="text-sm text-destructive">{errors.link}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>File *</Label>
                <Input
                  type="file"
                  accept={
                    formData.type === "pdf"
                      ? ".pdf"
                      : formData.type === "png"
                      ? ".png"
                      : ".jpg,.jpeg"
                  }
                  onChange={handleFileChange}
                />
                {errors.file && (
                  <p className="text-sm text-destructive">{errors.file}</p>
                )}
                {formData.file && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {formData.file.name} (
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitAdd} disabled={isProcessing}>
              {isProcessing ? "Adding..." : "Add Material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="font-[montserrat]">
          <DialogHeader>
            <DialogTitle>Edit Reference Material</DialogTitle>
            <DialogDescription>
              Update the reference material details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Material Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "pdf" | "png" | "jpeg" | "link") => {
                  setFormData({
                    ...formData,
                    type: value,
                    file: undefined,
                    link: "",
                  });
                  setErrors({});
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="png">PNG Image</SelectItem>
                  <SelectItem value="jpeg">JPEG Image</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors({ ...errors, title: "" });
                }}
                placeholder="Enter material title"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {formData.type === "link" ? (
              <div className="space-y-2">
                <Label>Link URL *</Label>
                <Input
                  value={formData.link}
                  onChange={(e) => {
                    setFormData({ ...formData, link: e.target.value });
                    setErrors({ ...errors, link: "" });
                  }}
                  placeholder="https://example.com"
                />
                {errors.link && (
                  <p className="text-sm text-destructive">{errors.link}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>File (optional - leave empty to keep current)</Label>
                <Input
                  type="file"
                  accept={
                    formData.type === "pdf"
                      ? ".pdf"
                      : formData.type === "png"
                      ? ".png"
                      : ".jpg,.jpeg"
                  }
                  onChange={handleFileChange}
                />
                {errors.file && (
                  <p className="text-sm text-destructive">{errors.file}</p>
                )}
                {formData.file && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {formData.file.name} (
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {!formData.file && selectedMaterial?.url && (
                  <p className="text-xs text-muted-foreground">
                    Current file: {selectedMaterial.url}
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit} disabled={isProcessing}>
              {isProcessing ? "Updating..." : "Update Material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="font-[montserrat]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reference Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedMaterial?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PDContentManagePage;
