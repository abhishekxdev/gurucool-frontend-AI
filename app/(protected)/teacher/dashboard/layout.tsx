"use client";

import TeacherHeader, {
  BreadcrumbItemType,
} from "@/components/teacher-dashbaord/teacher-header";
import { TeacherSidebar } from "@/components/teacher-dashbaord/teacher-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconChartBar,
  IconListDetails,
  IconSchool,
  IconTrophy,
  IconWallpaper,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

// Page metadata mapping for titles, descriptions, and icons
const pageMetadata: Record<
  string,
  { title: string; description?: string; icon: React.ReactNode }
> = {
  "/teacher/dashboard": {
    title: "Dashboard Overview",
    description: "Welcome back! Here's your teaching overview",
    icon: <IconSchool />,
  },
  "/teacher/dashboard/assessments": {
    title: "Assessments",
    description: "Create and manage student assessments",
    icon: <IconChartBar />,
  },
  "/teacher/dashboard/learning": {
    title: "AI Tutor",
    description: "Interactive AI-powered learning platform",
    icon: <IconWallpaper />,
  },
  "/teacher/dashboard/results": {
    title: "Performance",
    description: "View and analyze student results",
    icon: <IconListDetails />,
  },
  "/teacher/dashboard/certificates": {
    title: "Achievements",
    description: "Student achievements and certificates",
    icon: <IconTrophy />,
  },
  "/teacher/dashboard/profile": {
    title: "My Profile",
    description: "Manage your account and settings",
    icon: <IconSchool />,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getBreadcrumbs = (): BreadcrumbItemType[] => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItemType[] = [];

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

  const breadcrumbs = getBreadcrumbs();

  // Get current page metadata or use defaults
  const currentPageMeta = pageMetadata[pathname] || {
    title: "Teacher Dashboard",
    description: "Manage your teaching activities",
    icon: <IconSchool />,
  };

  return (
    <SidebarProvider className="max-w-screen-2xl mx-auto">
      <TeacherSidebar />
      <SidebarInset>
        <TeacherHeader
          title={currentPageMeta.title}
          description={currentPageMeta.description}
          icon={currentPageMeta.icon}
          breadcrumbs={breadcrumbs}
          notificationCount={5}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
