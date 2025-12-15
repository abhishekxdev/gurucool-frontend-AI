"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Info, Lock, Mail, Shield, XCircle } from "lucide-react";

// Suspension Banner
interface SuspensionBannerProps {
  suspensionReason?: string;
  onViewDetails: () => void;
}

export function SuspensionBanner({ onViewDetails }: SuspensionBannerProps) {
  return (
    <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-red-950/40 to-red-900/20 border border-red-800/40 font-[montserrat] shadow-lg shadow-red-900/10">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-red-900/40 border border-red-800/30">
          <Lock className="size-6 text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-400 text-lg">
            Account Suspended
          </h3>
          <p className="text-sm text-red-400/80 mt-1.5 leading-relaxed">
            Your account has been suspended. You have read-only access to your
            profile, badges, and certificates.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-red-400 border-red-700/50 hover:bg-red-950/40 hover:border-red-600/50 rounded-lg"
            onClick={onViewDetails}
          >
            <Info className="size-4 mr-2" />
            View Suspension Details
          </Button>
        </div>
      </div>
    </div>
  );
}

// Suspension Dialog
interface SuspensionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suspensionReason?: string;
}

export function SuspensionDialog({
  open,
  onOpenChange,
  suspensionReason,
}: SuspensionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400 font-[montserrat]">
            <Shield className="size-5" />
            Account Suspension Notice
          </DialogTitle>
          <DialogDescription>
            Your account has been temporarily suspended by your school
            administrator.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {suspensionReason && (
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-800/30">
              <p className="text-sm font-medium text-red-400 mb-1 font-[montserrat]">
                Reason for Suspension:
              </p>
              <p className="text-sm text-red-400/80 font-[montserrat]">
                {suspensionReason}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">During suspension, you:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-red-400 font-[montserrat]">
                <XCircle className="size-4" />
                Cannot access AI Tutor or learning modules
              </div>
              <div className="flex items-center gap-2 text-sm text-red-400 font-[montserrat]">
                <XCircle className="size-4" />
                Cannot take assessments
              </div>
              <div className="flex items-center gap-2 text-sm text-red-400 font-[montserrat]">
                <XCircle className="size-4" />
                Cannot earn new badges
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">You can still:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-green-400 font-[montserrat]">
                <CheckCircle2 className="size-4" />
                View your profile information
              </div>
              <div className="flex items-center gap-2 text-sm text-green-400 font-[montserrat]">
                <CheckCircle2 className="size-4" />
                View previously earned badges
              </div>
              <div className="flex items-center gap-2 text-sm text-green-400 font-[montserrat]">
                <CheckCircle2 className="size-4" />
                Download your certificates
              </div>
              <div className="flex items-center gap-2 text-sm text-green-400 font-[montserrat]">
                <CheckCircle2 className="size-4" />
                View past PD history
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>I Understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// School Change Request Banners
interface SchoolChangeRequest {
  id: string;
  fromSchool: string;
  toSchool: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  responseDate?: string;
  adminComment?: string;
}

interface SchoolChangeRequestBannerProps {
  request: SchoolChangeRequest;
  formatDate: (date: string) => string;
}

export function SchoolChangeRequestBanner({
  request,
  formatDate,
}: SchoolChangeRequestBannerProps) {
  if (request.status === "pending") {
    return (
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-amber-900/20 border border-amber-800/40 font-[montserrat] shadow-lg shadow-amber-900/10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-900/40 border border-amber-800/30">
            <Info className="size-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-400 text-lg">
              School Change Request Pending
            </h3>
            <p className="text-sm text-amber-400/80 mt-1.5 leading-relaxed">
              Your request to transfer to{" "}
              <strong className="text-amber-300">{request.toSchool}</strong> is
              awaiting approval from the school administrator.
            </p>
            <p className="text-xs text-amber-500 mt-2.5 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-amber-500" />
              Submitted on {formatDate(request.requestDate)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (request.status === "rejected") {
    return (
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-red-950/40 to-red-900/20 border border-red-800/40 font-[montserrat] shadow-lg shadow-red-900/10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-900/40 border border-red-800/30">
            <XCircle className="size-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-400 text-lg">
              School Change Request Rejected
            </h3>
            <p className="text-sm text-red-400/80 mt-1.5 leading-relaxed">
              Your school change request was rejected by the school
              administrator.
            </p>
            {request.adminComment && (
              <p className="text-sm text-red-400 mt-3 p-3 bg-red-900/30 rounded-xl border border-red-800/30">
                <strong>Reason:</strong> {request.adminComment}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Update Confirmation Dialog
interface UpdateConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEmailChanged: boolean;
  selectedNewSchool: string;
  schoolName?: string;
  onConfirm: () => void;
}

export function UpdateConfirmDialog({
  open,
  onOpenChange,
  isEmailChanged,
  selectedNewSchool,
  schoolName,
  onConfirm,
}: UpdateConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-[montserrat]">
            Confirm Profile Update
          </DialogTitle>
          <DialogDescription className="font-[montserrat]">
            {isEmailChanged && selectedNewSchool ? (
              <>
                You are about to update your profile and request a school change
                to <strong>{schoolName}</strong>. This request will need
                approval from the school administrator.
              </>
            ) : (
              "Are you sure you want to update your profile information?"
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-[montserrat]"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            {isEmailChanged && selectedNewSchool
              ? "Submit for Approval"
              : "Update Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Email Verification Dialog
interface EmailVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerify: () => void;
}

export function EmailVerificationDialog({
  open,
  onOpenChange,
  email,
  onVerify,
}: EmailVerificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-[montserrat]">
            Verify Your Email
          </DialogTitle>
          <DialogDescription className="font-[montserrat]">
            A verification link has been sent to <strong>{email}</strong>.
            Please check your inbox and click the verification link.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 font-[montserrat]">
          <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted">
            <Mail className="size-8 text-primary" />
            <div>
              <p className="font-medium">Check your email</p>
              <p className="text-sm text-muted-foreground font-[montserrat]">
                Click the link to verify
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onVerify}
            className="font-[montserrat]"
          >
            <CheckCircle2 className="size-4 mr-2" />
            I&apos;ve Verified (Simulate)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// School Change Success Dialog
interface SchoolChangeSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SchoolChangeSuccessDialog({
  open,
  onOpenChange,
}: SchoolChangeSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-[montserrat]">
            School Change Request Submitted
          </DialogTitle>
          <DialogDescription className="font-[montserrat]">
            Your request has been submitted successfully.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 font-[montserrat]">
          <div className="p-4 rounded-lg bg-green-950/20 border border-green-800/30">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="size-5" />
              <p className="font-medium">Profile sent for approval</p>
            </div>
            <p className="text-sm text-green-400/80 mt-2">
              Your school change request will be reviewed by the selected
              school&apos;s administrator. You will be notified once a decision
              is made.
            </p>
          </div>
        </div>
        <DialogFooter className="font-[montserrat]">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
