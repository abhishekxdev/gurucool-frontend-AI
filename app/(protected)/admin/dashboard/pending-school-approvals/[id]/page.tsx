"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react";
import Image from "next/image";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PendingSchool {
  id: string;
  name: string;
  email: string;
  address: string;
  contactNumber: string;
  adminName: string;
  adminEmail: string;
  submittedDocuments?: Array<{
    name: string;
    url: string;
    type: "pdf" | "image" | "other";
  }>;
  appliedDate: string;
}

// Mock data - should match the list page
const mockPendingSchools: PendingSchool[] = [
  {
    id: "pending-school-001",
    name: "Riverside Academy",
    email: "info@riverside.edu",
    address: "123 Riverside Drive, Mumbai, India",
    contactNumber: "+91-98765-11111",
    adminName: "Rajesh Kumar",
    adminEmail: "admin@riverside.edu",
    submittedDocuments: [
      {
        name: "Registration Certificate",
        url: "https://example.com/documents/riverside-registration.pdf",
        type: "pdf",
      },
      {
        name: "Tax ID Document",
        url: "https://example.com/documents/riverside-tax-id.pdf",
        type: "pdf",
      },
      {
        name: "School License",
        url: "https://example.com/documents/riverside-license.pdf",
        type: "pdf",
      },
      {
        name: "School Building Photo",
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
        type: "image",
      },
    ],
    appliedDate: "2024-11-25",
  },
  {
    id: "pending-school-002",
    name: "Mountain View School",
    email: "contact@mountainview.edu",
    address: "456 Mountain Road, Bangalore, India",
    contactNumber: "+91-98765-22222",
    adminName: "Priya Sharma",
    adminEmail: "principal@mountainview.edu",
    submittedDocuments: [
      {
        name: "Registration Certificate",
        url: "https://example.com/documents/mountainview-registration.pdf",
        type: "pdf",
      },
      {
        name: "License",
        url: "https://example.com/documents/mountainview-license.pdf",
        type: "pdf",
      },
    ],
    appliedDate: "2024-11-24",
  },
  {
    id: "pending-school-003",
    name: "Ocean Breeze International",
    email: "info@oceanbreeze.edu",
    address: "789 Ocean Avenue, Chennai, India",
    contactNumber: "+91-98765-33333",
    adminName: "Amit Patel",
    adminEmail: "admin@oceanbreeze.edu",
    appliedDate: "2024-11-23",
  },
];

const PendingSchoolApprovalDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [school, setSchool] = useState<PendingSchool | undefined>(
    mockPendingSchools.find((s) => s.id === id)
  );
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    url: string;
    type: "pdf" | "image" | "other";
  } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [onboardingLimit, setOnboardingLimit] = useState<string>("");
  const [limitError, setLimitError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!school) {
    router.push("/admin/dashboard/pending-school-approvals");
    return null;
  }

  const handleViewDocument = (doc: {
    name: string;
    url: string;
    type: "pdf" | "image" | "other";
  }) => {
    setSelectedDocument(doc);
    setIsPreviewOpen(true);
  };

  const handleApprove = () => {
    setAction("approve");
    setOnboardingLimit("");
    setLimitError(null);
  };

  const handleReject = () => {
    setAction("reject");
    setRejectionComment("");
  };

  const confirmApprove = async () => {
    // Validate onboarding limit
    const limit = Number(onboardingLimit);
    if (!onboardingLimit.trim() || !Number.isFinite(limit) || limit <= 0) {
      setLimitError(
        "Please enter a valid positive number for onboarding limit."
      );
      return;
    }

    setIsProcessing(true);
    setLimitError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate potential failure (sad path)
      const shouldFail = Math.random() < 0.1;
      if (shouldFail) {
        throw new Error(
          "Network error: Unable to approve school. Please try again."
        );
      }

      // Check if school was already approved (stale data error)
      const schoolStillPending = mockPendingSchools.find((s) => s.id === id);
      if (!schoolStillPending) {
        throw new Error(
          "This school has already been processed. Please refresh the page."
        );
      }

      // Success (happy path)
      toast.success("School approved successfully", {
        description: `${school.name} has been approved and is now active.`,
      });

      // Navigate back to list
      router.push("/admin/dashboard/pending-school-approvals");
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to approve school";
      toast.error("Approval failed", {
        description: errorMessage,
      });
    }
  };

  const confirmReject = async () => {
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate potential failure
      const shouldFail = Math.random() < 0.1;
      if (shouldFail) {
        throw new Error(
          "Network error: Unable to reject school. Please try again."
        );
      }

      // Check if school was already processed
      const schoolStillPending = mockPendingSchools.find((s) => s.id === id);
      if (!schoolStillPending) {
        throw new Error(
          "This school has already been processed. Please refresh the page."
        );
      }

      // Success
      toast.success("School rejected", {
        description: `${school.name} has been rejected and the admin has been notified.`,
      });

      // Navigate back to list
      router.push("/admin/dashboard/pending-school-approvals");
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject school";
      toast.error("Rejection failed", {
        description: errorMessage,
      });
    }
  };

  const closeDialog = () => {
    if (isProcessing) return;

    setAction(null);
    setRejectionComment("");
    setOnboardingLimit("");
    setLimitError(null);
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
            onClick={() =>
              router.push("/admin/dashboard/pending-school-approvals")
            }
          >
            <XCircle className="h-4 w-4 rotate-45" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {school.name}
            </h1>
            <p className="text-muted-foreground">
              Pending School Approval Details
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={handleApprove}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            variant="outline"
            className="rounded-xl text-destructive hover:text-destructive"
            onClick={handleReject}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: School information */}
        <div className="space-y-6 lg:col-span-2">
          {/* School Profile Card */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>
                Review all submitted information before making a decision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">School Name</p>
                    <p className="font-medium">{school.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">School Email</p>
                    <p className="font-medium">{school.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Contact Number</p>
                    <p className="font-medium">{school.contactNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Applied Date</p>
                    <p className="font-medium">
                      {new Date(school.appliedDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">{school.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-muted-foreground mb-3">Admin Details</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Admin Name</p>
                    <p className="font-medium">{school.adminName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Admin Email</p>
                    <p className="font-medium">{school.adminEmail}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Preview Card */}
          {school.submittedDocuments && school.submittedDocuments.length > 0 ? (
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
                <CardDescription>
                  Click on any document to preview it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {school.submittedDocuments.map((doc, index) => (
                    <button
                      key={index}
                      onClick={() => handleViewDocument(doc)}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 text-left hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                        {doc.type === "pdf" ? (
                          <FileText className="h-5 w-5 text-red-500" />
                        ) : doc.type === "image" ? (
                          <ImageIcon className="h-5 w-5 text-blue-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {doc.type} document
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-xl">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No documents submitted by this school
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Quick actions */}
        <div className="space-y-6">
          <Card className="rounded-xl border-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Application Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Applied On</p>
                <p className="font-medium">
                  {new Date(school.appliedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-amber-400"
                >
                  Pending Approval
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="font-[montserrat] max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogDescription>Preview of submitted document</DialogDescription>
          </DialogHeader>
          <div className="mt-4 min-h-[400px] flex items-center justify-center bg-muted rounded-lg">
            {selectedDocument?.type === "pdf" ? (
              <div className="text-center p-8 w-full">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  PDF Preview
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  (In production, use a PDF viewer component)
                </p>
                <a
                  href={selectedDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Open in new tab
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : selectedDocument?.type === "image" ? (
              <div className="relative w-full h-[500px]">
                <Image
                  src={selectedDocument.url}
                  alt={selectedDocument.name}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="text-center p-8">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Document preview not available
                </p>
                <a
                  href={selectedDocument?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Open in new tab
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <AlertDialog
        open={action === "approve"}
        onOpenChange={(open) => {
          if (!open && !isProcessing) {
            closeDialog();
          }
        }}
      >
        <AlertDialogContent className="font-[montserrat]">
          <AlertDialogHeader>
            <AlertDialogTitle>Approve School</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve{" "}
              <span className="font-semibold text-foreground">
                {school.name}
              </span>
              ? The school will become Active and the school admin will gain
              access to the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-muted/40 p-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{school.name}</p>
                  <p className="text-muted-foreground">{school.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-medium">
                Set Teacher Onboarding Limit{" "}
                <span className="text-destructive">*</span>
              </p>
              <Input
                type="number"
                min={1}
                value={onboardingLimit}
                onChange={(e) => {
                  setOnboardingLimit(e.target.value);
                  setLimitError(null);
                }}
                placeholder="Enter maximum number of teachers"
                className="max-w-xs"
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">
                This limit controls how many teachers can onboard from this
                school. You can adjust it later from the school details page.
              </p>
              {limitError && (
                <p className="text-sm font-medium text-destructive">
                  {limitError}
                </p>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Approve School"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog
        open={action === "reject"}
        onOpenChange={(open) => {
          if (!open && !isProcessing) {
            closeDialog();
          }
        }}
      >
        <AlertDialogContent className="font-[montserrat]">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject School Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject{" "}
              <span className="font-semibold text-foreground">
                {school.name}
              </span>
              ? The school admin will be notified of the rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-muted/40 p-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{school.name}</p>
                  <p className="text-muted-foreground">{school.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">
                Rejection Reason{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </p>
              <Textarea
                placeholder="Provide a reason for rejecting this application"
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                className="text-base"
                rows={3}
                disabled={isProcessing}
              />
              <p className="text-muted-foreground">
                This message will be sent to the school admin.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Reject Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PendingSchoolApprovalDetailPage;
