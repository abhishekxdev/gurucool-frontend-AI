"use client";

import { Building2, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type SchoolStatus = "active" | "suspended";

interface School {
  id: string;
  name: string;
  logoUrl: string;
  contactEmail: string;
  teacherCount: number;
  status: SchoolStatus;
  onboardingLimit: number;
}

const initialSchools: School[] = [
  {
    id: "school-001",
    name: "Sunrise Public School",
    logoUrl: "/gurucool/logo_full_light.png",
    contactEmail: "admin@sunrise.edu",
    teacherCount: 48,
    status: "active",
    onboardingLimit: 60,
  },
  {
    id: "school-002",
    name: "Green Valley High",
    logoUrl: "/gurucool/logo_light.png",
    contactEmail: "principal@greenvalley.edu",
    teacherCount: 32,
    status: "active",
    onboardingLimit: 40,
  },
  {
    id: "school-003",
    name: "Harmony International",
    logoUrl: "/gurucool/logo.png",
    contactEmail: "contact@harmonyint.org",
    teacherCount: 20,
    status: "suspended",
    onboardingLimit: 25,
  },
  {
    id: "school-004",
    name: "Blue Ridge Academy",
    logoUrl: "/gurucool/logo_dark.png",
    contactEmail: "info@blueridge.edu",
    teacherCount: 12,
    status: "active",
    onboardingLimit: 15,
  },
  {
    id: "school-005",
    name: "Starlight Girls School",
    logoUrl: "/gurucool/logo_full.png",
    contactEmail: "contact@starlightgirls.org",
    teacherCount: 27,
    status: "active",
    onboardingLimit: 30,
  },
  {
    id: "school-006",
    name: "Lotus Valley School",
    logoUrl: "/gurucool/logo_yellow.png",
    contactEmail: "admin@lotusvalley.edu",
    teacherCount: 35,
    status: "active",
    onboardingLimit: 35,
  },
  {
    id: "school-007",
    name: "Skyline International",
    logoUrl: "/gurucool/logo_sky.png",
    contactEmail: "contact@skylineintl.edu",
    teacherCount: 10,
    status: "suspended",
    onboardingLimit: 20,
  },
  {
    id: "school-008",
    name: "Riverbank Primary",
    logoUrl: "/gurucool/logo_river.png",
    contactEmail: "admin@riverbank.edu",
    teacherCount: 8,
    status: "active",
    onboardingLimit: 12,
  },
  {
    id: "school-009",
    name: "Pinecrest Public School",
    logoUrl: "/gurucool/logo_green.png",
    contactEmail: "principal@pinecrest.edu",
    teacherCount: 22,
    status: "active",
    onboardingLimit: 25,
  },
  {
    id: "school-010",
    name: "Emerald Woods Academy",
    logoUrl: "/gurucool/logo_emerald.png",
    contactEmail: "admin@emeraldwoods.edu",
    teacherCount: 15,
    status: "active",
    onboardingLimit: 20,
  },
];

const ManageSchoolsPage = () => {
  const router = useRouter();

  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SchoolStatus>("all");
  const [schoolToSuspend, setSchoolToSuspend] = useState<School | null>(null);
  const [suspensionNote, setSuspensionNote] = useState("");
  const [schoolToEditLimit, setSchoolToEditLimit] = useState<School | null>(
    null
  );
  const [newLimit, setNewLimit] = useState<number | "">("");

  const filteredSchools = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return schools.filter((school) => {
      const matchesSearch =
        !term ||
        school.name.toLowerCase().includes(term) ||
        school.contactEmail.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ? true : school.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [schools, searchTerm, statusFilter]);

  const handleConfirmLimitIncrease = () => {
    if (!schoolToEditLimit || newLimit === "") return;

    // Only allow increasing the limit (happy-path validation)
    if (newLimit <= schoolToEditLimit.onboardingLimit) {
      // optional: you could show a toast here instead
      return;
    }

    setSchools((prev) =>
      prev.map((school) =>
        school.id === schoolToEditLimit.id
          ? { ...school, onboardingLimit: newLimit as number }
          : school
      )
    );

    setSchoolToEditLimit(null);
    setNewLimit("");
  };

  const handleStatusToggle = (schoolId: string) => {
    setSchools((prev) =>
      prev.map((school) =>
        school.id === schoolId
          ? {
              ...school,
              status: school.status === "active" ? "suspended" : "active",
            }
          : school
      )
    );
  };

  const handleLimitChange = (schoolId: string, value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;

    setSchools((prev) =>
      prev.map((school) =>
        school.id === schoolId ? { ...school, onboardingLimit: parsed } : school
      )
    );
  };

  return (
    <div className="space-y-8 font-[montserrat]">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Schools Directory & Controls
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review all registered schools, adjust onboarding limits, and
              control access in real time.
            </p>
          </div>
          <Button variant="outline" size="lg">
            Export School List
          </Button>
        </div>
      </header>

      {/* Main card */}
      <Card>
        <CardHeader>
          <CardTitle>School List View</CardTitle>
          <CardDescription>
            The platform admin can view all registered schools, update teacher
            onboarding limits, and suspend or unsuspend schools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by school name or email"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | SchoolStatus)
              }
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border/60 bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Number of Teachers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Teacher Onboarding Limit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.length ? (
                  filteredSchools.map((school) => (
                    <TableRow key={school.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background">
                              <Building2 className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">{school.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {school.contactEmail}
                      </TableCell>
                      <TableCell>{school.teacherCount}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            school.status === "active"
                              ? "border-emerald-500/40 text-emerald-300"
                              : "border-red-500/40 text-red-400"
                          }
                        >
                          {school.status === "active" ? "Active" : "Suspended"}
                        </Badge>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">
                              {school.onboardingLimit}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              max teachers
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="whitespace-nowrap"
                            onClick={() => {
                              setSchoolToEditLimit(school);
                              setNewLimit(school.onboardingLimit);
                            }}
                          >
                            Increase limit
                          </Button>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div className="flex items-center justify-between gap-4">
                          <div className="leading-tight">
                            <p className="font-medium">
                              {school.onboardingLimit}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              max teachers
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="whitespace-nowrap"
                            onClick={() => {
                              setSchoolToEditLimit(school);
                              setNewLimit(school.onboardingLimit);
                            }}
                          >
                            Increase limit
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-w-[110px] justify-center whitespace-nowrap"
                            onClick={() =>
                              router.push(
                                `/admin/dashboard/manage-schools/${school.id}`
                              )
                            }
                          >
                            Manage
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              school.status === "active"
                                ? "destructive"
                                : "secondary"
                            }
                            className="min-w-[120px] justify-center whitespace-nowrap"
                            onClick={() =>
                              school.status === "active"
                                ? setSchoolToSuspend(school)
                                : handleStatusToggle(school.id)
                            }
                          >
                            {school.status === "active"
                              ? "Suspend"
                              : "Unsuspend"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No schools match this filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption>
                Showing {filteredSchools.length} of {schools.length} schools
              </TableCaption>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Suspension dialog – with note/comment */}
      <AlertDialog
        open={!!schoolToSuspend}
        onOpenChange={(open) => {
          if (!open) {
            setSchoolToSuspend(null);
            setSuspensionNote("");
          }
        }}
      >
        <AlertDialogContent className="font-[montserrat]">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm School Suspension</AlertDialogTitle>
            <AlertDialogDescription>
              {schoolToSuspend
                ? `Are you sure you want to suspend ${schoolToSuspend.name}? This will immediately affect the school admin and all associated teachers.`
                : ""}
            </AlertDialogDescription>

            {schoolToSuspend && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-4 text-sm">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md bg-background">
                    <Image
                      src={schoolToSuspend.logoUrl}
                      alt={schoolToSuspend.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{schoolToSuspend.name}</p>
                    <p className="text-muted-foreground">
                      {schoolToSuspend.contactEmail}
                    </p>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={
                          schoolToSuspend.status === "active"
                            ? "border-emerald-500/40 text-emerald-300"
                            : "border-red-500/40 text-red-400"
                        }
                      >
                        {schoolToSuspend.status === "active"
                          ? "Currently Active"
                          : "Currently Suspended"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    Add a note / reason for this suspension
                  </p>
                  <Textarea
                    placeholder="Share the reason for suspending this school (kept on the school record)."
                    value={suspensionNote}
                    onChange={(event) => setSuspensionNote(event.target.value)}
                    className="text-base"
                    rows={3}
                  />
                  <p className="text-muted-foreground">
                    This note represents the admin’s comment and will be stored
                    with the school’s status history.
                  </p>
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSchoolToSuspend(null);
                setSuspensionNote("");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (schoolToSuspend) {
                  handleStatusToggle(schoolToSuspend.id);
                  setSchoolToSuspend(null);
                  setSuspensionNote("");
                }
              }}
            >
              Suspend School
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Increase onboarding limit dialog */}
      <AlertDialog
        open={!!schoolToEditLimit}
        onOpenChange={(open) => {
          if (!open) {
            setSchoolToEditLimit(null);
            setNewLimit("");
          }
        }}
      >
        <AlertDialogContent className="font-[montserrat]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Increase teacher onboarding limit
            </AlertDialogTitle>
            <AlertDialogDescription>
              {schoolToEditLimit
                ? `You are increasing the onboarding limit for ${schoolToEditLimit.name}. This will allow more teachers from this school to join Gurucool instantly.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {schoolToEditLimit && (
            <div className="space-y-4 text-sm">
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="font-medium">{schoolToEditLimit.name}</p>
                <p className="text-muted-foreground">
                  Current limit: {schoolToEditLimit.onboardingLimit} teachers
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-medium">New teacher onboarding limit</p>
                <Input
                  type="number"
                  min={schoolToEditLimit.onboardingLimit + 1}
                  value={newLimit}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setNewLimit(Number.isNaN(value) ? "" : value);
                  }}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  You can only <span className="font-medium">increase</span>{" "}
                  this limit from the current value. The change is applied
                  immediately for this school’s admin and teachers.
                </p>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSchoolToEditLimit(null);
                setNewLimit("");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={
                !schoolToEditLimit ||
                newLimit === "" ||
                (schoolToEditLimit &&
                  newLimit !== "" &&
                  (newLimit as number) <= schoolToEditLimit.onboardingLimit)
              }
              onClick={handleConfirmLimitIncrease}
            >
              Confirm increase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageSchoolsPage;
