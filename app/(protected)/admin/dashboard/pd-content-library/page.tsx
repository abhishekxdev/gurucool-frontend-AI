"use client";

import { BookOpen, FileText, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pdCatalog } from "@/lib/data";

const PDContentLibraryPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [competencyFilter, setCompetencyFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [materialsFilter, setMaterialsFilter] = useState<string>("all");

  // Get unique competencies from catalog
  const competencies = useMemo(() => {
    const unique = new Set(pdCatalog.map((pd) => pd.competency));
    return Array.from(unique).sort();
  }, []);

  const filteredPDs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return pdCatalog.filter((pd) => {
      // Search filter
      const matchesSearch =
        !term ||
        pd.title.toLowerCase().includes(term) ||
        pd.competency.toLowerCase().includes(term) ||
        pd.description.toLowerCase().includes(term);

      // Competency filter
      const matchesCompetency =
        competencyFilter === "all" || pd.competency === competencyFilter;

      // Difficulty filter
      const matchesDifficulty =
        difficultyFilter === "all" || pd.difficulty === difficultyFilter;

      // Materials filter
      const matchesMaterials =
        materialsFilter === "all" ||
        (materialsFilter === "with" && pd.materials.length > 0) ||
        (materialsFilter === "without" && pd.materials.length === 0);

      return (
        matchesSearch &&
        matchesCompetency &&
        matchesDifficulty &&
        matchesMaterials
      );
    });
  }, [searchTerm, competencyFilter, difficultyFilter, materialsFilter]);

  const handleManage = (pdId: string) => {
    router.push(`/admin/dashboard/pd-content-library/${pdId}`);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-auto p-4 sm:p-6 scrollbar-hide font-[montserrat]">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            PD Content Library
          </h1>
          <p className="text-muted-foreground">
            Manage reference materials for existing PD assessments
          </p>
        </div>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>PD Assessments</CardTitle>
          <CardDescription>
            View and manage reference materials for each PD. You can add, edit,
            or remove reference materials only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, competency, or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select
                value={competencyFilter}
                onValueChange={setCompetencyFilter}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by competency" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="all">All Competencies</SelectItem>
                  {competencies.map((competency) => (
                    <SelectItem key={competency} value={competency}>
                      {competency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={materialsFilter}
                onValueChange={setMaterialsFilter}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by materials" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="all">All Materials</SelectItem>
                  <SelectItem value="with">With Materials</SelectItem>
                  <SelectItem value="without">Without Materials</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PD Title</TableHead>
                  <TableHead>Competency</TableHead>
                  <TableHead>Reference Materials</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPDs.length ? (
                  filteredPDs.map((pd) => (
                    <TableRow key={pd.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{pd.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {pd.description.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{pd.competency}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {pd.materials.length} material
                            {pd.materials.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => handleManage(pd.id)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No PD assessments found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDContentLibraryPage;
