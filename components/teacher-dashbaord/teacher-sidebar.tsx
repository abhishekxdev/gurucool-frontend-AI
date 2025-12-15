"use client";

import {
  IconListDetails,
  IconSchool,
  IconTrophy,
  IconUser,
  IconWallpaper,
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
  // ...existing code...
  navMain: [
    {
      title: "Overview",
      url: "/teacher/dashboard",
      icon: IconSchool,
    },
    {
      title: "AI Tutor",
      url: "/teacher/dashboard/learning",
      icon: IconWallpaper,
    },
    {
      title: "Performance",
      url: "/teacher/dashboard/results",
      icon: IconListDetails,
    },
    {
      title: "Achievements",
      url: "/teacher/dashboard/certificates",
      icon: IconTrophy,
    },
    {
      title: "Profile",
      url: "/teacher/dashboard/profile",
      icon: IconUser,
    },
  ],
  // ...existing code...
  navSecondary: [],
};

export function TeacherSidebar({
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
              <Link href="/admin/dashboard">
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
                    Teacher Dashboard
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
