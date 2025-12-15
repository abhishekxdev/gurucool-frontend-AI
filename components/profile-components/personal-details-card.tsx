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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  CheckCircle2,
  Clock,
  Lock,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";

export interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  profilePhoto: string;
  experience: string;
  subjects: string[];
  proficiencyLevel: string;
  currentSchool: {
    id: string;
    name: string;
  };
  joinDate: string;
  status: "active" | "suspended" | "pending_approval";
  suspensionReason?: string;
  emailVerified: boolean;
}

interface PersonalDetailsCardProps {
  profile: TeacherProfile;
  isEditing: boolean;
  isSuspended: boolean;
  errors: Record<string, string>;
  onInputChange: (field: keyof TeacherProfile, value: string) => void;
}

export function PersonalDetailsCard({
  profile,
  isEditing,
  isSuspended,
  errors,
  onInputChange,
}: PersonalDetailsCardProps) {
  return (
    <Card className="font-[montserrat] overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/50">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="size-5 text-primary" />
          </div>
          Personal Details
        </CardTitle>
        <CardDescription>Your basic personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Profile Photo */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="size-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10">
              {profile.profilePhoto ? (
                <Image
                  src={profile.profilePhoto}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <User className="size-12 text-primary/60" />
              )}
            </div>
            {isEditing && !isSuspended && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 size-8 rounded-full shadow-md border border-border/50 bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Camera className="size-4" />
              </Button>
            )}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 group-hover:ring-primary/30 transition-all duration-300" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold tracking-tight">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary/60" />
              Teacher at {profile.currentSchool.name}
            </p>
            <Badge
              variant="outline"
              className={`px-3 py-1 font-medium ${
                profile.status === "active"
                  ? "border-green-700/50 bg-green-950/30 text-green-400"
                  : profile.status === "suspended"
                  ? "border-red-700/50 bg-red-950/30 text-red-400"
                  : "border-amber-700/50 bg-amber-950/30 text-amber-400"
              }`}
            >
              {profile.status === "active" && (
                <CheckCircle2 className="size-3.5 mr-1.5" />
              )}
              {profile.status === "suspended" && (
                <Lock className="size-3.5 mr-1.5" />
              )}
              {profile.status === "pending_approval" && (
                <Clock className="size-3.5 mr-1.5" />
              )}
              {profile.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Name Fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2.5">
            <Label
              htmlFor="firstName"
              className="text-muted-foreground font-medium"
            >
              First Name
            </Label>
            {isEditing ? (
              <div>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => onInputChange("firstName", e.target.value)}
                  className={`h-11 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-colors ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <span className="size-1 rounded-full bg-red-500" />
                    {errors.firstName}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm py-2.5 px-3 rounded-xl bg-muted/30 border border-border/30">
                {profile.firstName}
              </p>
            )}
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="lastName"
              className="text-muted-foreground font-medium"
            >
              Last Name
            </Label>
            {isEditing ? (
              <div>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => onInputChange("lastName", e.target.value)}
                  className={`h-11 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-colors ${
                    errors.lastName ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <span className="size-1 rounded-full bg-red-500" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm py-2.5 px-3 rounded-xl bg-muted/30 border border-border/30">
                {profile.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2.5">
          <Label
            htmlFor="address"
            className="flex items-center gap-2 text-muted-foreground font-medium"
          >
            <MapPin className="size-4" />
            Address
          </Label>
          {isEditing ? (
            <div>
              <Textarea
                id="address"
                value={profile.address}
                onChange={(e) => onInputChange("address", e.target.value)}
                rows={2}
                className={`rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-colors resize-none ${
                  errors.address ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="size-1 rounded-full bg-red-500" />
                  {errors.address}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm py-2.5 px-3 rounded-xl bg-muted/30 border border-border/30">
              {profile.address}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2.5">
          <Label
            htmlFor="phone"
            className="flex items-center gap-2 text-muted-foreground font-medium"
          >
            <Phone className="size-4" />
            Phone Number
          </Label>
          {isEditing ? (
            <div>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                className={`h-11 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-colors ${
                  errors.phone ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="size-1 rounded-full bg-red-500" />
                  {errors.phone}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm py-2.5 px-3 rounded-xl bg-muted/30 border border-border/30">
              {profile.phone}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
