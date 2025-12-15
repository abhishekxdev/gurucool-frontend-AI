"use client";

import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    IconBook,
    IconBooks,
    IconChalkboardTeacher,
    IconChecklist,
    IconSchool,
    IconUserCircle,
} from "@tabler/icons-react";
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumbs: BreadcrumbItemType[];
  notificationCount?: number;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  description,
  icon,
  breadcrumbs,
  notificationCount = 0,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchItems = [
    {
      label: "Overview",
      icon: <IconBook className="size-4" />,
      href: "/admin/dashboard",
    },
    {
      label: "Manage Schools",
      icon: <IconSchool className="size-4" />,
      href: "/admin/dashboard/manage-schools",
    },
    {
      label: "Manage Teachers",
      icon: <IconChalkboardTeacher className="size-4" />,
      href: "/admin/dashboard/manage-teachers",
    },
    {
      label: "Pending Approvals",
      icon: <IconChecklist className="size-4" />,
      href: "/admin/dashboard/pending-school-approvals",
    },
    {
      label: "Content Library",
      icon: <IconBooks className="size-4" />,
      href: "/admin/dashboard/pd-content-library",
    },
    {
      label: "Account",
      icon: <IconUserCircle className="size-4" />,
      href: "/admin/dashboard/profile",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-10 border-b-2 border-dashed bg-background font-[montserrat] py-2">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between gap-3 px-4 py-3">
          {/* Left - Sidebar Trigger, Icon and Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <SidebarTrigger className="flex-shrink-0" />
            {icon && (
              <div className="flex items-center justify-center text-primary flex-shrink-0 [&_svg]:size-6 [&_svg]:stroke-[1.5]">
                {icon}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm font-medium truncate leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-muted-foreground truncate leading-tight">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right - Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(true)}
              className="relative"
            >
              <Search className="size-4" />
              <span className="sr-only">Search</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => router.push("/admin/dashboard/notifications")}
              className="relative"
            >
              <Bell className="size-4" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px]">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </div>

        {/* Mobile Breadcrumbs - Below main header */}
        <div className="flex md:hidden border-t px-4 py-2">
          <Breadcrumb>
            <BreadcrumbList className="flex-wrap">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem className="text-xs">
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : crumb.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6 px-6 py-4">
          {/* Left side - Icon, Title and Description */}
          <div className="flex items-start gap-4 min-w-0 flex-shrink-0">
            <div className="flex flex-row gap-4 items-center justify-center">
              {icon && (
                <div className="flex items-center justify-center rounded-full text-primary flex-shrink-0 mt-1 [&_svg]:size-8 [&_svg]:stroke-[1.5]">
                  {icon}
                </div>
              )}

              <div className="flex flex-col gap-0.5 min-w-0">
                <h1 className="text-sm font-medium truncate leading-tight">
                  {title}
                </h1>
                {description && (
                  <p className="text-xs text-muted-foreground truncate leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center - Breadcrumbs */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem className="text-sm">
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : crumb.href ? (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right side - Search and Notification */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Button */}
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setOpen(true)}
              className="relative"
            >
              <Search className="size-4" />
              <span className="sr-only">Search (Cmd+K)</span>
            </Button>

            {/* Notification Button */}
            <Button
              variant="secondary"
              size="icon"
              onClick={() => router.push("/admin/dashboard/notifications")}
              className="relative"
            >
              <Bell className="size-4" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Search Command Dialog */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="font-[inter]"
      >
        <CommandInput placeholder="Search pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {searchItems.map((item, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default AdminHeader;
