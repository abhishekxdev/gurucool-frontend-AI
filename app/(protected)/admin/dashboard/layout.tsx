"use client";

import AdminHeader from "@/components/admin-components/admin-header";
import { AdminSidebar } from "@/components/admin-components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconAlignBoxLeftBottom,
  IconBook,
  IconBooks,
  IconChalkboardTeacher,
  IconChecklist,
  IconSchool,
  IconUserCircle,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

// Define page metadata for each route
const pageMetadata: Record<
  string,
  { title: string; description?: string; icon?: React.ReactNode }
> = {
  "/admin/dashboard": {
    title: "Overview",
    description: "Welcome to your admin dashboard",
    icon: <IconBook className="size-5" />,
  },
  "/admin/dashboard/manage-schools": {
    title: "Schools",
    description: "Manage and track your schools",
    icon: <IconSchool className="size-5" />,
  },
  "/admin/dashboard/manage-teachers": {
    title: "Teachers",
    description: "Manage and track your teachers",
    icon: <IconChalkboardTeacher className="size-5" />,
  },
  "/admin/dashboard/pending-school-approvals": {
    title: "Approvals",
    description: "Review pending school registrations",
    icon: <IconChecklist className="size-5" />,
  },
  "/admin/dashboard/pd-content-library": {
    title: "Content Library",
    description: "Manage professional development content",
    icon: <IconBooks className="size-5" />,
  },

  "/admin/dashboard/assessment-management": {
    title: "Assessment",
    description: "Manage assessments and evaluations",
    icon: <IconAlignBoxLeftBottom className="size-5" />,
  },
  "/admin/dashboard/profile": {
    title: "Account",
    description: "Manage your account settings",
    icon: <IconUserCircle className="size-5" />,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { pageData, breadcrumbs } = useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    // Build breadcrumbs
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const href = "/" + paths.slice(0, i + 1).join("/");

      // Check if this is a dynamic route (like [id])
      const isDynamic = !isNaN(Number(path)) || path.length > 20;

      let label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // For dynamic routes, use shorter labels
      if (isDynamic) {
        label = "Details";
      }

      breadcrumbs.push({ label, href });
    }

    // Get page metadata or use default from breadcrumbs
    let pageData = pageMetadata[pathname];

    // For dynamic routes, use the parent route metadata
    if (!pageData) {
      const parentPath = paths.slice(0, -1).join("/");
      const parentFullPath = "/" + parentPath;
      pageData = pageMetadata[parentFullPath] || {
        title: breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard",
        description: undefined,
        icon: <IconBook className="size-5" />,
      };
    }

    return { pageData, breadcrumbs };
  }, [pathname]);

  return (
    <SidebarProvider className="max-w-screen-2xl mx-auto ">
      <AdminSidebar />
      <SidebarInset>
        {/* <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-8" />
        </div> */}

        <AdminHeader
          title={pageData.title}
          description={pageData.description}
          icon={pageData.icon}
          breadcrumbs={breadcrumbs}
          notificationCount={3}
        />

        <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
