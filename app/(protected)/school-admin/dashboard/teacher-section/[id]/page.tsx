"use client";

import {
  Award,
  BadgeCheck,
  Calendar,
  Clock,
  FileCheck,
  GraduationCap,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
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
import { Textarea } from "@/components/ui/textarea";
import { teacherDirectory } from "@/lib/data";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

const TeacherDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [teacher, setTeacher] = useState(
    teacherDirectory.find((entry) => entry.id === id)
  );
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspensionNote, setSuspensionNote] = useState("");

  if (!teacher) {
    router.push("/school-admin/dashboard/teacher-section");
    return null;
  }

  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  const initials = `${teacher.firstName?.[0] ?? ""}${
    teacher.lastName?.[0] ?? ""
  }`.toUpperCase();
  const certificatesEarned = teacher.certificates.length;
  const badgesEarned = teacher.badges.length;
  const completedAssessments = teacher.assessments.length;
  const scores = teacher.assessments.map((assessment) => assessment.score);
  const scoreAverage = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;
  const scoreHigh = scores.length ? Math.max(...scores) : 0;

  const handleSuspendToggle = () => {
    if (teacher.status === "active") {
      setShowSuspendDialog(true);
    } else {
      // Unsuspend directly
      setTeacher({
        ...teacher,
        status: "active",
        suspensionNote: undefined,
      });
    }
  };

  const confirmSuspension = () => {
    setTeacher({
      ...teacher,
      status: "suspended",
      suspensionNote: suspensionNote || "No reason provided",
    });
    setShowSuspendDialog(false);
    setSuspensionNote("");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-4 sm:p-6 overflow-auto scrollbar-hide font-[montserrat]">
      {teacher.suspensionNote && (
        <div className="mb-6 rounded-xl border-2 border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-destructive/20 p-2">
              <svg
                className="h-5 w-5 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">
                Teacher Suspended
              </h3>
              <p className="mt-1 text-sm text-destructive/90">
                {teacher.suspensionNote}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {fullName}
          </h1>
          <p className="text-muted-foreground">
            12.2 Teacher Detailed View · {teacher.currentSchool}
          </p>
        </div>
        <div className="flex gap-3">
          <Badge
            variant="outline"
            className={
              teacher.status === "active"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/40 bg-rose-500/10 text-rose-400"
            }
          >
            {teacher.status === "active" ? "Active" : "Suspended"}
          </Badge>
          <Button
            variant={teacher.status === "active" ? "destructive" : "default"}
            className="rounded-xl h-11 px-5"
            onClick={handleSuspendToggle}
          >
            {teacher.status === "active" ? "Suspend" : "Unsuspend"}
          </Button>
          <Button asChild variant="outline" className="rounded-xl h-11 px-5">
            <Link href="/school-admin/dashboard/teacher-section">
              Back to Roster
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                label: "Total PD Complete",
                value: teacher.totalPdCompleted,
                icon: GraduationCap,
                gradient: "from-blue-500 to-cyan-500",
                iconBg: "bg-blue-500/10",
                iconColor: "text-blue-500",
              },
              {
                label: "Total Badges",
                value: teacher.totalBadgesEarned,
                icon: Trophy,
                gradient: "from-amber-500 to-orange-500",
                iconBg: "bg-amber-500/10",
                iconColor: "text-amber-500",
              },
              {
                label: "PD Hours",
                value: teacher.pdHours,
                icon: Clock,
                gradient: "from-purple-500 to-pink-500",
                iconBg: "bg-purple-500/10",
                iconColor: "text-purple-500",
              },
              {
                label: "Last Active",
                value: teacher.lastActive,
                icon: Calendar,
                gradient: "from-emerald-500 to-teal-500",
                iconBg: "bg-emerald-500/10",
                iconColor: "text-emerald-500",
              },
            ].map((stat) => (
              <Card
                key={stat.label}
                className="rounded-xl border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Teacher profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="font-medium text-foreground">{fullName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium text-foreground">
                    {teacher.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="font-medium text-foreground">
                    {teacher.phone}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Experience</dt>
                  <dd className="font-medium text-foreground">
                    {teacher.experience}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Address</dt>
                  <dd className="font-medium text-foreground">
                    {teacher.address}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Professional Snapshot</CardTitle>
              <CardDescription>Subjects, proficiency, and PD</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Subjects</p>
                <p className="font-medium text-foreground">
                  {teacher.subjects.join(", ")}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Proficiency Level</p>
                  <p className="font-medium text-foreground">
                    {teacher.proficiencyLevel}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Join Date</p>
                  <p className="font-medium text-foreground">
                    {teacher.joinDate}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs uppercase text-muted-foreground">
                  Assessment Data
                </p>
                <div className="mt-2 text-foreground font-medium">
                  {completedAssessments} completed · Avg {scoreAverage}% · High{" "}
                  {scoreHigh}%
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {teacher.assessments
                    .map(
                      (assessment) =>
                        `${assessment.title}: ${assessment.attempts} attempt${
                          assessment.attempts > 1 ? "s" : ""
                        }`
                    )
                    .join(" · ")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                </div>
                Assessment History
              </CardTitle>
              <CardDescription>
                Detailed attempts, scores, and progress for PD assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {teacher.assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="rounded-xl border border-border/60 bg-gradient-to-r from-blue-500/5 to-transparent hover:from-blue-500/10 transition-colors p-4 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-blue-500" />
                      <p className="font-medium text-foreground">
                        {assessment.title}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="uppercase text-xs border-blue-500/30 text-blue-600 dark:text-blue-400"
                    >
                      {assessment.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="mt-3 grid gap-2 text-muted-foreground sm:grid-cols-3">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      Score: {assessment.score}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Attempts: {assessment.attempts}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last: {assessment.lastAttempt}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-xl border-0 shadow-md bg-gradient-to-br from-amber-500/5 to-orange-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                Certificates
              </CardTitle>
              <CardDescription>
                {certificatesEarned} records available
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {teacher.certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="rounded-xl border border-amber-500/20 bg-white/50 dark:bg-black/20 hover:bg-amber-500/5 transition-colors p-4 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-amber-500/10 p-1.5">
                        <FileCheck className="h-4 w-4 text-amber-500" />
                      </div>
                      <p className="font-medium text-foreground">
                        {certificate.name}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="uppercase text-xs border-amber-500/30 text-amber-600 dark:text-amber-400"
                    >
                      {certificate.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Uploaded {certificate.uploadDate}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    File: {certificate.fileName}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 shadow-md bg-gradient-to-br from-purple-500/5 to-pink-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                </div>
                Badges
              </CardTitle>
              <CardDescription>
                {badgesEarned} achievements earned
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {teacher.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="rounded-xl border border-purple-500/20 bg-white/50 dark:bg-black/20 hover:bg-purple-500/5 transition-colors p-4 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-purple-500/10 p-1.5">
                      <BadgeCheck className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="font-medium text-foreground">{badge.name}</p>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {badge.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Earned on {badge.earnedDate}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={showSuspendDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowSuspendDialog(false);
            setSuspensionNote("");
          }
        }}
      >
        <AlertDialogContent className="font-[montserrat]">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Suspension</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend {teacher.firstName}{" "}
              {teacher.lastName}? This will limit their access until you
              unsuspend them.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-muted/40 p-4 text-sm">
              <p className="font-medium">
                {teacher.firstName} {teacher.lastName}
              </p>
              <p className="text-muted-foreground">{teacher.email}</p>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 text-emerald-300"
                >
                  Active
                </Badge>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Add a note for this suspension</p>
              <Textarea
                placeholder="Share the reason for suspending this teacher"
                value={suspensionNote}
                onChange={(e) => setSuspensionNote(e.target.value)}
                className="text-base"
                rows={3}
              />
              <p className="text-muted-foreground">
                This note will be shared with the school admin record.
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

export default TeacherDetailPage;
