"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { IconChevronRight, type Icon } from "@tabler/icons-react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
  secondaryItems,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  secondaryItems?: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <>
      {/* Main Items */}
      <SidebarGroup>
        {!isCollapsed && (
          <SidebarGroupLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
            MAIN
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent className={!isCollapsed ? "mt-4" : ""}>
          <SidebarMenu
            className={`flex flex-col ${isCollapsed ? "gap-2" : "gap-4"}`}
          >
            {items.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <Link
                      href={item.url}
                      className={`flex items-center ${
                        isCollapsed ? "justify-center" : "gap-3"
                      } px-3 py-2 rounded-md transition-colors relative ${
                        isActive && !isCollapsed
                          ? "before:absolute before:left-0 before:w-1.5 before:h-6 before:bg-primary before:rounded-r-md"
                          : ""
                      }`}
                    >
                      {item.icon && (
                        <div
                          className={`${
                            isCollapsed ? "" : "p-1.5"
                          } rounded-md transition-colors ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <item.icon className="size-5" />
                        </div>
                      )}
                      {!isCollapsed && (
                        <>
                          <span
                            className={`text-sm font-medium flex-1 transition-colors ${
                              isActive
                                ? "text-muted-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {item.title}
                          </span>
                          {isActive && (
                            <IconChevronRight className="size-4 text-muted-foreground shrink-0" />
                          )}
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Secondary Items (Others) */}
      {secondaryItems && secondaryItems.length > 0 && (
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider px-4">
              OTHERS
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className={!isCollapsed ? "mt-4" : ""}>
            <SidebarMenu
              className={`flex flex-col ${isCollapsed ? "gap-2" : "gap-4"} ${
                !isCollapsed ? "px-2" : ""
              }`}
            >
              {secondaryItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={isCollapsed ? item.title : undefined}
                      className="p-0"
                    >
                      <Link
                        href={item.url}
                        className={`flex items-center ${
                          isCollapsed ? "justify-center" : "gap-3"
                        } px-3 py-2 rounded-md transition-colors relative ${
                          isActive && !isCollapsed
                            ? "before:absolute before:left-0 before:w-1 before:h-6 before:bg-primary before:rounded-r-md"
                            : ""
                        }`}
                      >
                        {item.icon && (
                          <div
                            className={`${
                              isCollapsed ? "" : "p-1.5"
                            } rounded-md transition-colors ${
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <item.icon className="size-5" />
                          </div>
                        )}
                        {!isCollapsed && (
                          <>
                            <span
                              className={`text-sm font-medium flex-1 transition-colors ${
                                isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {item.title}
                            </span>
                            {isActive && (
                              <IconChevronRight className="size-4 text-muted-foreground flex-shrink-0" />
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </>
  );
}
