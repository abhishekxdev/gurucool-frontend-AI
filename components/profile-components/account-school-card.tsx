"use client";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Info,
  Mail,
  RefreshCcw,
} from "lucide-react";
import { TeacherProfile } from "./personal-details-card";

export interface School {
  id: string;
  name: string;
  address: string;
}

interface AccountSchoolCardProps {
  profile: TeacherProfile;
  schools: School[];
  isEditing: boolean;
  isSuspended: boolean;
  errors: Record<string, string>;
  newEmail: string;
  isEmailChanged: boolean;
  isEmailVerified: boolean;
  isEmailVerificationSent: boolean;
  selectedNewSchool: string;
  onEmailChange: (value: string) => void;
  onSendVerification: () => void;
  onSchoolChange: (schoolId: string) => void;
  formatDate: (date: string) => string;
}

export function AccountSchoolCard({
  profile,
  schools,
  isEditing,
  isSuspended,
  errors,
  newEmail,
  isEmailChanged,
  isEmailVerified,
  isEmailVerificationSent,
  selectedNewSchool,
  onEmailChange,
  onSendVerification,
  onSchoolChange,
  formatDate,
}: AccountSchoolCardProps) {
  return (
    <Card className="font-[montserrat] overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/5 via-blue-500/3 to-transparent border-b border-border/50">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Building2 className="size-5 text-blue-500" />
          </div>
          Account & School Information
        </CardTitle>
        <CardDescription>
          Manage your email and school affiliation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Email */}
        <div className="space-y-2.5">
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-muted-foreground font-medium"
          >
            <Mail className="size-4" />
            Email Address
          </Label>
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={isEmailChanged ? newEmail : profile.email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className={`h-11 rounded-xl bg-muted/30 border-border/50 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  disabled={isSuspended}
                />
                {isEmailChanged && !isEmailVerified && (
                  <Button
                    variant="outline"
                    onClick={onSendVerification}
                    disabled={isEmailVerificationSent || isSuspended}
                    className="rounded-xl h-11 px-4"
                  >
                    {isEmailVerificationSent ? (
                      <>
                        <Clock className="size-4 mr-2" />
                        Verify
                      </>
                    ) : (
                      <>
                        <Mail className="size-4 mr-2" />
                        Send Verification
                      </>
                    )}
                  </Button>
                )}
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span className="size-1 rounded-full bg-red-500" />
                  {errors.email}
                </p>
              )}
              {isEmailChanged && isEmailVerified && (
                <div className="flex items-center gap-2 text-sm text-green-400 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="size-4" />
                  Email verified! You can now select a new school.
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
              <Mail className="size-5 text-muted-foreground" />
              <p className="text-sm flex-1">{profile.email}</p>
              {profile.emailVerified && (
                <Badge
                  variant="outline"
                  className="border-green-700/50 bg-green-950/30 text-green-400"
                >
                  <CheckCircle2 className="size-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          )}
        </div>

        <Separator className="bg-border/50" />

        {/* Current School */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-muted-foreground font-medium">
            <Building2 className="size-4" />
            Current School
          </Label>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
            <div className="p-3 rounded-xl bg-primary/10">
              <Building2 className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {profile.currentSchool.name}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Member since {formatDate(profile.joinDate)}
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-green-700/50 bg-green-950/30 text-green-400"
            >
              <CheckCircle2 className="size-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>

        {/* Change School Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <RefreshCcw className="size-4 text-primary" />
            </div>
            <Label className="text-base font-medium">Change School</Label>
          </div>

          {!isEditing && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-blue-900/20 border border-blue-800/40">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Info className="size-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-300">
                    Want to change school?
                  </p>
                  <p className="text-xs text-blue-400/80 mt-1">
                    Click &quot;Edit Profile&quot; and update your email ID
                    first to initiate a school transfer.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="space-y-4">
              {!isEmailChanged && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-amber-900/20 border border-amber-800/40">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <AlertCircle className="size-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-300">
                        Email update required
                      </p>
                      <p className="text-xs text-amber-400/80 mt-1">
                        Update your email address above to enable school
                        selection.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isEmailChanged && !isEmailVerified && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-amber-900/20 border border-amber-800/40">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <Clock className="size-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-300">
                        Verification pending
                      </p>
                      <p className="text-xs text-amber-400/80 mt-1">
                        Please verify your new email to enable school selection.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative">
                <Select
                  value={selectedNewSchool}
                  onValueChange={onSchoolChange}
                  disabled={!isEmailChanged || !isEmailVerified || isSuspended}
                >
                  <SelectTrigger
                    className={`h-auto py-3 ${
                      !isEmailChanged || !isEmailVerified
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-muted/50 transition-colors"
                    }`}
                  >
                    <SelectValue placeholder="Select a new school to transfer" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools
                      .filter((s) => s.id !== profile.currentSchool.id)
                      .map((school) => (
                        <SelectItem
                          key={school.id}
                          value={school.id}
                          className="py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                              <Building2 className="size-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{school.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {school.address}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedNewSchool && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-indigo-900/20 border border-blue-800/40">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <CheckCircle2 className="size-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Ready to submit
                      </p>
                      <p className="text-xs text-blue-400/80 mt-1">
                        Your school change request will be reviewed by the
                        selected school&apos;s administrator. You&apos;ll be
                        notified once approved.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
