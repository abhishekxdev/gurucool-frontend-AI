"use client";

import {
  IconAlignBoxLeftBottom,
  IconBook,
  IconBooks,
  IconChalkboardTeacher,
  IconChecklist,
  IconSchool,
  IconUserCircle,
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
    name: "Neel",
    email: "neel@gurucool.com",
    avatar: "/avatars/avatar.jpg",
  },
  // ...existing code...
  navMain: [
    {
      title: "Overview",
      url: "/admin/dashboard",
      icon: IconBook, // Use IconBook for overview
    },
    {
      title: "Schools",
      url: "/admin/dashboard/manage-schools",
      icon: IconSchool, // Consider IconBuildingSchool if available
    },
    {
      title: "Teachers",
      url: "/admin/dashboard/manage-teachers",
      icon: IconChalkboardTeacher, // Use IconUser for teachers
    },
    {
      title: "Approvals",
      url: "/admin/dashboard/pending-school-approvals",
      icon: IconChecklist, // Use IconChecklist for approvals
    },
    {
      title: "Content Library",
      url: "/admin/dashboard/pd-content-library",
      icon: IconBooks, // Use IconBooks for library
    },
    {
      title: "Assign PDs",
      url: "/admin/dashboard/assessment-management",
      icon: IconAlignBoxLeftBottom,
    },
    {
      title: "Account",
      url: "/admin/dashboard/profile",
      icon: IconUserCircle, // Use IconUserCircle for account/profile
    },
  ],
  // ...existing code...
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="font-[montserrat]">
      <SidebarHeader className="border-b border-neutral-200 dark:border-neutral-800/80 pb-4 mb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-6!important flex gap-3 items-center py-8"
            >
              <Link href="/admin/dashboard">
                <Image
                  src={logo}
                  alt="GuruCool"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
                <div className="flex flex-col">
                  <h1 className="text-xl font-medium font-[montserrat]">
                    thegurucoolai.
                  </h1>
                  <h2 className="text-xs font-[montserrat] font-medium text-neutral-500">Admin Dashboard</h2>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
