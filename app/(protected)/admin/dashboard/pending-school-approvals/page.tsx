"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SchoolDetails from "@/components/admin-components/school-pending";

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
  }>;
  appliedDate: string;
}

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
      },
      {
        name: "Tax ID",
        url: "https://example.com/documents/riverside-tax-id.pdf",
      },
      {
        name: "License",
        url: "https://example.com/documents/riverside-license.pdf",
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
      },
      {
        name: "License",
        url: "https://example.com/documents/mountainview-license.pdf",
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

const PendingSchoolApprovalsPage = () => {
  const router = useRouter();
  const [pendingSchools, setPendingSchools] = useState(mockPendingSchools);
  const [selectedSchool, setSelectedSchool] = useState<PendingSchool | null>(
    null
  );
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [onboardingLimit, setOnboardingLimit] = useState<string>("");
  const [limitError, setLimitError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleApprove = (school: PendingSchool) => {
    setSelectedSchool(school);
    setAction("approve");
    setOnboardingLimit("");
    setLimitError(null);
  };

  const handleReject = (school: PendingSchool) => {
    setSelectedSchool(school);
    setAction("reject");
    setRejectionComment("");
  };

  const handleViewDetails = (school: PendingSchool) => {
    setSelectedSchool(school);
    setDetailsOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedSchool) return;

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
      // Simulate API call - in real app, this would be an actual API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate potential failure (sad path)
      const shouldFail = Math.random() < 0.1; // 10% chance of failure for demo
      if (shouldFail) {
        throw new Error(
          "Network error: Unable to approve school. Please try again."
        );
      }

      // Check if school was already approved (stale data error)
      const schoolStillPending = pendingSchools.find(
        (s) => s.id === selectedSchool.id
      );
      if (!schoolStillPending) {
        throw new Error(
          "This school has already been processed. Please refresh the page."
        );
      }

      // Success (happy path)
      setPendingSchools((prev) =>
        prev.filter((s) => s.id !== selectedSchool.id)
      );

      toast.success("School approved successfully", {
        description: `${selectedSchool.name} has been approved and is now active.`,
      });

      // Reset state
      setSelectedSchool(null);
      setAction(null);
      setOnboardingLimit("");
      setIsProcessing(false);
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
    if (!selectedSchool) return;

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
      const schoolStillPending = pendingSchools.find(
        (s) => s.id === selectedSchool.id
      );
      if (!schoolStillPending) {
        throw new Error(
          "This school has already been processed. Please refresh the page."
        );
      }

      // Success
      setPendingSchools((prev) =>
        prev.filter((s) => s.id !== selectedSchool.id)
      );

      toast.success("School rejected", {
        description: `${selectedSchool.name} has been rejected and the admin has been notified.`,
      });

      // Reset state
      setSelectedSchool(null);
      setAction(null);
      setRejectionComment("");
      setIsProcessing(false);
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
    if (isProcessing) return; // Prevent closing during processing

    setSelectedSchool(null);
    setAction(null);
    setRejectionComment("");
    setOnboardingLimit("");
    setLimitError(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-auto p-4 sm:p-6 scrollbar-hide font-[montserrat]">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Pending School Approvals
          </h1>
          <p className="text-muted-foreground">
            Review and approve schools requesting to join the platform
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          {pendingSchools.length} Pending
        </Badge>
      </div>

      {pendingSchools.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground text-center">
              No pending school approvals at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingSchools.map((school) => (
            <Card key={school.id} className="rounded-xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{school.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Applied on{" "}
                        {new Date(school.appliedDate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:ml-auto">
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => handleViewDetails(school)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => handleApprove(school)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl text-destructive hover:text-destructive"
                      onClick={() => handleReject(school)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
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
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">{school.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Admin Name</p>
                      <p className="font-medium">{school.adminName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Admin Email</p>
                      <p className="font-medium">{school.adminEmail}</p>
                    </div>
                  </div>
                </div>

                {school.submittedDocuments &&
                  school.submittedDocuments.length > 0 && (
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs uppercase text-muted-foreground">
                          Submitted Documents
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {school.submittedDocuments.map((doc, index) => (
                          <a
                            key={index}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5"
                          >
                            <Badge
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {doc.name}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Badge>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
              {selectedSchool && (
                <>
                  Are you sure you want to approve{" "}
                  <span className="font-semibold text-foreground">
                    {selectedSchool.name}
                  </span>
                  ? The school will become Active and the school admin will gain
                  access to the platform.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedSchool && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/40 p-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedSchool.name}</p>
                    <p className="text-muted-foreground">
                      {selectedSchool.email}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {selectedSchool.address}
                    </p>
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
          )}

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
              {selectedSchool && (
                <>
                  Are you sure you want to reject{" "}
                  <span className="font-semibold text-foreground">
                    {selectedSchool.name}
                  </span>
                  ? The school admin will be notified of the rejection.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedSchool && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/40 p-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedSchool.name}</p>
                    <p className="text-muted-foreground">
                      {selectedSchool.email}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {selectedSchool.address}
                    </p>
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
          )}

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

      <SchoolDetails
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        school={selectedSchool}
      />
    </div>
  );
};

export default PendingSchoolApprovalsPage;
