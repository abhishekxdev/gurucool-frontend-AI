"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  BookOpen,
  Calendar,
  Download,
  FileText,
  GraduationCap,
  RefreshCcw,
  Upload,
} from "lucide-react";
import { useRef } from "react";
import { TeacherProfile } from "./personal-details-card";

export interface Certificate {
  id: string;
  name: string;
  fileName: string;
  uploadDate: string;
  type: "optional" | "earned";
}

export interface EarnedBadge {
  id: string;
  name: string;
  description: string;
  earnedDate: string;
  imageUrl: string;
}

// Certificates Dialog
interface CertificatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificates: Certificate[];
  isSuspended: boolean;
  uploadingCertificate: boolean;
  onDownload: (cert: Certificate) => void;
  onUpload: (file: File) => void;
  formatDate: (date: string) => string;
}

export function CertificatesDialog({
  open,
  onOpenChange,
  certificates,
  isSuspended,
  uploadingCertificate,
  onDownload,
  onUpload,
  formatDate,
}: CertificatesDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF or image file (JPEG, PNG)");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      onUpload(file);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border-border/50">
          <DialogHeader className="pb-4 border-b border-border/50">
            <DialogTitle className="flex items-center gap-3 font-[montserrat]">
              <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                <FileText className="size-5 text-green-500" />
              </div>
              Certificates
            </DialogTitle>
            <DialogDescription className="font-[montserrat]">
              Your earned and uploaded certificates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            {/* Earned Certificates */}
            <div>
              <p className="text-sm font-semibold mb-3 flex items-center gap-2 font-[montserrat] text-green-400">
                <Award className="size-4" />
                Earned Certificates
              </p>
              <div className="space-y-2.5 font-[montserrat]">
                {certificates
                  .filter((c) => c.type === "earned")
                  .map((cert) => (
                    <div
                      key={cert.id}
                      className="group flex items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-green-950/30 to-green-900/10 border border-green-800/30 hover:border-green-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="shrink-0 p-2.5 rounded-xl bg-green-900/40">
                          <FileText className="size-4 text-green-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {cert.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(cert.uploadDate)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 rounded-xl hover:bg-green-500/10 hover:text-green-400"
                        onClick={() => onDownload(cert)}
                      >
                        <Download className="size-4" />
                      </Button>
                    </div>
                  ))}
                {certificates.filter((c) => c.type === "earned").length ===
                  0 && (
                  <div className="text-center py-8 rounded-xl bg-muted/20 border border-dashed border-border/50">
                    <Award className="size-10 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground font-[montserrat]">
                      No earned certificates yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Uploaded Certificates */}
            <div>
              <p className="text-sm font-semibold mb-3 flex items-center gap-2 font-[montserrat] text-blue-400">
                <Upload className="size-4" />
                Uploaded Certificates
              </p>
              <div className="space-y-2.5 font-[montserrat]">
                {certificates
                  .filter((c) => c.type === "optional")
                  .map((cert) => (
                    <div
                      key={cert.id}
                      className="group flex items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/20 border border-border/50 hover:border-border transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="shrink-0 p-2.5 rounded-xl bg-muted/50">
                          <FileText className="size-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {cert.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(cert.uploadDate)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 rounded-xl hover:bg-blue-500/10 hover:text-blue-400"
                        onClick={() => onDownload(cert)}
                      >
                        <Download className="size-4" />
                      </Button>
                    </div>
                  ))}
                {certificates.filter((c) => c.type === "optional").length ===
                  0 && (
                  <div className="text-center py-8 rounded-xl bg-muted/20 border border-dashed border-border/50">
                    <Upload className="size-10 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No uploaded certificates yet
                    </p>
                  </div>
                )}
              </div>

              {!isSuspended && (
                <Button
                  variant="outline"
                  className="w-full mt-4 font-[montserrat] h-11 rounded-xl border-dashed border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/5 text-blue-400"
                  onClick={triggerFileInput}
                  disabled={uploadingCertificate}
                >
                  {uploadingCertificate ? (
                    <>
                      <RefreshCcw className="size-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="size-4 mr-2" />
                      Upload Certificate
                    </>
                  )}
                </Button>
              )}
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Supported formats: PDF, JPEG, PNG (max 5MB)
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Badges Dialog
interface BadgesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badges: EarnedBadge[];
  formatDate: (date: string) => string;
}

export function BadgesDialog({
  open,
  onOpenChange,
  badges,
  formatDate,
}: BadgesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border-border/50">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3 font-[montserrat]">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Award className="size-5 text-amber-500" />
            </div>
            Earned Badges
          </DialogTitle>
          <DialogDescription className="font-[montserrat]">
            Badges you&apos;ve earned from PD assessments
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          {badges.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-muted/20 border border-dashed border-border/50">
              <div className="p-4 rounded-2xl bg-amber-500/10 w-fit mx-auto mb-4">
                <Award className="size-10 text-amber-500/50" />
              </div>
              <p className="text-muted-foreground font-medium font-[montserrat]">
                No badges earned yet
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1 font-[montserrat]">
                Complete PD assessments to earn badges
              </p>
            </div>
          ) : (
            <div className="space-y-3 font-[montserrat]">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-amber-900/10 border border-amber-800/30 hover:border-amber-700/50 transition-colors"
                >
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="size-8 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">
                      {badge.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {badge.description}
                    </p>
                    <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      Earned on {formatDate(badge.earnedDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick Stats Dialog
interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: TeacherProfile;
  badges: EarnedBadge[];
  certificates: Certificate[];
  formatDate: (date: string) => string;
}

export function StatsDialog({
  open,
  onOpenChange,
  profile,
  badges,
  certificates,
  formatDate,
}: StatsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border-border/50">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3 font-[montserrat]">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <BookOpen className="size-5 text-blue-500" />
            </div>
            Quick Stats
          </DialogTitle>
          <DialogDescription className="font-[montserrat]">
            Overview of your profile statistics
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 pt-2 font-[montserrat]">
          <div className="grid grid-cols-2 gap-3">
            <div className="group p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-amber-900/10 border border-amber-800/30 text-center hover:border-amber-700/50 transition-colors">
              <div className="p-2.5 rounded-xl bg-amber-500/10 w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Award className="size-6 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-amber-400">
                {badges.length}
              </p>
              <p className="text-sm text-amber-500/80 mt-1">Badges Earned</p>
            </div>
            <div className="group p-4 rounded-xl bg-gradient-to-br from-green-950/30 to-green-900/10 border border-green-800/30 text-center hover:border-green-700/50 transition-colors">
              <div className="p-2.5 rounded-xl bg-green-500/10 w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                <FileText className="size-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400">
                {certificates.filter((c) => c.type === "earned").length}
              </p>
              <p className="text-sm text-green-500/80 mt-1">Certificates</p>
            </div>
            <div className="group p-4 rounded-xl bg-gradient-to-br from-blue-950/30 to-blue-900/10 border border-blue-800/30 text-center hover:border-blue-700/50 transition-colors">
              <div className="p-2.5 rounded-xl bg-blue-500/10 w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                <BookOpen className="size-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {profile.subjects.length}
              </p>
              <p className="text-sm text-blue-500/80 mt-1">Subjects</p>
            </div>
            <div className="group p-4 rounded-xl bg-gradient-to-br from-purple-950/30 to-purple-900/10 border border-purple-800/30 text-center hover:border-purple-700/50 transition-colors">
              <div className="p-2.5 rounded-xl bg-purple-500/10 w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                <GraduationCap className="size-6 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-purple-400">
                {profile.experience.split(" ")[0]}
              </p>
              <p className="text-sm text-purple-500/80 mt-1">
                Years Experience
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Additional Stats */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Profile Summary</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/30">
                <span className="text-sm text-muted-foreground">
                  Member Since
                </span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(profile.joinDate)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/30">
                <span className="text-sm text-muted-foreground">
                  Current School
                </span>
                <span className="text-sm font-medium truncate max-w-[150px] text-foreground">
                  {profile.currentSchool.name}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/30">
                <span className="text-sm text-muted-foreground">
                  Proficiency Level
                </span>
                <Badge
                  variant="outline"
                  className={`${
                    profile.proficiencyLevel === "Expert"
                      ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                      : profile.proficiencyLevel === "Advanced"
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                      : profile.proficiencyLevel === "Intermediate"
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                      : "border-muted-foreground/50 bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {profile.proficiencyLevel}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/30">
                <span className="text-sm text-muted-foreground">
                  Account Status
                </span>
                <Badge
                  variant="outline"
                  className={
                    profile.status === "active"
                      ? "border-green-700/50 bg-green-950/30 text-green-400"
                      : profile.status === "suspended"
                      ? "border-red-700/50 bg-red-950/30 text-red-400"
                      : "border-amber-700/50 bg-amber-950/30 text-amber-400"
                  }
                >
                  {profile.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/30">
                <span className="text-sm text-muted-foreground">
                  Uploaded Certificates
                </span>
                <span className="text-sm font-medium text-foreground">
                  {certificates.filter((c) => c.type === "optional").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
