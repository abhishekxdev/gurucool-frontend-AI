"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  createPdAssignmentMock,
  pdAssignments as initialAssignments,
  pdCatalog,
  teacherDirectory,
} from "@/lib/data";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  /* ----------------------------- STATE ----------------------------- */

  // Filters
  const [query, setQuery] = useState("");
  const [filterCompetency, setFilterCompetency] = useState<string>("ALL");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("ALL");
  const [filterDuration, setFilterDuration] = useState<string>("ALL");

  const [assigningPdId, setAssigningPdId] = useState<string | null>(null);
  const [assignStep, setAssignStep] = useState<1 | 2 | 3>(1);

  const [assignToAll, setAssignToAll] = useState(false);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [teacherSearch, setTeacherSearch] = useState("");

  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [assignments, setAssignments] = useState(initialAssignments);

  /* ----------------------------- FILTERS ----------------------------- */

  const filteredPds = useMemo(() => {
    const q = query.toLowerCase();
    return pdCatalog.filter((pd) => {
      const matchesQuery =
        !q ||
        pd.title.toLowerCase().includes(q) ||
        pd.description.toLowerCase().includes(q);
      const matchesCompetency =
        filterCompetency === "ALL" || pd.competency === filterCompetency;
      const matchesDifficulty =
        filterDifficulty === "ALL" || pd.difficulty === filterDifficulty;
      const matchesDuration =
        filterDuration === "ALL" ||
        (filterDuration === "<60" && pd.durationMinutes < 60) ||
        (filterDuration === "60-90" &&
          pd.durationMinutes >= 60 &&
          pd.durationMinutes <= 90) ||
        (filterDuration === ">90" && pd.durationMinutes > 90);
      return (
        matchesQuery &&
        matchesCompetency &&
        matchesDifficulty &&
        matchesDuration
      );
    });
  }, [query, filterCompetency, filterDifficulty, filterDuration]);

  const visibleTeachers = useMemo(() => {
    const q = teacherSearch.toLowerCase();
    return teacherDirectory.filter(
      (t) =>
        !q ||
        t.firstName.toLowerCase().includes(q) ||
        (t.lastName || "").toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
    );
  }, [teacherSearch]);

  /* ----------------------------- HELPERS ----------------------------- */
  function toggleTeacher(id: string) {
    setSelectedTeacherIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function resetDialog() {
    setAssigningPdId(null);
    setAssignStep(1);
    setAssignToAll(false);
    setSelectedTeacherIds([]);
    setTeacherSearch("");
    setDueDate("");
    setNotes("");
  }

  async function handleAssign() {
    if (!assigningPdId) return;

    if (!assignToAll && selectedTeacherIds.length === 0) {
      toast.error("Select at least one teacher or choose Assign to All");
      return;
    }

    const assignment = createPdAssignmentMock({
      pdId: assigningPdId,
      teacherIds: assignToAll ? undefined : selectedTeacherIds,
      assignToAll,
      assignedBy: "admin-001",
      dueDate: dueDate || undefined,
      notes: notes || undefined,
    });

    assignment.notificationSent = true;
    setAssignments((prev) => [assignment, ...prev]);

    toast.success("PD assigned successfully");
    resetDialog();
  }

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="space-y-6 font-[montserrat]">
      <Toaster />

      <header>
        <h1 className="text-3xl font-semibold">PD Catalog & Assignment</h1>
        <p className="text-muted-foreground">
          Assign professional development to teachers.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>PD Catalog</CardTitle>
          <CardDescription>
            Search PDs and assign them to teachers.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-end">
            {/* Search */}
            <div className="relative w-full sm:w-64 flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PDs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col gap-3 w-full sm:flex-row sm:gap-4 sm:w-auto">
              {/* Competency Filter */}
              <div className="w-full sm:w-56">
                <Select
                  value={filterCompetency}
                  onValueChange={setFilterCompetency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Competency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Competencies</SelectItem>
                    {[...new Set(pdCatalog.map((pd) => pd.competency))].map(
                      (c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Filter */}
              <div className="w-full sm:w-44">
                <Select
                  value={filterDifficulty}
                  onValueChange={setFilterDifficulty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Difficulties</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Filter */}
              <div className="w-full sm:w-40">
                <Select
                  value={filterDuration}
                  onValueChange={setFilterDuration}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Durations</SelectItem>
                    <SelectItem value="<60">Less than 60 min</SelectItem>
                    <SelectItem value="60-90">60-90 min</SelectItem>
                    <SelectItem value=">90">More than 90 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Competency</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPds.map((pd) => (
                  <TableRow key={pd.id}>
                    <TableCell className="font-medium">{pd.title}</TableCell>
                    <TableCell>
                      <div>{pd.description}</div>
                      {pd.materials && pd.materials.length > 0 && (
                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                          {pd.materials.map((mat) => (
                            <li
                              key={mat.id}
                              className="flex items-center gap-2"
                            >
                              {/* Icon by type */}
                              {mat.type === "pdf" && (
                                <span title="PDF" className="inline-block">
                                  📄
                                </span>
                              )}
                              {mat.type === "video" && (
                                <span title="Video" className="inline-block">
                                  🎬
                                </span>
                              )}
                              {mat.type === "link" && (
                                <span title="Link" className="inline-block">
                                  🔗
                                </span>
                              )}
                              {mat.type === "slides" && (
                                <span title="Slides" className="inline-block">
                                  📊
                                </span>
                              )}
                              <a
                                href={mat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-primary"
                              >
                                {mat.title}
                              </a>
                              {mat.description && (
                                <span className="ml-1 text-muted-foreground">
                                  - {mat.description}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </TableCell>
                    <TableCell>{pd.competency}</TableCell>
                    <TableCell>{pd.difficulty}</TableCell>
                    <TableCell>{pd.durationMinutes} min</TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={assigningPdId === pd.id}
                        onOpenChange={(open) =>
                          open ? setAssigningPdId(pd.id) : resetDialog()
                        }
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">Assign</Button>
                        </DialogTrigger>

                        <DialogContent className="max-h-[80vh] overflow-auto font-[montserrat]">
                          <DialogHeader>
                            <DialogTitle>Assign PD</DialogTitle>
                            <DialogDescription>
                              Assign <b>{pd.title}</b> to teachers
                            </DialogDescription>

                            {/* Breadcrumb */}
                            <Breadcrumb className="mt-3">
                              <BreadcrumbList>
                                <BreadcrumbItem>
                                  {assignStep === 1 ? (
                                    <BreadcrumbPage>Teachers</BreadcrumbPage>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Teachers
                                    </span>
                                  )}
                                </BreadcrumbItem>

                                <BreadcrumbSeparator />

                                <BreadcrumbItem>
                                  {assignStep === 2 ? (
                                    <BreadcrumbPage>Due Date</BreadcrumbPage>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Due Date
                                    </span>
                                  )}
                                </BreadcrumbItem>

                                <BreadcrumbSeparator />

                                <BreadcrumbItem>
                                  {assignStep === 3 ? (
                                    <BreadcrumbPage>Notes</BreadcrumbPage>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Notes
                                    </span>
                                  )}
                                </BreadcrumbItem>
                              </BreadcrumbList>
                            </Breadcrumb>
                          </DialogHeader>

                          {/* STEP CONTENT */}
                          <div className="py-4 space-y-4">
                            {/* Step 1 */}
                            {assignStep === 1 && (
                              <>
                                <Input
                                  placeholder="Search teachers..."
                                  value={teacherSearch}
                                  onChange={(e) =>
                                    setTeacherSearch(e.target.value)
                                  }
                                />

                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={assignToAll}
                                    onCheckedChange={(v) =>
                                      setAssignToAll(Boolean(v))
                                    }
                                  />
                                  <span className="text-sm">
                                    Assign to all teachers
                                  </span>
                                </div>

                                {!assignToAll && (
                                  <ScrollArea className="h-[40vh] border rounded-md">
                                    <div className="p-2 space-y-1">
                                      {visibleTeachers.map((t) => (
                                        <label
                                          key={t.id}
                                          className={`flex gap-3 p-2 rounded-md cursor-pointer hover:bg-muted ${
                                            selectedTeacherIds.includes(t.id)
                                              ? "bg-muted"
                                              : ""
                                          }`}
                                        >
                                          <Checkbox
                                            checked={selectedTeacherIds.includes(
                                              t.id
                                            )}
                                            onCheckedChange={() =>
                                              toggleTeacher(t.id)
                                            }
                                          />
                                          <div>
                                            <p className="font-medium">
                                              {t.firstName} {t.lastName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {t.email}
                                            </p>
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                )}
                              </>
                            )}

                            {/* Step 2 */}
                            {assignStep === 2 && (
                              <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                              />
                            )}

                            {/* Step 3 */}
                            {assignStep === 3 && (
                              <Textarea
                                placeholder="Optional notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                              />
                            )}
                          </div>

                          {/* FOOTER */}
                          <DialogFooter className="flex justify-between">
                            <Button variant="outline" onClick={resetDialog}>
                              Cancel
                            </Button>

                            <div className="flex gap-2">
                              {assignStep > 1 && (
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setAssignStep((s) => (s - 1) as 1 | 2 | 3)
                                  }
                                >
                                  Back
                                </Button>
                              )}

                              {assignStep < 3 ? (
                                <Button
                                  onClick={() => {
                                    if (
                                      assignStep === 1 &&
                                      !assignToAll &&
                                      selectedTeacherIds.length === 0
                                    ) {
                                      toast.error(
                                        "Select at least one teacher or assign to all"
                                      );
                                      return;
                                    }
                                    setAssignStep((s) => (s + 1) as 1 | 2 | 3);
                                  }}
                                >
                                  Next
                                </Button>
                              ) : (
                                <Button onClick={handleAssign}>
                                  Assign PD
                                </Button>
                              )}
                            </div>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
