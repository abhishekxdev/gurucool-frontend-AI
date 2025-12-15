"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockSchool } from "@/lib/data";
import profile from "@/public/gurucool/avatar.png";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";
import {
  Building2,
  FileText,
  Info,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  fileName: string;
  uploadedAt: string;
  fileUrl?: string;
  fileType?: string;
}

const initialDocuments: Document[] = [
  {
    id: "doc1",
    name: "Registration Certificate",
    fileName: "Registration Certificate.pdf",
    uploadedAt: "2024-05-10",
    fileUrl: "https://example.com/documents/registration.pdf",
    fileType: "pdf",
  },
  {
    id: "doc2",
    name: "Accreditation",
    fileName: "Accreditation.jpeg",
    uploadedAt: "2024-06-01",
    fileUrl: "https://example.com/documents/accreditation.jpeg",
    fileType: "image",
  },
  {
    id: "doc3",
    name: "Tax ID Document",
    fileName: "Tax_ID.pdf",
    uploadedAt: "2024-07-15",
    fileUrl: "https://example.com/documents/tax-id.pdf",
    fileType: "pdf",
  },
];

export default function SchoolProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: mockSchool.name,
    principalName: mockSchool.principalName,
    address: mockSchool.address,
    contactEmail: mockSchool.contactEmail,
    contactPhone: mockSchool.contactPhone,
    profilePhoto: "/gurucool/avatar.png",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profilePhoto: imageUrl }));
      toast.success("School logo updated!");
    }
  };

  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload PDF or image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setIsUploading(true);
      setTimeout(() => {
        const newDocument: Document = {
          id: `doc-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          uploadedAt: new Date().toISOString().split("T")[0],
          fileUrl: URL.createObjectURL(file),
          fileType: file.type.startsWith("image/") ? "image" : "pdf",
        };

        setDocuments((prev) => [newDocument, ...prev]);
        toast.success("Document uploaded successfully");
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 1000);
    }
  };

  const handleDeleteDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedDocument) return;

    setDocuments((prev) => prev.filter((d) => d.id !== selectedDocument.id));
    toast.success("Document deleted successfully");
    setIsDeleteDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
    setEditingField(null);
  };

  const handleCancel = () => {
    setFormData({
      schoolName: mockSchool.name,
      principalName: mockSchool.principalName,
      address: mockSchool.address,
      contactEmail: mockSchool.contactEmail,
      contactPhone: mockSchool.contactPhone,
      profilePhoto: "/gurucool/avatar.png",
    });
    setIsEditing(false);
    setEditingField(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFileIcon = (fileType?: string) => {
    if (fileType === "pdf") {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <FileText className="h-5 w-5 text-blue-500" />;
  };

  const InfoRow = ({
    label,
    value,
    field,
    description,
    editable = true,
    multiline = false,
    renderValue,
  }: {
    label: string;
    value?: string | React.ReactNode;
    field?: string;
    description?: string;
    editable?: boolean;
    multiline?: boolean;
    renderValue?: () => React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-6 group">
      <div className="flex-shrink-0 w-64">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-1 flex items-center justify-end gap-4">
        {isEditing && editingField === field && editable && field ? (
          multiline ? (
            <Textarea
              value={formData[field as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              rows={3}
              className="max-w-md"
            />
          ) : (
            <Input
              value={formData[field as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="max-w-xs"
            />
          )
        ) : renderValue ? (
          renderValue()
        ) : (
          <p className="text-base text-right">{value}</p>
        )}
        {editable && field && !isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setEditingField(field);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 font-[montserrat] max-w-6xl mx-auto w-full pb-16">
      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleDocumentUpload}
        className="hidden"
      />

      {/* Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <div className="flex items-center justify-between mb-8">
          <TabsList>
            <TabsTrigger value="basic">
              <Building2 className="size-4 mr-2" />
              School Information
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="size-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <Info className="size-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>
          {isEditing && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel} size="sm">
                Discard
              </Button>
              <Button onClick={handleSave} size="sm">
                Change
              </Button>
            </div>
          )}
        </div>

        {/* School Information Tab */}
        <TabsContent value="basic" className="space-y-0">
          {/* School Logo */}
          <div className="flex items-center justify-between py-8 group">
            <div className="flex-shrink-0 w-64">
              <Label className="text-sm text-muted-foreground">
                School Logo
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Min 400×400px, PNG or JPEG formats.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative size-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <Image
                  src={profile}
                  alt="School Logo"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePhotoClick}
                type="button"
              >
                Change
              </Button>
            </div>
          </div>

          <Separator />

          {/* School Name with Badge */}
          <div className="flex items-center justify-between py-6 group">
            <div className="flex-shrink-0 w-64">
              <Label className="text-sm text-muted-foreground">
                School Name
              </Label>
            </div>
            <div className="flex-1 flex items-center justify-end gap-4">
              {isEditing && editingField === "schoolName" ? (
                <Input
                  value={formData.schoolName}
                  onChange={(e) =>
                    handleInputChange("schoolName", e.target.value)
                  }
                  className="max-w-xs"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-base">{formData.schoolName}</p>
                  <div className="text-green-500">
                    <IconRosetteDiscountCheckFilled className="size-5" />
                  </div>
                </div>
              )}
              {!isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditingField("schoolName");
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          <Separator />

          {/* Principal Name */}
          <InfoRow
            label="Principal Name"
            value={formData.principalName}
            field="principalName"
            editable={true}
          />

          <Separator />

          {/* Address */}
          <InfoRow
            label="Address"
            description="School's registered address"
            value={formData.address}
            field="address"
            editable={true}
            multiline={true}
          />

          <Separator />

          {/* Contact Email */}
          <InfoRow
            label="Contact Email"
            description="Primary email for school communication"
            value={formData.contactEmail}
            field="contactEmail"
            editable={true}
          />

          <Separator />

          {/* Contact Phone */}
          <InfoRow
            label="Contact Phone"
            description="Primary phone number for school"
            value={formData.contactPhone}
            field="contactPhone"
            editable={true}
          />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-0">
          {/* Upload Button */}
          <div className="flex items-center justify-between py-6">
            <div>
              <Label className="text-base font-medium">
                Verification Documents
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Upload and manage school verification documents
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              disabled={isUploading}
            >
              <Upload className="size-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>

          <Separator />

          {/* Documents List */}
          <div className="py-6 space-y-4">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No documents uploaded</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id}>
                  <div className="flex items-center justify-between py-4 group">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base truncate">
                          {doc.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded on {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteDocument(doc)}
                    >
                      <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                  {doc.id !== documents[documents.length - 1].id && (
                    <Separator />
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-0">
          <div className="py-6">
            <Label className="text-sm text-muted-foreground mb-6 block">
              School Statistics
            </Label>
            <div className="flex gap-12">
              <div className="text-right">
                <Label className="text-xs text-muted-foreground block mb-1">
                  Total Teachers
                </Label>
                <p className="text-2xl font-semibold">128</p>
              </div>

              <div className="text-right">
                <Label className="text-xs text-muted-foreground block mb-1">
                  PD Completed
                </Label>
                <p className="text-2xl font-semibold">312</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="py-6">
            <Label className="text-sm text-muted-foreground mb-2 block">
              Establishment Date
            </Label>
            <p className="text-base">January 15, 2010</p>
          </div>

        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedDocument?.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
