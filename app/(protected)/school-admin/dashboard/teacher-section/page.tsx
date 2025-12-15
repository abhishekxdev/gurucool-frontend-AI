"use client";

import TeacherDetails from "@/components/admin-components/teacher-detail";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircle,
  IconCircleCheckFilled,
  IconCircleDot,
  IconCircleFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import React from "react";

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

interface TeacherSectionProps {
  showFiltersAndSearch?: boolean;
}

const TeacherSection: React.FC<TeacherSectionProps> = ({
  showFiltersAndSearch = true,
}) => {
  const [activeTab, setActiveTab] = React.useState<"active" | "suspended">(
    "active"
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState<
    TeacherDirectoryEntry | undefined
  >();

  // Show teachers based on tab: "active" or "suspended"
  const filteredData = React.useMemo(() => {
    if (activeTab === "suspended") {
      return teacherDirectory.filter((t) => t.status === "suspended");
    }
    // active tab
    return teacherDirectory.filter((t) => t.status === "active");
  }, [activeTab]);

  const handleViewDetails = (teacher: TeacherDirectoryEntry) => {
    setSelectedTeacher(teacher);
    setIsDetailsModalOpen(true);
  };

  const columns: ColumnDef<TeacherDirectoryEntry>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="outline"
            className={`gap-2 rounded-md px-3 py-1 ${
              status === "active"
                ? "badge text-green-700 bg-green-50 dark:bg-green-900/20"
                : "badge text-red-700 bg-red-50 dark:bg-red-900/20"
            }`}
          >
            {status === "active" ? (
              <>
                <IconCircleCheckFilled className="size-3 fill-green-500 dark:fill-green-400" />
                <span>Active</span>
              </>
            ) : (
              <>
                <IconX className="size-3 text-red-500 dark:text-red-400" />
                <span>Suspended</span>
              </>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: "joinDate",
      header: "Joining Date",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground font-[montserrat]">
            {formatDate(row.original.joinDate)}
          </div>
        );
      },
    },
    {
      id: "teacher",
      header: "Teacher",
      cell: ({ row }) => {
        const teacher = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={teacher.profilePhoto} alt={teacher.firstName} />
              <AvatarFallback className="text-xs font-[montserrat]">
                {getInitials(teacher.firstName, teacher.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm font-[montserrat]">
                {teacher.firstName} {teacher.lastName}
              </span>
              <span className="text-xs text-muted-foreground font-[montserrat]">
                {teacher.email}
              </span>
            </div>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "currentSchool",
      header: "School Name",
      cell: ({ row }) => {
        return (
          <div className="text-sm font-[montserrat]">
            {row.original.currentSchool}
          </div>
        );
      },
    },
    {
      accessorKey: "proficiencyLevel",
      header: "Proficiency Level",
      cell: ({ row }) => {
        const level = row.original.proficiencyLevel;
        return (
          <Badge
            variant="outline"
            className="gap-2 rounded-md px-3 py-1"
          >
            {level === "Advanced" ? (
              <IconCircle className="size-3 fill-green-500 dark:fill-green-400 stroke-none" />
            ) : level === "Intermediate" ? (
              <IconCircleDot className="size-3 fill-blue-500 dark:fill-blue-400 stroke-none" />
            ) : (
              <IconCircleFilled className="size-3 fill-amber-500 dark:fill-amber-400 stroke-none" />
            )}
            <span>{level}</span>
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const teacher = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8 font-[montserrat]"
                size="icon"
              >
                <IconDotsVertical className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 font-[montserrat]">
              <DropdownMenuItem onClick={() => handleViewDetails(teacher)}>
                View Details
              </DropdownMenuItem>
              {teacher.status === "active" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    Suspend
                  </DropdownMenuItem>
                </>
              )}
              {teacher.status === "suspended" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-green-600">
                    Activate
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="flex flex-col gap-4 font-[montserrat]">
        {/* Toolbar */}
        {showFiltersAndSearch && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={
                    (table.getColumn("teacher")?.getFilterValue() as string) ??
                    ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("teacher")
                      ?.setFilterValue(event.target.value)
                  }
                  className="pl-9 font-[montserrat]"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-[montserrat]"
                  >
                    <IconLayoutColumns className="size-4" />
                    <span className="hidden md:inline">Columns</span>
                    <IconChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 font-[montserrat]"
                >
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== "undefined" &&
                        column.getCanHide()
                    )
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "active" | "suspended")}
          className="w-full"
        >
          <TabsList className="font-[montserrat]">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="suspended">Suspended</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {/* Table */}
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="font-[montserrat]"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="h-20"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-4">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center font-[montserrat]"
                      >
                        No {activeTab} teachers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 mt-4">
              <div className="text-muted-foreground hidden flex-1 text-sm md:flex font-[montserrat]">
                Showing {table.getRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} {activeTab}{" "}
                teacher(s).
              </div>
              <div className="flex w-full items-center gap-8 md:w-fit">
                <div className="hidden items-center gap-2 md:flex">
                  <Label
                    htmlFor="rows-per-page"
                    className="text-sm font-medium font-[montserrat]"
                  >
                    Rows per page
                  </Label>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value));
                    }}
                  >
                    <SelectTrigger
                      className="w-20 font-[montserrat]"
                      size="sm"
                      id="rows-per-page"
                    >
                      <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                      />
                    </SelectTrigger>
                    <SelectContent className="font-[montserrat]">
                      {[5, 10, 20, 30, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-fit items-center justify-center text-sm font-medium font-[montserrat]">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <div className="ml-auto flex items-center gap-2 md:ml-0">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 md:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <IconChevronsLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <IconChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <IconChevronRight className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 md:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <IconChevronsRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Teacher Details Modal */}
      <TeacherDetails
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        teacher={selectedTeacher}
      />
    </>
  );
};

export default TeacherSection;
