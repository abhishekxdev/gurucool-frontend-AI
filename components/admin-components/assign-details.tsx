"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { teacherDirectory, type TeacherDirectoryEntry } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircle,
  IconCircleCheckFilled,
  IconCircleDot,
  IconCircleFilled,
  IconClock,
  IconDotsVertical,
  IconSearch,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import React from "react";
import { toast } from "sonner";
import TeacherDetails from "./teacher-detail";

interface AssignDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pdTitle: string;
  pdId: string;
}

const AssignDetails: React.FC<AssignDetailsProps> = ({
  isOpen,
  onOpenChange,
  pdTitle,
  pdId,
}) => {
  const [selectedTeachers, setSelectedTeachers] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [schoolFilter, setSchoolFilter] = React.useState<string>("all");
  const [proficiencyFilter, setProficiencyFilter] =
    React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [subjectFilter, setSubjectFilter] = React.useState<string>("all");
  const [experienceFilter, setExperienceFilter] = React.useState<string>("all");
  const [isAssigning, setIsAssigning] = React.useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState<
    TeacherDirectoryEntry | undefined
  >();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [activeTab, setActiveTab] = React.useState<"available" | "assigned">(
    "available"
  );

  // Mock assigned teachers (in real app, this would come from API)
  const [assignedTeachers, setAssignedTeachers] = React.useState<string[]>([
    "t001",
    "t002",
  ]);

  // Get unique schools for filter
  const uniqueSchools = React.useMemo(() => {
    return Array.from(
      new Set(teacherDirectory.map((t) => t.currentSchool))
    ).sort();
  }, []);

  // Get unique subjects for filter
  const uniqueSubjects = React.useMemo(() => {
    const subjects = new Set<string>();
    teacherDirectory.forEach((t) => {
      t.subjects.forEach((subject) => subjects.add(subject));
    });
    return Array.from(subjects).sort();
  }, []);

  // Helper function to parse experience years
  const getExperienceYears = (experience: string): number => {
    const match = experience.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Filter teachers based on tab
  const filteredTeachers = React.useMemo(() => {
    return teacherDirectory.filter((teacher) => {
      // Only show active teachers
      if (teacher.status !== "active") return false;

      // Filter by tab
      const isAssigned = assignedTeachers.includes(teacher.id);
      if (activeTab === "available" && isAssigned) return false;
      if (activeTab === "assigned" && !isAssigned) return false;

      const matchesSearch =
        teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.currentSchool.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSchool =
        schoolFilter === "all" || teacher.currentSchool === schoolFilter;

      const matchesProficiency =
        proficiencyFilter === "all" ||
        teacher.proficiencyLevel === proficiencyFilter;

      const matchesStatus =
        statusFilter === "all" || teacher.approvalStatus === statusFilter;

      const matchesSubject =
        subjectFilter === "all" || teacher.subjects.includes(subjectFilter);

      let matchesExperience = true;
      if (experienceFilter !== "all") {
        const years = getExperienceYears(teacher.teachingExperience);
        switch (experienceFilter) {
          case "0-2":
            matchesExperience = years >= 0 && years <= 2;
            break;
          case "3-5":
            matchesExperience = years >= 3 && years <= 5;
            break;
          case "6-10":
            matchesExperience = years >= 6 && years <= 10;
            break;
          case "10+":
            matchesExperience = years > 10;
            break;
        }
      }

      return (
        matchesSearch &&
        matchesSchool &&
        matchesProficiency &&
        matchesStatus &&
        matchesSubject &&
        matchesExperience
      );
    });
  }, [
    searchQuery,
    schoolFilter,
    proficiencyFilter,
    statusFilter,
    subjectFilter,
    experienceFilter,
    activeTab,
    assignedTeachers,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change or tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    schoolFilter,
    proficiencyFilter,
    statusFilter,
    subjectFilter,
    experienceFilter,
    activeTab,
  ]);

  const handleToggleTeacher = (teacherId: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === filteredTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredTeachers.map((t) => t.id));
    }
  };

  const handleViewDetails = (teacher: TeacherDirectoryEntry) => {
    setSelectedTeacher(teacher);
    setIsDetailsModalOpen(true);
  };

  const handleUnassign = (teacherId: string) => {
    setAssignedTeachers((prev) => prev.filter((id) => id !== teacherId));
    toast.success("Teacher unassigned successfully");
  };

  const handleAssignPD = async () => {
    if (selectedTeachers.length === 0) {
      toast.error("Please select at least one teacher");
      return;
    }

    setIsAssigning(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add to assigned teachers
    setAssignedTeachers((prev) => [...prev, ...selectedTeachers]);

    toast.success(
      `${pdTitle} assigned to ${selectedTeachers.length} teacher${
        selectedTeachers.length > 1 ? "s" : ""
      }`
    );

    setIsAssigning(false);
    setSelectedTeachers([]);
    setActiveTab("assigned");
  };

  // Helper function to get initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const availableCount = teacherDirectory.filter(
    (t) => t.status === "active" && !assignedTeachers.includes(t.id)
  ).length;
  const assignedCount = assignedTeachers.length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
        <DialogContent className="max-w-[95vw]! md:max-w-6xl h-[95vh] md:h-[85vh] p-0 font-[montserrat] gap-0 flex flex-col">
          {/* Header */}
          <DialogHeader className="p-6 border-b shrink-0">
            <DialogTitle className="text-xl">
              Assign "{pdTitle}" to Teachers
            </DialogTitle>
            <DialogDescription className="text-sm">
              Select teachers to assign this professional development module
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "available" | "assigned")
            }
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="px-4 md:px-6 pt-4 border-b shrink-0">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="available" className="relative">
                  Available Teachers
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-full h-5 min-w-5 px-1.5 text-xs"
                  >
                    {availableCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="assigned" className="relative">
                  Assigned Teachers
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-full h-5 min-w-5 px-1.5 text-xs"
                  >
                    {assignedCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="available"
              className="flex flex-col flex-1 min-h-0 m-0"
            >
              {/* Filters and Search */}
              <div className="flex flex-col gap-4 p-4 md:p-6 border-b shrink-0">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search teachers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={schoolFilter}
                      onValueChange={setSchoolFilter}
                    >
                      <SelectTrigger className="w-full md:w-40" size="sm">
                        <SelectValue placeholder="All Schools" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Schools</SelectItem>
                        {uniqueSchools.map((school) => (
                          <SelectItem key={school} value={school}>
                            {school}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={proficiencyFilter}
                      onValueChange={setProficiencyFilter}
                    >
                      <SelectTrigger className="w-full md:w-40" size="sm">
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full md:w-40" size="sm">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={subjectFilter}
                      onValueChange={setSubjectFilter}
                    >
                      <SelectTrigger className="w-full md:w-40" size="sm">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {uniqueSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={experienceFilter}
                      onValueChange={setExperienceFilter}
                    >
                      <SelectTrigger className="w-full md:w-40" size="sm">
                        <SelectValue placeholder="Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Experience</SelectItem>
                        <SelectItem value="0-2">0-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={
                        filteredTeachers.length > 0 &&
                        selectedTeachers.length === filteredTeachers.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    <Label
                      htmlFor="select-all"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Select All Teachers
                    </Label>
                  </div>
                  <Badge
                    variant="outline"
                    className="gap-2 rounded-md px-3 py-1"
                  >
                    <IconUsers className="size-3" />
                    <span>
                      {selectedTeachers.length}/{filteredTeachers.length}{" "}
                      selected
                    </span>
                  </Badge>
                </div>
              </div>

              {/* Teacher Table */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 md:p-6">
                  {filteredTeachers.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border">
                      <Table>
                        <TableHeader className="bg-muted">
                          <TableRow>
                            <TableHead className="w-12">
                              <span className="sr-only">Select</span>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joining Date</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>School Name</TableHead>
                            <TableHead>Subjects</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Proficiency Level</TableHead>
                            <TableHead>PD Completed</TableHead>
                            <TableHead>Badges Earned</TableHead>
                            <TableHead className="w-12">
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedTeachers.map((teacher) => (
                            <TableRow
                              key={teacher.id}
                              className={cn(
                                "h-20",
                                selectedTeachers.includes(teacher.id) &&
                                  "bg-primary/5"
                              )}
                            >
                              <TableCell className="py-4">
                                <Checkbox
                                  checked={selectedTeachers.includes(
                                    teacher.id
                                  )}
                                  onCheckedChange={() =>
                                    handleToggleTeacher(teacher.id)
                                  }
                                />
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant="outline"
                                  className="gap-2 rounded-md px-3 py-1"
                                >
                                  {teacher.approvalStatus === "approved" ? (
                                    <IconCircleCheckFilled className="size-3 fill-green-500 dark:fill-green-400" />
                                  ) : teacher.approvalStatus === "pending" ? (
                                    <IconClock className="size-3 text-amber-500 dark:text-amber-400" />
                                  ) : (
                                    <IconX className="size-3 text-gray-500 dark:text-gray-400" />
                                  )}
                                  <span className="capitalize">
                                    {teacher.approvalStatus}
                                  </span>
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(teacher.joinDate)}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="size-10">
                                    <AvatarImage
                                      src={teacher.profilePhoto}
                                      alt={teacher.firstName}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {getInitials(
                                        teacher.firstName,
                                        teacher.lastName
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {teacher.firstName} {teacher.lastName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {teacher.email}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm">
                                  {teacher.currentSchool}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex flex-wrap gap-1">
                                  {teacher.subjects
                                    .slice(0, 2)
                                    .map((subject) => (
                                      <Badge
                                        key={subject}
                                        variant="outline"
                                        className="rounded-md px-3 py-1 text-xs"
                                      >
                                        {subject}
                                      </Badge>
                                    ))}
                                  {teacher.subjects.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="rounded-md px-3 py-1 text-xs"
                                    >
                                      +{teacher.subjects.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm font-medium">
                                  {teacher.teachingExperience}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant="outline"
                                  className="gap-2 rounded-md px-3 py-1"
                                >
                                  {teacher.proficiencyLevel === "Advanced" ? (
                                    <IconCircle className="size-3 fill-green-500 dark:fill-green-400" />
                                  ) : teacher.proficiencyLevel ===
                                    "Intermediate" ? (
                                    <IconCircleDot className="size-3 fill-blue-500 dark:fill-blue-400" />
                                  ) : (
                                    <IconCircleFilled className="size-3 fill-amber-500 dark:fill-amber-400" />
                                  )}
                                  <span>{teacher.proficiencyLevel}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm font-medium">
                                  {teacher.totalPdCompleted}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm font-medium">
                                  {teacher.totalBadgesEarned}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                      size="icon"
                                    >
                                      <IconDotsVertical className="size-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-40 font-[montserrat]"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => handleViewDetails(teacher)}
                                    >
                                      View Profile
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <IconX className="size-12 text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-lg mb-2">
                        No teachers match your search
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Pagination */}
              {filteredTeachers.length > 0 && (
                <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t shrink-0 bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredTeachers.length)} of{" "}
                      {filteredTeachers.length} active teacher(s).
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Rows per page
                      </span>
                      <Select
                        value={rowsPerPage.toString()}
                        onValueChange={(value) => {
                          setRowsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-20 h-8" size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="30">30</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        <IconChevronsLeft className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <IconChevronLeft className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        <IconChevronRight className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <IconChevronsRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="assigned"
              className="flex flex-col flex-1 min-h-0 m-0"
            >
              {/* Filters for Assigned Tab */}
              <div className="flex flex-col gap-4 p-4 md:p-6 border-b shrink-0">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assigned teachers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Assigned Teachers Table */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 md:p-6">
                  {filteredTeachers.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border">
                      <Table>
                        <TableHeader className="bg-muted">
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Joining Date</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>School Name</TableHead>
                            <TableHead>Subjects</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Proficiency Level</TableHead>
                            <TableHead>PD Completed</TableHead>
                            <TableHead>Badges Earned</TableHead>
                            <TableHead className="w-12">
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedTeachers.map((teacher) => (
                            <TableRow key={teacher.id} className="h-20">
                              <TableCell className="py-4">
                                <Badge
                                  variant="outline"
                                  className="gap-2 rounded-md px-3 py-1"
                                >
                                  {teacher.approvalStatus === "approved" ? (
                                    <IconCircleCheckFilled className="size-3 fill-green-500 dark:fill-green-400" />
                                  ) : teacher.approvalStatus === "pending" ? (
                                    <IconClock className="size-3 text-amber-500 dark:text-amber-400" />
                                  ) : (
                                    <IconX className="size-3 text-gray-500 dark:text-gray-400" />
                                  )}
                                  <span className="capitalize">
                                    {teacher.approvalStatus}
                                  </span>
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(teacher.joinDate)}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="size-10">
                                    <AvatarImage
                                      src={teacher.profilePhoto}
                                      alt={teacher.firstName}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {getInitials(
                                        teacher.firstName,
                                        teacher.lastName
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {teacher.firstName} {teacher.lastName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {teacher.email}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm">
                                  {teacher.currentSchool}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex flex-wrap gap-1">
                                  {teacher.subjects
                                    .slice(0, 2)
                                    .map((subject) => (
                                      <Badge
                                        key={subject}
                                        variant="outline"
                                        className="rounded-md px-3 py-1 text-xs"
                                      >
                                        {subject}
                                      </Badge>
                                    ))}
                                  {teacher.subjects.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="rounded-md px-3 py-1 text-xs"
                                    >
                                      +{teacher.subjects.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm font-medium">
                                  {teacher.teachingExperience}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant="outline"
                                  className="gap-2 rounded-md px-3 py-1"
                                >
                                  {teacher.proficiencyLevel === "Advanced" ? (
                                    <IconCircle className="size-3 fill-green-500 dark:fill-green-400" />
                                  ) : teacher.proficiencyLevel ===
                                    "Intermediate" ? (
                                    <IconCircleDot className="size-3 fill-blue-500 dark:fill-blue-400" />
                                  ) : (
                                    <IconCircleFilled className="size-3 fill-amber-500 dark:fill-amber-400" />
                                  )}
                                  <span>{teacher.proficiencyLevel}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm font-medium">
                                  {teacher.totalPdCompleted}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm font-medium">
                                  {teacher.totalBadgesEarned}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                      size="icon"
                                    >
                                      <IconDotsVertical className="size-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-40 font-[montserrat]"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => handleViewDetails(teacher)}
                                    >
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUnassign(teacher.id)}
                                      className="text-destructive"
                                    >
                                      Unassign
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <IconUsers className="size-12 text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-lg mb-2">
                        No teachers assigned yet
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Switch to Available Teachers tab to assign this PD
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Pagination for Assigned Tab */}
              {filteredTeachers.length > 0 && (
                <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t shrink-0 bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredTeachers.length)} of{" "}
                      {filteredTeachers.length} assigned teacher(s).
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Rows per page
                      </span>
                      <Select
                        value={rowsPerPage.toString()}
                        onValueChange={(value) => {
                          setRowsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-20 h-8" size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="30">30</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        <IconChevronsLeft className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <IconChevronLeft className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        <IconChevronRight className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <IconChevronsRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Footer - Only show in Available tab */}
          {activeTab === "available" && (
            <div className="flex items-center justify-between gap-4 p-4 md:p-6 border-t shrink-0">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setSelectedTeachers([]);
                  setSearchQuery("");
                  setSchoolFilter("all");
                  setProficiencyFilter("all");
                  setStatusFilter("all");
                  setSubjectFilter("all");
                  setExperienceFilter("all");
                  setCurrentPage(1);
                  setActiveTab("available");
                }}
                disabled={isAssigning}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignPD}
                disabled={selectedTeachers.length === 0 || isAssigning}
                className="min-w-32"
              >
                {isAssigning ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Assigning...
                  </>
                ) : (
                  <>Assign PD ({selectedTeachers.length})</>
                )}
              </Button>
            </div>
          )}

          {/* Footer for Assigned tab */}
          {activeTab === "assigned" && (
            <div className="flex items-center justify-end gap-4 p-4 md:p-6 border-t shrink-0">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setSearchQuery("");
                  setCurrentPage(1);
                  setActiveTab("available");
                }}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Teacher Details Modal */}
      <TeacherDetails
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        teacher={selectedTeacher}
      />
    </>
  );
};

export default AssignDetails;
