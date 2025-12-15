"use client";

import { SchoolAdminSidebar } from "@/components/school-admin-dashboard/school-admin-sidebar";
import SchoolHeader from "@/components/school-admin-dashboard/school-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IconSchool } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const href = "/" + paths.slice(0, i + 1).join("/");
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({ label, href });
    }

    return breadcrumbs;
  };

  const getPageInfo = () => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    const pageMap: Record<
      string,
      { title: string; description: string; icon: React.ReactNode }
    > = {
      dashboard: {
        title: "Dashboard",
        description: "School administration overview",
        icon: <IconSchool className="size-6" />,
      },
      "teacher-section": {
        title: "Teachers",
        description: "Manage your school's teachers",
        icon: <IconSchool className="size-6" />,
      },
      "pending-approval": {
        title: "Pending Approvals",
        description: "Review teacher onboarding requests",
        icon: <IconSchool className="size-6" />,
      },
      "badeges-approval": {
        title: "Badge Approvals",
        description: "Review teacher badge submissions",
        icon: <IconSchool className="size-6" />,
      },
      "assign-pd": {
        title: "Assign PDs",
        description: "Assign professional development pathways",
        icon: <IconSchool className="size-6" />,
      },
      profile: {
        title: "School Profile",
        description: "Manage your school information",
        icon: <IconSchool className="size-6" />,
      },
      analytics: {
        title: "Analytics",
        description: "View school performance metrics",
        icon: <IconSchool className="size-6" />,
      },
    };

    return (
      pageMap[lastSegment] || {
        title: lastSegment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        description: "School Admin Dashboard",
        icon: <IconSchool className="size-6" />,
      }
    );
  };

  const breadcrumbs = getBreadcrumbs();
  const pageInfo = getPageInfo();

  return (
    <SidebarProvider className="max-w-screen-2xl mx-auto">
      <SchoolAdminSidebar />
      <SidebarInset>
        <SchoolHeader
          title={pageInfo.title}
          description={pageInfo.description}
          icon={pageInfo.icon}
          breadcrumbs={breadcrumbs}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
