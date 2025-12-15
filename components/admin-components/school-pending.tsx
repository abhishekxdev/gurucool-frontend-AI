"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Info,
  ShieldCheck,
  Users2,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface SchoolDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: {
    name: string;
    email: string;
    address: string;
    contactNumber: string;
    adminName: string;
    adminEmail: string;
    appliedDate: string;
    submittedDocuments?: Array<{ name: string; url: string }>;
    teacherCount?: number;
    onboardingLimit?: number;
    status?: string;
    verificationStatus?: "Active" | "Inactive" | "Pending";
  } | null;
  onApprove?: (teacherLimit: number) => void;
  onReject?: () => void;
  isProcessing?: boolean;
}

export default function SchoolDetailsDialog({
  open,
  onOpenChange,
  school,
  onApprove,
  onReject,
  isProcessing,
}: SchoolDetailsDialogProps) {
  const [tab, setTab] = useState("profile");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [teacherLimit, setTeacherLimit] = useState(
    school?.onboardingLimit ?? 1
  );
  const [actionState, setActionState] = useState<
    "idle" | "approved" | "rejected"
  >("idle");

  if (!school) return null;

  // Handler for approve button in main dialog
  const handleApproveClick = () => {
    setTeacherLimit(school.onboardingLimit ?? 1);
    setShowApproveDialog(true);
  };

  // Handler for confirm in approve dialog
  const handleApproveConfirm = () => {
    setShowApproveDialog(false);
    setActionState("approved");
    if (onApprove) onApprove(teacherLimit);
  };

  // Handler for reject
  const handleReject = () => {
    setActionState("rejected");
    if (onReject) onReject();
  };

  // Reset state when dialog is closed
  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setActionState("idle");
      setShowApproveDialog(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogOverlay />
        <DialogContent className="max-w-[50vw]! h-[90vh] p-0 font-[montserrat] gap-0">
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b">
              <DialogTitle className="text-base font-semibold">
                School Details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                View and manage school information
              </DialogDescription>
            </div>
            <Tabs
              value={tab}
              onValueChange={setTab}
              className="w-full flex flex-col flex-1"
            >
              <TabsList className="w-full px-4">
                <TabsTrigger value="profile" className="text-sm">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-sm">
                  Documents
                </TabsTrigger>
              </TabsList>
              <ScrollArea className="flex-1 p-5">
                <TabsContent value="profile" className="flex flex-col gap-8">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Card className="p-6 flex flex-col items-start gap-3 bg-muted/30 border-none">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                        <Users2 className="h-4 w-4" /> Teachers
                      </div>
                      <div className="text-2xl font-bold">
                        {school.teacherCount ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Currently onboarded from this school
                      </div>
                    </Card>
                    <Card className="p-6 flex flex-col items-start gap-3 bg-muted/30 border-none">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" /> Teacher Onboarding
                        Limit
                      </div>
                      <div className="text-2xl font-bold">
                        {school.onboardingLimit ?? "-"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Max teachers allowed to join from this school
                      </div>
                    </Card>
                    <Card className="p-6 flex flex-col items-start gap-3 bg-muted/30 border-none">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                        <Info className="h-4 w-4" /> Verification Status
                      </div>
                      <div className="text-2xl font-bold">
                        {school.verificationStatus ?? "Pending"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Changes are reflected instantly across the platform
                      </div>
                    </Card>
                  </div>
                  {/* School Info */}
                  <Card className="bg-background/80 border-none px-0 py-0">
                    <CardHeader className="pb-2 px-8 pt-6">
                      <CardTitle className="text-lg">
                        School Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-8 px-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-6 text-sm">
                        <div>
                          <div className="text-muted-foreground text-xs mb-1">
                            School Name
                          </div>
                          <div className="font-semibold">{school.name}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs mb-1">
                            Admin Email
                          </div>
                          <div className="font-semibold">
                            {school.adminEmail}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs mb-1">
                            Contact Number
                          </div>
                          <div className="font-semibold">
                            {school.contactNumber}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs mb-1">
                            Applied Date
                          </div>
                          <div className="font-semibold">
                            {school.appliedDate}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="text-muted-foreground text-xs mb-1">
                            School Address
                          </div>
                          <div className="font-semibold">{school.address}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="documents" className="flex flex-col gap-4">
                  <div className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    Submitted Documents
                  </div>
                  {school.submittedDocuments &&
                  school.submittedDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {school.submittedDocuments.map((doc, idx) => (
                        <Card key={idx} className="bg-background/80">
                          <CardHeader className="flex flex-row items-center gap-4 pb-4 pt-4 px-6">
                            <FileText className="h-7 w-7 text-primary" />
                            <CardTitle className="text-base font-semibold flex-1">
                              {doc.name}
                            </CardTitle>
                            <CardAction className="ml-2">
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="text-xs px-3 py-1"
                              >
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1"
                                >
                                  View <ExternalLink className="h-4 w-4 ml-1" />
                                </a>
                              </Button>
                            </CardAction>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-xs mt-2">
                      No documents submitted.
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
              {/* Approve/Reject Buttons */}
              <div className="flex gap-2 justify-end border-t p-3 bg-background">
                {actionState === "idle" && (
                  <>
                    <Button
                      variant="outline"
                      className="text-destructive px-3 py-1.5 text-xs"
                      onClick={handleReject}
                      disabled={isProcessing}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      className="px-3 py-1.5 text-xs"
                      onClick={handleApproveClick}
                      disabled={isProcessing}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
                {actionState === "approved" && (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <CheckCircle2 className="h-5 w-5" />
                    School approved with limit: {teacherLimit}
                  </div>
                )}
                {actionState === "rejected" && (
                  <div className="flex items-center gap-2 text-red-600 font-semibold">
                    <XCircle className="h-5 w-5" />
                    School rejected
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogOverlay />
        <DialogContent className="max-w-md w-full p-8 font-[montserrat]">
          <DialogTitle className="mb-2 text-lg font-semibold">
            Approve School
          </DialogTitle>
          <DialogDescription className="mb-4 text-sm">
            Are you sure you want to approve{" "}
            <span className="font-semibold">{school.name}</span>? The school
            will become <span className="font-semibold">Active</span> and the
            school admin will gain access to the platform.
          </DialogDescription>
          <div className="mb-6">
            <div className="bg-muted/40 rounded-xl p-4 flex flex-col gap-1 mb-4">
              <div className="font-semibold text-base">{school.name}</div>
              <div className="text-sm text-muted-foreground">
                {school.adminEmail}
              </div>
              <div className="text-sm text-muted-foreground">
                {school.address}
              </div>
            </div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="teacher-limit"
            >
              Set Teacher Onboarding Limit{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="teacher-limit"
              type="number"
              min={1}
              value={teacherLimit}
              onChange={(e) =>
                setTeacherLimit(Math.max(1, Number(e.target.value)))
              }
              placeholder="Enter maximum number of teachers"
              className="mb-2"
            />
            <div className="text-xs text-muted-foreground">
              This limit controls how many teachers can onboard from this
              school. You can adjust it later from the school details page.
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleApproveConfirm}
              disabled={isProcessing || teacherLimit < 1}
            >
              Approve School
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
