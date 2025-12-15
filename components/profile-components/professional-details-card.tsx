"use client";

import { Badge } from "@/components/ui/badge";
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
import { GraduationCap } from "lucide-react";
import { TeacherProfile } from "./personal-details-card";

interface ProfessionalDetailsCardProps {
  profile: TeacherProfile;
  isEditing: boolean;
  isSuspended: boolean;
  onInputChange: (field: keyof TeacherProfile, value: string) => void;
  onSubjectsChange: (subject: string, checked: boolean) => void;
}

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const subjectOptions = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Social Studies",
  "Computer Science",
  "Economics",
  "History",
];

export function ProfessionalDetailsCard({
  profile,
  isEditing,
  isSuspended,
  onInputChange,
  onSubjectsChange,
}: ProfessionalDetailsCardProps) {
  return (
    <Card className="font-[montserrat] overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/5 via-emerald-500/3 to-transparent border-b border-border/50">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <GraduationCap className="size-5 text-emerald-500" />
          </div>
          Professional Details
        </CardTitle>
        <CardDescription>
          Your teaching experience and expertise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Experience */}
        <div className="space-y-2.5">
          <Label
            htmlFor="experience"
            className="text-muted-foreground font-medium"
          >
            Teaching Experience
          </Label>
          {isEditing ? (
            <Input
              id="experience"
              value={profile.experience}
              onChange={(e) => onInputChange("experience", e.target.value)}
              placeholder="e.g., 5 years"
              disabled={isSuspended}
              className="h-11 rounded-xl bg-muted/30 border-border/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
            />
          ) : (
            <p className="text-sm py-2.5 px-3 rounded-xl bg-muted/30 border border-border/30">
              {profile.experience}
            </p>
          )}
        </div>

        {/* Subjects */}
        <div className="space-y-3">
          <Label className="text-muted-foreground font-medium">Subjects</Label>
          {isEditing ? (
            <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => {
                  const isSelected = profile.subjects.includes(subject);
                  return (
                    <Badge
                      key={subject}
                      variant="outline"
                      className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-200 ${
                        isSuspended
                          ? "opacity-50 cursor-not-allowed"
                          : isSelected
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "border-border/50 hover:border-emerald-500/30 hover:bg-emerald-500/5"
                      }`}
                      onClick={() => {
                        if (!isSuspended) {
                          onSubjectsChange(subject, !isSelected);
                        }
                      }}
                    >
                      {isSelected && (
                        <span className="size-1.5 rounded-full bg-emerald-400 mr-1.5" />
                      )}
                      {subject}
                    </Badge>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <span className="size-1 rounded-full bg-muted-foreground" />
                Click to select or deselect subjects
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.subjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="outline"
                  className="px-3 py-1.5 rounded-lg border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                >
                  <span className="size-1.5 rounded-full bg-emerald-400 mr-1.5" />
                  {subject}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Proficiency Level */}
        <div className="space-y-2.5">
          <Label className="text-muted-foreground font-medium">
            Proficiency Level
          </Label>
          {isEditing ? (
            <Select
              value={profile.proficiencyLevel}
              onValueChange={(value) =>
                onInputChange("proficiencyLevel", value)
              }
              disabled={isSuspended}
            >
              <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border/50 focus:border-emerald-500/50 focus:ring-emerald-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level} value={level} className="rounded-lg">
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Badge
              variant="outline"
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
