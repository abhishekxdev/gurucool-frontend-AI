"use client";

import {
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldX,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

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

type SchoolStatus = "active" | "suspended" | "pending_verification";

interface SchoolDetail {
  id: string;
  name: string;
  logoUrl: string;
  address: string;
  contactNumber: string;
  adminEmail: string;
  teacherCount: number;
  onboardingLimit: number;
  verificationStatus: SchoolStatus;
  suspensionNote?: string;
}

// Mock directory – should stay in sync with list view ids
const schoolDirectory: SchoolDetail[] = [
  {
    id: "school-001",
    name: "Sunrise Public School",
    logoUrl: "/gurucool/logo_full_light.png",
    address: "123 Sunrise Road, Delhi, India",
    contactNumber: "+91-98765-00001",
    adminEmail: "admin@sunrise.edu",
    teacherCount: 48,
    onboardingLimit: 60,
    verificationStatus: "active",
  },
  {
    id: "school-002",
    name: "Green Valley High",
    logoUrl: "/gurucool/logo_light.png",
    address: "42 Green Valley Lane, Bengaluru, India",
    contactNumber: "+91-98765-00002",
    adminEmail: "principal@greenvalley.edu",
    teacherCount: 32,
    onboardingLimit: 40,
    verificationStatus: "active",
  },
  {
    id: "school-003",
    name: "Harmony International",
    logoUrl: "/gurucool/logo.png",
    address: "7 Harmony Avenue, Mumbai, India",
    contactNumber: "+91-98765-00003",
    adminEmail: "contact@harmonyint.org",
    teacherCount: 20,
    onboardingLimit: 25,
    verificationStatus: "suspended",
    suspensionNote: "Temporarily suspended due to compliance review.",
  },
  {
    id: "school-004",
    name: "Blue Ridge Academy",
    logoUrl: "/gurucool/logo_dark.png",
    address: "21 Ridge Boulevard, Pune, India",
    contactNumber: "+91-98765-00004",
    adminEmail: "info@blueridge.edu",
    teacherCount: 12,
    onboardingLimit: 15,
    verificationStatus: "active",
  },
  {
    id: "school-005",
    name: "Starlight Girls School",
    logoUrl: "/gurucool/logo_full.png",
    address: "88 Starlight Street, Hyderabad, India",
    contactNumber: "+91-98765-00005",
    adminEmail: "contact@starlightgirls.org",
    teacherCount: 27,
    onboardingLimit: 30,
    verificationStatus: "pending_verification",
  },
  {
    id: "school-006",
    name: "Lotus Valley School",
    logoUrl: "/gurucool/logo_yellow.png",
    address: "77 Lotus Avenue, Kolkata, India",
    contactNumber: "+91-98765-00006",
    adminEmail: "admin@lotusvalley.edu",
    teacherCount: 35,
    onboardingLimit: 35,
    verificationStatus: "active",
  },
  {
    id: "school-007",
    name: "Skyline International",
    logoUrl: "/gurucool/logo_sky.png",
    address: "55 Skyline Road, Chennai, India",
    contactNumber: "+91-98765-00007",
    adminEmail: "contact@skylineintl.edu",
    teacherCount: 10,
    onboardingLimit: 20,
    verificationStatus: "suspended",
    suspensionNote: "Suspended for financial audit; contact administration.",
  },
  {
    id: "school-008",
    name: "Riverbank Primary",
    logoUrl: "/gurucool/logo_river.png",
    address: "8 Riverbank Crescent, Ahmedabad, India",
    contactNumber: "+91-98765-00008",
    adminEmail: "admin@riverbank.edu",
    teacherCount: 8,
    onboardingLimit: 12,
    verificationStatus: "active",
  },
  {
    id: "school-009",
    name: "Pinecrest Public School",
    logoUrl: "/gurucool/logo_green.png",
    address: "19 Pinecrest Avenue, Chandigarh, India",
    contactNumber: "+91-98765-00009",
    adminEmail: "principal@pinecrest.edu",
    teacherCount: 22,
    onboardingLimit: 25,
    verificationStatus: "pending_verification",
  },
  {
    id: "school-010",
    name: "Emerald Woods Academy",
    logoUrl: "/gurucool/logo_emerald.png",
    address: "101 Emerald Woods, Jaipur, India",
    contactNumber: "+91-98765-00010",
    adminEmail: "admin@emeraldwoods.edu",
    teacherCount: 15,
    onboardingLimit: 20,
    verificationStatus: "active",
  },
];

const SchoolDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [school, setSchool] = useState<SchoolDetail | undefined>(
    schoolDirectory.find((entry) => entry.id === id)
  );

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalValues, setOriginalValues] = useState({
    address: school?.address ?? "",
    contactNumber: school?.contactNumber ?? "",
    adminEmail: school?.adminEmail ?? "",
  });

  // Editable fields state
  const [address, setAddress] = useState(school?.address ?? "");
  const [contactNumber, setContactNumber] = useState(
    school?.contactNumber ?? ""
  );
  const [adminEmail, setAdminEmail] = useState(school?.adminEmail ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Onboarding limit dialog state
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [limitInput, setLimitInput] = useState<string>(
    school ? String(school.onboardingLimit) : ""
  );
  const [limitError, setLimitError] = useState<string | null>(null);

  // Suspend dialog state
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspensionNote, setSuspensionNote] = useState(
    school?.suspensionNote ?? ""
  );

  if (!school) {
    router.push("/admin/dashboard/manage-schools");
    return null;
  }

  const isSuspended = school.verificationStatus === "suspended";
  const isPendingVerification =
    school.verificationStatus === "pending_verification";

  const handleSuspendToggle = () => {
    if (!isSuspended) {
      setShowSuspendDialog(true);
    } else {
      // Unsuspend directly (happy path)
      setSchool({
        ...school,
        verificationStatus: "active",
        suspensionNote: undefined,
      });
      setSuspensionNote("");
    }
  };

  const confirmSuspension = () => {
    setSchool({
      ...school,
      verificationStatus: "suspended",
      suspensionNote: suspensionNote || "No reason provided",
    });
    setShowSuspendDialog(false);
  };

  const handleEditClick = () => {
    if (isPendingVerification) return; // Prevent editing if pending verification

    // Store current values as original when entering edit mode
    setOriginalValues({
      address,
      contactNumber,
      adminEmail,
    });
    setIsEditMode(true);
    setFormError(null);
  };

  const handleCancelEdit = () => {
    // Revert to original values
    setAddress(originalValues.address);
    setContactNumber(originalValues.contactNumber);
    setAdminEmail(originalValues.adminEmail);
    setIsEditMode(false);
    setFormError(null);
  };

  const handleSaveClick = () => {
    setFormError(null);

    // Basic validation (sad path)
    if (!address.trim() || !contactNumber.trim() || !adminEmail.trim()) {
      setFormError("Please fill all contact and address fields.");
      return;
    }

    // Check if email is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    // Show confirmation dialog
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    // "Save" locally – in real app this would be an API call
    const updated: SchoolDetail = {
      ...school,
      address: address.trim(),
      contactNumber: contactNumber.trim(),
      adminEmail: adminEmail.trim(),
    };
    setSchool(updated);
    setOriginalValues({
      address: address.trim(),
      contactNumber: contactNumber.trim(),
      adminEmail: adminEmail.trim(),
    });
    setIsEditMode(false);
    setShowSaveDialog(false);
    setFormError(null);
  };

  const statusStyles =
    school.verificationStatus === "active"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
      : school.verificationStatus === "pending_verification"
      ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
      : "border-rose-500/40 bg-rose-500/10 text-rose-400";

  const statusLabel =
    school.verificationStatus === "active"
      ? "Active"
      : school.verificationStatus === "pending_verification"
      ? "Pending verification"
      : "Suspended";

  const handleConfirmLimitChange = () => {
    setLimitError(null);

    const parsed = Number(limitInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setLimitError("Teacher onboarding limit must be a positive number.");
      return;
    }

    const updated: SchoolDetail = {
      ...school,
      onboardingLimit: parsed,
    };
    setSchool(updated);
    setShowLimitDialog(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-auto p-4 sm:p-6 scrollbar-hide font-[montserrat]">
      {school.suspensionNote && isSuspended && (
        <div className="mb-6 rounded-xl border-2 border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-destructive/20 p-2">
              <ShieldX className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">
                School Suspended
              </h3>
              <p className="mt-1 text-sm text-destructive/90">
                {school.suspensionNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {isPendingVerification && (
        <div className="mb-6 rounded-xl border-2 border-amber-500/50 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-500/20 p-2">
              <ShieldCheck className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-500">
                School Pending Verification
              </h3>
              <p className="mt-1 text-sm text-amber-500/90">
                This school is currently pending verification. All editing and
                management actions are locked until verification is complete.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {school.name}
            </h1>
            <p className="text-muted-foreground">
              14.2 School Detail View · {school.teacherCount} teachers
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className={statusStyles}>
            {statusLabel}
          </Badge>
          <Button
            variant={isSuspended ? "default" : "destructive"}
            className="h-11 rounded-xl px-5"
            onClick={handleSuspendToggle}
            disabled={isPendingVerification}
          >
            {isSuspended ? "Unsuspend School" : "Suspend School"}
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl px-5">
            <Link href="/admin/dashboard/manage-schools">
              Back to Schools List
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: profile + contact cards */}
        <div className="space-y-6 lg:col-span-2">
          {/* High‑level stats cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-xl border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                  Teachers
                </CardTitle>
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Users2 className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">
                  {school.teacherCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Currently onboarded from this school
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                  Teacher Onboarding Limit
                </CardTitle>
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">
                  {school.onboardingLimit}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Max teachers allowed to join from this school
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                  Verification Status
                </CardTitle>
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">
                  {statusLabel}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Changes are reflected instantly across the platform
                </p>
              </CardContent>
            </Card>
          </div>

          {/* School profile & contact details (editable) */}
          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>School Profile</CardTitle>
                  <CardDescription>
                    View and update the school&apos;s core information. Changes
                    are applied immediately in the system.
                  </CardDescription>
                </div>
                {!isEditMode && !isPendingVerification && (
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">School Name</p>
                  <p className="font-medium text-foreground">{school.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Admin Email</p>
                  <Input
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    disabled={!isEditMode || isPendingVerification}
                    className="mt-1"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <p className="text-muted-foreground">Contact Number</p>
                  <Input
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    disabled={!isEditMode || isPendingVerification}
                    className="mt-1"
                    placeholder="+91-00000-00000"
                  />
                </div>
                <div>
                  <p className="text-muted-foreground">
                    Teacher Onboarding Limit
                  </p>
                  <div className="mt-1 flex items-center gap-3">
                    <p className="font-medium text-foreground">
                      {school.onboardingLimit}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="whitespace-nowrap"
                      onClick={() => {
                        setLimitInput(String(school.onboardingLimit));
                        setLimitError(null);
                        setShowLimitDialog(true);
                      }}
                      disabled={isPendingVerification}
                    >
                      Change limit
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Adjusting this limit controls how many teachers can onboard
                    from this school.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground">School Address</p>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditMode || isPendingVerification}
                  className="mt-1"
                  rows={3}
                  placeholder="Full address of the school"
                />
              </div>

              {formError && (
                <p className="text-sm font-medium text-destructive">
                  {formError}
                </p>
              )}

              {isEditMode ? (
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="rounded-xl px-5"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button className="rounded-xl px-5" onClick={handleSaveClick}>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Click &quot;Edit&quot; to modify school details. Changes are
                    saved after confirmation (happy path). Validation errors or
                    network failures should surface here in a real integration
                    (sad path).
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Small informational card about behaviour */}
          {/* <Card className="rounded-xl border border-border/60 bg-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <CalendarCheck className="h-4 w-4" />
                System Behaviour
              </CardTitle>
              <CardDescription>
                How changes to this school impact the rest of the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                • Updated school details are stored for all admins viewing this
                record.
              </p>
              <p>
                • New teacher onboarding limit is enforced immediately when new
                teachers join from this school.
              </p>
              <p>
                • Suspension and reactivation updates the global school status
                for admins and teachers linked to this school.
              </p>
            </CardContent>
          </Card> */}
        </div>

        {/* Right column: quick snapshot cards */}
        <div className="space-y-6">
          <Card className="rounded-xl border-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                </div>
                Contact Overview
              </CardTitle>
              <CardDescription>
                Quick snapshot of how to reach this school.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium text-foreground">{address}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Contact Number
                  </p>
                  <p className="font-medium text-foreground">{contactNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Admin Email
                  </p>
                  <p className="font-medium text-foreground">{adminEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="rounded-xl border-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-rose-500/10 p-2">
                  <ShieldX className="h-5 w-5 text-rose-500" />
                </div>
                Risk & Status
              </CardTitle>
              <CardDescription>
                Track suspension notes and status for audit purposes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Current status</p>
                <p className="font-medium text-foreground">{statusLabel}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Latest suspension note</p>
                <p className="text-sm text-foreground">
                  {school.suspensionNote
                    ? school.suspensionNote
                    : "No suspension history recorded for this school."}
                </p>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>

      {/* Onboarding limit dialog */}
      <AlertDialog
        open={showLimitDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowLimitDialog(false);
            setLimitError(null);
            setLimitInput(String(school.onboardingLimit));
          }
        }}
      >
        <AlertDialogContent className="font-[montserrat]">
          <AlertDialogHeader>
            <AlertDialogTitle>Update teacher onboarding limit</AlertDialogTitle>
            <AlertDialogDescription>
              You are changing the maximum number of teachers who can onboard
              from this school. This change is applied immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 text-sm">
            <div className="rounded-lg bg-muted/40 p-4">
              <p className="font-medium">{school.name}</p>
              <p className="text-muted-foreground">
                Current limit: {school.onboardingLimit} teachers
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">New onboarding limit</p>
              <Input
                type="number"
                min={1}
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                You can increase or decrease this number. Make sure it aligns
                with the school&apos;s contract or usage plan.
              </p>
              {limitError && (
                <p className="text-sm font-medium text-destructive">
                  {limitError}
                </p>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowLimitDialog(false);
                setLimitError(null);
                setLimitInput(String(school.onboardingLimit));
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLimitChange}>
              Confirm change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save confirmation dialog */}
      <AlertDialog
        open={showSaveDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowSaveDialog(false);
          }
        }}
      >
        <AlertDialogContent className="font-[montserrat]">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm School Details Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes to {school.name}? The
              updated information will be applied immediately across the
              platform.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 text-sm">
            <div className="rounded-lg bg-muted/40 p-4">
              <p className="font-medium mb-3">Changes to be saved:</p>
              <div className="space-y-2">
                {address !== originalValues.address && (
                  <div>
                    <p className="text-muted-foreground text-xs">Address:</p>
                    <p className="font-medium">{address}</p>
                  </div>
                )}
                {contactNumber !== originalValues.contactNumber && (
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Contact Number:
                    </p>
                    <p className="font-medium">{contactNumber}</p>
                  </div>
                )}
                {adminEmail !== originalValues.adminEmail && (
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Admin Email:
                    </p>
                    <p className="font-medium">{adminEmail}</p>
                  </div>
                )}
                {address === originalValues.address &&
                  contactNumber === originalValues.contactNumber &&
                  adminEmail === originalValues.adminEmail && (
                    <p className="text-muted-foreground">
                      No changes detected.
                    </p>
                  )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              These updates will be reflected immediately for all platform
              admins viewing this school record.
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSaveDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>
              Confirm & Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspension dialog */}
      <AlertDialog
        open={showSuspendDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowSuspendDialog(false);
            setSuspensionNote(school.suspensionNote ?? "");
          }
        }}
      >
        <AlertDialogContent className="font-[montserrat]">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm School Suspension</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend {school.name}? This will
              immediately affect the school admin and all associated teachers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-muted/40 p-4 text-sm">
              <p className="font-medium">{school.name}</p>
              <p className="text-muted-foreground">{school.adminEmail}</p>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 text-emerald-300"
                >
                  Currently Active
                </Badge>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">
                Add a note / reason for this suspension
              </p>
              <Textarea
                placeholder="Share the reason for suspending this school"
                value={suspensionNote}
                onChange={(e) => setSuspensionNote(e.target.value)}
                className="text-base"
                rows={3}
              />
              <p className="text-muted-foreground">
                This note will be stored with the school record and visible in
                future audits.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSuspension}>
              Confirm Suspension
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SchoolDetailPage;
