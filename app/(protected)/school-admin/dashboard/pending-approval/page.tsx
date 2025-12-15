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
  IconClock,
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

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ManageTeacherSchool = () => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState<
    TeacherDirectoryEntry | undefined
  >();

  // Show only pending teachers
  const filteredData = React.useMemo(() => {
    return teacherDirectory.filter((t) => t.approvalStatus === "pending");
  }, []);

  const handleViewDetails = (teacher: TeacherDirectoryEntry) => {
    setSelectedTeacher(teacher);
    setIsDetailsModalOpen(true);
  };

  const columns: ColumnDef<TeacherDirectoryEntry>[] = [
    {
      accessorKey: "approvalStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.approvalStatus;

        return (
          <Badge
            variant="outline"
            className={`gap-2 rounded-md px-3 py-1 badge text-amber-700 bg-amber-50 dark:bg-amber-900/20`}
          >
            <IconClock className="size-3 fill-amber-500 dark:fill-amber-400" />
            <span className="capitalize">{status}</span>
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "joinDate",
      header: "Joining Date",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground font-[montserrat]">
          {formatDate(row.original.joinDate)}
        </div>
      ),
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
    },
    {
      accessorKey: "currentSchool",
      header: "School Name",
      cell: ({ row }) => (
        <div className="text-sm font-[montserrat]">
          {row.original.currentSchool}
        </div>
      ),
    },
    {
      accessorKey: "proficiencyLevel",
      header: "Proficiency Level",
      cell: ({ row }) => {
        const level = row.original.proficiencyLevel;
        return (
          <Badge variant="outline" className="gap-2 rounded-md px-3 py-1">
            {level === "Advanced" ? (
              <IconCircle className="size-3 fill-green-500 stroke-none" />
            ) : level === "Intermediate" ? (
              <IconCircleDot className="size-3 fill-blue-500 stroke-none" />
            ) : (
              <IconCircleFilled className="size-3 fill-amber-500 stroke-none" />
            )}
            <span>{level}</span>
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
                className="text-muted-foreground flex size-8 font-[montserrat]"
                size="icon"
              >
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 font-[montserrat]">
              <DropdownMenuItem onClick={() => handleViewDetails(teacher)}>
                View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-green-600">
                Approve
              </DropdownMenuItem>

              <DropdownMenuItem variant="destructive">Reject</DropdownMenuItem>
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                value={
                  (table.getColumn("teacher")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("teacher")?.setFilterValue(event.target.value)
                }
                className="pl-9"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {/* Proficiency Filter */}
            <Select
              value={
                (table
                  .getColumn("proficiencyLevel")
                  ?.getFilterValue() as string) || "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("proficiencyLevel")
                  ?.setFilterValue(value === "all" ? undefined : [value])
              }
            >
              <SelectTrigger className="w-40" size="sm">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns className="size-4" />
                  <IconChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                  <TableRow key={row.id} className="h-20">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                    className="h-24 text-center"
                  >
                    No pending teachers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 mt-4">
          <div className="text-muted-foreground hidden md:flex">
            Showing {table.getRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} pending teacher(s).
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronsLeft className="size-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft className="size-4" />
            </Button>

            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>

            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight className="size-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <TeacherDetails
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        teacher={selectedTeacher}
      />
    </>
  );
};

export default ManageTeacherSchool;
