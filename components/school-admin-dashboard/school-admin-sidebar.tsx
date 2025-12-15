"use client";

import {
  IconBadge,
  IconClipboardList,
  IconFileDescription,
  IconSchool,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import logo from "@/public/gurucool/logo.png";
import Image from "next/image";
import Link from "next/link";

const data = {
  user: {
    name: "School Admin",
    email: "admin@school.edu",
    avatar: logo.src,
  },
  navMain: [
    {
      title: "Overview",
      url: "/school-admin/dashboard",
      icon: IconSchool,
    },
    {
      title: "Teachers",
      url: "/school-admin/dashboard/teacher-section",
      icon: IconUsers,
    },
    {
      title: "Pending Approvals",
      url: "/school-admin/dashboard/pending-approval",
      icon: IconClipboardList,
    },
   
    {
      title: "Assign PDs",
      url: "/school-admin/dashboard/assign-pd",
      icon: IconFileDescription,
    },
    {
      title: "Profile",
      url: "/school-admin/dashboard/profile",
      icon: IconUser,
    },
  ],
  navSecondary: [],
};

export function SchoolAdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="font-[montserrat]"
      variant="sidebar"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:px-4 py-10 border-b border-neutral-200 dark:border-neutral-800/80 rounded-none"
            >
              <Link href="/school-admin/dashboard">
                <Image
                  src={logo}
                  alt="GuruCool"
                  width={120}
                  height={120}
                  className="h-10 w-auto object-contain"
                />
                <div className="flex flex-col w-full">
                  <h1 className="text-sm font-medium font-[montserrat]">
                    GurucoolAI.
                  </h1>
                  <h2 className="text-[12px] font-normal dark:text-neutral-400 text-neutral-700 font-[inter]">
                    School Admin
                  </h2>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="font-[inter]">
        <NavMain items={data.navMain} secondaryItems={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
