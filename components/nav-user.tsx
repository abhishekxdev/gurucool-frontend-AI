"use client";

import {
  IconChevronRight,
  IconLogout,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useTeacher } from "@/hooks/useRoleGuard";
import { useTheme } from "next-themes";
import test from "node:test";

export function NavUser({}: {}) {
  const { isMobile, state } = useSidebar();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isCollapsed = state === "collapsed";
  const user = useTeacher();

  const testuser = {
    name: "Arpit Chaudhary",
    email: "arpit@example.com",
    logo: "/logo.png",
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <SidebarMenu className="font-[inter] border-t border-neutral-200 dark:border-neutral-800/80 mt-4 p-4">
      {/* Theme Toggle - Only show when collapsed */}
      {isCollapsed && (
        <SidebarMenuItem className="mb-2">
          <SidebarMenuButton
            onClick={toggleTheme}
            tooltip={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="w-full justify-center"
          >
            {theme === "dark" ? (
              <IconSun className="size-5" />
            ) : (
              <IconMoon className="size-5" />
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      {/* User Menu */}
      <SidebarMenuItem className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size={isCollapsed ? "icon" : "lg"}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground font-[inter]"
            >
              <Avatar
                className={`rounded-full ${
                  isCollapsed ? "h-8 w-8" : "h-10 w-10"
                }`}
              >
                <AvatarImage src={user?.avatar ?? testuser.logo} alt={user?.name} />
                <AvatarFallback className="rounded-lg">{testuser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name ?? testuser.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email ?? testuser.email}
                    </span>
                  </div>
                  <IconChevronRight className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal font-[inter]">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-12 w-12 rounded-full">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {testuser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name ?? testuser.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email ?? testuser.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Theme Toggle in Dropdown */}
            <DropdownMenuItem
              onClick={toggleTheme}
              className="cursor-pointer font-[inter]"
            >
              {theme === "dark" ? (
                <>
                  <IconSun className="size-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <IconMoon className="size-4 mr-2" />
                  Dark Mode
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer font-[inter]"
            >
              <IconLogout className="size-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
